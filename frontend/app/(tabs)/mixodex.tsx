import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DM } from '@/constants/dm-theme';
import { THUMB_COLORS } from '@/constants/mock-data';
import { usePlayer } from '@/contexts/player-context';

export default function MixodexScreen() {
  const router = useRouter();
  const { player, cocktails, startGame } = usePlayer();
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () => cocktails.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())),
    [cocktails, search],
  );

  const handleCocktailPress = (id: string, locked: boolean) => {
    if (locked) return;
    startGame(id);
    router.push('/game');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Mixodex</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>
            {player.mixodexUnlocked} / {player.mixodexTotal} débloqués
          </Text>
        </View>
      </View>

      <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍  Rechercher un cocktail..."
          placeholderTextColor={DM.muted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView contentContainerStyle={styles.grid}>
        {filtered.map((cocktail) => (
          <Pressable
            key={cocktail.id}
            style={[styles.card, cocktail.locked && styles.cardLocked]}
            onPress={() => handleCocktailPress(cocktail.id, cocktail.locked)}>
            <View style={[styles.thumb, { backgroundColor: THUMB_COLORS[cocktail.thumbClass] }]}>
              {cocktail.locked ? (
                <MaterialIcons name="lock" size={24} color={DM.muted} />
              ) : (
                <>
                  <Text style={styles.emoji}>{cocktail.emoji}</Text>
                  <View style={styles.stars}>
                    {[1, 2, 3].map((i) => (
                      <MaterialIcons
                        key={i}
                        name={i <= cocktail.stars ? 'star' : 'star-border'}
                        size={8}
                        color={i <= cocktail.stars ? DM.gold : DM.muted}
                      />
                    ))}
                  </View>
                </>
              )}
            </View>
            <View style={styles.info}>
              <Text style={[styles.name, cocktail.locked && styles.nameLocked]}>{cocktail.name}</Text>
              <Text style={styles.meta}>
                {cocktail.locked
                  ? cocktail.lockReason
                  : `${cocktail.points} pts · Niv. ${cocktail.level}`}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: DM.bg },
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
  title: { fontSize: 15, fontWeight: '500', color: DM.text },
  countBadge: {
    backgroundColor: DM.card,
    borderWidth: 0.5,
    borderColor: DM.border,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
  },
  countText: { fontSize: 11, color: DM.muted },
  searchWrap: { paddingHorizontal: 12, paddingTop: 8, paddingBottom: 4 },
  searchInput: {
    width: '100%',
    fontSize: 12,
    paddingVertical: 7,
    paddingHorizontal: 10,
    backgroundColor: DM.surface,
    borderWidth: 0.5,
    borderColor: DM.border,
    borderRadius: 10,
    color: DM.text,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 12,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: DM.surface,
    borderWidth: 0.5,
    borderColor: DM.border,
    borderRadius: 14,
    overflow: 'hidden',
    width: '48%',
    flexGrow: 1,
  },
  cardLocked: { opacity: 0.45 },
  thumb: {
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  emoji: { fontSize: 28 },
  stars: { position: 'absolute', top: 4, right: 6, flexDirection: 'row', gap: 1 },
  info: { paddingHorizontal: 8, paddingBottom: 8, paddingTop: 6 },
  name: { fontSize: 12, fontWeight: '500', color: DM.text },
  nameLocked: { color: DM.muted },
  meta: { fontSize: 9, color: DM.muted, marginTop: 1 },
});
