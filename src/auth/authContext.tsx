import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

type AuthContextType = {
    session: string | null;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// This hook lets any component access the auth state
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for token when app starts
        SecureStore.getItemAsync('session').then((token) => {
            setSession(token);
            setIsLoading(false);
        });
    }, []);

    const signIn = async () => {
        const MOCK_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
        await SecureStore.setItemAsync('session', MOCK_JWT);
        setSession(MOCK_JWT); // This triggers the screen switch!
    };

    const signOut = async () => {
        await SecureStore.deleteItemAsync('session');
        setSession(null); // This triggers the switch back to Login!
    };

    return (
        <AuthContext.Provider value={{ session, signIn, signOut, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};