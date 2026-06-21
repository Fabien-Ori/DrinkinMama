import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { DM } from '@/constants/dm-theme';

import { usePlayer } from '@/context/player-context';
import { GlobalHeaderRight } from '@/components/dm/global-header-right';

export default function ProfileScreen() {
  const { player, activities, user, logout, badges } = usePlayer();
  const router = useRouter();
  const xpPercent = (player.xp / player.xpMax) * 100;

  const stats = [
    { label: 'Pièces', value: player.coins.toLocaleString('fr-FR'), icon: 'monetization-on' as const, color: DM.gold },
    { label: 'Cocktails réalisés', value: String(player.cocktailsCompleted), icon: 'menu-book' as const, color: DM.tealLight },
    { label: 'Rang global', value: player.globalRank, icon: 'emoji-events' as const, color: DM.purple },
    { label: 'Série actuelle', value: `${player.streak} j.`, icon: 'whatshot' as const, color: DM.coral },
  ];

  const handleLogout = () => {
    logout();
    router.push('/authentification');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        {user ? (
          <>
            <View style={styles.header}>
              <View style={styles.avatarRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{player.initials}</Text>
                </View>
                <View>
                  <Text style={styles.name}>{user.username}</Text>
                  <Text style={styles.emailText}>{user.email}</Text>
                  <View style={styles.rankBadge}>
                    <MaterialIcons name="military-tech" size={12} color={DM.gold} />
                    <Text style={styles.rankText}>{player.rankTitle}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.xpWrap}>
                <View style={styles.xpLabel}>
                  <Text style={styles.xpMuted}>XP Niveau {player.level}</Text>
                  <Text style={styles.xpMuted}>
                    {player.xp.toLocaleString('fr-FR')} / {player.xpMax.toLocaleString('fr-FR')}
                  </Text>
                </View>
                <View style={styles.xpTrack}>
                  <View style={[styles.xpFill, { width: `${xpPercent}%` as `${number}%` }]} />
                </View>
              </View>
              <GlobalHeaderRight />
            </View>

            {user.biography ? (
              <View style={styles.bioSection}>
                <Text style={styles.sectionTitle}>Biographie</Text>
                <View style={styles.bioCard}>
                  <Text style={styles.bioText}>{user.biography}</Text>
                </View>
              </View>
            ) : null}

            <View style={styles.statsGrid}>
              {stats.map((stat) => (
                <View key={stat.label} style={styles.profileStat}>
                  <MaterialIcons name={stat.icon} size={16} color={stat.color} style={styles.psIcon} />
                  <Text style={styles.psVal}>{stat.value}</Text>
                  <Text style={styles.psLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>

            <View style={styles.badgesSection}>
              <Text style={styles.sectionTitle}>Badges</Text>
              <View style={styles.badgesRow}>
                {badges.map((badge) => (
                  <View key={badge.id} style={[styles.badgeItem, badge.earned && styles.badgeEarned]}>
                    <MaterialIcons
                      name={badge.icon as 'star'}
                      size={20}
                      color={badge.earned ? DM.gold : DM.muted}
                    />
                    <Text style={[styles.badgeLabel, badge.earned && styles.badgeLabelEarned]}>
                      {badge.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.activitySection}>
              <Text style={styles.sectionTitle}>Activité récente</Text>
              {activities.map((activity) => (
                <View key={activity.id} style={styles.activityRow}>
                  <MaterialIcons
                    name={activity.type === 'success' ? 'check-circle' : 'shopping-bag'}
                    size={14}
                    color={activity.type === 'success' ? DM.success : DM.tealLight}
                  />
                  <Text style={styles.activityLabel}>{activity.label}</Text>
                  <Text
                    style={[
                      styles.activityPts,
                      { color: activity.points >= 0 ? DM.gold : DM.danger },
                    ]}>
                    {activity.points >= 0 ? '+' : ''}
                    {activity.points} pts
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.actionSection}>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <MaterialIcons name="logout" size={16} color="white" />
                <Text style={styles.logoutButtonText}>Se déconnecter</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.unauthenticatedContainer}>
            <MaterialIcons name="account-circle" size={80} color={DM.muted} />
            <Text style={styles.unauthTitle}>Vous n'êtes pas connecté</Text>
            <Text style={styles.unauthSubtitle}>
              Connectez-vous à votre compte Drinking Mama pour suivre votre progression et voir vos badges.
            </Text>
            <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/authentification')}>
              <Text style={styles.loginButtonText}>Se connecter / S'inscrire</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: DM.bg },
  content: { paddingBottom: 24 },
  header: {
    backgroundColor: DM.surface,
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: DM.border,
  },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: DM.purpleDark,
    borderWidth: 2,
    borderColor: DM.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 20, fontWeight: '500', color: DM.purple },
  name: { fontSize: 16, fontWeight: '500', color: DM.text },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: DM.goldDark,
    borderWidth: 0.5,
    borderColor: DM.gold,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 2,
    alignSelf: 'flex-start',
  },
  rankText: { fontSize: 11, color: DM.goldLight },
  xpWrap: { marginTop: 8 },
  xpLabel: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  xpMuted: { fontSize: 10, color: DM.muted },
  xpTrack: {
    backgroundColor: DM.card,
    borderRadius: 4,
    height: 6,
    borderWidth: 0.5,
    borderColor: DM.border,
    overflow: 'hidden',
  },
  xpFill: { backgroundColor: DM.purple, height: '100%', borderRadius: 4 },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 12,
  },
  profileStat: {
    backgroundColor: DM.surface,
    borderWidth: 0.5,
    borderColor: DM.border,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    width: '48%',
    flexGrow: 1,
  },
  psIcon: { marginBottom: 4 },
  psVal: { fontSize: 22, fontWeight: '500', color: DM.text },
  psLabel: { fontSize: 10, color: DM.muted, marginTop: 2, textAlign: 'center' },
  badgesSection: { paddingHorizontal: 12, paddingBottom: 12 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: DM.muted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  badgesRow: { flexDirection: 'row', gap: 8 },
  badgeItem: {
    flex: 1,
    backgroundColor: DM.surface,
    borderWidth: 0.5,
    borderColor: DM.border,
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
  },
  badgeEarned: { borderColor: DM.gold },
  badgeLabel: { fontSize: 9, color: DM.muted, marginTop: 3, textAlign: 'center' },
  badgeLabelEarned: { color: DM.goldLight },
  activitySection: { paddingHorizontal: 12 },
  activityRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 5 },
  activityLabel: { flex: 1, fontSize: 11, color: DM.muted },
  activityPts: { fontSize: 11, fontWeight: '500' },
  emailText: { fontSize: 12, color: DM.muted, marginTop: 2 },
  bioSection: { paddingHorizontal: 12, marginTop: 16 },
  bioCard: {
    backgroundColor: DM.surface,
    borderWidth: 0.5,
    borderColor: DM.border,
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
  },
  bioText: { fontSize: 13, color: DM.text, lineHeight: 18 },
  actionSection: { padding: 12, marginTop: 20, alignItems: 'center' },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: DM.danger || '#E74C3C',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    justifyContent: 'center',
  },
  logoutButtonText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  unauthenticatedContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unauthTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: DM.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  unauthSubtitle: {
    fontSize: 14,
    color: DM.muted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: DM.gold,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
  },
  loginButtonText: { color: 'white', fontWeight: 'bold', fontSize: 15 },
});
