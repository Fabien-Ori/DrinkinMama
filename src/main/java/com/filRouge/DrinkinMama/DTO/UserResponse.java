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
    private Integer coins;
    private Integer score;
    private Integer level;
    private Integer xp;
    private Integer xpMax;
    private Integer streak;
    private Integer cocktailsCompleted;
    private String rankTitle;

    public static UserResponse fromEntity(User user) {


        return UserResponse.builder()
                .id(user.getId())
                .username(user.getProfileUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .biography(user.getBiography())
                .userImage(user.getUserImage())
                .coins(user.getCoins())
                .score(user.getScore())
                .level(user.getLevel())
                .xp(user.getXp())
                .xpMax(user.getXpMax())
                .streak(user.getStreak())
                .cocktailsCompleted(user.getCocktailsCompleted())
                .rankTitle(user.getRankTitle())
                .build();
    }


}
