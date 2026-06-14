package com.filRouge.DrinkinMama.controller;

import jakarta.validation.Valid;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.web.bind.annotation.*;
import com.filRouge.DrinkinMama.DTO.UserRequest;
import com.filRouge.DrinkinMama.DTO.UserResponse;
import com.filRouge.DrinkinMama.service.UserService;


@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public CollectionModel<EntityModel<UserResponse>> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/me")
    public EntityModel<UserResponse> getCurrentUserProfile() {
        return userService.getCurrentUserProfile();
    }


    @PatchMapping("/me")
    public EntityModel<UserResponse> updateCurrentUser(@Valid @RequestBody UserRequest request) {
        return userService.updateCurrentUserProfile(request);
    }


    @GetMapping("/{id}")
    public EntityModel<UserResponse> getUserById(@PathVariable("id") Long id) {
        return userService.getUserById(id);
    }

    @GetMapping("/slug/{slug}")
    public EntityModel<UserResponse> findUserBySlug(@PathVariable("slug") String slug) {
        return userService.findUserBySlug(slug);
    }


    @PatchMapping("/{id}")
    public EntityModel<UserResponse> patchUser(@Valid @PathVariable("id") Long id, @RequestBody UserRequest request) {
        return userService.updateUser(id, request);
    }
}
