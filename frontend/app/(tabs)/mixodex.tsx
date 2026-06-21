import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useMemo, useState, useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GlobalHeaderRight } from '@/components/dm/global-header-right';
import { DM } from '@/constants/dm-theme';
import { useAuth } from '@/context/AuthContext'; // On utilise useAuth

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8090';

interface Cocktail {
  id: number;
  slug: string;
  name: string;
  emoji: string;
  thumbClass: string;
  point: number;
  level: number;
  stars: number;
  locked: boolean;
  lockReason?: string;
}

export default function MixodexScreen() {
  const router = useRouter();
  const { userToken } = useAuth(); // Récupération du token
  const [search, setSearch] = useState('');
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);

  useEffect(() => {
    const fetchCocktails = async () => {
      try {
        const response = await fetch(`${API_URL}/cocktails`, {
          headers: { 'Authorization': `Bearer ${userToken}` }
        });
        const data = await response.json();

        console.log("Données reçues :", Object.keys(data._embedded));

        const embedded = data._embedded;
        const key = Object.keys(embedded)[0];
        setCocktails(embedded[key]);

      } catch (error) {
        console.error("Erreur:", error);
      }
    };
    fetchCocktails();
  }, [userToken]);

  const filtered = useMemo(
      () => cocktails.filter((c: any) => c.name.toLowerCase().includes(search.toLowerCase())),
      [cocktails, search],
  );

  const unlockedCount = cocktails.filter((c: any) => !c.locked).length;

  const handleCocktailPress = async (id: string, locked: boolean, slug: string) => {
    if (locked) return;

    try {
      const response = await fetch(`${API_URL}/cocktails/${id}/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        }
      });

      const sessionData = await response.json();

      router.push(`/${slug}` as any);
    } catch (error) {
      console.error("Erreur démarrage:", error);
    }
  };

  return (
      <SafeAreaView style={styles.safe} edges={['top']}>

        <View style={styles.header}>
          <View style={styles.titleGroup}>
            <Text style={styles.title}>Mixodex</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>
                {unlockedCount} / {cocktails.length}
              </Text>
            </View>
          </View>
          <GlobalHeaderRight />
        </View>

        <View style={styles.searchWrap}>
          <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un cocktail..."
              placeholderTextColor={DM.muted}
              value={search}
              onChangeText={setSearch}
          />
        </View>

        <ScrollView contentContainerStyle={styles.grid}>
          {filtered.map((item: any) => (
              <Pressable
                  key={item.content?.id ?? item.id}
                  style={[styles.card, (item.content?.locked ?? item.locked) && styles.cardLocked]}
                  onPress={() => handleCocktailPress(item.content?.id ?? item.id, item.content?.locked ?? item.locked, item.content?.slug ?? item.slug)}
              >
                <View style={styles.thumb}>
                  {item.imageUrl ? (
                      <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
                  ) : (
                      <Text style={styles.emoji}>{item.emoji}</Text>
                  )}

                  {item.locked ? (
                      <View style={styles.lockedOverlay}>
                        <MaterialIcons name="lock" size={28} color="#FFFFFF" />
                      </View>
                  ) : (
                      <View style={styles.stars}>
                        {[1, 2, 3].map((i) => (
                            <MaterialIcons
                                key={i}
                                name={i <= item.stars ? 'star' : 'star-border'}
                                size={12}
                                color={i <= item.stars ? DM.gold : '#FFFFFF'}
                            />
                        ))}
                      </View>
                  )}
                </View>

                <View style={styles.info}>
                  <Text style={[styles.name, item.locked && styles.nameLocked]}>{item.name}</Text>
                  <Text style={styles.meta}>
                    {item.locked
                        ? item.lockReason
                        : `${item.points} pts · Niveau ${item.level}`}
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: DM.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: { fontSize: 22, fontWeight: '700', color: DM.text },
  countBadge: {
    backgroundColor: DM.bg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  countText: { fontSize: 12, fontWeight: '600', color: DM.muted },
  searchWrap: { paddingHorizontal: 15, paddingTop: 15, paddingBottom: 5 },
  searchInput: {
    width: '100%',
    fontSize: 15,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: DM.surface,
    borderRadius: 8,
    color: DM.text,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    padding: 15,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: DM.surface,
    borderRadius: 12,
    overflow: 'hidden',
    width: '47%',
    flexGrow: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardLocked: { opacity: 0.7 },
  thumb: {
    height: 160, 
    width: '100%',
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 40 },
  stars: { 
    position: 'absolute', 
    top: 10, 
    right: 10, 
    flexDirection: 'row', 
    gap: 2,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 10,
  },
  info: { padding: 12 },
  name: { fontSize: 15, fontWeight: '700', color: DM.text, marginBottom: 4 },
  nameLocked: { color: DM.muted },
  meta: { fontSize: 12, color: DM.muted },
});