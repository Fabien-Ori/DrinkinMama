import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActiveToolVisual } from '@/components/dm/tool-visuals';
import { GlobalHeaderRight } from '@/components/dm/global-header-right';
import { DM } from '@/constants/dm-theme';
import { useAuth } from '@/context/AuthContext';

const BASE_URL = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8090').replace(/\/$/, '');

type VisualToolId = 'glass' | 'shaker' | 'mortar' | 'golden-shaker';

function unwrapEntity<T = any>(value: any): T {
    return value?.content ?? value;
}

function extractCollection(value: any): any[] {
    if (Array.isArray(value)) return value;
    if (!value?._embedded) return [];

    const key = Object.keys(value._embedded)[0];
    return key ? value._embedded[key].map(unwrapEntity) : [];
}

function getToolVisualId(tool: any | null): VisualToolId {
    if (!tool) return 'glass';

    const label = `${tool.label ?? ''}`.toLowerCase();
    const icon = `${tool.icon ?? ''}`.toLowerCase();
    const id = `${tool.id ?? ''}`;

    if (label.includes('dor') || id === 'golden-shaker') return 'golden-shaker';
    if (label.includes('shaker') || icon.includes('liquor') || id === '2') return 'shaker';
    if (label.includes('mortier') || icon.includes('construction') || id === '3') return 'mortar';

    return 'glass';
}

function getActionHint(tool: any | null): string {
    const visualTool = getToolVisualId(tool);

    switch (visualTool) {
        case 'mortar':
            return 'Appuyer pour écraser';
        case 'shaker':
        case 'golden-shaker':
            return 'Appuyer pour shaker';
        default:
            return 'Appuyer pour verser';
    }
}

export default function GameScreen() {
    const router = useRouter();
    const { slug } = useLocalSearchParams();
    const { userToken, isLoading } = useAuth();

    const [loading, setLoading] = useState(true);
    const [cocktail, setCocktail] = useState<any>(null);
    const [steps, setSteps] = useState<any[]>([]);
    const [tools, setTools] = useState<any[]>([]);
    const [ingredients, setIngredients] = useState<any[]>([]);
    const [gameSession, setGameSession] = useState<any>(null);

    const [selectedTool, setSelectedTool] = useState<string | null>(null);
    const [selectedIngredient, setSelectedIngredient] = useState<string | null>(null);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [userScore, setUserScore] = useState<number | null>(null);
    const [finishCalled, setFinishCalled] = useState(false);

    const [toolsVisible, setToolsVisible] = useState(true);
    const [recipeVisible, setRecipeVisible] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const selectedToolObj = useMemo(
        () => tools.find((tool) => tool.id?.toString() === selectedTool?.toString()) ?? null,
        [tools, selectedTool],
    );

    const selectedIngObj = useMemo(
        () => ingredients.find((ingredient) => ingredient.id?.toString() === selectedIngredient?.toString()) ?? null,
        [ingredients, selectedIngredient],
    );

    const loadGame = async () => {
        if (!userToken || !slug) return;

        setErrorMessage(null);
        setLoading(true);
        setFinishCalled(false);

        try {
            const cocktailsRes = await fetch(`${BASE_URL}/cocktails`, {
                headers: { Authorization: `Bearer ${userToken}` },
            });

            if (!cocktailsRes.ok) {
                throw new Error(`Impossible de charger les cocktails (${cocktailsRes.status})`);
            }

            const cocktailsData = await cocktailsRes.json();
            const cocktails = extractCollection(cocktailsData);
            const slugValue = Array.isArray(slug) ? slug[0] : slug;

            const foundCocktail = cocktails.find((item: any) => {
                const itemId = item.id?.toString();
                return item.slug === slugValue || itemId === slugValue;
            });

            if (!foundCocktail) {
                throw new Error(`Cocktail introuvable pour: ${slugValue}`);
            }

            const cocktailId = foundCocktail.id;

            const [cocktailRes, stepsRes, toolsRes, ingredientsRes, sessionRes] = await Promise.all([
                fetch(`${BASE_URL}/cocktails/${cocktailId}`, {
                    headers: { Authorization: `Bearer ${userToken}` },
                }),
                fetch(`${BASE_URL}/cocktails/${cocktailId}/steps`, {
                    headers: { Authorization: `Bearer ${userToken}` },
                }),
                fetch(`${BASE_URL}/tools`, {
                    headers: { Authorization: `Bearer ${userToken}` },
                }),
                fetch(`${BASE_URL}/ingredients`, {
                    headers: { Authorization: `Bearer ${userToken}` },
                }),
                fetch(`${BASE_URL}/cocktails/${cocktailId}/start`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${userToken}` },
                }),
            ]);

            if (!cocktailRes.ok) throw new Error(`Cocktail non chargé (${cocktailRes.status})`);
            if (!stepsRes.ok) throw new Error(`Étapes non chargées (${stepsRes.status})`);
            if (!toolsRes.ok) throw new Error(`Outils non chargés (${toolsRes.status})`);
            if (!ingredientsRes.ok) throw new Error(`Ingrédients non chargés (${ingredientsRes.status})`);
            if (!sessionRes.ok) throw new Error(`Session non démarrée (${sessionRes.status})`);

            const cocktailData = unwrapEntity(await cocktailRes.json());
            const stepsData = await stepsRes.json();
            const toolsData = await toolsRes.json();
            const ingredientsData = await ingredientsRes.json();
            const sessionData = await sessionRes.json();

            setCocktail(cocktailData);
            setSteps(extractCollection(stepsData));
            setTools(extractCollection(toolsData));
            setIngredients(extractCollection(ingredientsData));
            setGameSession({
                ...sessionData,
                currentStepIndex: 0,
                completedSteps: [],
                sessionPoints: 0,
            });

            setCurrentStepIndex(0);
            setSelectedTool(null);
            setSelectedIngredient(null);
            setUserScore(null);
        } catch (error: any) {
            console.error(error);
            setErrorMessage(error?.message ?? 'Impossible de charger la partie.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isLoading && userToken && slug) {
            loadGame();
        }
    }, [isLoading, userToken, slug]);

    const performAction = async () => {
        if (!cocktail || !gameSession || steps.length === 0) return;

        const step = steps[currentStepIndex];
        if (!step) return;

        try {
            const response = await fetch(`${BASE_URL}/cocktails/${cocktail.id}/validate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userToken}`,
                },
                body: JSON.stringify({
                    toolId: selectedTool,
                    ingredientId: selectedIngredient,
                    stepOrder: step.stepOrder,
                }),
            });

            if (!response.ok) {
                throw new Error(`Validation impossible (${response.status})`);
            }

            const isValid = await response.json();

            if (!isValid) {
                Alert.alert('Oups !', "Ce n'est pas le bon outil ou le bon ingrédient pour cette étape.");
                return;
            }

            setGameSession((prev: any) => ({
                ...prev,
                sessionPoints: prev.sessionPoints + step.points,
                completedSteps: [...prev.completedSteps, step.id],
            }));

            setCurrentStepIndex((prev) => prev + 1);
            setSelectedIngredient(null);
        } catch (error) {
            console.error(error);
            Alert.alert('Erreur', "L'action n'a pas pu être validée.");
        }
    };

    useEffect(() => {
        const finishGame = async () => {
            if (!cocktail || !gameSession || steps.length === 0 || finishCalled) return;
            if (currentStepIndex < steps.length) return;

            setFinishCalled(true);

            try {
                await fetch(`${BASE_URL}/cocktails/${cocktail.id}/finish?points=${gameSession.sessionPoints}`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${userToken}` },
                });

                const userRes = await fetch(`${BASE_URL}/users/me`, {
                    headers: { Authorization: `Bearer ${userToken}` },
                });

                if (userRes.ok) {
                    const userData = await userRes.json();
                    setUserScore(userData.score ?? userData.coins ?? null);
                }
            } catch (error) {
                console.error(error);
            }
        };

        finishGame();
    }, [currentStepIndex, steps.length, cocktail, gameSession, finishCalled, userToken]);

    if (errorMessage) {
        return (
            <SafeAreaView style={styles.safe}>
                <View style={styles.empty}>
                    <Text style={styles.emptyText}>{errorMessage}</Text>
                    <Pressable style={styles.primaryBtn} onPress={loadGame}>
                        <Text style={styles.primaryBtnText}>Réessayer</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    if (loading || isLoading || !cocktail || !gameSession) {
        return (
            <SafeAreaView style={styles.safe}>
                <View style={styles.empty}>
                    <ActivityIndicator size="large" color={DM.gold} />
                    <Text style={styles.emptyText}>Chargement de la partie…</Text>
                </View>
            </SafeAreaView>
        );
    }

    const totalSteps = steps.length;
    const progress = totalSteps > 0 ? ((currentStepIndex / totalSteps) * 100).toFixed(0) : '0';
    const fillLevel = Math.min(0.2 + currentStepIndex * 0.12, 0.85);
    const isComplete = totalSteps > 0 && currentStepIndex >= totalSteps;

    const handleReplay = () => loadGame();
    const handleGoToShop = () => router.push('/shop');
    const handleChooseAnother = () => router.push('/mixodex');

    if (isComplete) {
        return (
            <SafeAreaView style={styles.safe}>
                <View style={styles.victoryContainer}>
                    <View style={styles.victoryCard}>
                        <View style={styles.iconCircle}>
                            <MaterialIcons name="local-bar" size={40} color={DM.gold} />
                        </View>

                        <Text style={styles.victoryTitle}>Santé !</Text>
                        <Text style={styles.victorySub}>Recette parfaitement exécutée.</Text>

                        <View style={styles.rewardBox}>
                            <Text style={styles.rewardLabel}>Gains de la partie</Text>
                            <Text style={styles.rewardValue}>+ {gameSession.sessionPoints} pts</Text>
                            <View style={styles.divider} />
                            <Text style={styles.totalLabel}>
                                {userScore !== null ? `Nouveau score : ${userScore}` : 'Score sauvegardé'}
                            </Text>
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

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.recipeTitle}>{cocktail.name}</Text>
                    <Text style={styles.stepMeta}>
                        Étape {Math.min(currentStepIndex + 1, totalSteps)} / {totalSteps}
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
                {toolsVisible ? (
                    <View style={styles.toolsPanelWrapper}>
                        <ScrollView
                            style={styles.toolsPanel}
                            contentContainerStyle={styles.toolsPanelContent}
                            showsVerticalScrollIndicator={false}
                        >
                            <Text style={styles.panelLabel}>Outils</Text>
                            {tools.map((tool) => {
                                const active = selectedTool === tool.id?.toString();

                                return (
                                    <Pressable
                                        key={tool.id}
                                        style={[styles.toolBtn, active && styles.toolBtnActive]}
                                        onPress={() => setSelectedTool(tool.id.toString())}
                                    >
                                        <MaterialIcons
                                            name={(tool.icon || 'local-bar') as any}
                                            size={16}
                                            color={active ? DM.gold : DM.muted}
                                        />
                                        <Text style={[styles.toolLabel, active && styles.toolLabelActive]}>{tool.label}</Text>
                                    </Pressable>
                                );
                            })}
                        </ScrollView>
                        <Pressable style={styles.collapseBtn} onPress={() => setToolsVisible(false)}>
                            <MaterialIcons name="chevron-left" size={14} color={DM.muted} />
                        </Pressable>
                    </View>
                ) : (
                    <Pressable style={styles.expandTab} onPress={() => setToolsVisible(true)}>
                        <MaterialIcons name="chevron-right" size={14} color={DM.gold} />
                        <Text style={styles.expandTabText}>Outils</Text>
                    </Pressable>
                )}

                <View style={styles.gameCenter}>
                    <Pressable style={styles.toolDisplay} onPress={performAction}>
                        <ActiveToolVisual tool={getToolVisualId(selectedToolObj) as any} fillLevel={fillLevel} />
                        <View style={styles.tapHint}>
                            <MaterialIcons name="touch-app" size={12} color={DM.gold} />
                            <Text style={styles.tapHintText}>{getActionHint(selectedToolObj)}</Text>
                        </View>
                    </Pressable>

                    {selectedIngObj && (
                        <View style={styles.ingredientBadge}>
                            {selectedIngObj.emoji ? (
                                <Text style={styles.ingredientEmoji}>{selectedIngObj.emoji}</Text>
                            ) : (
                                <MaterialIcons name={(selectedIngObj.icon || 'eco') as any} size={12} color="#fff" />
                            )}
                            <Text style={styles.ingredientBadgeText}>{selectedIngObj.label} sélec.</Text>
                        </View>
                    )}
                </View>

                {recipeVisible ? (
                    <View style={styles.recipePanelWrapper}>
                        <Pressable style={styles.collapseBtn} onPress={() => setRecipeVisible(false)}>
                            <MaterialIcons name="chevron-right" size={14} color={DM.muted} />
                        </Pressable>
                        <View style={styles.recipePanel}>
                            <Text style={styles.panelLabel}>Recette</Text>
                            {steps.map((step, index) => {
                                const done = gameSession.completedSteps.includes(step.id);
                                const current = index === currentStepIndex && !done;

                                return (
                                    <View
                                        key={step.id}
                                        style={[
                                            styles.recipeStep,
                                            done && styles.recipeStepDone,
                                            current && styles.recipeStepCurrent,
                                        ]}
                                    >
                                        <Text style={styles.stepNum}>Étape {step.stepOrder ?? index + 1}</Text>
                                        <Text style={[styles.stepLabel, done && styles.stepLabelDone, current && styles.stepLabelCurrent]}>
                                            {step.label}
                                        </Text>
                                        <Text style={styles.stepPts}>+{step.points} pts</Text>
                                        {done && <MaterialIcons name="check" size={10} color={DM.success} style={styles.stepCheck} />}
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                ) : (
                    <Pressable style={[styles.expandTab, styles.expandTabRight]} onPress={() => setRecipeVisible(true)}>
                        <Text style={styles.expandTabText}>Recette</Text>
                        <MaterialIcons name="chevron-left" size={14} color={DM.gold} />
                    </Pressable>
                )}
            </View>

            <View style={styles.shelf}>
                <Text style={styles.shelfLabel}>Ingrédients disponibles</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shelfScroll}>
                    {ingredients.map((ing) => {
                        const selected = selectedIngredient === ing.id?.toString();

                        return (
                            <Pressable
                                key={ing.id}
                                style={[styles.ingredientChip, selected && styles.ingredientChipSelected]}
                                onPress={() => setSelectedIngredient(ing.id.toString())}
                            >
                                {ing.emoji ? (
                                    <Text style={styles.chipEmoji}>{ing.emoji}</Text>
                                ) : (
                                    <MaterialIcons
                                        name={(ing.icon || 'eco') as any}
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
    empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
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
    toolsPanelWrapper: { flexDirection: 'row', alignItems: 'center', gap: 2 },
    toolsPanel: {
        width: 56,
        backgroundColor: DM.surface,
        borderWidth: 0.5,
        borderColor: DM.border,
        borderRadius: 12,
    },
    toolsPanelContent: { padding: 6, gap: 6 },
    recipePanelWrapper: { flexDirection: 'row', alignItems: 'center', gap: 2 },
    recipePanel: {
        width: 80,
        backgroundColor: DM.surface,
        borderWidth: 0.5,
        borderColor: DM.border,
        borderRadius: 12,
        padding: 8,
        gap: 6,
    },
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
    toolLabel: { fontSize: 8, color: DM.muted, marginTop: 2, textAlign: 'center' },
    toolLabelActive: { color: DM.goldLight },
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
    chipEmoji: { fontSize: 18 },
    chipLabel: { fontSize: 8, color: DM.muted, marginTop: 2 },
    chipLabelSelected: { color: DM.tealLight },
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