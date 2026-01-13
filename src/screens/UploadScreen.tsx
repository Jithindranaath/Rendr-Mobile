import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { UploadManager } from '../upload/manager';

export default function UploadScreen() {
    const [manager, setManager] = useState<UploadManager | null>(null);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('Idle');
    const [fileName, setFileName] = useState<string | null>(null);

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: false,
            });

            if (result.canceled) return;

            const asset = result.assets[0];
            setFileName(asset.name);
            setStatus('Ready to Upload');

            // Initialize Manager
            const newManager = new UploadManager(asset.uri, (p) => {
                setProgress(p);
                if (p >= 1) setStatus('Completed');
            });
            setManager(newManager);
            setProgress(0);

        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Failed to pick file');
        }
    };

    const startUpload = async () => {
        if (!manager) return;
        try {
            setStatus('Uploading...');
            await manager.start();
        } catch (e) {
            console.error(e);
            setStatus('Error');
            Alert.alert('Error', 'Upload failed');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>File Upload</Text>

            <View style={styles.card}>
                <Button title="Select File" onPress={pickDocument} />
                {fileName && <Text style={styles.fileInfo}>Selected: {fileName}</Text>}
            </View>

            {manager && (
                <View style={styles.card}>
                    <Text style={styles.status}>Status: {status}</Text>
                    <Text style={styles.progressText}>{(progress * 100).toFixed(0)}%</Text>

                    <Button
                        title="Start Upload"
                        onPress={startUpload}
                        disabled={status === 'Uploading...'}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, alignItems: 'center', paddingTop: 50 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 30 },
    card: { width: '100%', marginBottom: 20, padding: 15, borderWidth: 1, borderColor: '#eee', borderRadius: 8 },
    fileInfo: { marginTop: 10, fontStyle: 'italic' },
    status: { marginBottom: 5, fontWeight: '600' },
    progressText: { fontSize: 32, fontWeight: 'bold', marginBottom: 15, color: '#007AFF' }
});
