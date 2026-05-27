import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';

export function Collapsible({ children, title }: { children: React.ReactNode; title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: isOpen ? withTiming('auto') : withTiming(0),
      opacity: isOpen ? withTiming(1) : withTiming(0),
      overflow: 'hidden',
    };
  });

  return (
      <ThemedView style={styles.container}>
        <TouchableOpacity
            style={styles.heading}
            onPress={() => setIsOpen((value) => !value)}
            activeOpacity={0.8}>
          <ThemedText type="smallBold">{title}</ThemedText>
          <ThemedText style={{ color: theme.textSecondary }}>
            {isOpen ? '▼' : '▶'}
          </ThemedText>
        </TouchableOpacity>
        <Animated.View style={animatedStyle}>
          <View style={styles.content}>{children}</View>
        </Animated.View>
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    overflow: 'hidden',
    marginBottom: 8,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  content: {
    padding: 12,
    paddingTop: 0,
  },
});