package com.filRouge.DrinkinMama.repository.game;

import com.filRouge.DrinkinMama.entity.game.Badge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BadgeRepository extends JpaRepository<Badge, String> {
}
