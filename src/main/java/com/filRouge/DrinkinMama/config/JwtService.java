package com.filRouge.DrinkinMama.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * Service qui gère la création et la validation des tokens JWT.
 * <p>
 * Cette classe fournit des fonctionnalités pour générer des tokens JWT pour les utilisateurs
 * authentifiés, extraire des informations de ces tokens, et vérifier leur validité.
 * Elle encapsule toute la logique liée à la manipulation des tokens JWT utilisés
 * pour l'authentification dans l'application.
 * </p>
 */
@Service
public class JwtService {

    private static final String secretKey = "9a4f2c8d3e1b7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a";

    /**
     * Extrait le nom d'utilisateur (username) contenu dans un token JWT.
     *
     * @param token Le token JWT à analyser
     * @return Le nom d'utilisateur extrait du token
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extrait une revendication (claim) spécifique d'un token JWT.
     *
     * @param token         Le token JWT à analyser
     * @param claimResolver La fonction qui extrait la revendication souhaitée
     * @param <T>           Le type de donnée de la revendication à extraire
     * @return La revendication extraite du token
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        final Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    /**
     * Génère un token JWT pour un utilisateur sans revendications supplémentaires.
     *
     * @param userDetails Les détails de l'utilisateur pour lequel générer le token
     * @return Le token JWT généré
     */
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    /**
     * Génère un token JWT pour un utilisateur avec des revendications supplémentaires.
     *
     * @param extraClaims Les revendications supplémentaires à inclure dans le token
     * @param userDetails Les détails de l'utilisateur pour lequel générer le token
     * @return Le token JWT généré
     */
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Vérifie si un token JWT est valide pour un utilisateur donné.
     * <p>
     * Un token est considéré comme valide si le nom d'utilisateur qu'il contient
     * correspond à celui des détails utilisateur fournis et si le token n'a pas expiré.
     * </p>
     *
     * @param token       Le token JWT à vérifier
     * @param userDetails Les détails de l'utilisateur pour lequel vérifier le token
     * @return true si le token est valide, false sinon
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()  //maybe problem here
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}