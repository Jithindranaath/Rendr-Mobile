import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { CircleCheck, ChevronRight } from 'lucide-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

// Dummy Data for Editors
const CREATORS = [
    {
        id: '1',
        name: 'Alex Rivera',
        bio: 'Specialist in high-energy vlog edits and travel content.',
        image: { uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' },
        verified: true,
        tags: ['Vlogs', 'Travel']
    },
    {
        id: '2',
        name: 'Sarah Chen',
        bio: 'Cinematic color grading and documentary storytelling.',
        image: { uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop' },
        verified: true,
        tags: ['Cinema', 'Color']
    },
];

export default function HomeScreen({ navigation }: Props) {
    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.logo}>Rendr</Text>
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                <Text style={styles.sectionTitle}>Choose an Editor</Text>

                <FlatList
                    data={CREATORS}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => navigation.navigate('CreatorProfile', item)}
                        >
                            <Image source={item.image} style={styles.avatar} />
                            <View style={styles.cardInfo}>
                                <View style={styles.nameRow}>
                                    <Text style={styles.name}>{item.name}</Text>
                                    {item.verified && <CircleCheck size={16} color="#C8A96A" />}
                                </View>
                                <Text style={styles.tags}>{item.tags.join(' • ')}</Text>
                            </View>
                            <ChevronRight size={24} color="#94A3B8" />
                        </TouchableOpacity>
                    )}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    header: { padding: 20, backgroundColor: '#0F172A' },
    logo: { fontSize: 24, fontWeight: 'bold', color: '#C8A96A' },
    content: { flex: 1, padding: 20 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#0F172A', marginBottom: 16 },
    card: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 16, borderRadius: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
    avatar: { width: 56, height: 56, borderRadius: 28, marginRight: 16 },
    cardInfo: { flex: 1 },
    nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
    name: { fontSize: 16, fontWeight: 'bold', color: '#0F172A' },
    tags: { fontSize: 13, color: '#64748B' },
});