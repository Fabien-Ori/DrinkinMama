package com.filRouge.DrinkinMama.DTO;

import com.filRouge.DrinkinMama.entity.user.Role;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class UserRequest {
    @NotBlank(message = "Le pseudo est requis.")
    @Pattern(regexp = "^[a-zA-Z0-9_\\-\\.]+$", message = "Le pseudo peut seulement contenir des lettres, des nombres, des tirets, des underscores, et des points.")
    private String Username;
    @NotBlank(message = "L'email est requis.")
    @Email(message = "L'email doit être valide.")
    private String email;
    @NotBlank(message = "Le mot de passe est requis.")
    @Size(min = 8, message = "Le mot de passe doit faire au moins 8 caractères.")
    private String password;

    @NotNull(message = "Le rôle est requis.")
    private Role role;

    @Size(max = 500, message = "La biographie ne doit pas excéder 500 caractères.")
    private String biography;
    @Pattern(regexp = "^(http|https)://.*", message = "Chaque image doit avoir une URL valide commançant par http ou https.")
    private String UserImage;

    @Size(max = 2, message = "Les initiales doivent faire au maximum 2 caractères.")
    private String initials;

    private String avatarBg;

    private String avatarColor;
}