package com.filRouge.DrinkinMama.service;

import com.filRouge.DrinkinMama.DTO.ActionRequest;
import com.filRouge.DrinkinMama.DTO.GameSession;
import com.filRouge.DrinkinMama.entity.cocktail.Cocktail;
import com.filRouge.DrinkinMama.entity.cocktail.RecipeStep;
import com.filRouge.DrinkinMama.repository.CocktailRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class GameService {
    private final CocktailRepository cocktailRepository;
    private final Map<Long, GameSession> activeSessions = new ConcurrentHashMap<>();

    public GameService(CocktailRepository cocktailRepository) {
        this.cocktailRepository = cocktailRepository;
    }

    public GameSession startSession(Long cocktailId) {
        Cocktail cocktail = cocktailRepository.findById(cocktailId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        return new GameSession(cocktail);
    }

    public boolean validateStep(Long cocktailId, ActionRequest request) {
        Cocktail cocktail = cocktailRepository.findById(cocktailId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        RecipeStep step = cocktail.getRecipeSteps().stream()
                .filter(s -> s.getStepOrder() == request.getStepOrder())
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        boolean isValid = (step.getTool() == null || step.getTool().getId().toString().equals(request.getToolId()))
                && (step.getIngredient() == null || step.getIngredient().getId().toString().equals(request.getIngredientId()));

        if (isValid) {
            GameSession session = activeSessions.get(cocktailId);
            if (session != null) {
                session.setSessionPoints(session.getSessionPoints() + step.getPoints());
                session.getCompletedSteps().add(step.getId());
            }
        }
        return isValid;
    }
}