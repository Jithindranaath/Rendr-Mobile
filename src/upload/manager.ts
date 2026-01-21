import { uploadStore } from './store';
import { getFileStats, calculateChunks, readChunk, CHUNK_SIZE } from './chunker';
import { apiClient } from '../api/client';
import { UploadStatus, UploadState } from './types';
import { Buffer } from 'buffer'; // We use Buffer for reliable conversion

export interface UploadConfig {
    projectName: string;
    userEmail: string;
}

type ProgressCallback = (progress: number) => void;

export class UploadManager {
    private state: UploadState & { resumableUrl?: string } = {
        fileUri: '',
        fileSize: 0,
        totalChunks: 0,
        currentChunkIndex: 0,
        status: UploadStatus.IDLE,
        uploadId: '',
        resumableUrl: '',
    };

    private config: UploadConfig;
    private onProgress?: ProgressCallback;

    constructor(fileUri: string, config: UploadConfig, onProgress?: ProgressCallback) {
        this.state.fileUri = fileUri;
        this.config = config;
        this.onProgress = onProgress;
    }

    async start() {
        try {
            this.state.status = UploadStatus.UPLOADING;
            const stats = await getFileStats(this.state.fileUri);
            this.state.fileSize = stats.size;
            this.state.totalChunks = calculateChunks(stats.size);

            // Init Request
            const initResponse = await apiClient.fetch<{ uploadId: string, url: string }>('/uploads/init', {
                method: 'POST',
                body: JSON.stringify({
                    filename: 'mobile_upload.mp4',
                    fileSize: stats.size,
                    projectName: this.config.projectName,
                    userEmail: this.config.userEmail
                }),
            });

            this.state.uploadId = initResponse.uploadId;
            this.state.resumableUrl = initResponse.url;

            const savedIndex = await uploadStore.getProgress(this.state.uploadId);
            if (savedIndex > 0 && savedIndex < this.state.totalChunks) {
                console.log(`Resuming from chunk ${savedIndex}`);
                this.state.currentChunkIndex = savedIndex;
            }

            await this.uploadLoop();

        } catch (error) {
            console.error('Upload start failed:', error);
            this.state.status = UploadStatus.ERROR;
        }
    }

    private async uploadLoop() {
        while (this.state.currentChunkIndex < this.state.totalChunks) {
            if (this.state.status === UploadStatus.PAUSED) return;

            try {
                const { currentChunkIndex, fileSize, fileUri } = this.state;
                const signedUrl = this.state.resumableUrl;

                if (!signedUrl) throw new Error("Missing upload URL");

                // 1. Read as Base64 String
                const chunkBase64 = await readChunk(fileUri, currentChunkIndex);

                // 2. CONVERT Base64 String -> Binary Array (Uint8Array)
                // This fixes the "400 Bad Request" size mismatch
                const chunkBinary = Buffer.from(chunkBase64, 'base64');

                // 3. Calculate Byte Range
                const startByte = currentChunkIndex * CHUNK_SIZE;
                // Important: The end byte is based on the ACTUAL binary size we just converted
                const actualChunkSize = chunkBinary.length;
                const endByte = startByte + actualChunkSize - 1;

                // 4. Upload Binary Data
                const uploadRes = await fetch(signedUrl, {
                    method: 'PUT',
                    body: chunkBinary, // Send the binary, not the string
                    headers: {
                        'Content-Range': `bytes ${startByte}-${endByte}/${fileSize}`,
                        'Content-Type': 'application/octet-stream'
                    }
                });

                if (uploadRes.status !== 308 && uploadRes.status !== 200 && uploadRes.status !== 201) {
                    // Log the error text from Google for debugging
                    const text = await uploadRes.text();
                    console.error(`Google Drive Error Body: ${text}`);
                    throw new Error(`Google Drive Status ${uploadRes.status}`);
                }

                const nextIndex = currentChunkIndex + 1;
                await uploadStore.saveProgress(this.state.uploadId, nextIndex);
                this.state.currentChunkIndex = nextIndex;

                if (this.onProgress) this.onProgress(nextIndex / this.state.totalChunks);

            } catch (error) {
                console.error(`Chunk error:`, error);
                this.state.status = UploadStatus.PAUSED;
                return;
            }
        }
        await this.completeUpload();
    }

    private async completeUpload() {
        try {
            await apiClient.fetch(`/uploads/${this.state.uploadId}/complete`, { method: 'POST' });
            await uploadStore.removeProgress(this.state.uploadId);
            this.state.status = UploadStatus.COMPLETED;
            if (this.onProgress) this.onProgress(1);
        } catch (e) {
            this.state.status = UploadStatus.ERROR;
        }
    }

    pause() { this.state.status = UploadStatus.PAUSED; }
    resume() {
        if (this.state.status === UploadStatus.PAUSED || this.state.status === UploadStatus.ERROR) {
            this.state.status = UploadStatus.UPLOADING;
            this.uploadLoop();
        }
    }
}