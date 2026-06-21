import { Tabs, Redirect } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { DM } from '@/constants/dm-theme';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { usePlayer } from '@/context/player-context';

export default function TabLayout() {
  const { userToken, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!userToken) {
    return <Redirect href="/authentification" />;
  }

  return (
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: DM.surface,
              borderTopColor: DM.border,
              borderTopWidth: 0.5,
              paddingTop: 8,
              paddingBottom: 10,
              height: 60,
            },
            tabBarActiveTintColor: DM.gold,
            tabBarInactiveTintColor: DM.muted,
            tabBarLabelStyle: { fontSize: 10 },
          }}>
          <Tabs.Screen
            name="index"
            options={{
              title: 'Accueil',
              tabBarIcon: ({ color }) => <MaterialIcons name="home" size={20} color={color} />,
            }}
          />
          <Tabs.Screen
            name="game"
            options={{
              title: 'Jouer',
              tabBarIcon: ({ color }) => <MaterialIcons name="play-arrow" size={20} color={color} />,
            }}
          />
          <Tabs.Screen
            name="mixodex"
            options={{
              title: 'Mixodex',
              tabBarIcon: ({ color }) => <MaterialIcons name="menu-book" size={20} color={color} />,
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Profil',
              tabBarIcon: ({ color }) => <MaterialIcons name="person" size={20} color={color} />,
            }}
          />
          <Tabs.Screen
            name="shop"
            options={{
              title: 'Boutique',
              tabBarIcon: ({ color }) => <MaterialIcons name="shopping-bag" size={20} color={color} />,
            }}
          />
          {/* <Tabs.Screen name="shop" options={{ href: null }} /> */}
          <Tabs.Screen name="leaderboard" options={{ href: null }} />
          <Tabs.Screen name="explore" options={{ href: null }} />
        </Tabs>
  );
}
