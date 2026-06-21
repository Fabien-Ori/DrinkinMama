package com.filRouge.DrinkinMama.repository;

import com.filRouge.DrinkinMama.entity.badge.Badge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Optional;

@RepositoryRestResource(collectionResourceRel = "badges", path = "badges", exported = false)
public interface BadgeRepository extends JpaRepository<Badge, Long> {
    Badge findByLabel(String label);
}