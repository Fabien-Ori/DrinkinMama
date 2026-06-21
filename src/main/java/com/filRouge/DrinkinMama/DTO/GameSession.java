package com.filRouge.DrinkinMama.DTO;

import com.filRouge.DrinkinMama.entity.cocktail.Cocktail;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
public class GameSession {
    private Long cocktailId;
    private String cocktailName;
    private int totalSteps;
    private int sessionPoints = 0;
    private List<Long> completedSteps = new ArrayList<>();

    public GameSession(Cocktail cocktail) {
        this.cocktailId = cocktail.getId();
        this.cocktailName = cocktail.getName();
        this.totalSteps = cocktail.getRecipeSteps().size();
    }
}