import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';

import { DM } from '@/constants/dm-theme';
import { GlobalHeaderRight } from '@/components/dm/global-header-right';
import { useAuth } from '@/context/AuthContext';

interface LeaderboardPlayer {
  rank: number;
  initials: string;
  name: string;
  score: number;
  isMe?: boolean;
  avatarBg?: string;
  avatarColor?: string;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8090';

export default function LeaderboardScreen() {
  const router = useRouter();

  const { userToken, isLoading } = useAuth();

  const [usersList, setUsersList] = useState<LeaderboardPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;

    const fetchLeaderboardData = async () => {
      try {
        let currentUser: any = null;

        if (userToken) {
          const meResponse = await fetch(`${API_URL}/users/me`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${userToken}`,
              'Content-Type': 'application/json'
            },
          });
          if (meResponse.ok) {
            currentUser = await meResponse.json();
          }
        }

        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };
        if (userToken) {
          headers['Authorization'] = `Bearer ${userToken}`;
        }

        const response = await fetch(`${API_URL}/users`, { headers });
        if (response.ok) {
          const data = await response.json();
          const userResponses = data._embedded?.userResponses || data || [];

          const sorted = userResponses
              .map((u: any) => {
                const isCurrentUser = currentUser && (u.email === currentUser.email || u.id === currentUser.id);

                const effectiveScore = (u.score && u.score > 0) ? u.score : (u.coins ?? 0);

                const initials = isCurrentUser && currentUser.initials
                    ? currentUser.initials
                    : (u.username ? u.username.slice(0, 2).toUpperCase() : 'JD');

                const name = isCurrentUser && currentUser.username
                    ? currentUser.username
                    : (u.username || 'Joueur');

                return {
                  rank: 0,
                  initials,
                  name,
                  score: effectiveScore,
                  isMe: isCurrentUser,
                  avatarBg: isCurrentUser ? DM.purpleDark : '#1a0d1e',
                  avatarColor: isCurrentUser ? DM.purple : '#cd7f32',
                };
              })
              .sort((a: any, b: any) => b.score - a.score)
              .map((u: any, idx: number) => ({ ...u, rank: idx + 1 }));

          setUsersList(sorted);
        }
      } catch (err) {
        console.error('Error fetching users for leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [userToken, isLoading]);

  const podiumList = usersList.slice(0, 3);
  const podiumSlots: LeaderboardPlayer[] = [];

  // 2ème Place
  if (podiumList.length > 1) {
    podiumSlots.push(podiumList[1]);
  } else {
    podiumSlots.push({ rank: 2, initials: '-', name: 'Aucun', score: 0 });
  }

  // 1ère Place
  if (podiumList.length > 0) {
    podiumSlots.push(podiumList[0]);
  } else {
    podiumSlots.push({ rank: 1, initials: '-', name: 'Aucun', score: 0 });
  }

  // 3ème Place
  if (podiumList.length > 2) {
    podiumSlots.push(podiumList[2]);
  } else {
    podiumSlots.push({ rank: 3, initials: '-', name: 'Aucun', score: 0 });
  }

  const listItems = usersList.slice(3);

  const meEntry = usersList.find((p) => p.isMe);
  const nextRankPlayer = meEntry ? usersList.find((p) => p.rank === meEntry.rank - 1) : null;
  const pointsToNext = nextRankPlayer && meEntry ? nextRankPlayer.score - meEntry.score : 0;

  return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={8} style={styles.backBtn}>
            <MaterialIcons name="arrow-back" size={22} color={DM.text} />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.title}>Classement</Text>
            <Text style={styles.period}>Joueurs connectés</Text>
          </View>
          <View style={styles.backBtn} />
          <GlobalHeaderRight />
        </View>

        {loading || isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={DM.gold} />
              <Text style={styles.loadingText}>Chargement du classement...</Text>
            </View>
        ) : (
            <ScrollView contentContainerStyle={styles.content}>
              <View style={styles.podium}>
                {podiumSlots.map((slot, index) => {
                  const barHeights = [36, 52, 28];
                  const barColors = [DM.silver, DM.gold, DM.bronze];
                  const scoreColors = ['silver', 'gold', 'bronze'] as const;
                  const isFirst = slot.rank === 1;

                  return (
                      <View key={index} style={styles.podiumSlot}>
                        <View
                            style={[
                              styles.podiumAvatar,
                              isFirst && styles.podiumAvatarFirst,
                              {
                                borderColor: barColors[index],
                                backgroundColor: index === 0 ? '#FFFFFF' : index === 1 ? DM.goldDark : '#FBF8F1',
                              },
                            ]}>
                          <Text style={[styles.podiumInitials, { color: barColors[index] }]}>{slot.initials}</Text>
                        </View>
                        <Text style={styles.podiumName}>{slot.name}</Text>
                        <View
                            style={[
                              styles.podiumBar,
                              { height: barHeights[index], borderColor: barColors[index], backgroundColor: `${barColors[index]}22` },
                            ]}
                        />
                        <Text
                            style={[
                              styles.barScore,
                              scoreColors[index] === 'gold' && { color: DM.gold },
                              scoreColors[index] === 'silver' && { color: DM.silver },
                              scoreColors[index] === 'bronze' && { color: DM.bronze },
                            ]}>
                          {slot.score.toLocaleString('fr-FR')} pts
                        </Text>
                      </View>
                  );
                })}
              </View>

              <View style={styles.list}>
                {listItems.map((entry) => (
                    <View key={entry.rank} style={[styles.row, entry.isMe && styles.rowMe]}>
                      <Text style={[styles.rank, entry.isMe && { color: DM.purple }]}>{entry.rank}</Text>
                      <View
                          style={[
                            styles.playerAvatar,
                            entry.avatarBg && { backgroundColor: entry.avatarBg },
                          ]}>
                        <Text style={[styles.playerInitials, entry.avatarColor && { color: entry.avatarColor }]}>
                          {entry.initials}
                        </Text>
                      </View>
                      <Text style={[styles.playerName, entry.isMe && { color: DM.purple }]}>
                        {entry.name}
                        {entry.isMe && <Text style={styles.meTag}> Vous</Text>}
                      </Text>
                      <View style={styles.scoreCol}>
                        <Text style={[styles.playerScore, entry.isMe && { color: DM.purple }]}>
                          {entry.score.toLocaleString('fr-FR')}
                        </Text>
                        <Text style={styles.playerPts}>pts</Text>
                      </View>
                    </View>
                ))}
              </View>

              {meEntry && nextRankPlayer ? (
                  <View style={styles.nextRankCard}>
                    <View>
                      <Text style={styles.nextRankLabel}>Pour passer au rang</Text>
                      <Text style={styles.nextRankName}>#{nextRankPlayer.rank} — {nextRankPlayer.name}</Text>
                    </View>
                    <View style={styles.nextRankRight}>
                      <Text style={styles.nextRankPts}>+{pointsToNext} pts</Text>
                      <Text style={styles.nextRankSub}>à gagner</Text>
                    </View>
                  </View>
              ) : null}
            </ScrollView>
        )}
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
  },
  backBtn: { width: 32 },
  headerCenter: { flex: 1, alignItems: 'center' },
  title: { fontSize: 15, fontWeight: '500', color: DM.text },
  period: { fontSize: 11, color: DM.muted, marginTop: 1 },
  content: { paddingBottom: 24 },
  podium: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  podiumSlot: { alignItems: 'center' },
  podiumAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  podiumAvatarFirst: { width: 44, height: 44, borderRadius: 22 },
  podiumInitials: { fontSize: 13, fontWeight: '500' },
  podiumName: { fontSize: 9, color: DM.muted },
  podiumBar: {
    width: 44,
    borderRadius: 6,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 0.5,
    marginTop: 4,
  },
  barScore: { fontSize: 9, marginTop: 3 },
  list: { paddingHorizontal: 12, paddingTop: 8, gap: 6 },
  row: {
    backgroundColor: DM.surface,
    borderWidth: 0.5,
    borderColor: DM.border,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowMe: { borderColor: DM.purple, backgroundColor: DM.purpleBg },
  rank: { fontSize: 12, fontWeight: '500', color: DM.muted, minWidth: 20 },
  playerAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: DM.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerInitials: { fontSize: 11, fontWeight: '500', color: DM.text },
  playerName: { flex: 1, fontSize: 12, color: DM.text },
  meTag: {
    fontSize: 8,
    backgroundColor: DM.purple,
    color: '#fff',
    borderRadius: 4,
    overflow: 'hidden',
  },
  scoreCol: { alignItems: 'flex-end' },
  playerScore: { fontSize: 12, color: DM.gold, fontWeight: '500' },
  playerPts: { fontSize: 9, color: DM.muted },
  nextRankCard: {
    marginHorizontal: 12,
    marginTop: 8,
    backgroundColor: DM.surface,
    borderWidth: 0.5,
    borderColor: DM.border,
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nextRankLabel: { fontSize: 11, color: DM.muted },
  nextRankName: { fontSize: 13, fontWeight: '500', color: DM.text },
  nextRankRight: { alignItems: 'flex-end' },
  nextRankPts: { fontSize: 13, color: DM.gold, fontWeight: '500' },
  nextRankSub: { fontSize: 10, color: DM.muted },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, paddingVertical: 100 },
  loadingText: { fontSize: 13, color: DM.muted },
});