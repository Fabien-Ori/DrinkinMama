import React from 'react';
import { View, Pressable, Platform, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';

import { CoinsBadge } from '@/components/dm/coins-badge';
import { DM } from '@/constants/dm-theme';

export function GlobalHeaderRight() {
  const router = useRouter();

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      localStorage.removeItem('jwt_token');
    }
    // Redirection vers la page d'authentification
    router.replace('/authentification');
  };

  return (
    <View style={styles.container}>
      <CoinsBadge />
      <Pressable 
        style={({ pressed }) => [styles.logoutBtn, pressed && styles.pressed]} 
        onPress={handleLogout}
      >
        <MaterialIcons name="logout" size={22} color={DM.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoutBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: DM.bg,
    borderWidth: 0.5,
    borderColor: DM.border,
  },
  pressed: {
    opacity: 0.8,
  },
});