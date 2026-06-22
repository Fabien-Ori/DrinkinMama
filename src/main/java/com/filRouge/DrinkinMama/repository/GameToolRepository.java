package com.filRouge.DrinkinMama.repository;

import com.filRouge.DrinkinMama.entity.cocktail.GameTool;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "game_tools", path = "game-tools", exported = false)
public interface GameToolRepository extends JpaRepository<GameTool, Long> {
}