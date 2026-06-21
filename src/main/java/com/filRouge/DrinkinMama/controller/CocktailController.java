package com.filRouge.DrinkinMama.controller;

import com.filRouge.DrinkinMama.DTO.ActionRequest;
import com.filRouge.DrinkinMama.DTO.CocktailResponse;
import com.filRouge.DrinkinMama.DTO.GameSession;
import com.filRouge.DrinkinMama.service.CocktailService;
import com.filRouge.DrinkinMama.service.GameService;
import com.filRouge.DrinkinMama.service.UserService;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cocktails")
public class CocktailController {

    private final CocktailService cocktailService;
    private final UserService userService;
    private final GameService gameService;

    public CocktailController(CocktailService cocktailService, UserService userService, GameService gameService) {
        this.cocktailService = cocktailService;
        this.userService = userService;
        this.gameService = gameService;
    }

    @GetMapping
    public CollectionModel<EntityModel<CocktailResponse>> getAllCocktails() {
        Long userId = userService.getCurrentAuthenticatedUser().getId();
        return cocktailService.getAllCocktails(userId);
    }

    @GetMapping("/{id}")
    public EntityModel<CocktailResponse> getCocktailById(@PathVariable Long id) {
        Long userId = userService.getCurrentAuthenticatedUser().getId();
        return cocktailService.getCocktailById(id, userId);
    }

    @PostMapping("/{id}/start")
    public ResponseEntity<GameSession> startNewGame(@PathVariable Long id) {
        return ResponseEntity.ok(gameService.startSession(id));
    }

    @PostMapping("/{id}/validate")
    public ResponseEntity<Boolean> validate(@PathVariable Long id, @RequestBody ActionRequest request) {
        boolean isValid = gameService.validateStep(id, request);
        return ResponseEntity.ok(isValid);
    }
}
