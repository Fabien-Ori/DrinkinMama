import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Platform, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';

import { DM } from '@/constants/dm-theme';
import { usePlayer } from '@/contexts/player-context';

export default function CreateRecipeScreen() {
  const router = useRouter();
  const { availableTools, availableIngredients } = usePlayer();

  // Infos générales
  const [name, setName] = useState('');
  const [points, setPoints] = useState('100');
  const [level, setLevel] = useState('1');
  
  // Visuel
  const [isImage, setIsImage] = useState(false);
  const [visualValue, setVisualValue] = useState('');

  // Étapes dynamiques
  const [steps, setSteps] = useState([
    { id: 1, label: '', points: '20', tool: '', ingredient: '' }
  ]);

  // Ajouter une étape
  const handleAddStep = () => {
    setSteps([
      ...steps,
      { id: steps.length + 1, label: '', points: '20', tool: '', ingredient: '' }
    ]);
  };

  // Supprimer la dernière étape
  const handleRemoveStep = () => {
    if (steps.length > 1) {
      setSteps(steps.slice(0, -1));
    }
  };

  // Mettre à jour une étape spécifique
  const updateStep = (index: number, field: string, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setSteps(newSteps);
  };

  // Sauvegarder
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
      }))
    };

    console.log('Nouvelle recette créée :', JSON.stringify(newRecipe, null, 2));
    
    if (Platform.OS === 'web') {
      alert("Recette créée avec succès !");
      router.back();
    } else {
      // Alert native pour mobile
      alert("Recette créée avec succès !");
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* EN-TÊTE */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={DM.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Nouvelle Recette</Text>
        <View style={{ width: 24 }} /> {/* Espace pour centrer le titre */}
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
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Outil requis (ID)</Text>
                <TextInput
                  style={styles.input}
                  value={step.tool}
                  onChangeText={(val) => updateStep(index, 'tool', val)}
                  placeholder="Ex: shaker"
                  placeholderTextColor={DM.silver}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Ingrédient requis (ID)</Text>
                <TextInput
                  style={styles.input}
                  value={step.ingredient}
                  onChangeText={(val) => updateStep(index, 'ingredient', val)}
                  placeholder="Ex: rhum_blanc"
                  placeholderTextColor={DM.silver}
                />
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

        {/* BOUTONS D'AJOUT/SUPPRESSION D'ÉTAPES */}
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

        {/* BOUTON SAUVEGARDER */}
        <Pressable style={({ pressed }) => [styles.saveBtn, pressed && styles.pressed]} onPress={handleSaveRecipe}>
          <MaterialIcons name="check-circle" size={20} color={DM.surface} />
          <Text style={styles.saveBtnText}>Créer la recette</Text>
        </Pressable>

      </ScrollView>
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
  actionBtnOutline: {
    backgroundColor: DM.bg,
    borderWidth: 1,
    borderColor: DM.border,
  },
  actionBtnFilled: {
    backgroundColor: DM.tealDark,
    borderWidth: 1,
    borderColor: DM.tealLight,
  },
  actionBtnText: { fontSize: 13, fontWeight: '600' },

  saveBtn: {
    backgroundColor: DM.gold,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: DM.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: { color: DM.surface, fontSize: 16, fontWeight: '700' },
  pressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
});