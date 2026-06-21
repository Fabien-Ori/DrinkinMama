import React, { createContext, useCallback, useContext, useMemo, useState, useEffect } from 'react';
import { Alert, Platform } from 'react-native';

import {
  ACTIVITIES,
  BASE_INGREDIENTS,
  BASE_TOOLS,
  COCKTAILS,
  BADGES,
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
  type Badge,
} from '@/constants/mock-data';

interface PlayerState {
  name: string;
  initials: string;
  rank: string;
  rankTitle: string;
  coins: number;
  score: number;
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
  badges: Badge[];
  loadingAuth: boolean;
  setPlayerRank: (rank: string) => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

const INITIAL_PLAYER: PlayerState = {
  name: 'Macron Explosion',
  initials: 'JD',
  rank: '#42',
  rankTitle: 'Maître Mixologue',
  coins: 1240,
  score: 1240,
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

function buildAvailableIngredients(shopItems: ShopItem[], baseIngredients: GameIngredient[]): GameIngredient[] {
  const shopIngredients = shopItems
    .filter((item) => item.category === 'ingredients' && item.owned && item.gameIngredientId)
    .map((item) => {
      const def = SHOP_INGREDIENT_DEFS[item.id];
      if (!def) return null;
      return { ...def, fromShop: true } as GameIngredient;
    })
    .filter((item): item is GameIngredient => item !== null);

  const base = baseIngredients.filter(i => !i.fromShop);
  return [...base, ...shopIngredients];
}

function buildAvailableTools(shopItems: ShopItem[], baseTools: GameTool[]): GameTool[] {
  const shopTools = shopItems
    .filter((item) => item.category === 'utensils' && item.owned && item.gameToolId)
    .map((item) => {
      const def = SHOP_TOOL_DEFS[item.gameToolId!];
      if (!def) return null;
      return { ...def, fromShop: true } as GameTool;
    })
    .filter((item): item is GameTool => item !== null);

  const base = baseTools.filter(t => !t.fromShop);
  return [...base, ...shopTools];
}

function applyCocktailUnlocks(shopItems: ShopItem[], cocktailsSource: Cocktail[]): Cocktail[] {
  const unlockedIds = new Set(
    shopItems
      .filter((item) => item.category === 'recipes' && item.owned && item.unlocksCocktailId)
      .map((item) => item.unlocksCocktailId!),
  );

  return cocktailsSource.map((cocktail) =>
    unlockedIds.has(cocktail.id) ? { ...cocktail, locked: false, lockReason: undefined } : cocktail,
  );
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [player, setPlayer] = useState<PlayerState>(INITIAL_PLAYER);
  const [shopItems, setShopItems] = useState<ShopItem[]>(SHOP_ITEMS);
  const [badges, setBadges] = useState<Badge[]>(BADGES);
  const [cocktailsList, setCocktailsList] = useState<Cocktail[]>(COCKTAILS);
  const [ingredientsList, setIngredientsList] = useState<GameIngredient[]>(BASE_INGREDIENTS);
  const [toolsList, setToolsList] = useState<GameTool[]>(BASE_TOOLS);

  const [activities, setActivities] = useState(ACTIVITIES);
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [selectedTool, setSelectedTool] = useState<ToolId>('glass');
  const [selectedIngredient, setSelectedIngredient] = useState<IngredientId | null>(null);

  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<DbUser | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8090/api/v1/auth';
  const BASE_API_URL = API_URL.replace('/api/v1/auth', '');

  const fetchGameData = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/api/v1/game/data`);
      if (response.ok) {
        const data = await response.json();
        if (data.cocktails && data.cocktails.length > 0) {
          setCocktailsList(data.cocktails);
        }
        if (data.shopItems && data.shopItems.length > 0) {
          setShopItems((prev) => {
            return data.shopItems.map((dbItem: ShopItem) => {
              const prevItem = prev.find((i) => i.id === dbItem.id);
              return { ...dbItem, owned: prevItem ? prevItem.owned : dbItem.owned };
            });
          });
        }
        if (data.badges && data.badges.length > 0) {
          setBadges((prev) => {
            return data.badges.map((dbBadge: Badge) => {
              const prevBadge = prev.find((b) => b.id === dbBadge.id);
              return { ...dbBadge, earned: prevBadge ? prevBadge.earned : dbBadge.earned };
            });
          });
        }
        if (data.ingredients && data.ingredients.length > 0) {
          setIngredientsList(data.ingredients);
        }
        if (data.tools && data.tools.length > 0) {
          setToolsList(data.tools);
        }
      }
    } catch (err) {
      console.error('Failed to fetch game metadata, using local mock data:', err);
    }
  }, [BASE_API_URL]);

  useEffect(() => {
    fetchGameData();
  }, [fetchGameData]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    if (Platform.OS === 'web') {
      localStorage.removeItem('jwt_token');
    }
    setPlayer(INITIAL_PLAYER);
    setActivities(ACTIVITIES);
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
        if (Platform.OS === 'web') {
          const hasDbStats = data.coins !== undefined && data.coins !== null;
          const savedPlayerStr = localStorage.getItem(`player_${data.email}`);
          
          let resolvedPlayer: PlayerState;
          if (hasDbStats && (data.coins > 0 || data.level > 1 || data.xp > 0 || (data.score !== undefined && data.score > 0))) {
            resolvedPlayer = {
              name: data.username,
              initials: data.username ? data.username.slice(0, 2).toUpperCase() : 'JD',
              rank: '#Unranked',
              rankTitle: data.rankTitle || 'Apprenti Mixologue',
              coins: data.coins,
              score: data.score !== undefined && data.score !== null ? data.score : data.coins,
              level: data.level,
              xp: data.xp,
              xpMax: data.xpMax || 1000,
              mixodexUnlocked: 0,
              mixodexTotal: 48,
              streak: data.streak || 0,
              globalRank: '#Unranked',
              cocktailsCompleted: data.cocktailsCompleted || 0,
            };
            if (savedPlayerStr) {
              const localPlayer = JSON.parse(savedPlayerStr);
              resolvedPlayer.mixodexUnlocked = localPlayer.mixodexUnlocked;
            }
          } else if (savedPlayerStr) {
            resolvedPlayer = JSON.parse(savedPlayerStr);
            resolvedPlayer.name = data.username;
            resolvedPlayer.initials = data.username ? data.username.slice(0, 2).toUpperCase() : 'JD';
            if (resolvedPlayer.score === undefined || resolvedPlayer.score === null) {
              resolvedPlayer.score = resolvedPlayer.coins;
            }
          } else {
            resolvedPlayer = {
              name: data.username,
              initials: data.username ? data.username.slice(0, 2).toUpperCase() : 'JD',
              rank: '#Unranked',
              rankTitle: 'Apprenti Mixologue',
              coins: 0,
              score: 0,
              level: 1,
              xp: 0,
              xpMax: 1000,
              mixodexUnlocked: 0,
              mixodexTotal: 48,
              streak: 0,
              globalRank: '#Unranked',
              cocktailsCompleted: 0,
            };
          }
          setPlayer(resolvedPlayer);
          localStorage.setItem(`player_${data.email}`, JSON.stringify(resolvedPlayer));

          // Compute global rank from the users list
          fetch(`${BASE_API_URL}/users`, {
            headers: { 'Authorization': `Bearer ${jwtToken}`, 'Content-Type': 'application/json' },
          }).then(async (rankRes) => {
            if (rankRes.ok) {
              const rankData = await rankRes.json();
              const allUsers = rankData._embedded?.userResponses || [];
              const sorted = allUsers
                .map((u: any) => ({
                  id: u.id,
                  email: u.email,
                  score: (u.score && u.score > 0) ? u.score : (u.coins ?? 0),
                }))
                .sort((a: any, b: any) => b.score - a.score);
              const myRankIdx = sorted.findIndex((u: any) => u.email === data.email || u.id === data.id);
              if (myRankIdx !== -1) {
                setPlayer((prev) => ({ ...prev, globalRank: `#${myRankIdx + 1}` }));
              }
            }
          }).catch(() => {});

          if (!hasDbStats || (data.coins === 0 && resolvedPlayer.coins > 0) || (data.score === undefined || data.score === null || (data.score === 0 && resolvedPlayer.score > 0))) {
            fetch(`${BASE_API_URL}/users/me/stats`, {
              method: 'PATCH',
              headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                coins: resolvedPlayer.coins,
                score: resolvedPlayer.score,
                level: resolvedPlayer.level,
                xp: resolvedPlayer.xp,
                xpMax: resolvedPlayer.xpMax,
                streak: resolvedPlayer.streak,
                cocktailsCompleted: resolvedPlayer.cocktailsCompleted,
                rankTitle: resolvedPlayer.rankTitle,
              }),
            }).catch(e => console.error("Initial stats sync failed", e));
          }

          const savedActivitiesStr = localStorage.getItem(`activities_${data.email}`);
          if (savedActivitiesStr) {
            setActivities(JSON.parse(savedActivitiesStr));
          } else {
            setActivities([]);
            localStorage.setItem(`activities_${data.email}`, JSON.stringify([]));
          }

          // Restore purchased shop items from localStorage
          const savedPurchasesStr = localStorage.getItem(`purchases_${data.email}`);
          if (savedPurchasesStr) {
            const ownedIds: string[] = JSON.parse(savedPurchasesStr);
            setShopItems((prev) => prev.map((i) => ({ ...i, owned: ownedIds.includes(i.id) })));
          }
        }
      } else {
        console.error('Failed to fetch user profile:', response.status);
        if (response.status === 403 || response.status === 401) {
          logout();
        }
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    } finally {
      setLoadingAuth(false);
    }
  }, [logout]);

  const login = useCallback(async (jwtToken: string) => {
    setToken(jwtToken);
    if (Platform.OS === 'web') {
      localStorage.setItem('jwt_token', jwtToken);
    }
    await fetchUserProfile(jwtToken);
  }, [fetchUserProfile]);

  const syncPlayerStats = useCallback(async (updatedPlayer: PlayerState) => {
    if (!token || !user) return;
    try {
      await fetch(`${BASE_API_URL}/users/me/stats`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coins: updatedPlayer.coins,
          score: updatedPlayer.score,
          level: updatedPlayer.level,
          xp: updatedPlayer.xp,
          xpMax: updatedPlayer.xpMax,
          streak: updatedPlayer.streak,
          cocktailsCompleted: updatedPlayer.cocktailsCompleted,
          rankTitle: updatedPlayer.rankTitle,
        }),
      });
    } catch (err) {
      console.error('Failed to sync player stats with DB:', err);
    }
  }, [token, user]);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const storedToken = localStorage.getItem('jwt_token');
      if (storedToken) {
        login(storedToken);
      } else {
        setLoadingAuth(false);
      }
    } else {
      setLoadingAuth(false);
    }
  }, [login]);

  useEffect(() => {
    if (user && Platform.OS === 'web') {
      localStorage.setItem(`activities_${user.email}`, JSON.stringify(activities));
    }
  }, [activities, user]);

  const cocktails = useMemo(() => applyCocktailUnlocks(shopItems, cocktailsList), [shopItems, cocktailsList]);
  const dailyCocktail = cocktails.find((c) => c.id === 'mojito-passion') ?? cocktails[0];
  const unlockedCocktails = cocktails.filter((c) => !c.locked);
  const availableIngredients = useMemo(() => buildAvailableIngredients(shopItems, ingredientsList), [shopItems, ingredientsList]);
  const availableTools = useMemo(() => buildAvailableTools(shopItems, toolsList), [shopItems, toolsList]);

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
    setPlayer((prev) => {
      const updated = {
        ...prev,
        coins: prev.coins + totalPoints,
        score: (prev.score ?? prev.coins) + totalPoints,
        xp: Math.min(prev.xp + totalPoints, prev.xpMax),
        cocktailsCompleted: prev.cocktailsCompleted + 1,
      };
      
      // XP Level Up logic
      if (updated.xp >= updated.xpMax) {
        updated.level += 1;
        updated.xp = updated.xp - updated.xpMax;
        updated.xpMax = updated.level * 1000;
        updated.rankTitle = updated.level >= 5 ? 'Maître Mixologue' : 'Mixologue';
      }

      if (user && Platform.OS === 'web') {
        localStorage.setItem(`player_${user.email}`, JSON.stringify(updated));
        syncPlayerStats(updated);
      }
      return updated;
    });
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
  }, [user, syncPlayerStats]);

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

      setPlayer((prev) => {
        const updated = { ...prev, coins: prev.coins - item.price };
        if (user && Platform.OS === 'web') {
          localStorage.setItem(`player_${user.email}`, JSON.stringify(updated));
          syncPlayerStats(updated);
        }
        return updated;
      });

      setShopItems((prev) => {
        const updated = prev.map((i) => (i.id === itemId ? { ...i, owned: true } : i));
        // Persist purchased item IDs in localStorage
        if (user && Platform.OS === 'web') {
          const ownedIds = updated.filter((i) => i.owned).map((i) => i.id);
          localStorage.setItem(`purchases_${user.email}`, JSON.stringify(ownedIds));
        }
        return updated;
      });

      setActivities((prev) => {
        const updated = [
          {
            id: Date.now().toString(),
            label: `Acheté : ${item.name}`,
            points: -item.price,
            type: 'purchase' as const,
          },
          ...prev.slice(0, 4),
        ];
        if (user && Platform.OS === 'web') {
          localStorage.setItem(`activities_${user.email}`, JSON.stringify(updated));
        }
        return updated;
      });

      let message = `${item.name} a été ajouté à ton inventaire.`;
      if (item.category === 'ingredients') message += ' Retrouve-le dans l\'écran de jeu.';
      if (item.category === 'utensils') message += ' Retrouve-le dans les outils de jeu.';
      if (item.category === 'recipes') message += ' Le cocktail est débloqué dans le Mixodex.';

      showAlert('Achat réussi !', message);
      return true;
    },
    [player.coins, shopItems, user],
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
      badges,
      loadingAuth,
      setPlayerRank: (rank: string) => setPlayer((prev) => ({ ...prev, globalRank: rank })),
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
      badges,
      loadingAuth,
    ],
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}