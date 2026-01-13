import { supabase } from '../lib/supabase';
import { API_BASE_URL } from '../config/constants';

interface ApiOptions extends RequestInit {
    authenticated?: boolean; // Default true
}

export const apiClient = {
    async fetch<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
        const { authenticated = true, headers: customHeaders, ...rest } = options;

        // Prepare headers
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...(customHeaders || {}),
        };

        if (authenticated) {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            if (token) {
                (headers as any)['Authorization'] = `Bearer ${token}`;
            }
        }

        const url = `${API_BASE_URL}${endpoint}`;

        try {
            const response = await fetch(url, {
                ...rest,
                headers,
            });

            if (!response.ok) {
                // Create a custom error or just throw
                const errorBody = await response.text();
                throw new Error(`API Error ${response.status}: ${errorBody || response.statusText}`);
            }

            // Check if response has content
            const text = await response.text();
            return (text ? JSON.parse(text) : {}) as T;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }
};
