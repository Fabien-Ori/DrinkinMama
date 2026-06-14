import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { DM } from '@/constants/dm-theme';

// Adresse de votre API Spring Boot
const API_URL = 'http://localhost:8090/api/v1/auth';

export default function LoginScreen() {
    const router = useRouter();
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
            <Text style={styles.title}>Drinking Mama</Text>
            <Text style={styles.subtitle}>Connectez-vous à votre compte</Text>

            {/* Affichage du bandeau d'erreur rouge uniquement si errorMessage contient du texte */}
            {errorMessage ? (
                <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            <TextInput
                style={styles.input}
                placeholder="Email"
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

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Se connecter</Text>
            </TouchableOpacity>

            {/* NOUVEAU : Bouton format lien pour créer un compte */}
            <TouchableOpacity
                style={styles.linkButton}
                onPress={() => router.push('/register')}
            >
                <Text style={styles.linkText}>
                    Pas de compte ? <Text style={styles.linkTextBold}>Créer un compte</Text>
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
        fontSize: 24,
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
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    // Styles pour le bouton format lien
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
        textDecorationLine: 'underline', // Donne l'effet souligné d'un lien web
    }
});