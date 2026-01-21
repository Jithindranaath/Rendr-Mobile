import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert, TextInput } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
// We use the legacy import to match your other files and avoid deprecation errors
import * as FileSystem from 'expo-file-system/legacy';
import { UploadManager } from '../upload/manager';

export default function UploadScreen() {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('Idle');
    const [isUploading, setIsUploading] = useState(false);

    // NEW: Inputs for Folder Security
    const [projectName, setProjectName] = useState('');
    const [email, setEmail] = useState('');

    const pickFile = async () => {
        try {
            // 1. Pick the file
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*', // Allow all file types
                copyToCacheDirectory: false, // We will handle copying manually for control
            });

            if (result.canceled) return;

            const asset = result.assets[0];
            let fileUri = asset.uri;

            console.log('Original URI:', fileUri);

            // ============================================================
            // ANDROID FIX: Sanitize the URI
            // ============================================================
            if (fileUri.startsWith('content://')) {
                setStatus('Preparing file...');
                const fileName = asset.name || 'temp-upload';
                const newPath = FileSystem.cacheDirectory + fileName;

                await FileSystem.copyAsync({
                    from: fileUri,
                    to: newPath
                });

                fileUri = newPath;
                console.log('Sanitized URI:', fileUri);
            }

            // 2. Start the Upload
            startUpload(fileUri);

        } catch (err) {
            console.error('File Pick Error:', err);
            Alert.alert('Error', 'Failed to pick or prepare file.');
        }
    };

    const startUpload = async (uri: string) => {
        setIsUploading(true);
        setStatus('Initializing...');
        setProgress(0);

        // Initialize the Manager with Config (Project Name & Email)
        const manager = new UploadManager(
            uri,
            {
                projectName: projectName,
                userEmail: email
            },
            (prog) => {
                // Update UI on progress
                setProgress(Math.round(prog * 100));
                setStatus(prog === 1 ? 'Completed!' : 'Uploading...');
            }
        );

        try {
            await manager.start();
        } catch (error) {
            Alert.alert('Upload Failed', 'Check console for details');
            setStatus('Failed');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Upload File</Text>

            <View style={styles.card}>

                {/* Project Name Input */}
                <Text style={styles.label}>Project Name:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. Nike Commercial"
                    value={projectName}
                    onChangeText={setProjectName}
                />

                {/* Email Input */}
                <Text style={styles.label}>Editor Email (for access):</Text>
                <TextInput
                    style={styles.input}
                    placeholder="editor@gmail.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <View style={styles.spacer} />

                <Text style={styles.status}>Status: {status}</Text>

                {isUploading && (
                    <View style={styles.progressContainer}>
                        <ActivityIndicator size="small" color="#0000ff" />
                        <Text style={styles.percent}>{progress}%</Text>
                    </View>
                )}

                <View style={styles.spacer} />

                <Button
                    title={isUploading ? "Uploading..." : "Select & Upload"}
                    onPress={pickFile}
                    // Disable if inputs are empty or currently uploading
                    disabled={!projectName || !email || isUploading}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#f5f5f5' },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    card: { backgroundColor: 'white', padding: 20, borderRadius: 10, elevation: 3 },
    status: { fontSize: 16, marginBottom: 10, textAlign: 'center', color: '#666' },
    progressContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
    percent: { marginLeft: 10, fontSize: 18, fontWeight: 'bold' },
    spacer: { height: 10 },
    // NEW Styles for Inputs
    label: { fontWeight: 'bold', marginTop: 10, marginBottom: 5, color: '#333' },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
        marginBottom: 5
    },
});