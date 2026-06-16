package com.filRouge.DrinkinMama.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserGameStatsRequest {
    private Integer coins;
    private Integer score;
    private Integer level;
    private Integer xp;
    private Integer xpMax;
    private Integer streak;
    private Integer cocktailsCompleted;
    private String rankTitle;
}
