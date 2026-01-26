import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

import HomeScreen from '../screens/HomeScreen';
import CreatorProfileScreen from '../screens/CreatorProfileScreen';
import UploadScreen from '../screens/UploadScreen';
// 1. Import the new Welcome Screen
import WelcomeScreen from '../screens/WelcomeScreen';
import { COLORS } from '../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
    return (
        <Stack.Navigator
            // 2. Set Welcome as the starting screen
            initialRouteName="Home"
            screenOptions={{
                headerShown: false, // We are implementing custom headers in screens
                contentStyle: { backgroundColor: COLORS.background },
                animation: 'slide_from_right',
            }}
        >
            {/* 3. Add the Welcome Screen to the stack */}
            <Stack.Screen name="Welcome" component={WelcomeScreen} />

            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="CreatorProfile" component={CreatorProfileScreen} />
            <Stack.Screen name="Upload" component={UploadScreen} />
        </Stack.Navigator>
    );
}