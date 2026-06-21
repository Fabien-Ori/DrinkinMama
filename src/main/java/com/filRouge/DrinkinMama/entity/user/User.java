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

    @Column(name = "slug_user", nullable = false, unique = true, length = 50)
    private String slug;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", length = 50)
    private Role role;

    @Column(name = "username", nullable = false, unique = true, length = 50)
    private String username;

    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @Column(name = "biography", columnDefinition = "TEXT")
    private String biography;

    @Column(name = "user_image", columnDefinition = "TEXT")
    private String userImage;

    @Enumerated(EnumType.STRING)
    @Column(name = "provider", nullable = false, length = 20)
    private AuthProvider provider;

    @Column(name = "score")
    private Integer score;

    @Column(name = "initials", length = 5)
    private String initials;

    @Column(name = "avatar_bg", length = 20)
    private String avatarBg;

    @Column(name = "avatar_color", length = 20)
    private String avatarColor;

    @Column(name = "cocktails_completed")
    private Integer cocktailsCompleted = 0;

    @Column(name = "rank")
    private Integer rank;

    @Column(name = "streak")
    private Integer streak = 0;

    @Column(name = "level")
    private Integer level = 1;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return role != null ? role.getAuthorities() : null;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }
}