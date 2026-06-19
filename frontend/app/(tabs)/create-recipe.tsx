import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Platform, Switch, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';

import { DM } from '@/constants/dm-theme';
import { usePlayer } from '@/contexts/player-context';

export default function CreateRecipeScreen() {
  const router = useRouter();
  const { availableTools, availableIngredients } = usePlayer();

  // Liste locale pour stocker les nouveaux ingrédients créés à la volée
  const [addedIngredients, setAddedIngredients] = useState<any[]>([]);
  
  // Combinaison des ingrédients du back + les nouveaux
  const allIngredients = [...availableIngredients, ...addedIngredients];
  const allTools = [...availableTools];

  // Infos générales
  const [name, setName] = useState('');
  const [points, setPoints] = useState('100');
  const [level, setLevel] = useState('1');
  
  // Visuel du cocktail
  const [isImage, setIsImage] = useState(false);
  const [visualValue, setVisualValue] = useState('');

  // Étapes dynamiques
  const [steps, setSteps] = useState([
    { id: 1, label: '', points: '20', tool: '', ingredient: '' }
  ]);

  // États pour le Menu Déroulant Custom
  const [pickerState, setPickerState] = useState({
    visible: false,
    stepIndex: -1,
    type: 'tool' as 'tool' | 'ingredient',
  });

  // États pour la création d'un Nouvel Ingrédient
  const [newIngModalVisible, setNewIngModalVisible] = useState(false);
  const [newIngLabel, setNewIngLabel] = useState('');
  const [newIngIsImage, setNewIngIsImage] = useState(false);
  const [newIngVisual, setNewIngVisual] = useState('');

  // ── LOGIQUE DES ÉTAPES ──
  const handleAddStep = () => {
    setSteps([...steps, { id: steps.length + 1, label: '', points: '20', tool: '', ingredient: '' }]);
  };

  const handleRemoveStep = () => {
    if (steps.length > 1) setSteps(steps.slice(0, -1));
  };

  const updateStep = (index: number, field: string, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setSteps(newSteps);
  };

  // ── LOGIQUE DU MENU DÉROULANT ──
  const openPicker = (index: number, type: 'tool' | 'ingredient') => {
    setPickerState({ visible: true, stepIndex: index, type });
  };

  const handleSelectOption = (id: string) => {
    updateStep(pickerState.stepIndex, pickerState.type, id);
    setPickerState({ ...pickerState, visible: false });
  };

  const getLabelForId = (id: string, type: 'tool' | 'ingredient') => {
    if (!id) return "Sélectionner...";
    if (type === 'tool') {
      const t = allTools.find(x => x.id === id);
      return t ? t.label : id;
    } else {
      const i = allIngredients.find(x => x.id === id);
      return i ? i.label : id;
    }
  };

  // ── LOGIQUE DU NOUVEL INGRÉDIENT ──
  const handleCreateIngredient = () => {
    if (!newIngLabel.trim()) {
      alert("Le nom de l'ingrédient est requis.");
      return;
    }
    
    // Génération d'un ID propre (ex: "Jus de Citron" -> "jus_de_citron")
    const generatedId = newIngLabel.trim().toLowerCase().replace(/\s+/g, '_');
    
    const newIngredient = {
      id: generatedId,
      label: newIngLabel,
      emoji: !newIngIsImage ? (newIngVisual || '🌿') : undefined,
      imageUrl: newIngIsImage ? newIngVisual : undefined,
    };

    setAddedIngredients([...addedIngredients, newIngredient]);
    
    // On l'assigne directement à l'étape en cours si le picker était ouvert
    if (pickerState.stepIndex !== -1) {
      updateStep(pickerState.stepIndex, 'ingredient', generatedId);
    }

    // Reset et fermeture
    setNewIngLabel('');
    setNewIngVisual('');
    setNewIngModalVisible(false);
  };

  // ── SAUVEGARDE FINALE ──
  const handleSaveRecipe = () => {
    const newRecipe = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      points: parseInt(points, 10),
      level: parseInt(level, 10),
      emoji: !isImage ? visualValue : undefined,
      imageUrl: isImage ? visualValue : undefined,
      recipe: steps.map((s, i) => ({
        id: i + 1,
        label: s.label,
        points: parseInt(s.points, 10),
        requiredTool: s.tool,
        requiredIngredient: s.ingredient,
      })),
      newIngredientsToCreate: addedIngredients // On envoie les nouveaux ingrédients au back
    };

    console.log('Nouvelle recette créée :', JSON.stringify(newRecipe, null, 2));
    alert("Recette créée avec succès !");
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* EN-TÊTE */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={DM.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Nouvelle Recette</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        
        {/* INFOS GÉNÉRALES */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Informations générales</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom du cocktail</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Ex: Margarita Royale"
              placeholderTextColor={DM.silver}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Niveau requis</Text>
              <TextInput
                style={styles.input}
                value={level}
                onChangeText={setLevel}
                keyboardType="numeric"
                placeholder="1"
                placeholderTextColor={DM.silver}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Points de complétion</Text>
              <TextInput
                style={styles.input}
                value={points}
                onChangeText={setPoints}
                keyboardType="numeric"
                placeholder="100"
                placeholderTextColor={DM.silver}
              />
            </View>
          </View>
        </View>

        {/* VISUEL */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Visuel du cocktail</Text>
            <View style={styles.switchRow}>
              <Text style={[styles.switchLabel, !isImage && styles.switchLabelActive]}>Emoji</Text>
              <Switch
                value={isImage}
                onValueChange={setIsImage}
                trackColor={{ false: DM.border, true: DM.tealLight }}
                thumbColor={isImage ? DM.teal : DM.silver}
              />
              <Text style={[styles.switchLabel, isImage && styles.switchLabelActive]}>Image</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{isImage ? "URL de l'image" : "Emoji"}</Text>
            <TextInput
              style={styles.input}
              value={visualValue}
              onChangeText={setVisualValue}
              placeholder={isImage ? "https://images.unsplash.com/..." : "🍹"}
              placeholderTextColor={DM.silver}
            />
          </View>
        </View>

        {/* ÉTAPES DE LA RECETTE */}
        <Text style={[styles.sectionTitle, { marginLeft: 4, marginTop: 10 }]}>Étapes de préparation</Text>
        
        {steps.map((step, index) => (
          <View key={index} style={styles.stepCard}>
            <View style={styles.stepHeader}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepTitle}>Étape {index + 1}</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Instruction affichée</Text>
              <TextInput
                style={styles.input}
                value={step.label}
                onChangeText={(val) => updateStep(index, 'label', val)}
                placeholder="Ex: Versez 4cl de Rhum..."
                placeholderTextColor={DM.silver}
              />
            </View>

            <View style={styles.row}>
              {/* SÉLECTEUR OUTIL */}
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Outil requis</Text>
                <Pressable style={styles.dropdownInput} onPress={() => openPicker(index, 'tool')}>
                  <Text style={[styles.dropdownText, !step.tool && styles.dropdownPlaceholder]}>
                    {getLabelForId(step.tool, 'tool')}
                  </Text>
                  <MaterialIcons name="arrow-drop-down" size={20} color={DM.muted} />
                </Pressable>
              </View>
              
              {/* SÉLECTEUR INGRÉDIENT */}
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Ingrédient requis</Text>
                <Pressable style={styles.dropdownInput} onPress={() => openPicker(index, 'ingredient')}>
                  <Text style={[styles.dropdownText, !step.ingredient && styles.dropdownPlaceholder]}>
                    {getLabelForId(step.ingredient, 'ingredient')}
                  </Text>
                  <MaterialIcons name="arrow-drop-down" size={20} color={DM.muted} />
                </Pressable>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Points gagnés</Text>
              <TextInput
                style={styles.input}
                value={step.points}
                onChangeText={(val) => updateStep(index, 'points', val)}
                keyboardType="numeric"
                placeholderTextColor={DM.silver}
              />
            </View>
          </View>
        ))}

        {/* ACTIONS ÉTAPES */}
        <View style={styles.stepActions}>
          <Pressable style={[styles.actionBtn, styles.actionBtnOutline]} onPress={handleRemoveStep}>
            <MaterialIcons name="remove" size={20} color={DM.danger} />
            <Text style={[styles.actionBtnText, { color: DM.danger }]}>Retirer</Text>
          </Pressable>
          <Pressable style={[styles.actionBtn, styles.actionBtnFilled]} onPress={handleAddStep}>
            <MaterialIcons name="add" size={20} color={DM.teal} />
            <Text style={[styles.actionBtnText, { color: DM.teal }]}>Ajouter une étape</Text>
          </Pressable>
        </View>

        {/* SAUVEGARDER */}
        <Pressable style={({ pressed }) => [styles.saveBtn, pressed && styles.pressed]} onPress={handleSaveRecipe}>
          <MaterialIcons name="check-circle" size={20} color={DM.surface} />
          <Text style={styles.saveBtnText}>Créer la recette</Text>
        </Pressable>
      </ScrollView>


      {/* MODALE : SÉLECTEUR (OUTIL OU INGRÉDIENT)   */}
      <Modal visible={pickerState.visible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.pickerCard}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>
                Sélectionner un {pickerState.type === 'tool' ? 'outil' : 'ingrédient'}
              </Text>
              <Pressable onPress={() => setPickerState({ ...pickerState, visible: false })}>
                <MaterialIcons name="close" size={24} color={DM.muted} />
              </Pressable>
            </View>
            
            <ScrollView style={styles.pickerList}>
              <Pressable style={styles.pickerItem} onPress={() => handleSelectOption('')}>
                <Text style={[styles.pickerItemText, { color: DM.muted, fontStyle: 'italic' }]}>Aucun requis</Text>
              </Pressable>
              
              {(pickerState.type === 'tool' ? allTools : allIngredients).map(item => (
                <Pressable key={item.id} style={styles.pickerItem} onPress={() => handleSelectOption(item.id)}>
                  <Text style={styles.pickerItemText}>{item.label}</Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Bouton Nouvel Ingrédient */}
            {pickerState.type === 'ingredient' && (
              <Pressable 
                style={styles.newIngredientBtn} 
                onPress={() => {
                  setPickerState({ ...pickerState, visible: false });
                  setNewIngModalVisible(true);
                }}
              >
                <MaterialIcons name="add-circle-outline" size={20} color={DM.gold} />
                <Text style={styles.newIngredientBtnText}>Créer un nouvel ingrédient</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Modal>

      {/* MODALE : CRÉER UN NOUVEL INGRÉDIENT */}
      <Modal visible={newIngModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.pickerCard, { maxHeight: 'auto' }]}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Nouvel Ingrédient</Text>
              <Pressable onPress={() => setNewIngModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={DM.muted} />
              </Pressable>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nom de l'ingrédient</Text>
              <TextInput
                style={styles.input}
                value={newIngLabel}
                onChangeText={setNewIngLabel}
                placeholder="Ex: Sirop de Fraise"
                placeholderTextColor={DM.silver}
              />
            </View>

            <View style={styles.rowBetween}>
              <Text style={styles.label}>Visuel</Text>
              <View style={styles.switchRow}>
                <Text style={[styles.switchLabel, !newIngIsImage && styles.switchLabelActive]}>Emoji</Text>
                <Switch
                  value={newIngIsImage}
                  onValueChange={setNewIngIsImage}
                  trackColor={{ false: DM.border, true: DM.tealLight }}
                  thumbColor={newIngIsImage ? DM.teal : DM.silver}
                />
                <Text style={[styles.switchLabel, newIngIsImage && styles.switchLabelActive]}>Image</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                value={newIngVisual}
                onChangeText={setNewIngVisual}
                placeholder={newIngIsImage ? "URL de l'image..." : "🍓"}
                placeholderTextColor={DM.silver}
              />
            </View>

            <Pressable style={styles.saveBtn} onPress={handleCreateIngredient}>
              <Text style={styles.saveBtnText}>Ajouter l'ingrédient</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: DM.bg },
  header: {
    backgroundColor: DM.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: DM.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: DM.text },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  
  card: {
    backgroundColor: DM.surface,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: DM.border,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: DM.text,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: { flexDirection: 'row', gap: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  
  inputGroup: { marginBottom: 16 },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: DM.muted,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: DM.bg,
    borderWidth: 1,
    borderColor: DM.border,
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 48,
    color: DM.text,
    fontSize: 14,
  },

  // Dropdown Custom
  dropdownInput: {
    backgroundColor: DM.bg,
    borderWidth: 1,
    borderColor: DM.border,
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: { color: DM.text, fontSize: 14, flex: 1 },
  dropdownPlaceholder: { color: DM.silver },

  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  switchLabel: { fontSize: 12, color: DM.muted, fontWeight: '500' },
  switchLabelActive: { color: DM.teal, fontWeight: '700' },

  stepCard: {
    backgroundColor: DM.surface,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: DM.border,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: DM.gold,
  },
  stepHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: DM.goldDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeText: { fontSize: 12, fontWeight: '700', color: DM.gold },
  stepTitle: { fontSize: 16, fontWeight: '700', color: DM.text },

  stepActions: { flexDirection: 'row', gap: 12, marginBottom: 30 },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  actionBtnOutline: { backgroundColor: DM.bg, borderWidth: 1, borderColor: DM.border },
  actionBtnFilled: { backgroundColor: DM.tealDark, borderWidth: 1, borderColor: DM.tealLight },
  actionBtnText: { fontSize: 13, fontWeight: '600' },

  saveBtn: {
    backgroundColor: DM.gold,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  saveBtnText: { color: DM.surface, fontSize: 16, fontWeight: '700' },
  pressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },

  // Styles Modales
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(42, 40, 38, 0.6)',
    justifyContent: 'flex-end',
  },
  pickerCard: {
    backgroundColor: DM.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  pickerTitle: { fontSize: 18, fontWeight: '700', color: DM.text },
  pickerList: { marginBottom: 16 },
  pickerItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: DM.border,
  },
  pickerItemText: { fontSize: 16, color: DM.text },
  
  newIngredientBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: DM.goldDark,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: DM.goldLight,
  },
  newIngredientBtnText: { fontSize: 15, fontWeight: '600', color: DM.gold },
});