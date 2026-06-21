import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CoinsBadge } from '@/components/dm/coins-badge';
import { DM } from '@/constants/dm-theme';
import { ShopItem } from '@/constants/mock-data';
import { usePlayer } from '@/context/player-context';
import { GlobalHeaderRight } from '@/components/dm/global-header-right';

type ShopTab = ShopItem['category'];

const TABS: { id: ShopTab; label: string }[] = [
  { id: 'ingredients', label: 'Ingrédients' },
  { id: 'recipes', label: 'Recettes' },
  { id: 'utensils', label: 'Ustensiles' },
];

export default function ShopScreen() {
  const router = useRouter();
  const { shopItems, buyItem } = usePlayer();
  const [activeTab, setActiveTab] = useState<ShopTab>('ingredients');

  const items = shopItems.filter((item) => item.category === activeTab);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={22} color={DM.text} />
        </Pressable>
        <Text style={styles.title}>Boutique</Text>
        <CoinsBadge />
        <GlobalHeaderRight />
      </View>

      <View style={styles.tabs}>
        {TABS.map((tab) => (
          <Pressable
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.tabActive]}
            onPress={() => setActiveTab(tab.id)}>
            <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.items}>
        {items.length === 0 ? (
          <Text style={styles.empty}>Aucun article dans cette catégorie.</Text>
        ) : (
          items.map((item) => (
            <View key={item.id} style={styles.item}>
              <View style={[styles.thumb, { backgroundColor: item.thumbBg }]}>
                <Text style={styles.emoji}>{item.emoji}</Text>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDesc}>{item.description}</Text>
              </View>
              <Pressable
                style={[styles.priceBtn, item.owned && styles.priceOwned]}
                onPress={() => !item.owned && buyItem(item.id)}
                disabled={item.owned}>
                {item.owned ? (
                  <>
                    <MaterialIcons name="check" size={12} color={DM.tealLight} />
                    <Text style={styles.priceOwnedText}>Acquis</Text>
                  </>
                ) : (
                  <>
                    <MaterialIcons name="monetization-on" size={12} color={DM.gold} />
                    <Text style={styles.priceText}>{item.price}</Text>
                  </>
                )}
              </Pressable>
            </View>
          ))
        )}
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
  tabs: { flexDirection: 'row', gap: 6, paddingHorizontal: 12, paddingTop: 10 },
  tab: {
    flex: 1,
    backgroundColor: DM.surface,
    borderWidth: 0.5,
    borderColor: DM.border,
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: 'center',
  },
  tabActive: { borderColor: DM.gold, backgroundColor: DM.goldDark },
  tabText: { fontSize: 10, color: DM.muted },
  tabTextActive: { color: DM.goldLight },
  items: { padding: 12, gap: 8, paddingBottom: 24 },
  empty: { color: DM.muted, textAlign: 'center', padding: 24 },
  item: {
    backgroundColor: DM.surface,
    borderWidth: 0.5,
    borderColor: DM.border,
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  thumb: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 22 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 13, fontWeight: '500', color: DM.text },
  itemDesc: { fontSize: 10, color: DM.muted, marginTop: 1 },
  priceBtn: {
    backgroundColor: DM.goldDark,
    borderWidth: 0.5,
    borderColor: DM.gold,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  priceText: { fontSize: 12, fontWeight: '500', color: DM.goldLight },
  priceOwned: { backgroundColor: DM.tealDark, borderColor: DM.tealLight },
  priceOwnedText: { fontSize: 12, color: DM.tealLight },
});
