import React, { useState } from 'react';
import { View, Button, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../auth/authContext';

export default function LoginScreen() {
    const [loading, setLoading] = useState(false);

    // 1. Get the signIn function from our context
    const { signIn } = useAuth();

    const handleLogin = async () => {
        setLoading(true);
        try {
            // 2. ONLY call signIn. 
            // DO NOT call navigation.navigate('Home')
            // DO NOT call navigation.replace('Home')
            await signIn();

            console.log("Sign in triggered. RootNavigator should now switch to Home.");

        } catch (error) {
            console.error("Login Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Rendr v0</Text>
            {loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <Button title="Login (Dev Mode)" onPress={handleLogin} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 24, marginBottom: 20, fontWeight: 'bold' }
});