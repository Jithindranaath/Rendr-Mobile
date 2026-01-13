import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../auth/authContext';

export default function HomeScreen({ navigation }: any) {
    // FIX: Change 'user' to 'session'
    const { signOut, session } = useAuth();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome back!</Text>

            {/* We can display a snippet of the token or just a generic message */}
            <Text style={styles.subtitle}>
                Session Active: {session ? 'Yes' : 'No'}
            </Text>

            <View style={styles.spacer} />

            <Button
                title="Start New Upload"
                onPress={() => navigation.navigate('Upload')}
            />

            <View style={styles.spacer} />

            <Button
                title="Sign Out"
                onPress={signOut}
                color="#ff4444"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30
    },
    spacer: {
        height: 20
    }
});