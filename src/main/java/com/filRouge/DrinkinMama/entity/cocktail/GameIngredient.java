package com.filRouge.DrinkinMama.entity.cocktail;

import jakarta.persistence.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Entity
@Table(name = "game_ingredients")
public class GameIngredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ingredient")
    private Long id;

    @Column(name = "label", nullable = false, length = 50)
    private String label;

    @Column(name = "icon", nullable = false, length = 50)
    private String icon;

    @Column(name = "emoji", length = 10)
    private String emoji;
}