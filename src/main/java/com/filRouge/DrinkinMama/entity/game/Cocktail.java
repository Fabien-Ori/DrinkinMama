package com.filRouge.DrinkinMama.entity.game;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "cocktail")
public class Cocktail {

    @Id
    @Column(name = "id_cocktail", nullable = false, length = 50)
    private String id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "emoji", nullable = false, length = 10)
    private String emoji;

    @Column(name = "thumb_class", nullable = false, length = 20)
    private String thumbClass;

    @Column(name = "points", nullable = false)
    private int points;

    @Column(name = "level", nullable = false)
    private int level;

    @Column(name = "stars", nullable = false)
    private int stars;

    @Column(name = "locked", nullable = false)
    private boolean locked;

    @Column(name = "lock_reason", length = 100)
    private String lockReason;

    @OneToMany(mappedBy = "cocktail", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @OrderBy("stepId ASC")
    @Builder.Default
    private List<RecipeStep> recipe = new ArrayList<>();
}
