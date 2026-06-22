package com.filRouge.DrinkinMama.DTO;

import com.filRouge.DrinkinMama.entity.cocktail.RecipeStep;
import lombok.Data;

@Data
public class RecipeStepDTO {
    private Long id;
    private Integer stepOrder;
    private String label;
    private Integer points;
    private String toolId;
    private String ingredientId;

    public static RecipeStepDTO fromEntity(RecipeStep step) {
        RecipeStepDTO dto = new RecipeStepDTO();
        dto.setId(step.getId());
        dto.setStepOrder(step.getStepOrder());
        dto.setLabel(step.getLabel());
        dto.setPoints(step.getPoints());
        dto.setToolId(step.getTool() != null ? step.getTool().getId().toString() : null);
        dto.setIngredientId(step.getIngredient() != null ? step.getIngredient().getId().toString() : null);
        return dto;
    }
}