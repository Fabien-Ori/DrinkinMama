package com.filRouge.DrinkinMama.entity.user;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static com.filRouge.DrinkinMama.entity.user.Permission.*;


@RequiredArgsConstructor
public enum Role {
    AuthService(Set.of(
            AUTH_SERVICE_CREATE,
            AUTH_SERVICE_READ,
            AUTH_SERVICE_UPDATE,
            AUTH_SERVICE_DELETE
    )),
    User(Set.of(
            USER_READ,
            USER_CREATE,
            USER_UPDATE,
            USER_DELETE
    )),
    Admin(Set.of(
            ADMIN_READ,
            ADMIN_UPDATE,
            ADMIN_DELETE,
            ADMIN_CREATE
    )),
    Banned(
            Collections.emptySet()
    );



    @Getter
    private final Set<Permission> permissions;

    public List<SimpleGrantedAuthority> getAuthorities() {
        var authorities = getPermissions()
                .stream()
                .map(permission -> new SimpleGrantedAuthority(permission.getPermission()))
                .collect(Collectors.toList());
        authorities.add(new SimpleGrantedAuthority("ROLE_" + this.name()));
        return authorities;
    }
}
