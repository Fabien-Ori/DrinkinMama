# Spécifications Fonctionnelles : DrinkinMama

## 1. Fonctionnalités attendues

L'application DrinkinMama est une plateforme interactive de gestion de recettes de cocktails. Ses fonctionnalités principales sont :

* **Gestion des recettes :** Consultation et recherche de cocktails.
* **Système de jeu :** Mécaniques de jeu intégrées permettant de progresser dans la découverte des recettes.
* **Inventaire utilisateur :** Gestion des ingrédients et outils possédés par le joueur.
* **Boutique :** Achat d'objets ou d'ingrédients via une monnaie virtuelle.
* **Système de succès :** Attribution de badges basés sur la progression et les actions de l'utilisateur.

## 2. Rôles des utilisateurs et interactions

Le système distingue deux types d'utilisateurs via un système de rôles (gestion via `Role.java` et `Permission.java`) :

* **Utilisateur (Client/Joueur) :** * Peut s'inscrire et se connecter.
* Peut parcourir les recettes, gérer son inventaire, jouer aux mini-jeux et acheter des items.


* **Administrateur :**
* Possède les droits complets pour gérer les données (CRUD sur les cocktails, ingrédients, outils, badges).
* Assure la maintenance du système.



## 3. Cas d’utilisation principaux

* **Scénario : Création d'un cocktail dans le jeu**
1. L'utilisateur consulte la liste des recettes disponibles.
2. Il sélectionne une recette et vérifie dans son inventaire s'il possède les ingrédients et outils requis.
3. Il valide une étape de préparation (ActionRequest).
4. Le système valide l'action, met à jour le score/la progression, et octroie potentiellement un badge si la recette est complétée.



## 4. Contraintes et exigences non fonctionnelles

* **Sécurité :** * Authentification basée sur les JSON Web Tokens (JWT) pour sécuriser les échanges entre le client (mobile) et le serveur.
* Utilisation de Spring Security pour la gestion des accès par rôles.


* **Performance :** * Utilisation d'une base de données PostgreSQL optimisée avec Hibernate (mode `update`) pour la persistance.
* Structure de données orientée `DTO` (Data Transfer Objects) pour minimiser les données inutiles transférées via l'API.


* **Accessibilité :**
* API documentée automatiquement via **Swagger-UI**, facilitant l'intégration avec le front-end React Native.