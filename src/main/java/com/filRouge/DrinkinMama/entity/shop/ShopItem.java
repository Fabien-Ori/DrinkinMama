package com.filRouge.DrinkinMama.entity.shop;

import com.filRouge.DrinkinMama.entity.cocktail.Cocktail;
import com.filRouge.DrinkinMama.entity.cocktail.GameIngredient;
import com.filRouge.DrinkinMama.entity.cocktail.GameTool;
import jakarta.persistence.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Entity
@Table(name = "shop_items")
public class ShopItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_shop_item")
    private Long id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "emoji", length = 10)
    private String emoji;

    @Column(name = "thumb_bg", length = 20)
    private String thumbBg;

    @Column(name = "price", nullable = false)
    private Integer price;

    @Column(name = "category", nullable = false, length = 20)
    private String category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_ingredient")
    private GameIngredient ingredient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tool")
    private GameTool tool;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cocktail")
    private Cocktail cocktail;
}