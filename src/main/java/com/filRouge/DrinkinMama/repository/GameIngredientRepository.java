package com.filRouge.DrinkinMama.repository;

import com.filRouge.DrinkinMama.entity.cocktail.GameIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "game_ingredients", path = "game-ingredients", exported = false)
public interface GameIngredientRepository extends JpaRepository<GameIngredient, Long> {
}