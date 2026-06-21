package com.filRouge.DrinkinMama.service;

import com.github.slugify.Slugify;
import com.filRouge.DrinkinMama.DTO.UserRequest;
import com.filRouge.DrinkinMama.controller.UserController;
import com.filRouge.DrinkinMama.entity.user.Role;
import com.filRouge.DrinkinMama.repository.UserRepository;
import com.filRouge.DrinkinMama.entity.user.User;
import com.filRouge.DrinkinMama.DTO.UserResponse;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PagedResourcesAssembler pagedResourcesAssembler;
    private final Slugify slugify = Slugify.builder().build();

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, PagedResourcesAssembler pagedResourcesAssembler) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.pagedResourcesAssembler = pagedResourcesAssembler;
    }

    /**
     * Retrieves the profile of the currently authenticated user.
     *
     * <p>This method fetches the user's email from the security context, looks up the corresponding
     * {@link User} entity in the database, maps it to a {@link UserResponse}, and wraps it in an
     * {@link EntityModel} with a self-referencing HATEOAS link.</p>
     *
     * @return an {@link EntityModel} containing the current user's profile
     * @throws ResponseStatusException if the user is not found in the database
     */
    @Transactional(readOnly = true)
    public EntityModel<UserResponse> getCurrentUserProfile() {
        User user = getCurrentAuthenticatedUser();

        UserResponse response = UserResponse.fromEntity(user);

        return EntityModel.of(response,
                linkTo(methodOn(UserController.class).getUserById(user.getId())).withSelfRel(),
                linkTo(methodOn(UserController.class).getAllUsers()).withRel("users"));
    }

    public EntityModel<UserResponse> findUserBySlug(String slug) {
        User user = userRepository.findBySlug(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No user found with the slug: " + slug));

        UserResponse response = UserResponse.fromEntity(user);

        return EntityModel.of(response,
                linkTo(methodOn(UserController.class).getUserById(user.getId())).withSelfRel(),
                linkTo(methodOn(UserController.class).getAllUsers()).withRel("users"));

    }


    /**
     * Updates the profile of the currently authenticated user with the provided data.
     *
     * @param request the fields to update (only non-null fields will be modified)
     * @return an {@link EntityModel} containing the updated user profile
     */
    public EntityModel<UserResponse> updateCurrentUserProfile(UserRequest request) {
        try {
            User existingUser = getCurrentAuthenticatedUser();

            applyUserUpdates(existingUser, request);

            if (request.getRole() != null) {
                Role currentRole = existingUser.getRole();
                Role newRole = request.getRole();

                boolean isAdmin = currentRole == Role.Admin;
                if (currentRole == Role.User) {
                    existingUser.setRole(newRole);
                } else if (isAdmin) {
                    existingUser.setRole(newRole);
                } else {
                    throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                            "You are not allowed to change your role to " + newRole);
                }
            }
            User updatedUser = userRepository.save(existingUser);
            UserResponse response = UserResponse.fromEntity(updatedUser);

            return EntityModel.of(response,
                    linkTo(methodOn(UserController.class).getCurrentUserProfile()).withSelfRel());

        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected error while updating profile", e);
        }
    }

    /**
     * Set the current authenticated user to dosabled.
     * Throws an exception if the user is not found.
     */
    @Transactional(readOnly = true)
    public EntityModel<UserResponse> getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        UserResponse response = UserResponse.fromEntity(user);
        return EntityModel.of(response,
                linkTo(methodOn(UserController.class).getUserById(id)).withSelfRel(),
                linkTo(methodOn(UserController.class).getAllUsers()).withRel("users"));

    }

    @Transactional(readOnly = true)
    public CollectionModel<EntityModel<UserResponse>> getAllUsers() {

        List<EntityModel<UserResponse>> users = userRepository.findAll().stream()
                .map(user -> {
                    UserResponse response = UserResponse.fromEntity(user);
                    return EntityModel.of(response,
                            linkTo(methodOn(UserController.class).getUserById(user.getId())).withSelfRel());
                })
                .collect(Collectors.toList());
        return CollectionModel.of(users,
                linkTo(methodOn(UserController.class).getAllUsers()).withSelfRel(),
                linkTo(methodOn(UserController.class).getAllUsers()).withRel("users"));
    }

    public EntityModel<UserResponse> updateUser(Long id, UserRequest request) {

        User currentUser = getCurrentAuthenticatedUser();
        boolean isAdmin = currentUser.getRole() == Role.Admin;

        if (!isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only administrators can update users.");
        }
        User existingUser = userRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur non trouvé"));

        applyUserUpdates(existingUser, request);

        if (request.getRole() != null) {
            existingUser.setRole(request.getRole());
        }

        User updatedUser = userRepository.save(existingUser);
        UserResponse response = UserResponse.fromEntity(updatedUser);

        return EntityModel.of(response,
                linkTo(methodOn(UserController.class).getUserById(id)).withSelfRel());
    }

    public void deleteUser(Long id) {
        User userToDelete = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        User currentUser = getCurrentAuthenticatedUser();

        boolean isOwner = userToDelete.getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.Admin;

        if (!isOwner && !isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have permission to delete this user.");
        }

        userRepository.delete(userToDelete);
    }

    private User getCurrentAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof User)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }
        return (User) principal;
    }

    private void applyUserUpdates(User user, UserRequest request) {
        if (request.getUsername() != null && !request.getUsername().equals(user.getUsername())) {
            user.setUsername(request.getUsername());
            String newSlug = slugify.slugify(request.getUsername());
            user.setSlug(newSlug);
        }

        if (request.getEmail() != null) user.setEmail(request.getEmail());
        if (request.getPassword() != null) user.setPassword(passwordEncoder.encode(request.getPassword()));
        if (request.getBiography() != null) user.setBiography(request.getBiography());
        if (request.getUserImage() != null) user.setUserImage(request.getUserImage());
    }

}