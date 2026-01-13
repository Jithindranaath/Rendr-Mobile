// This script imports all key modules to ensure dependencies are installed and paths are correct.
// It is intended to be run or compiled to check for missing packages.

import { apiClient } from './api/client';
import { supabase } from './lib/supabase';
import { AuthProvider, useAuth } from './auth/authContext';
import { tokenStorage } from './auth/tokenStorage';
import { API_BASE_URL, SUPABASE_URL } from './config/constants';
import * as chunker from './upload/chunker';
import { UploadManager } from './upload/manager';
import { uploadStore } from './upload/store';
import { UploadStatus } from './upload/types';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import UploadScreen from './screens/UploadScreen';
import RootNavigator from './navigation/RootNavigator';

async function verify() {
    console.log('🔍 Starting Project Verification...');

    const checks = [
        { name: 'API Client', value: apiClient },
        { name: 'Supabase Client', value: supabase },
        { name: 'Auth Provider', value: AuthProvider },
        { name: 'Token Storage', value: tokenStorage },
        { name: 'Config Constants', value: API_BASE_URL },
        { name: 'Upload Chunker', value: chunker },
        { name: 'Upload Manager', value: UploadManager },
        { name: 'Upload Store', value: uploadStore },
        { name: 'Upload Enum', value: UploadStatus },
        { name: 'Login Screen', value: LoginScreen },
        { name: 'Home Screen', value: HomeScreen },
        { name: 'Upload Screen', value: UploadScreen },
        { name: 'Root Navigator', value: RootNavigator },
    ];

    let missing = 0;
    checks.forEach(check => {
        if (!check.value) {
            console.error(`❌ Missing or failed import: ${check.name}`);
            missing++;
        } else {
            console.log(`✅ ${check.name} imported successfully.`);
        }
    });

    if (missing === 0) {
        console.log('\n✨ All modules verified. Dependencies look good!');
    } else {
        console.error(`\n⚠️ Found ${missing} issues.`);
    }
}

// Check for Critical Dependencies explicitly
try {
    require('expo-file-system');
    console.log('✅ expo-file-system installed');
    require('expo-secure-store');
    console.log('✅ expo-secure-store installed');
    require('@supabase/supabase-js');
    console.log('✅ @supabase/supabase-js installed');
    require('@react-native-async-storage/async-storage');
    console.log('✅ @react-native-async-storage/async-storage installed');
} catch (e: any) {
    console.error('❌ Missing critical node dependency:', e.message);
}

verify();
