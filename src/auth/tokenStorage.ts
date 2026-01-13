import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// "Windows Fix": Ensure no encryption errors occur on simulators or incompatible environments.
// We wrap SecureStore calls in try/catch and check platform.
// Note: SecureStore doesn't work on 'web' or sometimes gives issues in dev clients on Windows if not configured.

const isSecureStoreAvailable = Platform.OS !== 'web';

export const tokenStorage = {
    async getItem(key: string): Promise<string | null> {
        if (!isSecureStoreAvailable) return null;
        try {
            return await SecureStore.getItemAsync(key);
        } catch (error) {
            console.warn('SecureStore.getItem error:', error);
            // Fallback or return null to force re-login
            return null;
        }
    },

    async setItem(key: string, value: string): Promise<void> {
        if (!isSecureStoreAvailable) return;
        try {
            await SecureStore.setItemAsync(key, value);
        } catch (error) {
            console.warn('SecureStore.setItem error:', error);
        }
    },

    async removeItem(key: string): Promise<void> {
        if (!isSecureStoreAvailable) return;
        try {
            await SecureStore.deleteItemAsync(key);
        } catch (error) {
            console.warn('SecureStore.removeItem error:', error);
        }
    },
};
