export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Default to local development URL if not provided.
// Adjust '192.168.1.X' to your machine's local IP address.
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.2:3000';

export const CHUNK_SIZE = 50 * 1024 * 1024; // 50MB
