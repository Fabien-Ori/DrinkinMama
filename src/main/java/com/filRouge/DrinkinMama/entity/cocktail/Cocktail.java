package com.filRouge.DrinkinMama.entity.cocktail;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Entity
@Table(name = "cocktails")
public class Cocktail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cocktail")
    private Long id;

    @Column(name = "slug_cocktail", nullable = false, unique = true, length = 50)
    private String slug;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "emoji", length = 10)
    private String emoji;

    @Column(name = "thumb_class", nullable = false, length = 10)
    private String thumbClass;

    @Column(name = "points", nullable = false)
    private Integer points;

    @Column(name = "level", nullable = false)
    private Integer level;

    @Column(name = "stars", nullable = false)
    private Integer stars;

    @Column(name = "locked", nullable = false)
    private boolean locked;

    @Column(name = "lock_reason", length = 100)
    private String lockReason;

    @OneToMany(mappedBy = "cocktail", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RecipeStep> recipeSteps;
}