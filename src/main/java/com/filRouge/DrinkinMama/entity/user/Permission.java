package com.filRouge.DrinkinMama.entity.user;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum Permission {

    ADMIN_READ("admin:read"),
    ADMIN_UPDATE("admin:update"),
    ADMIN_CREATE("admin:create"),
    ADMIN_DELETE("admin:delete"),

    USER_READ("user:read"),
    USER_UPDATE("user:update"),
    USER_CREATE("user:create"),
    USER_DELETE("user:delete"),

    AUTH_SERVICE_READ("auth:read"),
    AUTH_SERVICE_UPDATE("auth:update"),
    AUTH_SERVICE_CREATE("auth:create"),
    AUTH_SERVICE_DELETE("auth:delete"),
    ;

    @Getter
    private final String permission;
}
