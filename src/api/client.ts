// src/api/client.ts

// =====================================================================
// PASTE YOUR GOOGLE SCRIPT URL HERE
// It should look like: https://script.google.com/macros/s/.../exec
// =====================================================================
const BACKEND_URL = "https://script.google.com/macros/s/AKfycbzAUYYVg3E2vQJ04K1dIVOJ1m0KCTz0tRNrtxMQBKOdaDC3XQb-kSYokaY0wK45hT59NA/exec";

export const apiClient = {
    fetch: async <T>(endpoint: string, options: any = {}): Promise<T> => {

        // 1. INTERCEPT "INIT" REQUESTS
        // When the app says "I want to start an upload", we redirect that request
        // to your Google Apps Script.
        if (endpoint.includes('/uploads/init')) {
            console.log(`[Client] Connecting to Google Script: ${BACKEND_URL}`);

            const response = await fetch(BACKEND_URL, {
                method: 'POST',
                // Pass the Project Name, Email, and Filename exactly as the Manager sends them
                body: options.body
            });

            const text = await response.text();

            // Safety check: Did Google return an error?
            try {
                const json = JSON.parse(text);
                if (json.error) throw new Error(json.error);
                return json as T; // Returns { uploadId: "...", url: "..." }
            } catch (e) {
                console.error("Script Error:", text);
                throw new Error("Failed to parse Google Script response");
            }
        }

        // 2. INTERCEPT "COMPLETE" REQUESTS
        // We just acknowledge it locally because Google Drive saves the file automatically.
        if (endpoint.includes('/complete')) {
            return { success: true } as unknown as T;
        }

        // Default Fallback
        return {} as T;
    }
};