package com.filRouge.DrinkinMama.service;

import com.filRouge.DrinkinMama.DTO.ShopItemDTO;
import com.filRouge.DrinkinMama.entity.shop.ShopItem;
import com.filRouge.DrinkinMama.entity.user.User;
import com.filRouge.DrinkinMama.entity.user.UserInventory;
import com.filRouge.DrinkinMama.repository.ShopItemRepository;
import com.filRouge.DrinkinMama.repository.UserInventoryRepository;
import com.filRouge.DrinkinMama.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ShopService {

    private final ShopItemRepository shopRepository;
    private final UserInventoryRepository inventoryRepository;
    private final UserRepository userRepository;

    public ShopService(ShopItemRepository shopRepository, UserInventoryRepository inventoryRepository, UserRepository userRepository) {
        this.shopRepository = shopRepository;
        this.inventoryRepository = inventoryRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void processPurchase(Long userId, Long shopItemId) throws Exception {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new Exception("Utilisateur non trouvé"));
        ShopItem item = shopRepository.findById(shopItemId)
                .orElseThrow(() -> new Exception("Article non trouvé"));

        if (user.getScore() < item.getPrice()) {
            throw new Exception("Solde insuffisant");
        }

        if (inventoryRepository.existsByUserIdAndShopItemId(userId, shopItemId)) {
            throw new Exception("Article déjà possédé");
        }

        user.setScore(user.getScore() - item.getPrice());
        userRepository.save(user);

        UserInventory inv = UserInventory.builder()
                .user(user)
                .shopItem(item)
                .build();
        inventoryRepository.save(inv);
    }

    public List<ShopItemDTO> getShopItemsForUser(Long userId) {
        List<ShopItem> allItems = shopRepository.findAll();
        Set<Long> ownedIds = inventoryRepository.findOwnedItemIdsByUserId(userId);

        return allItems.stream().map(item -> {
            ShopItemDTO dto = new ShopItemDTO();
            dto.setId(item.getId());
            dto.setName(item.getName());
            dto.setDescription(item.getDescription());
            dto.setEmoji(item.getEmoji());
            dto.setThumbBg(item.getThumbBg());
            dto.setPrice(item.getPrice());
            dto.setCategory(item.getCategory());
            dto.setOwned(ownedIds.contains(item.getId()));
            return dto;
        }).collect(Collectors.toList());
    }
}
