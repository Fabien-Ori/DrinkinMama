import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { DM } from '@/constants/dm-theme';
import { usePlayer } from '@/contexts/player-context';

// Adresse de votre API Spring Boot
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8090/api/v1/auth';

export default function LoginScreen() {
    const router = useRouter();
    const { login } = usePlayer();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // État pour stocker et afficher l'erreur visuelle sur l'écran
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async () => {
        // Réinitialisation de l'erreur à chaque nouvelle tentative
        setErrorMessage('');

        try {
            // .trim() supprime les espaces invisibles en début/fin
            // .toLowerCase() évite les conflits avec les majuscules automatiques des claviers
            const cleanEmail = email.trim().toLowerCase();
            const cleanPassword = password.trim();

            const response = await fetch(`${API_URL}/authenticate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: cleanEmail,
                    password: cleanPassword,
                }),
            });

            // Si le serveur Spring Boot renvoie une erreur (Ex: code 403, 404, etc.)
            if (!response.ok) {
                try {
                    const errorData = await response.json();
                    setErrorMessage(errorData.message || "Identifiants incorrects ou utilisateur introuvable.");
                } catch {
                    setErrorMessage("Une erreur est survenue lors de l'authentification.");
                }
                return;
            }

            // Si la réponse est OK (Status 200), on récupère le JSON contenant le token JWT
            const data = await response.json();
            console.log('Connexion réussie, Token JWT :', data.token);

            // Connexion dans le contexte global (charge aussi le profil)
            await login(data.token);

            // GESTION DE L'ALERTE DE SUCCÈS COMPATIBLE WEB ET MOBILE
            if (Platform.OS === 'web') {
                // Alerte classique pour navigateur web
                alert("Connexion Réussie ! Votre Token JWT a bien été généré par l'API.");
                // Redirection immédiate vers la page explore
                router.push('/explore');
            } else {
                // Boîte de dialogue native pour iOS / Android
                Alert.alert(
                    "Connexion Réussie !",
                    "Votre Token JWT a bien été généré par l'API.",
                    [
                        {
                            text: "Super, redirection !",
                            onPress: () => {
                                router.push('/explore');
                            }
                        }
                    ]
                );
            }

        } catch (error) {
            console.error('Erreur lors de la requête :', error);
            // Erreur déclenchée si le serveur Spring Boot est éteint ou inaccessible
            setErrorMessage("Impossible de joindre le serveur. Vérifiez que votre API Spring Boot est lancée.");
        }
    };

   return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Drinking Mama</Text>
                <Text style={styles.subtitle}>Prêt(e) à shaker ? Connectez-vous.</Text>

                {errorMessage ? (
                    <Text style={styles.errorText}>{errorMessage}</Text>
                ) : null}

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Adresse e-mail</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="hello@exemple.com"
                        placeholderTextColor={DM.silver}
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
                        Nouveau ici ? <Text style={styles.linkTextBold}>Créer un compte</Text>
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
        backgroundColor: DM.bg, // Utilise maintenant le blanc cassé chic
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