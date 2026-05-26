package com.filRouge.DrinkinMama.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
/**
 * Représente la réponse retournée suite à une authentification réussie.
 * <p>
 * Cette classe encapsule le token d'authentification JWT généré lors de l'enregistrement
 * ou de la connexion d'un utilisateur. Ce token sera utilisé par le client pour les requêtes
 * ultérieures nécessitant une authentification.
 * </p>
 *
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {

    private String token;

}
