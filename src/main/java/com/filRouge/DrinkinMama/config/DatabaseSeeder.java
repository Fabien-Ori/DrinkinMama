package com.filRouge.DrinkinMama.config;

import com.filRouge.DrinkinMama.entity.game.*;
import com.filRouge.DrinkinMama.repository.game.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final IngredientRepository ingredientRepository;
    private final GameToolRepository gameToolRepository;
    private final CocktailRepository cocktailRepository;
    private final ShopItemRepository shopItemRepository;
    private final BadgeRepository badgeRepository;

    @Override
    @Transactional
    public void run(String... args) {
        if (cocktailRepository.count() == 0) {
            seedIngredients();
            seedTools();
            seedCocktails();
            seedShopItems();
            seedBadges();
            System.out.println(">>> Database seeded with default game metadata successfully!");
        }
    }

    private void seedIngredients() {
        ingredientRepository.saveAll(Arrays.asList(
                Ingredient.builder().id("mint").label("Menthe").icon("eco").fromShop(false).build(),
                Ingredient.builder().id("rum").label("Rhum").icon("water-drop").fromShop(false).build(),
                Ingredient.builder().id("lemon").label("Citron").icon("brightness-5").fromShop(false).build(),
                Ingredient.builder().id("ice").label("Glaçons").icon("ac-unit").fromShop(false).build(),
                Ingredient.builder().id("syrup").label("Sirop").icon("spa").fromShop(false).build(),
                Ingredient.builder().id("rose-syrup").label("Sirop rose").icon("spa").emoji("🌹").fromShop(true).build(),
                Ingredient.builder().id("blueberries").label("Myrtilles").icon("circle").emoji("🫐").fromShop(true).build(),
                Ingredient.builder().id("elderflower").label("Sureau").icon("local-florist").emoji("🌺").fromShop(true).build(),
                Ingredient.builder().id("yuzu").label("Yuzu").icon("brightness-5").emoji("🍋").fromShop(true).build()
        ));
    }

    private void seedTools() {
        gameToolRepository.saveAll(Arrays.asList(
                GameTool.builder().id("glass").label("Verre").icon("local-bar").fromShop(false).build(),
                GameTool.builder().id("shaker").label("Shaker").icon("liquor").fromShop(false).build(),
                GameTool.builder().id("mortar").label("Mortier").icon("construction").fromShop(false).build(),
                GameTool.builder().id("golden-shaker").label("Shaker doré").icon("liquor").fromShop(true).satisfiesTool("shaker").build()
        ));
    }

    private void seedCocktails() {
        // Mojito Passion
        Cocktail mojito = Cocktail.builder()
                .id("mojito-passion")
                .name("Mojito Passion")
                .emoji("🍹")
                .thumbClass("c1")
                .points(160)
                .level(2)
                .stars(3)
                .locked(false)
                .build();
        mojito.setRecipe(Arrays.asList(
                RecipeStep.builder().stepId(1).label("Écraser la menthe").points(40).tool("mortar").ingredient("mint").cocktail(mojito).build(),
                RecipeStep.builder().stepId(2).label("Verser le rhum").points(40).tool("glass").ingredient("rum").cocktail(mojito).build(),
                RecipeStep.builder().stepId(3).label("Ajouter le citron").points(30).tool("glass").ingredient("lemon").cocktail(mojito).build(),
                RecipeStep.builder().stepId(4).label("Shaker vigoureusement").points(30).tool("shaker").cocktail(mojito).build(),
                RecipeStep.builder().stepId(5).label("Servir & décorer").points(20).tool("glass").cocktail(mojito).build()
        ));

        // Cosmopolitan
        Cocktail cosmo = Cocktail.builder()
                .id("cosmopolitan")
                .name("Cosmopolitan")
                .emoji("🍸")
                .thumbClass("c2")
                .points(140)
                .level(3)
                .stars(2)
                .locked(false)
                .build();
        cosmo.setRecipe(Arrays.asList(
                RecipeStep.builder().stepId(1).label("Verser la vodka").points(40).tool("glass").ingredient("rum").cocktail(cosmo).build(),
                RecipeStep.builder().stepId(2).label("Ajouter le citron").points(30).tool("glass").ingredient("lemon").cocktail(cosmo).build(),
                RecipeStep.builder().stepId(3).label("Shaker avec glace").points(40).tool("shaker").ingredient("ice").cocktail(cosmo).build(),
                RecipeStep.builder().stepId(4).label("Servir en coupe").points(30).tool("glass").cocktail(cosmo).build()
        ));

        // Whisky Sour
        Cocktail whisky = Cocktail.builder()
                .id("whisky-sour")
                .name("Whisky Sour")
                .emoji("🥃")
                .thumbClass("c3")
                .points(120)
                .level(4)
                .stars(1)
                .locked(false)
                .build();
        whisky.setRecipe(Arrays.asList(
                RecipeStep.builder().stepId(1).label("Verser le whisky").points(40).tool("glass").ingredient("rum").cocktail(whisky).build(),
                RecipeStep.builder().stepId(2).label("Presser le citron").points(30).tool("mortar").ingredient("lemon").cocktail(whisky).build(),
                RecipeStep.builder().stepId(3).label("Ajouter le sirop").points(20).tool("glass").ingredient("syrup").cocktail(whisky).build(),
                RecipeStep.builder().stepId(4).label("Shaker & filtrer").points(30).tool("shaker").cocktail(whisky).build()
        ));

        // Menthe Fraîche
        Cocktail menthe = Cocktail.builder()
                .id("mint-syrup")
                .name("Menthe Fraîche")
                .emoji("🌿")
                .thumbClass("c1")
                .points(100)
                .level(1)
                .stars(2)
                .locked(false)
                .build();
        menthe.setRecipe(Arrays.asList(
                RecipeStep.builder().stepId(1).label("Écraser la menthe").points(30).tool("mortar").ingredient("mint").cocktail(menthe).build(),
                RecipeStep.builder().stepId(2).label("Ajouter le sirop").points(25).tool("glass").ingredient("syrup").cocktail(menthe).build(),
                RecipeStep.builder().stepId(3).label("Verser sur glace").points(25).tool("glass").ingredient("ice").cocktail(menthe).build(),
                RecipeStep.builder().stepId(4).label("Shaker & servir").points(20).tool("shaker").cocktail(menthe).build()
        ));

        // Citron Gingembre
        Cocktail citron = Cocktail.builder()
                .id("citron-gingembre")
                .name("Citron Gingembre")
                .emoji("🍋")
                .thumbClass("c4")
                .points(130)
                .level(2)
                .stars(1)
                .locked(false)
                .build();
        citron.setRecipe(Arrays.asList(
                RecipeStep.builder().stepId(1).label("Presser le citron").points(35).tool("mortar").ingredient("lemon").cocktail(citron).build(),
                RecipeStep.builder().stepId(2).label("Ajouter le sirop").points(30).tool("glass").ingredient("syrup").cocktail(citron).build(),
                RecipeStep.builder().stepId(3).label("Glace pilée").points(25).tool("glass").ingredient("ice").cocktail(citron).build(),
                RecipeStep.builder().stepId(4).label("Shaker & garnir").points(40).tool("shaker").cocktail(citron).build()
        ));

        // Rhum Piscine
        Cocktail rhum = Cocktail.builder()
                .id("rhum-glace")
                .name("Rhum Piscine")
                .emoji("🏖️")
                .thumbClass("c2")
                .points(110)
                .level(1)
                .stars(3)
                .locked(false)
                .build();
        rhum.setRecipe(Arrays.asList(
                RecipeStep.builder().stepId(1).label("Verser le rhum").points(35).tool("glass").ingredient("rum").cocktail(rhum).build(),
                RecipeStep.builder().stepId(2).label("Ajouter les glaçons").points(25).tool("glass").ingredient("ice").cocktail(rhum).build(),
                RecipeStep.builder().stepId(3).label("Shaker légèrement").points(30).tool("shaker").cocktail(rhum).build(),
                RecipeStep.builder().stepId(4).label("Garnir de menthe").points(20).tool("glass").ingredient("mint").cocktail(rhum).build()
        ));

        // Negroni
        Cocktail negroni = Cocktail.builder()
                .id("negroni")
                .name("Negroni")
                .emoji("🍹")
                .thumbClass("c4")
                .points(180)
                .level(5)
                .stars(0)
                .locked(true)
                .lockReason("À débloquer — Niv. 5")
                .recipe(Collections.emptyList())
                .build();

        // Daiquiri Rose
        Cocktail daiquiri = Cocktail.builder()
                .id("daiquiri-rose")
                .name("Daiquiri Rose")
                .emoji("🌹")
                .thumbClass("c1")
                .points(150)
                .level(6)
                .stars(0)
                .locked(true)
                .lockReason("À débloquer — Niv. 6")
                .recipe(Collections.emptyList())
                .build();

        // Margarita
        Cocktail margarita = Cocktail.builder()
                .id("margarita")
                .name("Margarita")
                .emoji("🍸")
                .thumbClass("c2")
                .points(200)
                .level(3)
                .stars(0)
                .locked(true)
                .lockReason("Boutique — 200 🪙")
                .recipe(Collections.emptyList())
                .build();

        cocktailRepository.saveAll(Arrays.asList(mojito, cosmo, whisky, menthe, citron, rhum, negroni, daiquiri, margarita));
    }

    private void seedShopItems() {
        shopItemRepository.saveAll(Arrays.asList(
                ShopItem.builder().id("rose-syrup").name("Sirop de rose").description("Ingrédient rare · +15% de points").emoji("🌹").thumbBg("#1a120d").price(80).category("ingredients").gameIngredientId("rose-syrup").build(),
                ShopItem.builder().id("blueberries").name("Myrtilles fraîches").description("Ingrédient commun").emoji("🫐").thumbBg("#0d1a12").price(50).category("ingredients").owned(true).gameIngredientId("blueberries").build(),
                ShopItem.builder().id("elderflower").name("Fleur de sureau").description("Ingrédient exotique · Unique").emoji("🌺").thumbBg("#1a0d1e").price(150).category("ingredients").gameIngredientId("elderflower").build(),
                ShopItem.builder().id("yuzu").name("Citron yuzu").description("Ingrédient rare · Asiatique").emoji("🍋").thumbBg("#1a1508").price(200).category("ingredients").gameIngredientId("yuzu").build(),
                ShopItem.builder().id("margarita-recipe").name("Recette Margarita").description("Débloque le cocktail Margarita").emoji("🍸").thumbBg("#0d111a").price(200).category("recipes").unlocksCocktailId("margarita").build(),
                ShopItem.builder().id("golden-shaker").name("Shaker doré").description("Ustensile premium · +10% de points").emoji("✨").thumbBg("#2d2008").price(350).category("utensils").gameToolId("golden-shaker").build()
        ));
    }

    private void seedBadges() {
        badgeRepository.saveAll(Arrays.asList(
                Badge.builder().id("first").label("Première recette").icon("star").earned(true).build(),
                Badge.builder().id("streak").label("5 jours de suite").icon("whatshot").earned(true).build(),
                Badge.builder().id("ten").label("10 cocktails").icon("lock").earned(false).build(),
                Badge.builder().id("top10").label("Rang Top 10").icon("lock").earned(false).build()
        ));
    }
}
