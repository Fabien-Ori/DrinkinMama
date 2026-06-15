package com.filRouge.DrinkinMama.controller.game;

import com.filRouge.DrinkinMama.DTO.GameDataDTO;
import com.filRouge.DrinkinMama.repository.game.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/game")
@RequiredArgsConstructor
public class GameDataController {

    private final CocktailRepository cocktailRepository;
    private final IngredientRepository ingredientRepository;
    private final GameToolRepository gameToolRepository;
    private final ShopItemRepository shopItemRepository;
    private final BadgeRepository badgeRepository;

    @GetMapping("/data")
    public GameDataDTO getGameData() {
        return GameDataDTO.builder()
                .cocktails(cocktailRepository.findAll())
                .ingredients(ingredientRepository.findAll())
                .tools(gameToolRepository.findAll())
                .shopItems(shopItemRepository.findAll())
                .badges(badgeRepository.findAll())
                .build();
    }
}
