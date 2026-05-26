package com.filRouge.DrinkinMama.repository;

import com.filRouge.DrinkinMama.entity.user.Role;
import com.filRouge.DrinkinMama.entity.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@RepositoryRestResource(collectionResourceRel = "users", path = "users", exported = false)
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    //User findByUsername(String username);
    Optional<User> findByEmail(String email);

    Optional<User> findById(Long id);

    /**
     * Get the user by the slug based on the filed pseudo, optional because the city could not exist
     *
     * @param slug
     * @return
     */
    Optional<User> findBySlug(String slug);

    /**
     * Retrieves a list of users by their role.
     *
     * @param role The role to filter users by.
     * @return A list of users with the specified role.
     */
    Page<User> findByRole(Role role, Pageable pageable);
}
