import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { DM } from '@/constants/dm-theme';
import {AuthProvider} from "@/context/AuthContext";

export const unstable_settings = {
  anchor: '(tabs)',
};

const DrinkingMamaTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: DM.gold,
    background: DM.bg,
    card: DM.surface,
    text: DM.text,
    border: DM.border,
  },
};

export default function RootLayout() {
  return (
      <AuthProvider>
          <ThemeProvider value={DrinkingMamaTheme}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="authentification" options={{ headerShown: false }} />
              <Stack.Screen name="register" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
            <StatusBar style="dark" />
          </ThemeProvider>
      </AuthProvider>
  );
}
