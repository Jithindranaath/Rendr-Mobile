import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../auth/authContext';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import UploadScreen from '../screens/UploadScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    const { session, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <Stack.Navigator>
            {session ? (
                // CASE A: User IS logged in (Only these screens exist)
                <>
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="Upload" component={UploadScreen} />
                </>
            ) : (
                // CASE B: User is NOT logged in (Only Login exists)
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />
            )}
        </Stack.Navigator>
    );
}