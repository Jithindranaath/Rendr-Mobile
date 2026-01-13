export enum UploadStatus {
    IDLE = 'IDLE',
    UPLOADING = 'UPLOADING',
    PAUSED = 'PAUSED',
    COMPLETED = 'COMPLETED',
    ERROR = 'ERROR',
}

export interface UploadChunk {
    index: number;
    start: number;
    end: number;
    uploaded: boolean;
}

export interface UploadState {
    fileUri: string;
    fileSize: number;
    totalChunks: number;
    currentChunkIndex: number;
    status: UploadStatus;
    uploadId: string; // Unique identifier for the upload valid for the backend
    signedUrl?: string; // If using a single signed URL or we fetch per chunk
}
