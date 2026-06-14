package com.filRouge.DrinkinMama.DTO;

import com.filRouge.DrinkinMama.entity.user.Role;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class UserRequest {
    @NotBlank(message = "Username is required.")
    @Pattern(regexp = "^[a-zA-Z0-9_\\-\\.]+$", message = "Username can only contain letters, numbers, dashes, underscores, and dots.")
    private String Username;
    @NotBlank(message = "Email is required.")
    @Email(message = "Email must be valid.")
    private String email;
    @NotBlank(message = "Password is required.")
    @Size(min = 8, message = "Password must be at least 8 characters long.")
    private String password;

    @NotNull(message = "Role is required.")
    private Role role;

    @Size(max = 500, message = "Biography must not exceed 500 characters.")
    private String biography;
    @Pattern(regexp = "^(http|https)://.*", message = "Image URL must be a valid URL starting with http or https.")
    private String UserImage;
}

