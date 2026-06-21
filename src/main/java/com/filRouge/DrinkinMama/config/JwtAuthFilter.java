package com.filRouge.DrinkinMama.config;

import com.filRouge.DrinkinMama.service.TokenBlacklistService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;

import java.io.IOException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Filtre d'authentification JWT qui intercepte chaque requête HTTP.
 * <p>
 * Ce filtre vérifie la présence et la validité des tokens JWT dans l'en-tête "Authorization"
 * des requêtes entrantes. Si un token valide est trouvé, l'utilisateur correspondant est
 * authentifié et ses informations sont placées dans le contexte de sécurité Spring pour
 * la durée de la requête.
 * </p>
 */
@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final TokenBlacklistService tokenBlacklistService;

    /**
     * Intercepte et traite chaque requête HTTP pour vérifier l'authentification JWT.
     * <p>
     * Cette méthode extrait le token JWT de l'en-tête "Authorization", vérifie sa validité,
     * et authentifie l'utilisateur si le token est valide. Si aucun token n'est présent ou
     * si le token est invalide, la requête continue sans authentification.
     * </p>
     *
     * @param request     La requête HTTP entrante
     * @param response    La réponse HTTP sortante
     * @param filterChain La chaîne de filtres pour continuer le traitement
     * @throws ServletException Si une erreur survient pendant le traitement de la requête
     * @throws IOException      Si une erreur d'entrée/sortie survient
     */
    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authorizationHeader.substring(7);

        try {
            if (tokenBlacklistService.isTokenBlacklisted(jwt)) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\":\"Déconnexion\",\"message\":\"Ce jeton a été invalidé par déconnexion.\"}");
                return;
            }

            username = jwtService.extractUsername(jwt);

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
            filterChain.doFilter(request, response);
        } catch (ExpiredJwtException e) {
            // Gestion pour les jetons expirés
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // Code 401
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"JWT expiré\",\"message\":\"" + e.getMessage() + "\"}");
        } catch (MalformedJwtException | SignatureException e) {
            // Gestion pour les jetons malformés ou avec une signature invalide
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // Code 401
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"JWT invalide\",\"message\":\"" + e.getMessage() + "\"}");
        } catch (Exception e) {
            // Gestion des autres exceptions
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Erreur d'authentification\",\"message\":\"" + e.getMessage() + "\"}");
        }
    }
}