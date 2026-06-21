package com.filRouge.DrinkinMama.repository;

import com.filRouge.DrinkinMama.entity.badge.Badge;
import com.filRouge.DrinkinMama.entity.user.User;
import com.filRouge.DrinkinMama.entity.user.UserBadge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(collectionResourceRel = "user_badges", path = "user-badges", exported = false)
public interface UserBadgeRepository extends JpaRepository<UserBadge, Long> {

    boolean existsByUserAndBadge(User user, Badge badge);

    List<UserBadge> findByUser(User user);
}