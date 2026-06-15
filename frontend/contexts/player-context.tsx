import React, { createContext, useCallback, useContext, useMemo, useState, useEffect } from 'react';
import { Alert, Platform } from 'react-native';

import {
  ACTIVITIES,
  BASE_INGREDIENTS,
  BASE_TOOLS,
  COCKTAILS,
  IngredientId,
  SHOP_INGREDIENT_DEFS,
  SHOP_ITEMS,
  SHOP_TOOL_DEFS,
  ToolId,
  toolMatchesStep,
  type ActivityItem,
  type Cocktail,
  type GameIngredient,
  type GameTool,
  type ShopItem,
} from '@/constants/mock-data';

interface PlayerState {
  name: string;
  initials: string;
  rank: string;
  rankTitle: string;
  coins: number;
  level: number;
  xp: number;
  xpMax: number;
  mixodexUnlocked: number;
  mixodexTotal: number;
  streak: number;
  globalRank: string;
  cocktailsCompleted: number;
}

interface GameSession {
  cocktailId: string;
  currentStepIndex: number;
  sessionPoints: number;
  completedSteps: number[];
}

export interface DbUser {
  id: number;
  username: string;
  email: string;
  role: string;
  biography?: string;
  userImage?: string;
}

interface PlayerContextValue {
  player: PlayerState;
  shopItems: ShopItem[];
  activities: ActivityItem[];
  gameSession: GameSession | null;
  dailyCocktail: Cocktail;
  unlockedCocktails: Cocktail[];
  cocktails: Cocktail[];
  availableTools: GameTool[];
  availableIngredients: GameIngredient[];
  startGame: (cocktailId: string) => void;
  resetGame: () => void;
  selectTool: (tool: ToolId) => void;
  selectIngredient: (ingredient: IngredientId) => void;
  performAction: () => boolean;
  selectedTool: ToolId;
  selectedIngredient: IngredientId | null;
  buyItem: (itemId: string) => boolean;
  user: DbUser | null;
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

const INITIAL_PLAYER: PlayerState = {
  name: 'Macron Explosion',
  initials: 'JD',
  rank: '#42',
  rankTitle: 'Maître Mixologue',
  coins: 1240,
  level: 7,
  xp: 6200,
  xpMax: 10000,
  mixodexUnlocked: 12,
  mixodexTotal: 48,
  streak: 5,
  globalRank: '#42',
  cocktailsCompleted: 12,
};

function showAlert(title: string, message: string) {
  if (Platform.OS === 'web') {
    alert(`${title}\n${message}`);
  } else {
    Alert.alert(title, message);
  }
}

function buildAvailableIngredients(shopItems: ShopItem[]): GameIngredient[] {
  const shopIngredients = shopItems
    .filter((item) => item.category === 'ingredients' && item.owned && item.gameIngredientId)
    .map((item) => {
      const def = SHOP_INGREDIENT_DEFS[item.id];
      if (!def) return null;
      return { ...def, fromShop: true };
    })
    .filter((item): item is GameIngredient => item !== null);

  return [...BASE_INGREDIENTS, ...shopIngredients];
}

function buildAvailableTools(shopItems: ShopItem[]): GameTool[] {
  const shopTools = shopItems
    .filter((item) => item.category === 'utensils' && item.owned && item.gameToolId)
    .map((item) => {
      const def = SHOP_TOOL_DEFS[item.gameToolId!];
      if (!def) return null;
      return { ...def, fromShop: true };
    })
    .filter((item): item is GameTool => item !== null);

  return [...BASE_TOOLS, ...shopTools];
}

function applyCocktailUnlocks(shopItems: ShopItem[]): Cocktail[] {
  const unlockedIds = new Set(
    shopItems
      .filter((item) => item.category === 'recipes' && item.owned && item.unlocksCocktailId)
      .map((item) => item.unlocksCocktailId!),
  );

  return COCKTAILS.map((cocktail) =>
    unlockedIds.has(cocktail.id) ? { ...cocktail, locked: false, lockReason: undefined } : cocktail,
  );
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [player, setPlayer] = useState<PlayerState>(INITIAL_PLAYER);
  const [shopItems, setShopItems] = useState(SHOP_ITEMS);
  const [activities, setActivities] = useState(ACTIVITIES);
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [selectedTool, setSelectedTool] = useState<ToolId>('glass');
  const [selectedIngredient, setSelectedIngredient] = useState<IngredientId | null>(null);

  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<DbUser | null>(null);

  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8090/api/v1/auth';
  const BASE_API_URL = API_URL.replace('/api/v1/auth', '');

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    if (Platform.OS === 'web') {
      localStorage.removeItem('jwt_token');
    }
    setPlayer(INITIAL_PLAYER);
  }, []);

  const fetchUserProfile = useCallback(async (jwtToken: string) => {
    try {
      const response = await fetch(`${BASE_API_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setPlayer((prev) => ({
          ...prev,
          name: data.username,
          initials: data.username ? data.username.slice(0, 2).toUpperCase() : 'JD',
        }));
      } else {
        console.error('Failed to fetch user profile:', response.status);
        if (response.status === 403 || response.status === 401) {
          logout();
        }
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  }, [logout]);

  const login = useCallback(async (jwtToken: string) => {
    setToken(jwtToken);
    if (Platform.OS === 'web') {
      localStorage.setItem('jwt_token', jwtToken);
    }
    await fetchUserProfile(jwtToken);
  }, [fetchUserProfile]);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const storedToken = localStorage.getItem('jwt_token');
      if (storedToken) {
        login(storedToken);
      }
    }
  }, [login]);

  const cocktails = useMemo(() => applyCocktailUnlocks(shopItems), [shopItems]);
  const dailyCocktail = cocktails.find((c) => c.id === 'mojito-passion') ?? cocktails[0];
  const unlockedCocktails = cocktails.filter((c) => !c.locked);
  const availableIngredients = useMemo(() => buildAvailableIngredients(shopItems), [shopItems]);
  const availableTools = useMemo(() => buildAvailableTools(shopItems), [shopItems]);

  const startGame = useCallback(
    (cocktailId: string) => {
      const cocktail = cocktails.find((c) => c.id === cocktailId);
      if (!cocktail || cocktail.locked) return;

      setGameSession({
        cocktailId,
        currentStepIndex: 0,
        sessionPoints: 0,
        completedSteps: [],
      });
      // Pas de présélection automatique — le joueur choisit lui-même
      setSelectedTool('glass');
      setSelectedIngredient(null);
    },
    [cocktails],
  );

  const resetGame = useCallback(() => {
    setGameSession(null);
  }, []);

  const completeGame = useCallback((cocktail: Cocktail, totalPoints: number) => {
    setPlayer((prev) => ({
      ...prev,
      coins: prev.coins + totalPoints,
      xp: Math.min(prev.xp + totalPoints, prev.xpMax),
    }));
    setActivities((prev) => [
      {
        id: Date.now().toString(),
        label: `${cocktail.name} complété`,
        points: totalPoints,
        type: 'success',
      },
      ...prev.slice(0, 4),
    ]);
    showAlert('Bravo ! 🍹', `${cocktail.name} terminé ! +${totalPoints} pts`);
    setGameSession(null);
  }, []);

  const performAction = useCallback(() => {
    if (!gameSession) return false;

    const cocktail = cocktails.find((c) => c.id === gameSession.cocktailId);
    if (!cocktail) return false;

    const step = cocktail.recipe[gameSession.currentStepIndex];
    if (!step) return false;

    const toolOk = toolMatchesStep(selectedTool, step.tool, availableTools);
    const ingredientOk = !step.ingredient || step.ingredient === selectedIngredient;

    if (!toolOk || !ingredientOk) {
      const hint = !toolOk ? 'le bon outil' : "le bon ingrédient";
      showAlert('Oups !', `Sélectionne ${hint} pour cette étape.`);
      return false;
    }

    let stepPoints = step.points;
    if (selectedTool === 'golden-shaker' && step.tool === 'shaker') {
      stepPoints = Math.round(stepPoints * 1.1);
    }
    if (selectedIngredient === 'rose-syrup') {
      stepPoints = Math.round(stepPoints * 1.15);
    }

    const newPoints = gameSession.sessionPoints + stepPoints;
    const newCompleted = [...gameSession.completedSteps, step.id];
    const nextIndex = gameSession.currentStepIndex + 1;

    if (nextIndex >= cocktail.recipe.length) {
      completeGame(cocktail, newPoints);
      return true;
    }

    setGameSession({
      ...gameSession,
      currentStepIndex: nextIndex,
      sessionPoints: newPoints,
      completedSteps: newCompleted,
    });

    // Pas de présélection automatique — le joueur choisit lui-même l'outil et l'ingrédient suivants
    return true;
  }, [
    availableIngredients,
    availableTools,
    cocktails,
    completeGame,
    gameSession,
    selectedIngredient,
    selectedTool,
  ]);

  const buyItem = useCallback(
    (itemId: string) => {
      const item = shopItems.find((i) => i.id === itemId);
      if (!item || item.owned) return false;

      if (player.coins < item.price) {
        showAlert('Pièces insuffisantes', `Il te faut ${item.price} 🪙 pour acheter ${item.name}.`);
        return false;
      }

      setPlayer((prev) => ({ ...prev, coins: prev.coins - item.price }));
      setShopItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, owned: true } : i)));
      setActivities((prev) => [
        {
          id: Date.now().toString(),
          label: `Acheté : ${item.name}`,
          points: -item.price,
          type: 'purchase',
        },
        ...prev.slice(0, 4),
      ]);

      let message = `${item.name} a été ajouté à ton inventaire.`;
      if (item.category === 'ingredients') message += ' Retrouve-le dans l\'écran de jeu.';
      if (item.category === 'utensils') message += ' Retrouve-le dans les outils de jeu.';
      if (item.category === 'recipes') message += ' Le cocktail est débloqué dans le Mixodex.';

      showAlert('Achat réussi !', message);
      return true;
    },
    [player.coins, shopItems],
  );

  const value = useMemo<PlayerContextValue>(
    () => ({
      player,
      shopItems,
      activities,
      gameSession,
      dailyCocktail,
      unlockedCocktails,
      cocktails,
      availableTools,
      availableIngredients,
      startGame,
      resetGame,
      selectTool: setSelectedTool,
      selectIngredient: setSelectedIngredient,
      performAction,
      selectedTool,
      selectedIngredient,
      buyItem,
      user,
      token,
      login,
      logout,
    }),
    [
      player,
      shopItems,
      activities,
      gameSession,
      dailyCocktail,
      unlockedCocktails,
      cocktails,
      availableTools,
      availableIngredients,
      startGame,
      resetGame,
      performAction,
      selectedTool,
      selectedIngredient,
      buyItem,
      user,
      token,
      login,
      logout,
    ],
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}