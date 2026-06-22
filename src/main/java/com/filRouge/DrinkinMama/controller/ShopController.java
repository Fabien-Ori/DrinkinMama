package com.filRouge.DrinkinMama.controller;

import com.filRouge.DrinkinMama.DTO.ShopItemDTO;
import com.filRouge.DrinkinMama.entity.user.User;
import com.filRouge.DrinkinMama.repository.UserRepository;
import com.filRouge.DrinkinMama.service.ShopService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/shop")
public class ShopController {

    private final ShopService shopService;
    private final UserRepository userRepository;

    public ShopController(ShopService shopService, UserRepository userRepository) {
        this.shopService = shopService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<ShopItemDTO>> getAllItems(Principal principal) {
        User user = userRepository.findByUsername(principal.getName()).orElseThrow();
        return ResponseEntity.ok(shopService.getShopItemsForUser(user.getId()));
    }

    @PostMapping("/buy/{itemId}")
    public ResponseEntity<?> buyItem(@PathVariable Long itemId, Principal principal) {
        try {
            User user = userRepository.findByUsername(principal.getName()).orElseThrow();
            shopService.processPurchase(user.getId(), itemId);
            return ResponseEntity.ok("Achat réussi");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
