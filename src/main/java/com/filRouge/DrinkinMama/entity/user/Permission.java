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

    LEVEL_DESIGNER_READ("level:read"),
    LEVEL_DESIGNER_UPDATE("level:update"),
    LEVEL_DESIGNER_CREATE("level:create"),
    LEVEL_DESIGNER_DELETE("level:delete"),
    ;

    @Getter
    private final String permission;
}
