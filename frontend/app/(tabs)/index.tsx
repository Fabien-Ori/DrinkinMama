import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GlobalHeaderRight } from '@/components/dm/global-header-right';
import { DM } from '@/constants/dm-theme';
import { usePlayer } from '@/context/player-context';

export default function HomeScreen() {
  const router = useRouter();
  
  // NOUVEAU : On importe "cocktails" (la liste complète) au lieu de l'ancien dailyCocktail fixe
  const { player, cocktails, startGame } = usePlayer();

  // NOUVEAU : Calcul automatique du cocktail du jour basé sur la date
  const cocktailDuJour = useMemo(() => {
    if (!cocktails || cocktails.length === 0) return null;
    
    // Calcule le nombre de jours écoulés depuis le 1er janvier 1970
    const daysSinceEpoch = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    
    // Le modulo (%) permet de boucler sur la liste des cocktails de manière cyclique
    const index = daysSinceEpoch % cocktails.length;
    return cocktails[index];
  }, [cocktails]);



  const handlePlay = () => {
    if (cocktailDuJour) {
      startGame(cocktailDuJour.id);
      router.push('/game');
    }
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
          <GlobalHeaderRight />
        </View>

        <View style={styles.hero}>
          {/* NOUVEAU DESIGN : Affichage de l'image du cocktail */}
          <View style={styles.heroImageContainer}>
            {cocktailDuJour?.imageUrl ? (
              <Image 
                source={{ uri: cocktailDuJour.imageUrl }} 
                style={styles.heroImage} 
                resizeMode="cover" 
              />
            ) : (
              <Text style={styles.heroEmoji}>{cocktailDuJour?.emoji}</Text>
            )}
          </View>
          
          <Text style={styles.heroTitle}>Cocktail du jour</Text>
          <Text style={styles.heroSub}>
            {cocktailDuJour?.name} — Niveau {cocktailDuJour?.level}
          </Text>
          
          <Pressable style={({ pressed }) => [styles.playBtn, pressed && styles.pressed]} onPress={handlePlay}>
            <MaterialIcons name="play-arrow" size={16} color="#FFFFFF" />
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
  
  /* NOUVEAUX STYLES POUR L'IMAGE DU COCKTAIL DU JOUR */
  heroImageContainer: {
    width: 90,
    height: 90,
    borderRadius: 45, // Rend l'image parfaitement ronde
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: DM.goldDark,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroEmoji: {
    fontSize: 40,
  },
  /* FIN DES NOUVEAUX STYLES */

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
  playBtnText: { fontSize: 14, fontWeight: '500', color: '#FFFFFF' },
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