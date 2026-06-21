package com.filRouge.DrinkinMama.DTO;

import com.filRouge.DrinkinMama.entity.cocktail.Cocktail;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CocktailResponse {
    private Long id;
    private String slug;
    private String name;
    private String emoji;
    private String thumbClass;
    private Integer point;
    private Integer level;
    private Integer stars;
    private Boolean locked;
    private String lockReason;

    public static CocktailResponse fromEntity(Cocktail cocktail, boolean isLocked) {
        return CocktailResponse.builder()
                .id(cocktail.getId())
                .slug(cocktail.getSlug())
                .name(cocktail.getName())
                .emoji(cocktail.getEmoji())
                .thumbClass(cocktail.getThumbClass())
                .point(cocktail.getPoints())
                .level(cocktail.getLevel())
                .stars(cocktail.getStars())
                .locked(isLocked)
                .lockReason(isLocked ? cocktail.getLockReason() : null)
                .build();
    }
}
