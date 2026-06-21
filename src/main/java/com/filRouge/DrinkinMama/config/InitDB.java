package com.filRouge.DrinkinMama.config;

import com.filRouge.DrinkinMama.entity.user.AuthProvider;
import com.filRouge.DrinkinMama.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

/**
 * Configuration pour l'initialisation de la base de données.
 * <p>
 * Cette classe est responsable de l'initialisation des données par défaut dans la base de données
 * au démarrage de l'application. Elle définit des beans CommandLineRunner qui s'exécutent
 * lors du lancement de l'application pour peupler les tables avec des données initiales.
 * </p>
 */
@Configuration
public class InitDB {

    /**
     * Initialise des utilisateurs par défaut dans la base de données si aucun n'existe déjà.
     * <p>
     * Ce bean crée quatre utilisateurs avec différents rôles (User, Admin, AuthService, Organizer)
     * et les enregistre dans la base de données uniquement si celle-ci est vide.
     * Les mots de passe sont encodés avant d'être stockés.
     * </p>
     *
     * @param userRepository  Le repository pour accéder aux données des utilisateurs
     * @param passwordEncoder L'encodeur utilisé pour sécuriser les mots de passe
     * @return Un CommandLineRunner qui initialise les utilisateurs
     */
    @Bean
    CommandLineRunner initUsers(UserRepository userRepository,
                                PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                List<com.filRouge.DrinkinMama.entity.user.User> users = List.of(
                        com.filRouge.DrinkinMama.entity.user.User.builder()
                                .username("ssmith")
                                .email("ssmith@gmail.com")
                                .provider(AuthProvider.LOCAL)
                                .password(passwordEncoder.encode("Password@123"))
                                .slug("ssmith")
                                .biography("Passionate home cook and food lover. Sharing my culinary adventures and recipes from around the world.")
                                .role(com.filRouge.DrinkinMama.entity.user.Role.User)
                                .build(),
                        com.filRouge.DrinkinMama.entity.user.User.builder()
                                .username("xelea")
                                .email("xelea@gmail.com")
                                .provider(AuthProvider.LOCAL)
                                .password(passwordEncoder.encode("k"))
                                .slug("xelea")
                                .biography("Food enthusiast and recipe creator. Exploring global cuisines and sharing delicious recipes with")
                                .role(com.filRouge.DrinkinMama.entity.user.Role.User)
                                .build(),
                        com.filRouge.DrinkinMama.entity.user.User.builder()
                                .username("accoow")
                                .email("accoow@gmail.com")
                                .provider(AuthProvider.LOCAL)
                                .password(passwordEncoder.encode("Password@123"))
                                .slug("accoow")
                                .biography("Chef and food blogger. Sharing my culinary creations and recipes inspired by world flavors.")
                                .role(com.filRouge.DrinkinMama.entity.user.Role.Admin)
                                .build(),
                        com.filRouge.DrinkinMama.entity.user.User.builder()
                                .username("auth")
                                .email("auth@example.com")
                                .provider(AuthProvider.LOCAL)
                                .password(passwordEncoder.encode("Password@123"))
                                .slug("auth")
                                .biography("Authentication service account. Used for managing authentication and authorization in the application.")
                                .role(com.filRouge.DrinkinMama.entity.user.Role.AuthService)
                                .build()
                );
                userRepository.saveAll(users);

            }
        };
    }
}
