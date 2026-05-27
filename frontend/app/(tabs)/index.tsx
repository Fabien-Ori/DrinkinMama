import { StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router'; // Utilisation du hook de navigation directe

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

export default function HomeScreen() {
  const router = useRouter();

  const handlePress = () => {
    // Force la navigation directe vers la page d'authentification
    router.push('/authentification');
  };

  return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>

          {/* Bouton épuré avec action de navigation directe */}
          <Pressable
              onPress={handlePress}
              style={({ pressed }) => [styles.loginButton, pressed && styles.pressed]}
          >
            <ThemedText style={styles.loginButtonText}>
              Se connecter / S'inscrire
            </ThemedText>
          </Pressable>

        </SafeAreaView>
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    justifyContent: 'center', // Centre le bouton verticalement
    alignItems: 'center',     // Centre le bouton horizontalement
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset,
  },
  loginButton: {
    backgroundColor: '#007AFF', // Fond bleu identique à votre page d'authentification
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.three,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    // Ombre portée légère
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    color: '#ffffff', // Écriture en blanc visible sur le fond de bouton bleu !
    fontWeight: 'bold',
    fontSize: 16,
  },
  pressed: {
    opacity: 0.8,
  },
});