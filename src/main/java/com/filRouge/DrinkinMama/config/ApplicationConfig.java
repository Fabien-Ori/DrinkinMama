package com.filRouge.DrinkinMama.config;
import com.filRouge.DrinkinMama.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
/**
 * Configuration des composants d'authentification de l'application.
 * <p>
 * Cette classe configure les différents beans nécessaires pour l'authentification
 * des utilisateurs, notamment le service de détails utilisateur, le fournisseur
 * d'authentification, l'encodeur de mot de passe et le gestionnaire d'authentification.
 * </p>
 */
@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {
    private final UserRepository userRepository;
    /**
     * Définit le service de détails utilisateur qui récupère les informations
     * des utilisateurs par leur username.
     *
     * @return Un service implémentant UserDetailsService
     * @throws UsernameNotFoundException Si aucun utilisateur n'est trouvé avec l'email fourni
     */
    @Bean
    public UserDetailsService customUserDetailsService() {
        return username -> userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
    /**
     * Configure le fournisseur d'authentification qui utilise le service de détails utilisateur
     * et l'encodeur de mot de passe.
     *
     * @return Le fournisseur d'authentification configuré
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(customUserDetailsService()); // Appelle le nouveau nom
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }
    /**
     * Crée un encodeur de mot de passe utilisant l'algorithme BCrypt.
     *
     * @return L'encodeur de mot de passe BCrypt
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Configure le gestionnaire d'authentification à partir de la configuration fournie.
     *
     * @param config La configuration d'authentification
     * @return Le gestionnaire d'authentification
     * @throws Exception Si une erreur survient lors de la création du gestionnaire
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}