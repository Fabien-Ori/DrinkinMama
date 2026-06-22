CREATE DATABASE drinkingmama;

CREATE TABLE _user
(
    id_user      SERIAL PRIMARY KEY,
    slug_user    VARCHAR(50)  NOT NULL UNIQUE,
    role         VARCHAR(50)  DEFAULT 'User',
    username     VARCHAR(50)  NOT NULL UNIQUE,
    email        VARCHAR(100) NOT NULL UNIQUE,
    password     VARCHAR(255) NOT NULL,
    biography    TEXT,
    user_image   TEXT DEFAULT 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png',
    provider     VARCHAR(20) DEFAULT 'LOCAL' NOT NULL CONSTRAINT _user_provider_check CHECK (provider IN ('LOCAL', 'GOOGLE')),
    score        INTEGER DEFAULT 0,
    cocktails_completed INTEGER DEFAULT 0,
    initials     VARCHAR(5),
    avatar_bg    VARCHAR(20),
    avatar_color VARCHAR(20)
);

CREATE TABLE game_ingredients 
(
    id_ingredient SERIAL PRIMARY KEY,
    label         VARCHAR(50) NOT NULL,
    icon          VARCHAR(50) NOT NULL,
    emoji         VARCHAR(10)
);

CREATE TABLE game_tools 
(
    id_tool        SERIAL PRIMARY KEY,
    label          VARCHAR(50) NOT NULL,
    icon           VARCHAR(50) NOT NULL,
    satisfies_tool VARCHAR(50)
);

CREATE TABLE cocktails 
(
    id_cocktail   SERIAL PRIMARY KEY,
    slug_cocktail VARCHAR(50)  NOT NULL UNIQUE,
    name          VARCHAR(100) NOT NULL,
    emoji         VARCHAR(10),
    thumb_class   VARCHAR(10) NOT NULL,
    points        INTEGER NOT NULL,
    level         INTEGER NOT NULL,
    stars         INTEGER NOT NULL,
    locked        BOOLEAN NOT NULL,
    lock_reason   VARCHAR(100)
);

CREATE TABLE recipe_steps 
(
    id_recipe_step SERIAL PRIMARY KEY,
    step_order     INTEGER NOT NULL,
    label          VARCHAR(255) NOT NULL,
    points         INTEGER NOT NULL,
    id_cocktail    INTEGER NOT NULL REFERENCES cocktails(id_cocktail) ON DELETE CASCADE,
    id_tool        INTEGER NOT NULL REFERENCES game_tools(id_tool),
    id_ingredient  INTEGER REFERENCES game_ingredients(id_ingredient)
);

CREATE TABLE shop_items 
(
    id_shop_item        SERIAL PRIMARY KEY,
    name                VARCHAR(100) NOT NULL,
    description         TEXT,
    emoji               VARCHAR(10),
    thumb_bg            VARCHAR(20),
    price               INTEGER NOT NULL,
    category            VARCHAR(20) NOT NULL,
    id_ingredient       INTEGER REFERENCES game_ingredients(id_ingredient),
    id_tool             INTEGER REFERENCES game_tools(id_tool),
    id_cocktail         INTEGER REFERENCES cocktails(id_cocktail)
);

CREATE TABLE badges 
(
    id_badge SERIAL PRIMARY KEY,
    label    VARCHAR(100) NOT NULL,
    icon     VARCHAR(50) NOT NULL
);

CREATE TABLE user_inventory (
    id_inventory SERIAL PRIMARY KEY,
    id_user INTEGER NOT NULL REFERENCES _user(id_user) ON DELETE CASCADE,
    id_shop_item INTEGER NOT NULL REFERENCES shop_items(id_shop_item) ON DELETE CASCADE,
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_user, id_shop_item)
);

CREATE TABLE user_badges (
    id_user_badge SERIAL PRIMARY KEY,
    id_user INTEGER NOT NULL REFERENCES _user(id_user) ON DELETE CASCADE,
    id_badge INTEGER NOT NULL REFERENCES badges(id_badge) ON DELETE CASCADE,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_user, id_badge)
);

INSERT INTO game_tools (label, icon, satisfies_tool) VALUES
('Verre', 'local-bar', NULL),
('Shaker', 'liquor', NULL),
('Mortier', 'construction', NULL),
('Shaker doré', 'liquor', 'shaker');

INSERT INTO game_ingredients (label, icon, emoji) VALUES
('Menthe', 'eco', NULL),
('Rhum', 'water-drop', NULL),
('Vodka', 'wine-bar', NULL),
('Whisky', 'sports-bar', NULL),
('Citron', 'brightness-5', NULL),
('Glaçons', 'ac-unit', NULL),
('Sirop', 'spa', NULL),
('Sirop rose', 'spa', '🌹'),
('Myrtilles', 'circle', '🫐'),
('Sureau', 'local-florist', '🌺'),
('Yuzu', 'brightness-5', '🍋');

INSERT INTO cocktails (slug_cocktail, name, emoji, thumb_class, points, level, stars, locked, lock_reason) VALUES 
('mojito-passion', 'Mojito Passion', '🍹', 'c1', 160, 2, 3, false, NULL),
('cosmopolitan', 'Cosmopolitan', '🍸', 'c2', 140, 3, 2, false, NULL),
('whisky-sour', 'Whisky Sour', '🥃', 'c3', 120, 4, 1, false, NULL),
('menthe-fraiche', 'Menthe Fraîche', '🌿', 'c1', 100, 1, 2, false, NULL),
('citron-gingembre', 'Citron Gingembre', '🍋', 'c4', 130, 2, 1, false, NULL),
('rhum-piscine', 'Rhum Piscine', '🏖️', 'c2', 110, 1, 3, false, NULL),
('negroni', 'Negroni', '🍹', 'c4', 180, 5, 0, true, 'À débloquer — Niv. 5'),
('daiquiri-rose', 'Daiquiri Rose', '🌹', 'c1', 150, 6, 0, true, 'À débloquer — Niv. 6'),
('margarita', 'Margarita', '🍸', 'c2', 200, 3, 0, true, 'Boutique — 200 🪙');

INSERT INTO recipe_steps (step_order, label, points, id_cocktail, id_tool, id_ingredient) VALUES 
(1, 'Écraser la menthe', 40, 1, 3, 1), (2, 'Verser le rhum', 40, 1, 1, 2), (3, 'Ajouter le citron', 30, 1, 1, 5), (4, 'Shaker', 30, 1, 2, NULL), (5, 'Servir', 20, 1, 1, NULL),
(1, 'Verser la vodka', 40, 2, 1, 3), (2, 'Ajouter le citron', 30, 2, 1, 5), (3, 'Shaker avec glace', 40, 2, 2, 6), (4, 'Servir', 30, 2, 1, NULL),
(1, 'Verser le whisky', 40, 3, 1, 4), (2, 'Presser le citron', 30, 3, 3, 5), (3, 'Ajouter le sirop', 20, 3, 1, 7), (4, 'Shaker', 30, 3, 2, NULL),
(1, 'Écraser la menthe', 30, 4, 3, 1), (2, 'Ajouter le sirop', 25, 4, 1, 7), (3, 'Verser sur glace', 25, 4, 1, 6), (4, 'Shaker', 20, 4, 2, NULL),
(1, 'Presser le citron', 35, 5, 3, 5), (2, 'Ajouter le sirop', 30, 5, 1, 7), (3, 'Glace pilée', 25, 5, 1, 6), (4, 'Shaker', 40, 5, 2, NULL),
(1, 'Verser le rhum', 35, 6, 1, 2), (2, 'Ajouter les glaçons', 25, 6, 1, 6), (3, 'Shaker', 30, 6, 2, NULL), (4, 'Garnir menthe', 20, 6, 1, 1);

INSERT INTO shop_items (name, description, emoji, thumb_bg, price, category, id_ingredient, id_tool, id_cocktail) VALUES 
('Sirop de rose', 'Ingrédient rare', '🌹', '#1a120d', 80, 'ingredients', 8, NULL, NULL),
('Myrtilles fraîches', 'Ingrédient commun', '🫐', '#0d1a12', 50, 'ingredients', 9, NULL, NULL),
('Fleur de sureau', 'Ingrédient exotique', '🌺', '#1a0d1e', 150, 'ingredients', 10, NULL, NULL),
('Citron yuzu', 'Ingrédient rare', '🍋', '#1a1508', 200, 'ingredients', 11, NULL, NULL),
('Recette Margarita', 'Débloque Margarita', '🍸', '#0d111a', 200, 'recipes', NULL, NULL, 9),
('Shaker doré', 'Ustensile premium', '✨', '#2d2008', 350, 'utensils', NULL, 4, NULL);

INSERT INTO badges (label, icon) VALUES 
('Première recette', 'star'), 
('5 jours', 'whatshot'), 
('10 cocktails', 'lock'), 
('Rang Top 10', 'lock');
