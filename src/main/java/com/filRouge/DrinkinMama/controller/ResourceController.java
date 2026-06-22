package com.filRouge.DrinkinMama.controller;

import com.filRouge.DrinkinMama.DTO.RecipeStepDTO;
import com.filRouge.DrinkinMama.entity.cocktail.GameTool;
import com.filRouge.DrinkinMama.entity.cocktail.GameIngredient;
import com.filRouge.DrinkinMama.repository.GameToolRepository;
import com.filRouge.DrinkinMama.repository.GameIngredientRepository;
import com.filRouge.DrinkinMama.repository.RecipeStepRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class ResourceController {

    private final GameToolRepository toolRepository;
    private final GameIngredientRepository ingredientRepository;
    private final RecipeStepRepository recipeStepRepository;

    public ResourceController(GameToolRepository toolRepository,
                              GameIngredientRepository ingredientRepository,
                              RecipeStepRepository recipeStepRepository) {
        this.toolRepository = toolRepository;
        this.ingredientRepository = ingredientRepository;
        this.recipeStepRepository = recipeStepRepository;
    }

    @GetMapping("/tools")
    public List<GameTool> getAllTools() {
        return toolRepository.findAll();
    }

    @GetMapping("/ingredients")
    public List<GameIngredient> getAllIngredients() {
        return ingredientRepository.findAll();
    }

    @GetMapping("/cocktails/{cocktailId}/steps")
    public List<RecipeStepDTO> getStepsByCocktail(@PathVariable Long cocktailId) {
        return recipeStepRepository.findByCocktailIdOrderByStepOrderAsc(cocktailId)
                .stream()
                .map(RecipeStepDTO::fromEntity)
                .collect(Collectors.toList());
    }
}