import AsyncStorage from '@react-native-async-storage/async-storage';

const UPLOAD_PREFIX = 'rendr_upload_progress_';

export const uploadStore = {
    /**
     * Saves the index of the next chunk to be uploaded.
     * @param uploadId Unique ID for the file upload (e.g. hash or server ID)
     * @param chunkIndex The index of the next chunk
     */
    async saveProgress(uploadId: string, chunkIndex: number): Promise<void> {
        try {
            await AsyncStorage.setItem(`${UPLOAD_PREFIX}${uploadId}`, chunkIndex.toString());
        } catch (e) {
            console.warn('Failed to save upload progress', e);
        }
    },

    /**
     * Retrieves the stored chunk index for an upload.
     * Returns 0 if no progress is found.
     */
    async getProgress(uploadId: string): Promise<number> {
        try {
            const val = await AsyncStorage.getItem(`${UPLOAD_PREFIX}${uploadId}`);
            return val ? parseInt(val, 10) : 0;
        } catch (e) {
            console.warn('Failed to get upload progress', e);
            return 0;
        }
    },

    /**
     * Clears the progress for an upload (e.g. on completion or cancellation).
     */
    async removeProgress(uploadId: string): Promise<void> {
        try {
            await AsyncStorage.removeItem(`${UPLOAD_PREFIX}${uploadId}`);
        } catch (e) {
            console.warn('Failed to remove upload progress', e);
        }
    }
};
