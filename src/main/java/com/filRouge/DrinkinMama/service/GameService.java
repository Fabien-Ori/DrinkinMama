package com.filRouge.DrinkinMama.service;

import com.filRouge.DrinkinMama.DTO.ActionRequest;
import com.filRouge.DrinkinMama.DTO.GameSession;
import com.filRouge.DrinkinMama.entity.cocktail.Cocktail;
import com.filRouge.DrinkinMama.entity.cocktail.RecipeStep;
import com.filRouge.DrinkinMama.entity.user.User;
import com.filRouge.DrinkinMama.repository.CocktailRepository;
import com.filRouge.DrinkinMama.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class GameService {
    private final CocktailRepository cocktailRepository;
    private final UserRepository userRepository;
    private final BadgeService badgeService;

    public GameService(CocktailRepository cocktailRepository,  UserRepository userRepository, BadgeService badgeService) {
        this.cocktailRepository = cocktailRepository;
        this.badgeService = badgeService;
        this.userRepository = userRepository;
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

        boolean isValidTool = (step.getTool() == null && request.getToolId() == null) ||
                (step.getTool() != null && step.getTool().getId().toString().equals(request.getToolId()));

        boolean isValidIngredient = (step.getIngredient() == null && request.getIngredientId() == null) ||
                (step.getIngredient() != null && step.getIngredient().getId().toString().equals(request.getIngredientId()));

        return isValidTool && isValidIngredient;
    }

    public void processCocktailCompletion(User user, int pointsGagnes) {
        int scoreActuel = user.getScore() != null ? user.getScore() : 0;
        int totalCocktailsActuel = user.getCocktailsCompleted() != null ? user.getCocktailsCompleted() : 0;
        int niveauActuel = user.getLevel() != null ? user.getLevel() : 1;

        int nouveauScore = scoreActuel + pointsGagnes;
        int nouveauTotalCocktails = totalCocktailsActuel + 1;

        int nouveauNiveau = (nouveauScore / 1000) + 1;

        user.setScore(nouveauScore);
        user.setCocktailsCompleted(nouveauTotalCocktails);

        if (nouveauNiveau > niveauActuel) {
            user.setLevel(nouveauNiveau);
        }

        userRepository.save(user);

        badgeService.checkAndGrantBadges(user, nouveauTotalCocktails, nouveauScore);
    }
}