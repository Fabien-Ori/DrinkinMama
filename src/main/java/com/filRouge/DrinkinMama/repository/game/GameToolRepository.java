package com.filRouge.DrinkinMama.repository.game;

import com.filRouge.DrinkinMama.entity.game.GameTool;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GameToolRepository extends JpaRepository<GameTool, String> {
}
