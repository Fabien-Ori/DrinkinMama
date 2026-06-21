import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { DM } from '@/constants/dm-theme';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8090/api/v1/auth';

export default function LoginScreen() {
    const router = useRouter();
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleLogin = async () => {
        setErrorMessage('');

        try {
            const cleanUsername = username.trim().toLowerCase();
            const cleanPassword = password.trim();

            const response = await fetch(`${API_URL}/authenticate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: cleanUsername,
                    password: cleanPassword,
                }),
            });

            if (!response.ok) {
                try {
                    const errorData = await response.json();
                    setErrorMessage(errorData.message || "Identifiants incorrects ou utilisateur introuvable.");
                } catch {
                    setErrorMessage("Une erreur est survenue lors de l'authentification.");
                }
                return;
            }

            const data = await response.json();
            console.log('Connexion réussie, Token JWT.');

            await login(data.token);

            setSuccessMessage("Connexion réalisée avec succès !")

            setTimeout(() => {
                router.replace('/');
            }, 600);
        } catch (error) {
            console.error('Erreur lors de la requête :', error);
            setErrorMessage("Impossible de joindre le serveur.");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Se connecter</Text>
                <Text style={styles.subtitle}>Connectez-vous pour continuer</Text>

                {errorMessage ? (
                    <Text style={styles.errorText}>{errorMessage}</Text>
                ) : null}
                {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}


                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Pseudo</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nom d'utilisateur"
                        placeholderTextColor={DM.silver}
                        autoCapitalize="none"
                        value={username}
                        onChangeText={setUsername}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Mot de passe</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="••••••••"
                        placeholderTextColor={DM.silver}
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Se connecter</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.linkButton}
                    onPress={() => router.push('/register')}
                >
                    <Text style={styles.linkText}>
                        Pas de compte ? <Text style={styles.linkTextBold}>Créer un compte</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: DM.bg,
    },
    formContainer: {
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
        backgroundColor: DM.surface,
        padding: 30,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 5,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: DM.text,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: DM.muted,
        marginBottom: 30,
        textAlign: 'center',
    },
    errorText: {
        color: DM.danger,
        backgroundColor: '#FFF0ED',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: '500',
        overflow: 'hidden'
    },
    successText: {
        color: DM.success,
        backgroundColor: '#FFF0ED',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
        maxWidth: 400,
        textAlign: 'center',
        fontWeight: '500',
        overflow: 'hidden'
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: DM.text,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: DM.bg,
        borderWidth: 1,
        borderColor: DM.border,
        paddingHorizontal: 15,
        borderRadius: 8,
        color: DM.text,
        fontSize: 16,
    },
    button: {
        backgroundColor: DM.gold,
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    linkButton: {
        marginTop: 25,
        alignItems: 'center',
    },
    linkText: {
        color: DM.muted,
        fontSize: 14,
    },
    linkTextBold: {
        color: DM.text,
        fontWeight: '700',
        textDecorationLine: 'underline',
    }
});
