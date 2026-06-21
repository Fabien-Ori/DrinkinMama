package com.filRouge.DrinkinMama.repository;

import com.filRouge.DrinkinMama.entity.cocktail.Cocktail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "cocktails", path = "cocktails", exported = false)
public interface CocktailRepository extends JpaRepository<Cocktail, Long>, JpaSpecificationExecutor<Cocktail> {
}
