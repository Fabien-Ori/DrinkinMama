package com.filRouge.DrinkinMama.repository;

import com.filRouge.DrinkinMama.entity.shop.ShopItem;
import com.filRouge.DrinkinMama.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Optional;

@RepositoryRestResource(collectionResourceRel = "shops", path = "shops", exported = false)
public interface ShopItemRepository extends JpaRepository<ShopItem, Long> {
    Optional<ShopItem> findByName(String name);

}
