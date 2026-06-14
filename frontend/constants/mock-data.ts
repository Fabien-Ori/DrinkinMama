export type ToolId = 'glass' | 'shaker' | 'mortar' | 'golden-shaker';
export type IngredientId =
  | 'mint'
  | 'rum'
  | 'lemon'
  | 'ice'
  | 'syrup'
  | 'rose-syrup'
  | 'blueberries'
  | 'elderflower'
  | 'yuzu';

export interface RecipeStep {
  id: number;
  label: string;
  points: number;
  tool?: ToolId;
  ingredient?: IngredientId;
}

export interface Cocktail {
  id: string;
  name: string;
  emoji: string;
  thumbClass: 'c1' | 'c2' | 'c3' | 'c4';
  points: number;
  level: number;
  stars: number;
  locked: boolean;
  lockReason?: string;
  recipe: RecipeStep[];
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  emoji: string;
  thumbBg: string;
  price: number;
  category: 'ingredients' | 'recipes' | 'utensils';
  owned?: boolean;
  gameIngredientId?: IngredientId;
  gameToolId?: ToolId;
  unlocksCocktailId?: string;
}

export interface GameIngredient {
  id: IngredientId;
  label: string;
  icon: string;
  emoji?: string;
  fromShop?: boolean;
}

export interface GameTool {
  id: ToolId;
  label: string;
  icon: string;
  fromShop?: boolean;
  satisfiesTool?: ToolId;
}

export interface Badge {
  id: string;
  label: string;
  icon: string;
  earned: boolean;
}

export interface ActivityItem {
  id: string;
  label: string;
  points: number;
  type: 'success' | 'purchase';
}

export interface LeaderboardPlayer {
  rank: number;
  initials: string;
  name: string;
  score: number;
  isMe?: boolean;
  avatarBg?: string;
  avatarColor?: string;
}

export const BASE_TOOLS: GameTool[] = [
  { id: 'glass', label: 'Verre', icon: 'local-bar' },
  { id: 'shaker', label: 'Shaker', icon: 'liquor' },
  { id: 'mortar', label: 'Mortier', icon: 'construction' },
];

export const BASE_INGREDIENTS: GameIngredient[] = [
  { id: 'mint', label: 'Menthe', icon: 'eco' },
  { id: 'rum', label: 'Rhum', icon: 'water-drop' },
  { id: 'lemon', label: 'Citron', icon: 'brightness-5' },
  { id: 'ice', label: 'Glaçons', icon: 'ac-unit' },
  { id: 'syrup', label: 'Sirop', icon: 'spa' },
];

export const SHOP_INGREDIENT_DEFS: Record<string, Omit<GameIngredient, 'fromShop'>> = {
  'rose-syrup': { id: 'rose-syrup', label: 'Sirop rose', icon: 'spa', emoji: '🌹' },
  blueberries: { id: 'blueberries', label: 'Myrtilles', icon: 'circle', emoji: '🫐' },
  elderflower: { id: 'elderflower', label: 'Sureau', icon: 'local-florist', emoji: '🌺' },
  yuzu: { id: 'yuzu', label: 'Yuzu', icon: 'brightness-5', emoji: '🍋' },
};

export const SHOP_TOOL_DEFS: Record<string, GameTool> = {
  'golden-shaker': {
    id: 'golden-shaker',
    label: 'Shaker doré',
    icon: 'liquor',
    satisfiesTool: 'shaker',
  },
};

export function toolMatchesStep(selectedTool: ToolId, requiredTool?: ToolId, availableTools?: GameTool[]): boolean {
  if (!requiredTool) return true;
  if (selectedTool === requiredTool) return true;
  const tool = availableTools?.find((t) => t.id === selectedTool);
  return tool?.satisfiesTool === requiredTool;
}

export function getActionHint(tool: ToolId): string {
  switch (tool) {
    case 'mortar':
      return 'Appuyer pour écraser';
    case 'shaker':
    case 'golden-shaker':
      return 'Appuyer pour shaker';
    default:
      return 'Appuyer pour verser';
  }
}

export const COCKTAILS: Cocktail[] = [
  {
    id: 'mojito-passion',
    name: 'Mojito Passion',
    emoji: '🍹',
    thumbClass: 'c1',
    points: 160,
    level: 2,
    stars: 3,
    locked: false,
    recipe: [
      { id: 1, label: 'Écraser la menthe', points: 40, tool: 'mortar', ingredient: 'mint' },
      { id: 2, label: 'Verser le rhum', points: 40, tool: 'glass', ingredient: 'rum' },
      { id: 3, label: 'Ajouter le citron', points: 30, tool: 'glass', ingredient: 'lemon' },
      { id: 4, label: 'Shaker vigoureusement', points: 30, tool: 'shaker' },
      { id: 5, label: 'Servir & décorer', points: 20, tool: 'glass' },
    ],
  },
  {
    id: 'cosmopolitan',
    name: 'Cosmopolitan',
    emoji: '🍸',
    thumbClass: 'c2',
    points: 140,
    level: 3,
    stars: 2,
    locked: false,
    recipe: [
      { id: 1, label: 'Verser la vodka', points: 40, tool: 'glass', ingredient: 'rum' },
      { id: 2, label: 'Ajouter le citron', points: 30, tool: 'glass', ingredient: 'lemon' },
      { id: 3, label: 'Shaker avec glace', points: 40, tool: 'shaker', ingredient: 'ice' },
      { id: 4, label: 'Servir en coupe', points: 30, tool: 'glass' },
    ],
  },
  {
    id: 'whisky-sour',
    name: 'Whisky Sour',
    emoji: '🥃',
    thumbClass: 'c3',
    points: 120,
    level: 4,
    stars: 1,
    locked: false,
    recipe: [
      { id: 1, label: 'Verser le whisky', points: 40, tool: 'glass', ingredient: 'rum' },
      { id: 2, label: 'Presser le citron', points: 30, tool: 'mortar', ingredient: 'lemon' },
      { id: 3, label: 'Ajouter le sirop', points: 20, tool: 'glass', ingredient: 'syrup' },
      { id: 4, label: 'Shaker & filtrer', points: 30, tool: 'shaker' },
    ],
  },
  {
    id: 'mint-syrup',
    name: 'Menthe Fraîche',
    emoji: '🌿',
    thumbClass: 'c1',
    points: 100,
    level: 1,
    stars: 2,
    locked: false,
    recipe: [
      { id: 1, label: 'Écraser la menthe', points: 30, tool: 'mortar', ingredient: 'mint' },
      { id: 2, label: 'Ajouter le sirop', points: 25, tool: 'glass', ingredient: 'syrup' },
      { id: 3, label: 'Verser sur glace', points: 25, tool: 'glass', ingredient: 'ice' },
      { id: 4, label: 'Shaker & servir', points: 20, tool: 'shaker' },
    ],
  },
  {
    id: 'citron-gingembre',
    name: 'Citron Gingembre',
    emoji: '🍋',
    thumbClass: 'c4',
    points: 130,
    level: 2,
    stars: 1,
    locked: false,
    recipe: [
      { id: 1, label: 'Presser le citron', points: 35, tool: 'mortar', ingredient: 'lemon' },
      { id: 2, label: 'Ajouter le sirop', points: 30, tool: 'glass', ingredient: 'syrup' },
      { id: 3, label: 'Glace pilée', points: 25, tool: 'glass', ingredient: 'ice' },
      { id: 4, label: 'Shaker & garnir', points: 40, tool: 'shaker' },
    ],
  },
  {
    id: 'rhum-glace',
    name: 'Rhum Piscine',
    emoji: '🏖️',
    thumbClass: 'c2',
    points: 110,
    level: 1,
    stars: 3,
    locked: false,
    recipe: [
      { id: 1, label: 'Verser le rhum', points: 35, tool: 'glass', ingredient: 'rum' },
      { id: 2, label: 'Ajouter les glaçons', points: 25, tool: 'glass', ingredient: 'ice' },
      { id: 3, label: 'Shaker légèrement', points: 30, tool: 'shaker' },
      { id: 4, label: 'Garnir de menthe', points: 20, tool: 'glass', ingredient: 'mint' },
    ],
  },
  {
    id: 'negroni',
    name: 'Negroni',
    emoji: '🍹',
    thumbClass: 'c4',
    points: 180,
    level: 5,
    stars: 0,
    locked: true,
    lockReason: 'À débloquer — Niv. 5',
    recipe: [],
  },
  {
    id: 'daiquiri-rose',
    name: 'Daiquiri Rose',
    emoji: '🌹',
    thumbClass: 'c1',
    points: 150,
    level: 6,
    stars: 0,
    locked: true,
    lockReason: 'À débloquer — Niv. 6',
    recipe: [],
  },
  {
    id: 'margarita',
    name: 'Margarita',
    emoji: '🍸',
    thumbClass: 'c2',
    points: 200,
    level: 3,
    stars: 0,
    locked: true,
    lockReason: 'Boutique — 200 🪙',
    recipe: [],
  },
];

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'rose-syrup',
    name: 'Sirop de rose',
    description: 'Ingrédient rare · +15% de points',
    emoji: '🌹',
    thumbBg: '#1a120d',
    price: 80,
    category: 'ingredients',
    gameIngredientId: 'rose-syrup',
  },
  {
    id: 'blueberries',
    name: 'Myrtilles fraîches',
    description: 'Ingrédient commun',
    emoji: '🫐',
    thumbBg: '#0d1a12',
    price: 50,
    category: 'ingredients',
    owned: true,
    gameIngredientId: 'blueberries',
  },
  {
    id: 'elderflower',
    name: 'Fleur de sureau',
    description: 'Ingrédient exotique · Unique',
    emoji: '🌺',
    thumbBg: '#1a0d1e',
    price: 150,
    category: 'ingredients',
    gameIngredientId: 'elderflower',
  },
  {
    id: 'yuzu',
    name: 'Citron yuzu',
    description: 'Ingrédient rare · Asiatique',
    emoji: '🍋',
    thumbBg: '#1a1508',
    price: 200,
    category: 'ingredients',
    gameIngredientId: 'yuzu',
  },
  {
    id: 'margarita-recipe',
    name: 'Recette Margarita',
    description: 'Débloque le cocktail Margarita',
    emoji: '🍸',
    thumbBg: '#0d111a',
    price: 200,
    category: 'recipes',
    unlocksCocktailId: 'margarita',
  },
  {
    id: 'golden-shaker',
    name: 'Shaker doré',
    description: 'Ustensile premium · +10% de points',
    emoji: '✨',
    thumbBg: '#2d2008',
    price: 350,
    category: 'utensils',
    gameToolId: 'golden-shaker',
  },
];

export const BADGES: Badge[] = [
  { id: 'first', label: 'Première recette', icon: 'star', earned: true },
  { id: 'streak', label: '5 jours de suite', icon: 'whatshot', earned: true },
  { id: 'ten', label: '10 cocktails', icon: 'lock', earned: false },
  { id: 'top10', label: 'Rang Top 10', icon: 'lock', earned: false },
];

export const ACTIVITIES: ActivityItem[] = [
  { id: '1', label: 'Mojito Passion complété', points: 160, type: 'success' },
  { id: '2', label: 'Cosmopolitan réalisé', points: 140, type: 'success' },
  { id: '3', label: 'Acheté : Sirop de rose', points: -80, type: 'purchase' },
];

export const PODIUM: LeaderboardPlayer[] = [
  { rank: 2, initials: 'AL', name: 'Alexia', score: 8450 },
  { rank: 1, initials: 'MX', name: 'MaxBar', score: 12300 },
  { rank: 3, initials: 'SR', name: 'Sara_R', score: 7800 },
];

export const LEADERBOARD_LIST: LeaderboardPlayer[] = [
  { rank: 4, initials: 'KV', name: 'KiviBar', score: 6900, avatarBg: '#2a1808', avatarColor: '#cd7f32' },
  { rank: 5, initials: 'TN', name: 'ToniNegroni', score: 5440, avatarBg: '#1a0d1e', avatarColor: '#7F77DD' },
  {
    rank: 42,
    initials: 'JD',
    name: 'Macron Explosion',
    score: 1240,
    isMe: true,
    avatarBg: '#2a2847',
    avatarColor: '#7F77DD',
  },
];

export const THUMB_COLORS: Record<Cocktail['thumbClass'], string> = {
  c1: '#1a0d1e',
  c2: '#0d1a12',
  c3: '#1a120d',
  c4: '#0d111a',
};