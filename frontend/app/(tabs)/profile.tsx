import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { GlobalHeaderRight } from '@/components/dm/global-header-right';
import { DM } from '@/constants/dm-theme';
import { usePlayer } from '@/contexts/player-context';

export default function ProfileScreen() {
  const { player } = usePlayer();

  // États pour les Modales
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  // États pour le formulaire d'édition
  const [editName, setEditName] = useState('Drinking Mama'); // Remplacer par la vraie donnée
  const [oldPassword, setOldPassword] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Fonctions de validation
  const handleSaveProfile = () => {
    // Vérification basique des mots de passe
    if (editPassword !== '' || oldPassword !== '' || confirmPassword !== '') {
      if (oldPassword === '') {
        Platform.OS === 'web' 
          ? alert("Veuillez entrer votre ancien mot de passe.") 
          : Alert.alert("Erreur", "Veuillez entrer votre ancien mot de passe.");
        return;
      }
      if (editPassword !== confirmPassword) {
        Platform.OS === 'web' 
          ? alert("Les nouveaux mots de passe ne correspondent pas.") 
          : Alert.alert("Erreur", "Les nouveaux mots de passe ne correspondent pas.");
        return;
      }
    }

    // Logique API pour sauvegarder les infos ici
    console.log('Profil mis à jour :', editName);
    
    // On nettoie les champs et on ferme la modale
    setOldPassword('');
    setEditPassword('');
    setConfirmPassword('');
    setIsEditModalVisible(false);
  };

  const handleDeleteAccount = () => {
    // Logique API pour supprimer le compte ici
    console.log('Compte supprimé');
    setIsDeleteModalVisible(false);
    // Redirection vers l'authentification à rajouter ici après suppression
  };

  const handleCloseEditModal = () => {
    setOldPassword('');
    setEditPassword('');
    setConfirmPassword('');
    setIsEditModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* EN-TÊTE */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mon Profil</Text>
        <GlobalHeaderRight />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        
        {/* CARTE PROFIL PRINCIPALE */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>DM</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{editName}</Text>
            <View style={styles.badgeContainer}>
              <MaterialIcons name="star" size={14} color={DM.gold} />
              <Text style={styles.badgeText}>Maître Mixologue (Niveau {player.level})</Text>
            </View>
          </View>
        </View>

        {/* STATISTIQUES */}
        <Text style={styles.sectionTitle}>Aperçu</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{player.coins || 0}</Text>
            <Text style={styles.statLabel}>Pièces</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{player.mixodexUnlocked}</Text>
            <Text style={styles.statLabel}>Cocktails réalisés</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>#{player.rank || 42}</Text>
            <Text style={styles.statLabel}>Rang global</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{player.streak} j.</Text>
            <Text style={styles.statLabel}>Série actuelle</Text>
          </View>
        </View>

        {/* GESTION DU COMPTE */}
        <Text style={styles.sectionTitle}>Paramètres du compte</Text>
        <View style={styles.settingsContainer}>
          <Pressable 
            style={({ pressed }) => [styles.settingButton, pressed && styles.pressed]}
            onPress={() => setIsEditModalVisible(true)}
          >
            <View style={styles.settingButtonLeft}>
              <MaterialIcons name="edit" size={20} color={DM.teal} />
              <Text style={styles.settingButtonText}>Modifier le profil</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={DM.muted} />
          </Pressable>

          <View style={styles.divider} />

          <Pressable 
            style={({ pressed }) => [styles.settingButton, pressed && styles.pressed]}
            onPress={() => setIsDeleteModalVisible(true)}
          >
            <View style={styles.settingButtonLeft}>
              <MaterialIcons name="delete-forever" size={20} color={DM.danger} />
              <Text style={[styles.settingButtonText, { color: DM.danger }]}>Supprimer le compte</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={DM.muted} />
          </Pressable>
        </View>
      </ScrollView>

      {/* MODALE : MODIFIER LE PROFIL */}
      <Modal
        visible={isEditModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseEditModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Modifier mon profil</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nom d'utilisateur</Text>
              <TextInput
                style={styles.input}
                value={editName}
                onChangeText={setEditName}
                placeholder="Votre nom"
                placeholderTextColor={DM.silver}
              />
            </View>

            <View style={styles.dividerModal} />

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Ancien mot de passe</Text>
              <TextInput
                style={styles.input}
                value={oldPassword}
                onChangeText={setOldPassword}
                placeholder="Requis pour changer"
                placeholderTextColor={DM.silver}
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nouveau mot de passe</Text>
              <TextInput
                style={styles.input}
                value={editPassword}
                onChangeText={setEditPassword}
                placeholder="Laisser vide pour ne pas changer"
                placeholderTextColor={DM.silver}
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirmer le nouveau mot de passe</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Retapez votre nouveau mot de passe"
                placeholderTextColor={DM.silver}
                secureTextEntry
              />
            </View>

            <View style={styles.modalActions}>
              <Pressable style={styles.btnCancel} onPress={handleCloseEditModal}>
                <Text style={styles.btnCancelText}>Annuler</Text>
              </Pressable>
              <Pressable style={styles.btnSave} onPress={handleSaveProfile}>
                <Text style={styles.btnSaveText}>Enregistrer</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODALE : SUPPRIMER LE COMPTE */}
      <Modal
        visible={isDeleteModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.warningIconContainer}>
              <MaterialIcons name="warning" size={32} color={DM.danger} />
            </View>
            <Text style={styles.modalTitle}>Supprimer le compte ?</Text>
            <Text style={styles.modalSubtitle}>
              Cette action est irréversible. Toutes vos données, vos recettes et vos pièces seront perdues à jamais.
            </Text>

            <View style={styles.modalActions}>
              <Pressable style={styles.btnCancel} onPress={() => setIsDeleteModalVisible(false)}>
                <Text style={styles.btnCancelText}>Annuler</Text>
              </Pressable>
              <Pressable style={styles.btnDanger} onPress={handleDeleteAccount}>
                <Text style={styles.btnSaveText}>Oui, supprimer</Text>
              </Pressable>
            </View>
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
  headerTitle: { fontSize: 20, fontWeight: '700', color: DM.text },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  
  // Carte Profil
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DM.surface,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: DM.border,
    marginBottom: 24,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: DM.purpleDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: DM.purple,
  },
  avatarText: { fontSize: 22, fontWeight: '700', color: DM.purple },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: '700', color: DM.text, marginBottom: 4 },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DM.goldDark,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: DM.goldLight,
  },
  badgeText: { fontSize: 11, color: DM.gold, marginLeft: 4, fontWeight: '600' },

  // Sections
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: DM.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },

  // Grille Stats
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 30,
  },
  statBox: {
    backgroundColor: DM.surface,
    width: '48%',
    flexGrow: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: DM.border,
  },
  statValue: { fontSize: 20, fontWeight: '700', color: DM.text, marginBottom: 4 },
  statLabel: { fontSize: 11, color: DM.muted },

  // Paramètres
  settingsContainer: {
    backgroundColor: DM.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: DM.border,
    overflow: 'hidden',
  },
  settingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingButtonText: { fontSize: 15, fontWeight: '500', color: DM.text },
  divider: { height: 1, backgroundColor: DM.border, marginHorizontal: 16 },
  pressed: { opacity: 0.7, backgroundColor: DM.bg },

  // Modales
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(42, 40, 38, 0.6)', 
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: DM.surface,
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: DM.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: DM.muted,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  warningIconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  dividerModal: {
    height: 1,
    backgroundColor: DM.border,
    marginVertical: 16,
    width: '100%',
  },
  inputGroup: { marginBottom: 16 },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: DM.muted,
    marginBottom: 8,
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
    fontSize: 15,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  btnCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: DM.bg,
    borderWidth: 1,
    borderColor: DM.border,
    alignItems: 'center',
  },
  btnCancelText: { color: DM.text, fontWeight: '600', fontSize: 15 },
  btnSave: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: DM.teal,
    alignItems: 'center',
  },
  btnDanger: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: DM.danger,
    alignItems: 'center',
  },
  btnSaveText: { color: DM.surface, fontWeight: '600', fontSize: 15 },
});