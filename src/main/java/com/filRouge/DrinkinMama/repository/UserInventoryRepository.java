package com.filRouge.DrinkinMama.repository;

import com.filRouge.DrinkinMama.entity.user.User;
import com.filRouge.DrinkinMama.entity.user.UserInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Set;

@RepositoryRestResource(collectionResourceRel = "user_inventory", path = "user-inventories", exported = false)
public interface UserInventoryRepository extends JpaRepository<UserInventory, Long>, JpaSpecificationExecutor<UserInventory> {
    @Query("SELECT si.cocktail.id " +
            "FROM UserInventory ui " +
            "JOIN ui.shopItem si " +
            "WHERE ui.user.id = :userId " +
            "AND si.cocktail IS NOT NULL")
    Set<Integer> findUnlockedCocktailIdsByUserId(@Param("userId") Long userId);

    boolean existsByUserIdAndShopItemId(Long userId, Long shopItemId);

    @Query("SELECT ui.shopItem.id FROM UserInventory ui WHERE ui.user.id = :userId")
    Set<Long> findOwnedItemIdsByUserId(@Param("userId") Long userId);
}
