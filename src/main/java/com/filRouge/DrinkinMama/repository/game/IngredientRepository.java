package com.filRouge.DrinkinMama.repository.game;

import com.filRouge.DrinkinMama.entity.game.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, String> {
}
