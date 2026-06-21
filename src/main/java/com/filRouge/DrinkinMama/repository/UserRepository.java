package com.filRouge.DrinkinMama.repository;

import com.filRouge.DrinkinMama.entity.user.Role;
import com.filRouge.DrinkinMama.entity.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Optional;

@RepositoryRestResource(collectionResourceRel = "users", path = "users", exported = false)
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    Optional<User> findByEmail(String email);

    Optional<User> findById(Long id);

    Optional<User> findBySlug(String slug);

    Optional<User> findByUsername(String username);

    Page<User> findByRole(Role role, Pageable pageable);
}