package com.filRouge.DrinkinMama.repository.game;

import com.filRouge.DrinkinMama.entity.game.ShopItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShopItemRepository extends JpaRepository<ShopItem, String> {
}
