import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, TextInput, Platform, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { GlobalHeaderRight } from '@/components/dm/global-header-right';
import { DM } from '@/constants/dm-theme';
import { useAuth } from '@/context/AuthContext';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8090';

export default function ProfileScreen() {
  const router = useRouter();
  const { userToken, logout, isLoading } = useAuth();

  const [user, setUser] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const [editName, setEditName] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/users/me`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${userToken}`, 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data);
          setEditName(data.username);
        }
      } catch (err) {
        console.error('Erreur chargement profil:', err);
      } finally {
        setLoadingProfile(false);
      }
    };

  useEffect(() => {
    if (isLoading) return;
    if (!userToken) {
      router.replace('/authentification');
      return;
    }
    fetchProfile();
  }, [userToken, isLoading]);


  const handleSaveProfile = async () => {
    if (editPassword !== '' && oldPassword === '') {
      Alert.alert("Erreur", "Veuillez entrer votre ancien mot de passe.");
      return;
    }
    if (editPassword !== confirmPassword) {
      Alert.alert("Erreur", "Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    const payload: any = { username: editName };
    if (editPassword !== '') {
      payload.password = editPassword;
      payload.oldPassword = oldPassword;
    }

    try {
      const response = await fetch(`${API_URL}/users/me`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();

      if (response.ok) {
        setIsEditModalVisible(false);

        setUser((prev: any) => ({ ...prev, username: editName }));

        setOldPassword('');
        setEditPassword('');
        setConfirmPassword('');

        Alert.alert("Succès", "Profil mis à jour !");
      } else {
        Alert.alert("Erreur", `Le serveur a renvoyé : ${response.status}`);
        console.error("Réponse serveur erreur :", responseText);
      }
    } catch (err) {
      console.error("Erreur réseau :", err);
      Alert.alert("Erreur", "Impossible de contacter le serveur.");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(`${API_URL}/users/${user?.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${userToken}` },
      });
      if (response.ok) {
        await logout();
        setIsDeleteModalVisible(false);
        router.replace('/authentification');
      }
    } catch (e) { Alert.alert("Erreur", "Impossible de contacter le serveur."); }
  };

  const handleCloseEditModal = () => {
    setOldPassword(''); setEditPassword(''); setConfirmPassword('');
    setIsEditModalVisible(false);
  };

  if (isLoading || loadingProfile) {
    return <View style={styles.safe}><ActivityIndicator size="large" color={DM.teal} /></View>;
  }

  return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mon Profil</Text>
          <GlobalHeaderRight />
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
          <View style={styles.profileCard}>
            <View style={[styles.avatarContainer, { backgroundColor: user?.avatarBg}]}>
              <Text style={[styles.avatarText, { color: user?.avatarColor }]}>
                {user?.initials}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.username || 'Chargement...'}</Text>
              <View style={styles.badgeContainer}>
                <MaterialIcons name="star" size={14} color={DM.gold} />
                <Text style={styles.badgeText}>Maître Mixologue</Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Aperçu</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{user?.score || 0}</Text>
              <Text style={styles.statLabel}>Score</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{user?.cocktailsCompleted}</Text>
              <Text style={styles.statLabel}>Cocktails réalisés</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{user?.rank || "Pas de rang"}</Text>
              <Text style={styles.statLabel}>Rang global</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{user?.streak || 0} j.</Text>
              <Text style={styles.statLabel}>Série actuelle</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Paramètres du compte</Text>
          <View style={styles.settingsContainer}>
            <Pressable style={styles.settingButton} onPress={() => setIsEditModalVisible(true)}>
              <View style={styles.settingButtonLeft}>
                <MaterialIcons name="edit" size={20} color={DM.teal} />
                <Text style={styles.settingButtonText}>Modifier le profil</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color={DM.muted} />
            </Pressable>
            <View style={styles.divider} />
            <Pressable style={styles.settingButton} onPress={() => setIsDeleteModalVisible(true)}>
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