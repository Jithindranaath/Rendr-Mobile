import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { CircleCheck, Lock } from 'lucide-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'CreatorProfile'>;

export default function CreatorProfileScreen({ route, navigation }: Props) {
    // Now TypeScript knows these exist!
    const { name, image, bio, verified } = route.params;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Hero Section */}
                <View style={styles.header}>
                    <Image source={typeof image === 'string' ? { uri: image } : image} style={styles.profileImage} />
                    <View style={styles.nameRow}>
                        <Text style={styles.name}>{name}</Text>
                        {verified && <CircleCheck size={20} color="#C8A96A" fill="transparent" />}
                    </View>
                    <Text style={styles.bio}>{bio}</Text>
                </View>

                {/* Portfolio / Sample Works */}
                <Text style={styles.sectionTitle}>Recent Work</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.portfolioScroll}>
                    {[1, 2, 3].map((i) => (
                        <View key={i} style={styles.portfolioItem} />
                    ))}
                </ScrollView>

            </ScrollView>

            {/* Sticky Bottom Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.ctaButton}
                    onPress={() => navigation.navigate('Upload', { projectName: `${name}'s Project` })}
                >
                    <Text style={styles.ctaText}>Submit Project</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    scrollContent: { paddingBottom: 100 },
    header: { alignItems: 'center', padding: 24, backgroundColor: 'white', borderBottomWidth: 1, borderColor: '#E2E8F0' },
    profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 16 },
    nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
    name: { fontSize: 24, fontWeight: 'bold', color: '#0F172A' },
    bio: { textAlign: 'center', color: '#64748B', lineHeight: 22 },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: '#0F172A', marginLeft: 20, marginTop: 24, marginBottom: 12 },
    portfolioScroll: { paddingLeft: 20 },
    portfolioItem: { width: 160, height: 220, backgroundColor: '#E2E8F0', borderRadius: 12, marginRight: 16 },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: 'white', borderTopWidth: 1, borderColor: '#E2E8F0' },
    ctaButton: { backgroundColor: '#C8A96A', padding: 16, borderRadius: 12, alignItems: 'center' },
    ctaText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});