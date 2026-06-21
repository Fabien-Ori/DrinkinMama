import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, Text, View } from 'react-native';

import { DM } from '@/constants/dm-theme';
import { usePlayer } from '@/context/player-context';

export function CoinsBadge() {
  const { player, user } = usePlayer();

  if (!user) return null;

  return (
    <View style={styles.badge}>
      <MaterialIcons name="monetization-on" size={14} color={DM.gold} />
      <Text style={styles.text}>{player.coins.toLocaleString('fr-FR')}</Text>
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
