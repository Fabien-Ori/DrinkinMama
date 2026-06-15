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
@Table(name = "game_tool")
public class GameTool {

    @Id
    @Column(name = "id_tool", nullable = false, length = 50)
    private String id;

    @Column(name = "label", nullable = false, length = 100)
    private String label;

    @Column(name = "icon", nullable = false, length = 50)
    private String icon;

    @Column(name = "from_shop", nullable = false)
    private boolean fromShop;

    @Column(name = "satisfies_tool", length = 50)
    private String satisfiesTool;
}
