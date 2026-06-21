package com.filRouge.DrinkinMama.service;

import com.github.slugify.Slugify;
import com.filRouge.DrinkinMama.DTO.AuthenticationRequest;
import com.filRouge.DrinkinMama.DTO.AuthenticationResponse;
import com.filRouge.DrinkinMama.DTO.UserRequest;
import com.filRouge.DrinkinMama.config.JwtService;
import com.filRouge.DrinkinMama.entity.user.AuthProvider;
import com.filRouge.DrinkinMama.entity.user.Role;
import com.filRouge.DrinkinMama.entity.user.User;
import com.filRouge.DrinkinMama.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Random;


/**
 * Service qui gère les opérations d'authentification des utilisateurs.
 * <p>
 * Ce service fournit des méthodes pour l'enregistrement de nouveaux utilisateurs et l'authentification
 * des utilisateurs existants. Il s'occupe également de la génération des tokens JWT pour les
 * sessions authentifiées.
 * </p>
 */
@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository repository;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final Slugify slugify = Slugify.builder().build();


    /**
     * Enregistre un nouvel utilisateur dans le système.
     *
     * @param request Les informations du nouvel utilisateur à enregistrer
     * @return Une réponse contenant le token JWT généré pour l'utilisateur enregistré
     */
    public AuthenticationResponse register(UserRequest request) throws Exception {
        repository.findByUsername(request.getUsername()).ifPresent(
                user -> {
                    throw new RuntimeException("Username already exists");
                }
        );
        String generatedSlug = slugify.slugify(request.getUsername());

        String initials = request.getUsername().length() >= 2
                ? request.getUsername().substring(0, 2).toUpperCase()
                : request.getUsername().toUpperCase();

        String[] backgroundColors = {"#2a1808", "#0d1a12", "#1a0d1e", "#2a2847"};
        String[] textColors = {"#cd7f32", "#7F77DD"};

        Random random = new Random();
        String randomBg = backgroundColors[random.nextInt(backgroundColors.length)];
        String randomColor = textColors[random.nextInt(textColors.length)];

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(encoder.encode(request.getPassword()))
                .biography(request.getBiography())
                .userImage(request.getUserImage())
                .slug(generatedSlug)
                .role(Role.User)
                .provider(AuthProvider.LOCAL)
                .initials(initials)
                .avatarBg(randomBg)
                .avatarColor(randomColor)
                .cocktailsCompleted(0)
                .score(0)
                .streak(0)
                .build();

        repository.save(user);
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    /**
     * Authentifie un utilisateur existant.
     *
     * @param request Les informations d'authentification (email et mot de passe)
     * @return Une réponse contenant le token JWT généré pour l'utilisateur authentifié
     * @throws org.springframework.security.core.AuthenticationException Si l'authentification échoue
     */
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        var user = repository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // If the user's role is Banned, block the authentication
        if (user.getRole() == Role.Banned) {
            throw new RuntimeException("Your account has been banned. Please contact the administrator.");
        }

        // Authenticate user's credentials (email and password)
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword())
        );

        // Generate the JWT token for the authenticated user
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }
}