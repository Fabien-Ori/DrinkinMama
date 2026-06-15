package com.filRouge.DrinkinMama.repository.game;

import com.filRouge.DrinkinMama.entity.game.Cocktail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CocktailRepository extends JpaRepository<Cocktail, String> {
}
