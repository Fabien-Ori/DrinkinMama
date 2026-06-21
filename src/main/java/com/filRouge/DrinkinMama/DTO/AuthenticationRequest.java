package com.filRouge.DrinkinMama.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Représente une requête d'authentification utilisée lors de la connexion d'un utilisateur.
 * <p>
 * Cette classe encapsule les informations d'identification (email et mot de passe) nécessaires
 * pour authentifier un utilisateur dans le système. Elle est utilisée principalement par le
 * contrôleur d'authentification pour traiter les demandes de connexion.
 * </p>
 *
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationRequest {
    private String username;
    private String password;
}