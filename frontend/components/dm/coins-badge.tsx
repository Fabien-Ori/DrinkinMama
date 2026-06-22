import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState, useCallback } from 'react';

import { DM } from '@/constants/dm-theme';
import { useAuth } from '@/context/AuthContext';

const BASE_URL = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8090').replace(/\/$/, '');

export function CoinsBadge() {
  const { userToken } = useAuth();
  const [coins, setCoins] = useState<number | null>(null);

  const fetchUserCoins = useCallback(async () => {
    if (!userToken) return;
    try {
      const response = await fetch(`${BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCoins(data.score ?? 0);
      }
    } catch (e) {
      console.error("Erreur chargement coins", e);
    }
  }, [userToken]);

  useEffect(() => {
    fetchUserCoins();
  }, [fetchUserCoins]);

  if (coins === null) return null;

  return (
      <View style={styles.badge}>
        <MaterialIcons name="monetization-on" size={14} color={DM.gold} />
        <Text style={styles.text}>{coins.toLocaleString('fr-FR')}</Text>
      </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: DM.goldDark,
    borderWidth: 0.5,
    borderColor: DM.gold,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  text: {
    fontSize: 13,
    fontWeight: '500',
    color: DM.goldLight,
  },
});