import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Lock, UploadCloud, ArrowLeft, CheckCircle } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import { UploadScreenProps } from '../navigation/types';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../theme';
import { UploadManager } from '../upload/manager';

export default function UploadScreen({ route, navigation }: UploadScreenProps) {
    const [projectName, setProjectName] = useState(route.params?.projectName || '');
    const [email, setEmail] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'completed' | 'error'>('idle');
    const [fileName, setFileName] = useState('');

    const handleSelectAndUpload = async () => {
        // Validation
        if (!projectName.trim()) {
            Alert.alert('Missing Information', 'Please enter a project name.');
            return;
        }
        if (!email.trim() || !email.includes('@')) {
            Alert.alert('Missing Information', 'Please enter a valid email address.');
            return;
        }

        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'video/*',
            });

            if (result.canceled) return;

            const asset = result.assets[0];
            setFileName(asset.name);

            startUpload(asset.uri);

        } catch (err) {
            console.error('Picker Error', err);
            Alert.alert('Error', 'Failed to pick file.');
        }
    };

    const startUpload = async (fileUri: string) => {
        setIsUploading(true);
        setUploadStatus('uploading');
        setProgress(0);

        try {
            const manager = new UploadManager(
                fileUri,
                { projectName, userEmail: email },
                (prog) => {
                    setProgress(prog);
                }
            );

            await manager.start();

            // Assumption: manager.start() resolves when completed or throws on error
            // Note: manager code implementation handles completion logic internally but start() awaits the loop.
            // Based on provided manager code, start() calls uploadLoop() which awaits completeUpload().

            setUploadStatus('completed');
            setIsUploading(false);
            Alert.alert('Success', 'File uploaded successfully! We will contact you shortly.');

        } catch (error) {
            console.error('Upload Error', error);
            setUploadStatus('error');
            setIsUploading(false);
            Alert.alert('Upload Failed', 'Something went wrong during the upload. Please try again.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} disabled={isUploading} style={styles.backButton}>
                    <ArrowLeft size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Upload Project</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>

                {/* Trust Element */}
                <View style={styles.trustContainer}>
                    <Lock size={16} color={COLORS.textSecondary} />
                    <Text style={styles.trustText}>Secure file-sharing via Google Drive</Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    <Text style={styles.label}>Project Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Summer Vlog 2024"
                        placeholderTextColor={COLORS.textSecondary}
                        value={projectName}
                        onChangeText={setProjectName}
                        editable={!isUploading}
                    />

                    <Text style={styles.label}>Your Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="editor@example.com"
                        placeholderTextColor={COLORS.textSecondary}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={!isUploading}
                    />
                </View>

                {/* Upload Status / Progress */}
                {uploadStatus === 'uploading' && (
                    <View style={styles.progressContainer}>
                        <View style={styles.progressLabelRow}>
                            <Text style={styles.progressText}>Uploading {fileName}...</Text>
                            <Text style={styles.progressPercentage}>{Math.round(progress * 100)}%</Text>
                        </View>
                        <View style={styles.progressBarBackground}>
                            <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
                        </View>
                    </View>
                )}

                {uploadStatus === 'completed' && (
                    <View style={styles.completedContainer}>
                        <CheckCircle size={40} color={COLORS.success} />
                        <Text style={styles.completedText}>Upload Complete!</Text>
                    </View>
                )}

                {/* Action Button */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.uploadButton, isUploading && styles.disabledButton]}
                        onPress={handleSelectAndUpload}
                        disabled={isUploading || uploadStatus === 'completed'}
                    >
                        {isUploading ? (
                            <ActivityIndicator color={COLORS.white} />
                        ) : (
                            <>
                                <UploadCloud size={20} color={COLORS.white} style={{ marginRight: 8 }} />
                                <Text style={styles.uploadButtonText}>
                                    {uploadStatus === 'completed' ? 'Uploaded' : 'Select & Upload Video'}
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.l,
        paddingVertical: SPACING.m,
    },
    backButton: {
        padding: SPACING.xs,
    },
    headerTitle: {
        fontSize: TYPOGRAPHY.size.l,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    content: {
        flex: 1,
        padding: SPACING.l,
    },
    trustContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E2E8F0', // slate-200
        padding: SPACING.s,
        borderRadius: 8,
        marginBottom: SPACING.xl,
    },
    trustText: {
        marginLeft: SPACING.s,
        color: COLORS.textSecondary,
        fontSize: TYPOGRAPHY.size.s,
        fontWeight: '500',
    },
    form: {
        marginBottom: SPACING.xl,
    },
    label: {
        fontSize: TYPOGRAPHY.size.s,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
        marginLeft: 4,
    },
    input: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        padding: SPACING.m,
        fontSize: TYPOGRAPHY.size.m,
        color: COLORS.textPrimary,
        marginBottom: SPACING.m,
    },
    footer: {
        marginTop: 'auto',
        marginBottom: SPACING.l,
    },
    uploadButton: {
        backgroundColor: COLORS.accent,
        borderRadius: 12,
        paddingVertical: SPACING.m,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.medium,
        height: 56,
    },
    disabledButton: {
        opacity: 0.7,
    },
    uploadButtonText: {
        color: COLORS.white,
        fontSize: TYPOGRAPHY.size.m,
        fontWeight: '700',
    },
    // Progress
    progressContainer: {
        marginBottom: SPACING.l,
    },
    progressLabelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.s,
    },
    progressText: {
        fontSize: TYPOGRAPHY.size.s,
        color: COLORS.textPrimary,
    },
    progressPercentage: {
        fontSize: TYPOGRAPHY.size.s,
        fontWeight: '700',
        color: COLORS.accent,
    },
    progressBarBackground: {
        height: 8,
        backgroundColor: COLORS.border,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: COLORS.accent,
        borderRadius: 4,
    },
    completedContainer: {
        alignItems: 'center',
        marginBottom: SPACING.l,
    },
    completedText: {
        marginTop: SPACING.s,
        color: COLORS.success,
        fontWeight: '700',
        fontSize: TYPOGRAPHY.size.m,
    },
});