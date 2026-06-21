package com.filRouge.DrinkinMama.repository;

import com.filRouge.DrinkinMama.entity.cocktail.RecipeStep;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "recipe_steps", path = "recipe-steps", exported = false)
public interface RecipeStepRepository extends JpaRepository<RecipeStep, Long>, JpaSpecificationExecutor<RecipeStep> {
}
