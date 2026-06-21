package com.filRouge.DrinkinMama.config;

import com.filRouge.DrinkinMama.service.TokenBlacklistService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * Configuration de sécurité de l'application.
 * <p>
 * Cette classe définit les règles d'autorisation et d'authentification pour l'application.
 * Elle configure les accès aux différentes API en fonction des rôles utilisateurs,
 * gère l'authentification par JWT et OAuth2, et paramètre les règles CORS.
 * </p>
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfiguration {

    private final JwtAuthFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    private final TokenBlacklistService tokenBlacklistService;

    @Value("${springdoc.swagger-ui.enabled:false}")
    private boolean swaggerEnabled;
    /**
     * Liste des URL accessibles sans authentification.
     */
    private static final String[] WHITE_LIST_URL = {
            "/api/v1/auth/**",
            "/error"
    };

    /**
     * Configure la source de configuration CORS.
     * <p>
     * Définit les origines, méthodes et en-têtes autorisés pour les requêtes
     * cross-origin, ainsi que la durée de mise en cache des pré-vérifications.
     * </p>
     *
     * @return La source de configuration CORS
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:8081"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PATCH", "DELETE", "OPTIONS","HEAD"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    /**
     * Configure la chaîne de filtres de sécurité.
     * <p>
     * Cette méthode définit l'ensemble des règles de sécurité de l'application :
     * - Désactive CSRF
     * - Configure CORS
     * - Définit les règles d'autorisation pour chaque endpoint API selon les rôles
     * - Configure la gestion des sessions (stateless)
     * - Ajoute les filtres d'authentification JWT
     * - Configure l'authentification OAuth2
     * </p>
     *
     * @param http La configuration HTTP à modifier
     * @return La chaîne de filtres de sécurité configurée
     * @throws Exception Si une erreur survient pendant la configuration
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> {
                    auth.requestMatchers(WHITE_LIST_URL).permitAll()
                            .requestMatchers("/error").permitAll()

                            .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html")
                            .access((authentication, context) -> new AuthorizationDecision(swaggerEnabled))

                            /*User permissions*/
                            .requestMatchers(HttpMethod.GET, "/users").hasRole("Admin")
                            .requestMatchers("/users/me").authenticated()
                            .requestMatchers(HttpMethod.GET, "/users/{id}").hasAnyRole("User", "Admin")
                            .requestMatchers(HttpMethod.GET, "/users/slug/{slug}").hasAnyRole("User", "Admin")

                            .requestMatchers(HttpMethod.POST, "/users").hasRole("Admin")

                            .requestMatchers(HttpMethod.PATCH, "/users/{id}").hasAnyRole("User", "Admin")

                            .requestMatchers(HttpMethod.DELETE, "/users/**").hasRole("Admin")

                            .anyRequest().authenticated();
                })
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)

                .logout(logout -> logout
                        .logoutUrl("/api/v1/auth/logout")
                        .addLogoutHandler((request, response, authentication) -> {
                            String authHeader = request.getHeader("Authorization");
                            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                                String jwt = authHeader.substring(7);

                                tokenBlacklistService.blacklistToken(jwt);
                            }
                        })
                        .logoutSuccessHandler((request, response, authentication) -> {
                            response.setStatus(jakarta.servlet.http.HttpServletResponse.SC_OK);
                        })
                )

                .build();
    }
}