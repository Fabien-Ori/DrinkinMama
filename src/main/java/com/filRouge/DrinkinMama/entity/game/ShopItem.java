package com.filRouge.DrinkinMama.entity.game;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "shop_item")
public class ShopItem {

    @Id
    @Column(name = "id_shop_item", nullable = false, length = 50)
    private String id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "description", nullable = false, length = 255)
    private String description;

    @Column(name = "emoji", nullable = false, length = 10)
    private String emoji;

    @Column(name = "thumb_bg", nullable = false, length = 20)
    private String thumbBg;

    @Column(name = "price", nullable = false)
    private int price;

    @Column(name = "category", nullable = false, length = 50)
    private String category; // e.g. "ingredients", "recipes", "utensils"

    @Column(name = "owned", nullable = false)
    private boolean owned;

    @Column(name = "game_ingredient_id", length = 50)
    private String gameIngredientId;

    @Column(name = "game_tool_id", length = 50)
    private String gameToolId;

    @Column(name = "unlocks_cocktail_id", length = 50)
    private String unlocksCocktailId;
}
