package com.filRouge.DrinkinMama.entity.game;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "recipe_step")
public class RecipeStep {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_recipe_step")
    private Long id;

    @Column(name = "step_id", nullable = false)
    private int stepId; // sequential step order number (1, 2, 3...)

    @Column(name = "label", nullable = false, length = 255)
    private String label;

    @Column(name = "points", nullable = false)
    private int points;

    @Column(name = "tool", length = 50)
    private String tool;

    @Column(name = "ingredient", length = 50)
    private String ingredient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cocktail", nullable = false)
    @JsonIgnore
    private Cocktail cocktail;
}
