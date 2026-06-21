package com.filRouge.DrinkinMama.service;

import com.filRouge.DrinkinMama.DTO.CocktailResponse;
import com.filRouge.DrinkinMama.controller.CocktailController;
import com.filRouge.DrinkinMama.entity.cocktail.Cocktail;
import com.filRouge.DrinkinMama.repository.CocktailRepository;
import com.filRouge.DrinkinMama.repository.UserInventoryRepository;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@Service
public class CocktailService {
    private final CocktailRepository cocktailRepository;
    private final UserInventoryRepository inventoryRepository;

    public CocktailService(CocktailRepository cocktailRepository, UserInventoryRepository inventoryRepository) {
        this.cocktailRepository = cocktailRepository;
        this.inventoryRepository = inventoryRepository;
    }

    @Transactional(readOnly = true)
    public CollectionModel<EntityModel<CocktailResponse>> getAllCocktails(Long userId) {
        List<Cocktail> cocktails = cocktailRepository.findAll();
        Set<Integer> unlockedIds = inventoryRepository.findUnlockedCocktailIdsByUserId(userId);

        List<EntityModel<CocktailResponse>> cocktailModels = cocktails.stream()
                .map(cocktail -> {
                    boolean isLocked = cocktail.isLocked() && !unlockedIds.contains(cocktail.getId().intValue());
                    CocktailResponse response = CocktailResponse.fromEntity(cocktail, isLocked);

                    return EntityModel.of(response,
                            linkTo(methodOn(CocktailController.class).getCocktailById(cocktail.getId())).withSelfRel());
                })
                .collect(Collectors.toList());

        return CollectionModel.of(cocktailModels,
                linkTo(methodOn(CocktailController.class).getAllCocktails()).withSelfRel());
    }

    @Transactional(readOnly = true)
    public EntityModel<CocktailResponse> getCocktailById(Long id, Long userId) {
        Cocktail cocktail = cocktailRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cocktail not found"));

        Set<Integer> unlockedIds = inventoryRepository.findUnlockedCocktailIdsByUserId(userId);
        boolean isLocked = cocktail.isLocked() && !unlockedIds.contains(cocktail.getId().intValue());

        CocktailResponse response = CocktailResponse.fromEntity(cocktail, isLocked);

        return EntityModel.of(response,
                linkTo(methodOn(CocktailController.class).getCocktailById(id)).withSelfRel(),
                linkTo(methodOn(CocktailController.class).getAllCocktails()).withRel("cocktails"));
    }
}