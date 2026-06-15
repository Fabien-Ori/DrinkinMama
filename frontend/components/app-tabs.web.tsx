import { Link } from 'expo-router';
import { useColorScheme, View, StyleSheet, Pressable } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';

export default function AppTabs() {
  return (
      <View style={styles.tabListContainer}>
        <ThemedView type="backgroundElement" style={styles.innerContainer}>
          <ThemedText type="smallBold" style={styles.brandText}>
            Expo Starter
          </ThemedText>

          <Link href="/" asChild>
            <Pressable style={styles.tabButtonView}>
              <ThemedText type="small">Home</ThemedText>
            </Pressable>
          </Link>

          <Link href="/game" asChild>
            <Pressable style={styles.tabButtonView}>
              <ThemedText type="small">Jouer</ThemedText>
            </Pressable>
          </Link>

          <Link href="/authentification" asChild>
            <Pressable style={styles.tabButtonView}>
              <ThemedText type="small">Auth</ThemedText>
            </Pressable>
          </Link>

          <Link href="/register" asChild>
            <Pressable style={styles.tabButtonView}>
              <ThemedText type="small">Register</ThemedText>
            </Pressable>
          </Link>
        </ThemedView>
      </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerContainer: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.five,
    borderRadius: Spacing.five,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    gap: Spacing.two,
    maxWidth: MaxContentWidth,
  },
  brandText: {
    marginRight: 'auto',
  },
  tabButtonView: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
  },
});