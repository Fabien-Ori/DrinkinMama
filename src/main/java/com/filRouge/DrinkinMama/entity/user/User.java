package com.filRouge.DrinkinMama.entity.user;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Entity
@Table(name = "_user")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_user", nullable = false, updatable = false, unique = true)
    private Long id;

    @Column(name = "username", nullable = false, unique = true, length = 50)
    private String username;

    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "biography", columnDefinition = "TEXT")
    private String biography;

    @Column(name = "user_image", columnDefinition = "TEXT")
    private String userImage;

    @Column(name = "slug", unique = true, nullable = false, length = 50)
    private String slug;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", length = 50)
    private Role role;

    @Column(name = "coins")
    @Builder.Default
    private Integer coins = 0;

    @Column(name = "level")
    @Builder.Default
    private Integer level = 1;

    @Column(name = "xp")
    @Builder.Default
    private Integer xp = 0;

    @Column(name = "xp_max")
    @Builder.Default
    private Integer xpMax = 1000;

    @Column(name = "streak")
    @Builder.Default
    private Integer streak = 0;

    @Column(name = "cocktails_completed")
    @Builder.Default
    private Integer cocktailsCompleted = 0;

    @Column(name = "rank_title", length = 100)
    @Builder.Default
    private String rankTitle = "Apprenti Mixologue";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuthProvider provider;

    public Integer getCoins() {
        return coins == null ? 0 : coins;
    }

    public Integer getLevel() {
        return level == null ? 1 : level;
    }

    public Integer getXp() {
        return xp == null ? 0 : xp;
    }

    public Integer getXpMax() {
        return xpMax == null ? 1000 : xpMax;
    }

    public Integer getStreak() {
        return streak == null ? 0 : streak;
    }

    public Integer getCocktailsCompleted() {
        return cocktailsCompleted == null ? 0 : cocktailsCompleted;
    }

    public String getRankTitle() {
        return rankTitle == null ? "Apprenti Mixologue" : rankTitle;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return role != null ? role.getAuthorities() : null;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}