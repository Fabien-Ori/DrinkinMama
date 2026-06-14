import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CoinsBadge } from '@/components/dm/coins-badge';
import { DM } from '@/constants/dm-theme';
import { usePlayer } from '@/contexts/player-context';

export default function HomeScreen() {
  const router = useRouter();
  const { player, dailyCocktail, startGame } = usePlayer();

  const handlePlay = () => {
    startGame(dailyCocktail.id);
    router.push('/game');
  };

  const quickActions = [
    { label: 'Mixodex', icon: 'menu-book' as const, route: '/mixodex' },
    { label: 'Boutique', icon: 'shopping-bag' as const, route: '/shop' },
    { label: 'Classement', icon: 'leaderboard' as const, route: '/leaderboard' },
    { label: 'Profil', icon: 'person' as const, route: '/profile' },
  ];

  const stats = [
    { label: 'Rang', value: player.rank, icon: 'emoji-events' as const, color: DM.purple, bg: DM.purpleDark },
    {
      label: 'Mixodex',
      value: `${player.mixodexUnlocked} / ${player.mixodexTotal}`,
      icon: 'menu-book' as const,
      color: DM.tealLight,
      bg: DM.tealDark,
    },
    { label: 'Série', value: `${player.streak} j.`, icon: 'whatshot' as const, color: DM.coral, bg: DM.coralDark },
    { label: 'Niveau', value: String(player.level), icon: 'star' as const, color: DM.gold, bg: DM.goldDark },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>🍹 Drinking Mama</Text>
          <CoinsBadge />
        </View>

        <View style={styles.hero}>
          <View style={styles.heroCocktail}>
            <View style={styles.heroGlass}>
              <View style={styles.heroLiquid} />
              <View style={styles.heroStraw} />
            </View>
          </View>
          <Text style={styles.heroTitle}>Cocktail du jour</Text>
          <Text style={styles.heroSub}>
            {dailyCocktail.name} — Niveau {dailyCocktail.level}
          </Text>
          <Pressable style={({ pressed }) => [styles.playBtn, pressed && styles.pressed]} onPress={handlePlay}>
            <MaterialIcons name="play-arrow" size={16} color="#1a1000" />
            <Text style={styles.playBtnText}>Jouer maintenant</Text>
          </Pressable>
        </View>

        <View style={styles.statsGrid}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: stat.bg }]}>
                <MaterialIcons name={stat.icon} size={16} color={stat.color} />
              </View>
              <View>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text style={styles.statVal}>{stat.value}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Accès rapide</Text>
        <View style={styles.quickActions}>
          {quickActions.map((action) => (
            <Pressable
              key={action.label}
              style={({ pressed }) => [styles.qaBtn, pressed && styles.pressed]}
              onPress={() => router.push(action.route as '/mixodex')}>
              <MaterialIcons name={action.icon} size={20} color={DM.gold} />
              <Text style={styles.qaText}>{action.label}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: DM.bg },
  scroll: { flex: 1 },
  content: { paddingBottom: 24 },
  header: {
    backgroundColor: DM.surface,
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: DM.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: { fontSize: 16, fontWeight: '500', color: DM.gold, letterSpacing: 0.5 },
  hero: {
    backgroundColor: DM.surface,
    margin: 12,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: DM.border,
    padding: 16,
    alignItems: 'center',
  },
  heroCocktail: { marginBottom: 8 },
  heroGlass: {
    width: 40,
    height: 60,
    backgroundColor: 'rgba(93, 202, 165, 0.15)',
    borderWidth: 1.5,
    borderColor: DM.tealLight,
    borderRadius: 4,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  heroLiquid: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    backgroundColor: 'rgba(212, 83, 126, 0.5)',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  heroStraw: {
    position: 'absolute',
    right: 6,
    top: -15,
    width: 3,
    height: 40,
    backgroundColor: DM.gold,
    borderRadius: 2,
    transform: [{ rotate: '10deg' }],
  },
  heroTitle: { fontSize: 15, fontWeight: '500', color: DM.text },
  heroSub: { fontSize: 12, color: DM.muted, marginTop: 2 },
  playBtn: {
    backgroundColor: DM.gold,
    borderRadius: 12,
    paddingVertical: 10,
    width: '100%',
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  playBtnText: { fontSize: 14, fontWeight: '500', color: '#1a1000' },
  pressed: { opacity: 0.8 },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginHorizontal: 12,
    marginBottom: 12,
  },
  statCard: {
    backgroundColor: DM.surface,
    borderWidth: 0.5,
    borderColor: DM.border,
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '48%',
    flexGrow: 1,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: { fontSize: 10, color: DM.muted },
  statVal: { fontSize: 15, fontWeight: '500', color: DM.text },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: DM.muted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginHorizontal: 12,
    marginBottom: 8,
  },
  quickActions: { flexDirection: 'row', gap: 8, paddingHorizontal: 12 },
  qaBtn: {
    flex: 1,
    backgroundColor: DM.surface,
    borderWidth: 0.5,
    borderColor: DM.border,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  qaText: { fontSize: 11, color: DM.text, marginTop: 4 },
});
