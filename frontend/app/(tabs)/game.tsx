import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActiveToolVisual } from '@/components/dm/tool-visuals';
import { DM } from '@/constants/dm-theme';
import { getActionHint } from '@/constants/mock-data';
import { usePlayer } from '@/contexts/player-context';
import { GlobalHeaderRight } from '@/components/dm/global-header-right';

export default function GameScreen() {
  const router = useRouter();
  const {
    player,
    gameSession,
    dailyCocktail,
    cocktails,
    startGame,
    selectedTool,
    selectedIngredient,
    selectTool,
    selectIngredient,
    performAction,
    availableTools,
    availableIngredients,
    user,
  } = usePlayer();

  // État pour masquer/afficher les panneaux latéraux
  const [toolsVisible, setToolsVisible] = useState(true);
  const [recipeVisible, setRecipeVisible] = useState(true);

  useEffect(() => {
    if (!gameSession) {
      startGame(dailyCocktail.id);
    }
  }, [dailyCocktail.id, gameSession, startGame]);

  const cocktail = cocktails.find((c) => c.id === (gameSession?.cocktailId ?? dailyCocktail.id));
  if (!cocktail || !gameSession) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Chargement de la partie…</Text>
        </View>
      </SafeAreaView>
    );
  }

  const totalSteps = cocktail.recipe.length;
  const currentStep = gameSession.currentStepIndex;
  const progress = totalSteps > 0 ? ((currentStep / totalSteps) * 100).toFixed(0) : '0';
  const selectedIng = availableIngredients.find((i) => i.id === selectedIngredient);
  const fillLevel = Math.min(0.2 + currentStep * 0.12, 0.85);

  // Vérifie si la partie est terminée
  const isComplete = totalSteps > 0 && currentStep >= totalSteps;

  // Actions de fin de partie
  const handleReplay = () => {
    startGame(cocktail.id);
  };

  const handleGoToShop = () => {
    router.push('/shop');
  };

  const handleChooseAnother = () => {
    router.push('/mixodex');
  };

  // ── ÉCRAN DE VICTOIRE ──
  if (isComplete) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.victoryContainer}>
          <View style={styles.victoryCard}>
            <View style={styles.iconCircle}>
              <MaterialIcons name="local-bar" size={40} color={DM.gold} />
            </View>
            
            <Text style={styles.victoryTitle}>Santé ! 🥂</Text>
            <Text style={styles.victorySub}>Recette parfaitement exécutée.</Text>

            <View style={styles.rewardBox}>
              <Text style={styles.rewardLabel}>Gains de la partie</Text>
              <Text style={styles.rewardValue}>+ {gameSession.sessionPoints} 🪙</Text>
              <View style={styles.divider} />
              {user ? (
                <Text style={styles.totalLabel}>Solde actuel : {player?.coins || 0} 🪙</Text>
              ) : (
                <Text style={styles.totalLabel}>Connectez-vous pour conserver vos gains !</Text>
              )}
            </View>

            <View style={styles.actionsContainer}>
              <Pressable style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]} onPress={handleReplay}>
                <MaterialIcons name="replay" size={20} color="#FFFFFF" />
                <Text style={styles.primaryBtnText}>Rejouer ce cocktail</Text>
              </Pressable>

              <Pressable style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressed]} onPress={handleChooseAnother}>
                <MaterialIcons name="menu-book" size={20} color={DM.teal} />
                <Text style={styles.secondaryBtnText}>Choisir une autre recette</Text>
              </Pressable>

              <Pressable style={({ pressed }) => [styles.tertiaryBtn, pressed && styles.pressed]} onPress={handleGoToShop}>
                <MaterialIcons name="shopping-bag" size={20} color={DM.muted} />
                <Text style={styles.tertiaryBtnText}>Aller à la boutique</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ── ÉCRAN DE JEU NORMAL ──
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.recipeTitle}>{cocktail.name}</Text>
          <Text style={styles.stepMeta}>
            Étape {Math.min(currentStep + 1, totalSteps)} / {totalSteps}
          </Text>
        </View>
        <View style={styles.pointsBadge}>
          <MaterialIcons name="monetization-on" size={13} color={DM.gold} />
          <Text style={styles.pointsText}>{gameSession.sessionPoints} pts</Text>
        </View>
        <GlobalHeaderRight />
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Number(progress)}%` as `${number}%` }]} />
        </View>
        <View style={styles.progressLabel}>
          <Text style={styles.progressMuted}>Progression</Text>
          <Text style={styles.progressMuted}>{progress}%</Text>
        </View>
      </View>

      <View style={styles.gameBody}>
        {/* ── Panneau OUTILS (gauche) ── */}
        {toolsVisible ? (
          <View style={styles.toolsPanelWrapper}>
            <ScrollView
              style={styles.toolsPanel}
              contentContainerStyle={styles.toolsPanelContent}
              showsVerticalScrollIndicator={false}>
              <Text style={styles.panelLabel}>Outils</Text>
              {availableTools.map((tool) => {
                const active = selectedTool === tool.id;
                return (
                  <Pressable
                    key={tool.id}
                    style={[styles.toolBtn, active && styles.toolBtnActive, tool.fromShop && styles.toolBtnShop]}
                    onPress={() => selectTool(tool.id)}>
                    <MaterialIcons
                      name={tool.icon as 'local-bar'}
                      size={16}
                      color={active ? DM.gold : tool.fromShop ? DM.goldLight : DM.muted}
                    />
                    <Text style={[styles.toolLabel, active && styles.toolLabelActive]}>{tool.label}</Text>
                    {tool.fromShop && <Text style={styles.shopTag}>★</Text>}
                  </Pressable>
                );
              })}
            </ScrollView>
            {/* Bouton pour masquer le panneau outils */}
            <Pressable style={styles.collapseBtn} onPress={() => setToolsVisible(false)}>
              <MaterialIcons name="chevron-left" size={14} color={DM.muted} />
            </Pressable>
          </View>
        ) : (
          /* Tab réduit pour réouvrir le panneau outils */
          <Pressable style={styles.expandTab} onPress={() => setToolsVisible(true)}>
            <MaterialIcons name="chevron-right" size={14} color={DM.gold} />
            <Text style={styles.expandTabText}>Outils</Text>
          </Pressable>
        )}

        {/* ── Zone centrale ── */}
        <View style={styles.gameCenter}>
          <Pressable style={styles.toolDisplay} onPress={performAction}>
            <ActiveToolVisual tool={selectedTool} fillLevel={fillLevel} />
            <View style={styles.tapHint}>
              <MaterialIcons name="touch-app" size={12} color={DM.gold} />
              <Text style={styles.tapHintText}>{getActionHint(selectedTool)}</Text>
            </View>
          </Pressable>
          {selectedIng && (
            <View style={styles.ingredientBadge}>
              {selectedIng.emoji ? (
                <Text style={styles.ingredientEmoji}>{selectedIng.emoji}</Text>
              ) : (
                <MaterialIcons name={selectedIng.icon as 'eco'} size={12} color="#fff" />
              )}
              <Text style={styles.ingredientBadgeText}>{selectedIng.label} sélec.</Text>
            </View>
          )}
        </View>

        {/* ── Panneau RECETTE (droite) ── */}
        {recipeVisible ? (
          <View style={styles.recipePanelWrapper}>
            {/* Bouton pour masquer le panneau recette */}
            <Pressable style={styles.collapseBtn} onPress={() => setRecipeVisible(false)}>
              <MaterialIcons name="chevron-right" size={14} color={DM.muted} />
            </Pressable>
            <View style={styles.recipePanel}>
              <Text style={styles.panelLabel}>Recette</Text>
              {cocktail.recipe.map((step, index) => {
                const done = gameSession.completedSteps.includes(step.id);
                const current = index === currentStep && !done;
                return (
                  <View
                    key={step.id}
                    style={[
                      styles.recipeStep,
                      done && styles.recipeStepDone,
                      current && styles.recipeStepCurrent,
                    ]}>
                    <Text style={styles.stepNum}>Étape {step.id}</Text>
                    <Text style={[styles.stepLabel, done && styles.stepLabelDone, current && styles.stepLabelCurrent]}>
                      {step.label}
                    </Text>
                    <Text style={styles.stepPts}>+{step.points} pts</Text>
                    {done && (
                      <MaterialIcons name="check" size={10} color={DM.success} style={styles.stepCheck} />
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        ) : (
          /* Tab réduit pour réouvrir le panneau recette */
          <Pressable style={[styles.expandTab, styles.expandTabRight]} onPress={() => setRecipeVisible(true)}>
            <Text style={styles.expandTabText}>Recette</Text>
            <MaterialIcons name="chevron-left" size={14} color={DM.gold} />
          </Pressable>
        )}
      </View>

      <View style={styles.shelf}>
        <Text style={styles.shelfLabel}>Ingrédients disponibles</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shelfScroll}>
          {availableIngredients.map((ing) => {
            const selected = selectedIngredient === ing.id;
            return (
              <Pressable
                key={ing.id}
                style={[
                  styles.ingredientChip,
                  selected && styles.ingredientChipSelected,
                  ing.fromShop && styles.ingredientChipShop,
                ]}
                onPress={() => selectIngredient(ing.id)}>
                {ing.emoji ? (
                  <Text style={styles.chipEmoji}>{ing.emoji}</Text>
                ) : (
                  <MaterialIcons
                    name={ing.icon as 'eco'}
                    size={18}
                    color={selected ? DM.tealLight : DM.muted}
                  />
                )}
                <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>{ing.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: DM.bg },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: DM.muted },
  header: {
    backgroundColor: DM.surface,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: DM.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recipeTitle: { fontSize: 14, fontWeight: '500', color: DM.text },
  stepMeta: { fontSize: 10, color: DM.muted },
  pointsBadge: {
    backgroundColor: DM.goldDark,
    borderWidth: 0.5,
    borderColor: DM.gold,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pointsText: { fontSize: 12, color: DM.goldLight },
  progressContainer: { paddingHorizontal: 12, paddingVertical: 6 },
  progressTrack: {
    backgroundColor: DM.surface,
    borderRadius: 4,
    height: 4,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: DM.border,
  },
  progressFill: { backgroundColor: DM.gold, height: '100%', borderRadius: 4 },
  progressLabel: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 3 },
  progressMuted: { fontSize: 9, color: DM.muted },
  gameBody: { flex: 1, flexDirection: 'row', padding: 8, gap: 6 },

  // ── Panneau Outils ──
  toolsPanelWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  toolsPanel: {
    width: 56,
    backgroundColor: DM.surface,
    borderWidth: 0.5,
    borderColor: DM.border,
    borderRadius: 12,
  },
  toolsPanelContent: { padding: 6, gap: 6 },

  // ── Panneau Recette ──
  recipePanelWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  recipePanel: {
    width: 80,
    backgroundColor: DM.surface,
    borderWidth: 0.5,
    borderColor: DM.border,
    borderRadius: 12,
    padding: 8,
    gap: 6,
  },

  // ── Bouton collapse ──
  collapseBtn: {
    width: 16,
    height: 40,
    backgroundColor: DM.card,
    borderWidth: 0.5,
    borderColor: DM.border,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Tab réduit ──
  expandTab: {
    width: 20,
    backgroundColor: DM.surface,
    borderWidth: 0.5,
    borderColor: DM.border,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
  },
  expandTabRight: {},
  expandTabText: {
    fontSize: 8,
    color: DM.gold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    writingDirection: 'ltr',
    transform: [{ rotate: '90deg' }],
    width: 48,
    textAlign: 'center',
  },

  panelLabel: {
    fontSize: 9,
    color: DM.muted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 2,
  },
  toolBtn: {
    backgroundColor: DM.card,
    borderWidth: 0.5,
    borderColor: DM.border,
    borderRadius: 8,
    padding: 5,
    alignItems: 'center',
    position: 'relative',
  },
  toolBtnActive: { borderColor: DM.gold, backgroundColor: DM.goldDark },
  toolBtnShop: { borderColor: 'rgba(230,168,23,0.4)' },
  toolLabel: { fontSize: 8, color: DM.muted, marginTop: 2, textAlign: 'center' },
  toolLabelActive: { color: DM.goldLight },
  shopTag: { position: 'absolute', top: 2, right: 3, fontSize: 7, color: DM.gold },
  gameCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  toolDisplay: { alignItems: 'center' },
  tapHint: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 4 },
  tapHintText: { fontSize: 9, color: DM.gold },
  ingredientBadge: {
    backgroundColor: DM.teal,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 24,
  },
  ingredientBadgeText: { fontSize: 10, color: '#fff' },
  ingredientEmoji: { fontSize: 12 },
  recipeStep: {
    backgroundColor: DM.card,
    borderWidth: 0.5,
    borderColor: DM.border,
    borderRadius: 8,
    padding: 6,
    position: 'relative',
  },
  recipeStepDone: { borderColor: DM.success, backgroundColor: DM.successDark },
  recipeStepCurrent: { borderColor: DM.gold, backgroundColor: DM.goldDark },
  stepNum: { fontSize: 8, color: DM.muted, textTransform: 'uppercase', marginBottom: 2 },
  stepLabel: { fontSize: 9, color: DM.muted, lineHeight: 12 },
  stepLabelDone: { color: DM.success },
  stepLabelCurrent: { color: DM.goldLight },
  stepPts: { fontSize: 8, color: DM.gold, marginTop: 2 },
  stepCheck: { position: 'absolute', top: 4, right: 4 },
  shelf: {
    backgroundColor: DM.surface,
    borderTopWidth: 0.5,
    borderTopColor: DM.border,
    padding: 8,
  },
  shelfLabel: {
    fontSize: 9,
    color: DM.muted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 6,
  },
  shelfScroll: { gap: 6, paddingBottom: 2 },
  ingredientChip: {
    backgroundColor: DM.card,
    borderWidth: 0.5,
    borderColor: DM.border,
    borderRadius: 8,
    padding: 5,
    alignItems: 'center',
    minWidth: 44,
  },
  ingredientChipSelected: { borderColor: DM.tealLight, backgroundColor: DM.tealDark },
  ingredientChipShop: { borderColor: 'rgba(230,168,23,0.35)' },
  chipEmoji: { fontSize: 18 },
  chipLabel: { fontSize: 8, color: DM.muted, marginTop: 2 },
  chipLabelSelected: { color: DM.tealLight },

  // ── Styles Écran de Victoire ──
  victoryContainer: {
    flex: 1,
    backgroundColor: DM.bg,
    justifyContent: 'center',
    padding: 20,
  },
  victoryCard: {
    backgroundColor: DM.surface,
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: DM.goldDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: DM.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  victoryTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: DM.text,
    marginBottom: 6,
  },
  victorySub: {
    fontSize: 15,
    color: DM.muted,
    marginBottom: 30,
    textAlign: 'center',
  },
  rewardBox: {
    backgroundColor: DM.bg,
    width: '100%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: DM.border,
  },
  rewardLabel: {
    fontSize: 12,
    color: DM.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  rewardValue: {
    fontSize: 32,
    fontWeight: '800',
    color: DM.gold,
    marginBottom: 15,
  },
  divider: {
    height: 1,
    width: '80%',
    backgroundColor: DM.border,
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: DM.text,
  },
  actionsContainer: {
    width: '100%',
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: DM.gold,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryBtn: {
    backgroundColor: DM.tealDark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  secondaryBtnText: {
    color: DM.teal,
    fontSize: 15,
    fontWeight: '600',
  },
  tertiaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  tertiaryBtnText: {
    color: DM.muted,
    fontSize: 14,
    fontWeight: '500',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});