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
@Table(name = "ingredient")
public class Ingredient {

    @Id
    @Column(name = "id_ingredient", nullable = false, length = 50)
    private String id;

    @Column(name = "label", nullable = false, length = 100)
    private String label;

    @Column(name = "icon", nullable = false, length = 50)
    private String icon;

    @Column(name = "emoji", length = 10)
    private String emoji;

    @Column(name = "from_shop", nullable = false)
    private boolean fromShop;
}
