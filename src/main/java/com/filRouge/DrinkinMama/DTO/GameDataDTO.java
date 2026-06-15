package com.filRouge.DrinkinMama.DTO;

import com.filRouge.DrinkinMama.entity.game.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameDataDTO {
    private List<Cocktail> cocktails;
    private List<Ingredient> ingredients;
    private List<GameTool> tools;
    private List<ShopItem> shopItems;
    private List<Badge> badges;
}
