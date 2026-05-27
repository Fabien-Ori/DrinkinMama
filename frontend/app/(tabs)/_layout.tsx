import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { Stack } from 'expo-router';

export default function RootLayout() {
    const colorScheme = useColorScheme();

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="explore" options={{ title: 'Explore' }} />
                <Stack.Screen name="authentification" options={{ title: 'Connexion' }} />
                <Stack.Screen name="register" options={{ title: 'Inscription' }} />
            </Stack>
        </ThemeProvider>
    );
}