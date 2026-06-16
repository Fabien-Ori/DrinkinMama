import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { DM } from '@/constants/dm-theme';

// Adresse de votre API Spring Boot pour la création d'utilisateur
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8090/api/v1/auth';

export default function RegisterScreen() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // États pour gérer l'affichage des messages à l'écran
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleRegister = async () => {
        setErrorMessage('');
        setSuccessMessage('');

        if (!username.trim() || !email.trim() || !password.trim()) {
            setErrorMessage("Veuillez remplir tous les champs.");
            return;
        }

        try {
            const cleanUsername = username.trim();
            const cleanEmail = email.trim().toLowerCase();
            const cleanPassword = password.trim();

            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: cleanUsername,
                    email: cleanEmail,
                    password: cleanPassword,
                }),
            });

            if (!response.ok) {
                try {
                    const errorData = await response.json();
                    setErrorMessage(errorData.message || "Impossible de créer le compte. Vérifiez vos informations.");
                } catch {
                    setErrorMessage(`Erreur serveur : Code ${response.status} (${response.statusText})`);
                }
                return;
            }

            setSuccessMessage("Compte créé avec succès !");

            if (Platform.OS === 'web') {
                alert("Votre compte a été créé avec succès ! Redirection vers la page de connexion.");
                router.push('/authentification');
            } else {
                Alert.alert(
                    "Inscription réussie !",
                    "Votre compte Taste Odyssey a bien été créé.",
                    [
                        {
                            text: "Se connecter",
                            onPress: () => router.push('/authentification')
                        }
                    ]
                );
            }

        } catch (error) {
            console.error('Erreur lors de la requête :', error);
            setErrorMessage("Impossible de joindre le serveur. Vérifiez que votre API Spring Boot est lancée.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Créer un compte</Text>
            <Text style={styles.subtitle}>Rejoignez l'aventure Drinking Mama</Text>

            {errorMessage ? (
                <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            {successMessage ? (
                <Text style={styles.successText}>{successMessage}</Text>
            ) : null}

            <TextInput
                style={styles.input}
                placeholder="Nom d'utilisateur"
                autoCapitalize="words"
                value={username}
                onChangeText={setUsername}
            />

            <TextInput
                style={styles.input}
                placeholder="Adresse Email"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>S'inscrire</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.linkButton}
                onPress={() => router.push('/authentification')}
            >
                <Text style={styles.linkText}>
                    Déjà un compte ? <Text style={styles.linkTextBold}>Se connecter</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        alignItems: 'center',
        backgroundColor: DM.bg,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 5,
        color: DM.text,
    },
    subtitle: {
        fontSize: 14,
        color: DM.muted,
        marginBottom: 25,
    },
    errorText: {
        color: DM.danger,
        backgroundColor: '#FDECEB',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
        width: '100%',
        maxWidth: 400,
        textAlign: 'center',
        fontWeight: '500'
    },
    successText: {
        color: DM.success,
        backgroundColor: '#FFF0ED', // Let's use a nice subtle red/rose or custom success bg
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
        width: '100%',
        maxWidth: 400,
        textAlign: 'center',
        fontWeight: '500'
    },
    input: {
        width: '100%',
        maxWidth: 400,
        height: 40,
        borderColor: DM.border,
        backgroundColor: DM.surface,
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
        borderRadius: 8,
        color: DM.text,
    },
    button: {
        backgroundColor: DM.gold,
        padding: 12,
        borderRadius: 8,
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
        marginTop: 5
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    },
    linkButton: {
        marginTop: 20,
        padding: 10,
    },
    linkText: {
        color: DM.muted,
        fontSize: 14,
    },
    linkTextBold: {
        color: DM.gold,
        fontWeight: '600',
        textDecorationLine: 'underline',
    }
});
