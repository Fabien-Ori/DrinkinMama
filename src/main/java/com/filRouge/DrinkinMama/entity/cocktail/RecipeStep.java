package com.filRouge.DrinkinMama.entity.cocktail;

import jakarta.persistence.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Entity
@Table(name = "recipe_steps")
public class RecipeStep {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_recipe_step")
    private Long id;

    @Column(name = "step_order", nullable = false)
    private Integer stepOrder;

    @Column(name = "label", nullable = false, length = 255)
    private String label;

    @Column(name = "points", nullable = false)
    private Integer points;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cocktail", nullable = false)
    private Cocktail cocktail;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tool", nullable = false)
    private GameTool tool;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_ingredient")
    private GameIngredient ingredient;
}