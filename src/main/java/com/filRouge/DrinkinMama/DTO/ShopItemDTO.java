package com.filRouge.DrinkinMama.DTO;

import lombok.Data;

@Data
public class ShopItemDTO {
    private Long id;
    private String name;
    private String description;
    private String emoji;
    private String thumbBg;
    private Integer price;
    private String category;
    private boolean owned;
}
