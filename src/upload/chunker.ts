import * as FileSystem from 'expo-file-system';

// 5MB Chunks
export const CHUNK_SIZE = 5 * 1024 * 1024;

export const getFileStats = async (uri: string) => {
    const info = await FileSystem.getInfoAsync(uri);

    if (!info.exists) {
        throw new Error('File does not exist');
    }

    return { size: info.size, exists: true };
};

export const calculateChunks = (totalSize: number): number => {
    if (!totalSize || totalSize === 0) return 0;
    return Math.ceil(totalSize / CHUNK_SIZE);
};

export const readChunk = async (
    uri: string,
    chunkIndex: number
): Promise<string> => {
    const start = chunkIndex * CHUNK_SIZE;

    // We calculate length based on chunk size
    return await FileSystem.readAsStringAsync(uri, {
        encoding: 'base64',
        position: start,
        length: CHUNK_SIZE,
    });
};