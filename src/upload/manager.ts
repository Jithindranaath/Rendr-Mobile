import { uploadStore } from './store';
// CHANGE: specific imports instead of "import * as"
import { getFileStats, calculateChunks, readChunk } from './chunker';
import { apiClient } from '../api/client';
import { UploadStatus, UploadState } from './types';

type ProgressCallback = (progress: number) => void;

export class UploadManager {
    private state: UploadState = {
        fileUri: '',
        fileSize: 0,
        totalChunks: 0,
        currentChunkIndex: 0,
        status: UploadStatus.IDLE,
        uploadId: '',
    };
    private onProgress?: ProgressCallback;

    constructor(fileUri: string, onProgress?: ProgressCallback) {
        this.state.fileUri = fileUri;
        this.onProgress = onProgress;
    }

    async start() {
        try {
            this.state.status = UploadStatus.UPLOADING;

            // DIRECT CALL (No "chunker." prefix)
            const stats = await getFileStats(this.state.fileUri);

            this.state.fileSize = stats.size;
            this.state.totalChunks = calculateChunks(stats.size);

            // Initialize on Backend
            const initResponse = await apiClient.fetch<{ uploadId: string }>('/uploads/init', {
                method: 'POST',
                body: JSON.stringify({ filename: 'upload.dat', fileSize: stats.size }),
            });
            this.state.uploadId = initResponse.uploadId;

            // Check for resume
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
                const { currentChunkIndex, totalChunks, uploadId, fileUri } = this.state;

                // DIRECT CALL
                const chunkDataB64 = await readChunk(fileUri, currentChunkIndex);

                // Get URL
                const { url: signedUrl } = await apiClient.fetch<{ url: string }>(`/uploads/${uploadId}/chunk/${currentChunkIndex + 1}/url`);

                // Upload
                const uploadRes = await fetch(signedUrl, {
                    method: 'PUT',
                    body: chunkDataB64,
                });

                if (!uploadRes.ok) throw new Error(`Status ${uploadRes.status}`);

                // Save Progress
                const nextIndex = currentChunkIndex + 1;
                await uploadStore.saveProgress(uploadId, nextIndex);
                this.state.currentChunkIndex = nextIndex;

                if (this.onProgress) this.onProgress(nextIndex / totalChunks);

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