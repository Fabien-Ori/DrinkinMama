import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { DM } from '@/constants/dm-theme';

// Adresse de votre API Spring Boot
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8090/api/v1/auth';

export default function RegisterScreen() {
    const router = useRouter();
    const { login } = useAuth();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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

            const data = await response.json();
            await login(data.token);

            setSuccessMessage("Compte créé avec succès !");

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
                <Text style={styles.title}>Créer un compte</Text>
                <Text style={styles.subtitle}>Rejoignez l'aventure Taste Odyssey</Text>

                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
                {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Pseudo</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nom d'utilisateur"
                        placeholderTextColor={DM.muted}
                        autoCapitalize="words"
                        value={username}
                        onChangeText={setUsername}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Adresse Email"
                        placeholderTextColor={DM.muted}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Mot de passe</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Mot de passe"
                        placeholderTextColor={DM.muted}
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>

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
