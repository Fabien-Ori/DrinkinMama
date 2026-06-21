package com.filRouge.DrinkinMama.entity.cocktail;

import jakarta.persistence.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Entity
@Table(name = "game_tools")
public class GameTool {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tool")
    private Long id;

    @Column(name = "label", nullable = false, length = 50)
    private String label;

    @Column(name = "icon", nullable = false, length = 50)
    private String icon;

    @Column(name = "satisfies_tool", length = 50)
    private String satisfiesTool;
}