import React, { useEffect } from 'react';
import { View, Image, Text, StyleSheet, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

const { width } = Dimensions.get('window');
type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {

    // Auto-navigate to Home after 3 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('Home');
        }, 3000);
        return () => clearTimeout(timer);
    }, [navigation]);

    const logoImage = { uri: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=2000&auto=format&fit=crop' };

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image source={logoImage} style={styles.logo} resizeMode="cover" />
            </View>

            {/* Standard Text instead of Animated Text */}
            <View style={styles.textWrapper}>
                <Text style={styles.title}>✨ Rendr Magic</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
    imageContainer: {
        marginBottom: 40, width: 200, height: 200, borderRadius: 40, overflow: 'hidden',
        shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 10,
    },
    logo: { width: '100%', height: '100%' },
    textWrapper: {
        paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#fff', borderRadius: 50,
        borderWidth: 1, borderColor: '#E2E8F0', elevation: 2,
    },
    title: { fontSize: 24, fontWeight: 'bold', color: 'black' }
});