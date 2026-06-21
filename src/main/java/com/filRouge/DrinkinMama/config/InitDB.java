package com.filRouge.DrinkinMama.config;

import com.filRouge.DrinkinMama.entity.badge.Badge;
import com.filRouge.DrinkinMama.entity.shop.ShopItem;
import com.filRouge.DrinkinMama.entity.user.AuthProvider;
import com.filRouge.DrinkinMama.entity.user.Role;
import com.filRouge.DrinkinMama.entity.user.User;
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
                                PasswordEncoder passwordEncoder, UserInventoryRepository userInventoryRepository, ShopItemRepository shopItemRepository, UserBadgeRepository userBadgeRepository, BadgeRepository badgeRepository) {
        return args -> {
            if (userRepository.count() == 0) {
                List<com.filRouge.DrinkinMama.entity.user.User> users = List.of(
                        com.filRouge.DrinkinMama.entity.user.User.builder()
                                .username("MaxBar")
                                .email("max@bar.fr")
                                .provider(AuthProvider.LOCAL)
                                .password(passwordEncoder.encode("Password@123"))
                                .slug("maxbar")
                                .role(Role.User)
                                .score(12300)
                                .initials("MX")
                                .avatarBg("#1a0d1e")
                                .avatarColor("#7F77DD")
                                .cocktailsCompleted(16)
                                .rank(1)
                                .streak(16)
                                .build(),
                        com.filRouge.DrinkinMama.entity.user.User.builder()
                                .username("Alexia")
                                .email("alex@bar.fr")
                                .provider(AuthProvider.LOCAL)
                                .password(passwordEncoder.encode("Password@123"))
                                .slug("alexia")
                                .role(Role.User)
                                .score(8450)
                                .initials("AL")
                                .avatarBg("#2a1808")
                                .avatarColor("#cd7f32")
                                .cocktailsCompleted(12)
                                .rank(2)
                                .streak(12)
                                .build(),
                        com.filRouge.DrinkinMama.entity.user.User.builder()
                                .username("Sara_R")
                                .email("sara@bar.fr")
                                .provider(AuthProvider.LOCAL)
                                .password(passwordEncoder.encode("Password@123"))
                                .slug("sara")
                                .role(Role.User)
                                .score(7800)
                                .initials("SR")
                                .avatarBg("#0d1a12")
                                .avatarColor("#7F77DD")
                                .cocktailsCompleted(11)
                                .rank(3)
                                .streak(11)
                                .build(),
                        com.filRouge.DrinkinMama.entity.user.User.builder()
                                .username("KiviBar")
                                .email("kivi@bar.fr")
                                .provider(AuthProvider.LOCAL)
                                .password(passwordEncoder.encode("Password@123"))
                                .slug("kivi")
                                .role(Role.User)
                                .score(6900)
                                .initials("KV")
                                .avatarBg("#2a1808")
                                .avatarColor("#cd7f32")
                                .cocktailsCompleted(10)
                                .rank(4)
                                .streak(10)
                                .build(),
                        com.filRouge.DrinkinMama.entity.user.User.builder()
                                .username("ToniNegroni")
                                .email("toni@bar.fr")
                                .provider(AuthProvider.LOCAL)
                                .password(passwordEncoder.encode("Password@123"))
                                .slug("toni")
                                .role(Role.User)
                                .score(5440)
                                .initials("TN")
                                .avatarBg("#1a0d1e")
                                .avatarColor("#7F77DD")
                                .cocktailsCompleted(9)
                                .rank(5)
                                .streak(9)
                                .build(),
                        com.filRouge.DrinkinMama.entity.user.User.builder()
                                .username("MacronExplosion")
                                .email("macron@bar.fr")
                                .provider(AuthProvider.LOCAL)
                                .password(passwordEncoder.encode("Password@123"))
                                .slug("macron")
                                .role(Role.User)
                                .score(1240)
                                .initials("JD")
                                .avatarBg("#2a2847")
                                .avatarColor("#7F77DD")
                                .cocktailsCompleted(5)
                                .rank(6)
                                .streak(5)
                                .build(),
                        com.filRouge.DrinkinMama.entity.user.User.builder()
                                .username("Accoow")
                                .email("accoow@gmail.com")
                                .provider(AuthProvider.LOCAL)
                                .password(passwordEncoder.encode("Password@123"))
                                .slug("accoow")
                                .role(Role.Admin)
                                .score(0)
                                .initials("AC")
                                .avatarBg("#0d1a12")
                                .avatarColor("#7F77DD")
                                .build(),
                        com.filRouge.DrinkinMama.entity.user.User.builder()
                                .username("Designer")
                                .email("designer@gmail.com")
                                .provider(AuthProvider.LOCAL)
                                .password(passwordEncoder.encode("Password@123"))
                                .slug("designer")
                                .role(Role.LevelDesigner)
                                .score(0)
                                .initials("LD")
                                .avatarBg("#2a1808")
                                .avatarColor("#cd7f32")
                                .build()
                );
                userRepository.saveAll(users);
                userRepository.flush();
            }
            if (userInventoryRepository.count() == 0) {
                List<User> users = userRepository.findAll();
                List<ShopItem> items = shopItemRepository.findAll();

                userInventoryRepository.saveAll(List.of(
                        com.filRouge.DrinkinMama.entity.user.UserInventory.builder().user(users.stream().filter(u->u.getUsername().equals("MaxBar")).findFirst().get()).shopItem(items.stream().filter(i->i.getName().equals("Sirop de rose")).findFirst().get()).build(),
                        com.filRouge.DrinkinMama.entity.user.UserInventory.builder().user(users.stream().filter(u->u.getUsername().equals("MaxBar")).findFirst().get()).shopItem(items.stream().filter(i->i.getName().equals("Myrtilles fraîches")).findFirst().get()).build(),
                        com.filRouge.DrinkinMama.entity.user.UserInventory.builder().user(users.stream().filter(u->u.getUsername().equals("MaxBar")).findFirst().get()).shopItem(items.stream().filter(i->i.getName().equals("Fleur de sureau")).findFirst().get()).build(),
                        com.filRouge.DrinkinMama.entity.user.UserInventory.builder().user(users.stream().filter(u->u.getUsername().equals("MaxBar")).findFirst().get()).shopItem(items.stream().filter(i->i.getName().equals("Citron yuzu")).findFirst().get()).build(),
                        com.filRouge.DrinkinMama.entity.user.UserInventory.builder().user(users.stream().filter(u->u.getUsername().equals("MaxBar")).findFirst().get()).shopItem(items.stream().filter(i->i.getName().equals("Recette Margarita")).findFirst().get()).build(),
                        com.filRouge.DrinkinMama.entity.user.UserInventory.builder().user(users.stream().filter(u->u.getUsername().equals("MaxBar")).findFirst().get()).shopItem(items.stream().filter(i->i.getName().equals("Shaker doré")).findFirst().get()).build(),
                        com.filRouge.DrinkinMama.entity.user.UserInventory.builder().user(users.stream().filter(u->u.getUsername().equals("Alexia")).findFirst().get()).shopItem(items.stream().filter(i->i.getName().equals("Myrtilles fraîches")).findFirst().get()).build(),
                        com.filRouge.DrinkinMama.entity.user.UserInventory.builder().user(users.stream().filter(u->u.getUsername().equals("Sara_R")).findFirst().get()).shopItem(items.stream().filter(i->i.getName().equals("Myrtilles fraîches")).findFirst().get()).build(),
                        com.filRouge.DrinkinMama.entity.user.UserInventory.builder().user(users.stream().filter(u->u.getUsername().equals("KiviBar")).findFirst().get()).shopItem(items.stream().filter(i->i.getName().equals("Myrtilles fraîches")).findFirst().get()).build(),
                        com.filRouge.DrinkinMama.entity.user.UserInventory.builder().user(users.stream().filter(u->u.getUsername().equals("ToniNegroni")).findFirst().get()).shopItem(items.stream().filter(i->i.getName().equals("Myrtilles fraîches")).findFirst().get()).build(),
                        com.filRouge.DrinkinMama.entity.user.UserInventory.builder().user(users.stream().filter(u->u.getUsername().equals("MacronExplosion")).findFirst().get()).shopItem(items.stream().filter(i->i.getName().equals("Myrtilles fraîches")).findFirst().get()).build()

                ));
            }

            if (userBadgeRepository.count() == 0) {
                List<User> users = userRepository.findAll();
                List<Badge> badges = badgeRepository.findAll();

                userBadgeRepository.saveAll(List.of(
                        com.filRouge.DrinkinMama.entity.user.UserBadge.builder().user(users.stream().filter(u->u.getUsername().equals("MaxBar")).findFirst().get()).badge(badges.stream().filter(b->b.getLabel().equals("Première recette")).findFirst().get()).build(),
                        com.filRouge.DrinkinMama.entity.user.UserBadge.builder().user(users.stream().filter(u->u.getUsername().equals("MaxBar")).findFirst().get()).badge(badges.stream().filter(b->b.getLabel().equals("5 jours")).findFirst().get()).build(),
                        com.filRouge.DrinkinMama.entity.user.UserBadge.builder().user(users.stream().filter(u->u.getUsername().equals("MaxBar")).findFirst().get()).badge(badges.stream().filter(b->b.getLabel().equals("10 cocktails")).findFirst().get()).build(),
                        com.filRouge.DrinkinMama.entity.user.UserBadge.builder().user(users.stream().filter(u->u.getUsername().equals("MaxBar")).findFirst().get()).badge(badges.stream().filter(b->b.getLabel().equals("Rang Top 10")).findFirst().get()).build(),

                        com.filRouge.DrinkinMama.entity.user.UserBadge.builder().user(users.stream().filter(u->u.getUsername().equals("Alexia")).findFirst().get()).badge(badges.stream().filter(b->b.getLabel().equals("Première recette")).findFirst().get()).build(),
                        com.filRouge.DrinkinMama.entity.user.UserBadge.builder().user(users.stream().filter(u->u.getUsername().equals("Alexia")).findFirst().get()).badge(badges.stream().filter(b->b.getLabel().equals("5 jours")).findFirst().get()).build(),
                        com.filRouge.DrinkinMama.entity.user.UserBadge.builder().user(users.stream().filter(u->u.getUsername().equals("Alexia")).findFirst().get()).badge(badges.stream().filter(b->b.getLabel().equals("10 cocktails")).findFirst().get()).build(),
                        com.filRouge.DrinkinMama.entity.user.UserBadge.builder().user(users.stream().filter(u->u.getUsername().equals("Alexia")).findFirst().get()).badge(badges.stream().filter(b->b.getLabel().equals("Rang Top 10")).findFirst().get()).build(),

                        com.filRouge.DrinkinMama.entity.user.UserBadge.builder().user(users.stream().filter(u->u.getUsername().equals("Sara_R")).findFirst().get()).badge(badges.stream().filter(b->b.getLabel().equals("Première recette")).findFirst().get()).build(),
                        com.filRouge.DrinkinMama.entity.user.UserBadge.builder().user(users.stream().filter(u->u.getUsername().equals("Sara_R")).findFirst().get()).badge(badges.stream().filter(b->b.getLabel().equals("5 jours")).findFirst().get()).build(),
                        com.filRouge.DrinkinMama.entity.user.UserBadge.builder().user(users.stream().filter(u->u.getUsername().equals("Sara_R")).findFirst().get()).badge(badges.stream().filter(b->b.getLabel().equals("10 cocktails")).findFirst().get()).build(),
                        com.filRouge.DrinkinMama.entity.user.UserBadge.builder().user(users.stream().filter(u->u.getUsername().equals("Sara_R")).findFirst().get()).badge(badges.stream().filter(b->b.getLabel().equals("Rang Top 10")).findFirst().get()).build(),

                        com.filRouge.DrinkinMama.entity.user.UserBadge.builder().user(users.stream().filter(u->u.getUsername().equals("KiviBar")).findFirst().get()).badge(badges.stream().filter(b->b.getLabel().equals("Première recette")).findFirst().get()).build(),
                        com.filRouge.DrinkinMama.entity.user.UserBadge.builder().user(users.stream().filter(u->u.getUsername().equals("KiviBar")).findFirst().get()).badge(badges.stream().filter(b->b.getLabel().equals("5 jours")).findFirst().get()).build(),
                        com.filRouge.DrinkinMama.entity.user.UserBadge.builder().user(users.stream().filter(u->u.getUsername().equals("KiviBar")).findFirst().get()).badge(badges.stream().filter(b->b.getLabel().equals("10 cocktails")).findFirst().get()).build(),
                        com.filRouge.DrinkinMama.entity.user.UserBadge.builder().user(users.stream().filter(u->u.getUsername().equals("KiviBar")).findFirst().get()).badge(badges.stream().filter(b->b.getLabel().equals("Rang Top 10")).findFirst().get()).build(),

                        com.filRouge.DrinkinMama.entity.user.UserBadge.builder().user(users.stream().filter(u->u.getUsername().equals("ToniNegroni")).findFirst().get()).badge(badges.stream().filter(b->b.getLabel().equals("Première recette")).findFirst().get()).build(),
                        com.filRouge.DrinkinMama.entity.user.UserBadge.builder().user(users.stream().filter(u->u.getUsername().equals("ToniNegroni")).findFirst().get()).badge(badges.stream().filter(b->b.getLabel().equals("5 jours")).findFirst().get()).build(),
                        com.filRouge.DrinkinMama.entity.user.UserBadge.builder().user(users.stream().filter(u->u.getUsername().equals("ToniNegroni")).findFirst().get()).badge(badges.stream().filter(b->b.getLabel().equals("Rang Top 10")).findFirst().get()).build(),

                        com.filRouge.DrinkinMama.entity.user.UserBadge.builder().user(users.stream().filter(u->u.getUsername().equals("MacronExplosion")).findFirst().get()).badge(badges.stream().filter(b->b.getLabel().equals("Première recette")).findFirst().get()).build(),
                        com.filRouge.DrinkinMama.entity.user.UserBadge.builder().user(users.stream().filter(u->u.getUsername().equals("MacronExplosion")).findFirst().get()).badge(badges.stream().filter(b->b.getLabel().equals("Rang Top 10")).findFirst().get()).build()
                ));
            }
        };
    }
}
