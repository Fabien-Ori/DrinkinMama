package com.filRouge.DrinkinMama.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.filRouge.DrinkinMama.entity.user.User;
import com.filRouge.DrinkinMama.entity.user.Role;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private Role role;
    private String biography;
    private String userImage;
    private String slug;
    private Integer score;
    private String initials;
    private String avatarBg;
    private String avatarColor;
    private Integer cocktailsCompleted;
    private Integer rank;
    private Integer streak;

    public static UserResponse fromEntity(User user) {

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .biography(user.getBiography())
                .userImage(user.getUserImage())
                .slug(user.getSlug())
                .score(user.getScore())
                .initials(user.getInitials())
                .avatarBg(user.getAvatarBg())
                .avatarColor(user.getAvatarColor())
                .cocktailsCompleted(user.getCocktailsCompleted())
                .rank(user.getRank())
                .streak(user.getStreak())
                .build();
    }


}