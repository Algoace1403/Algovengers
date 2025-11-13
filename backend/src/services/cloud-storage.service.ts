import { Storage } from '@google-cloud/storage';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

interface UploadResult {
  success: boolean;
  publicUrl?: string;
  fileName?: string;
  error?: string;
}

class CloudStorageService {
  private storage: Storage;
  private bucketName: string;
  private storageType: string;

  constructor() {
    this.storageType = process.env.STORAGE_TYPE || 'local';
    this.bucketName = process.env.GCS_BUCKET_NAME || 'intelligent-storage-bucket';

    if (this.storageType === 'gcs') {
      const keyFilePath = process.env.GCS_KEY_FILE;

      if (!keyFilePath || !fs.existsSync(keyFilePath)) {
        console.warn('⚠️  GCS key file not found. Falling back to local storage.');
        this.storageType = 'local';
      } else {
        this.storage = new Storage({
          projectId: process.env.GCS_PROJECT_ID,
          keyFilename: keyFilePath,
        });
        console.log('☁️  Google Cloud Storage initialized');
      }
    } else {
      console.log('💾 Using local file storage');
    }
  }

  /**
   * Upload file to cloud storage or local storage
   */
  async uploadFile(
    localFilePath: string,
    userId: string,
    category: string,
    subcategory: string,
    originalFileName: string
  ): Promise<UploadResult> {
    try {
      const cloudPath = `users/${userId}/media/${category}/${subcategory}/${originalFileName}`;

      if (this.storageType === 'gcs') {
        // Upload to Google Cloud Storage
        const bucket = this.storage.bucket(this.bucketName);
        const blob = bucket.file(cloudPath);

        await bucket.upload(localFilePath, {
          destination: cloudPath,
          metadata: {
            contentType: this.getContentType(originalFileName),
            metadata: {
              userId,
              category,
              subcategory,
              uploadedAt: new Date().toISOString(),
            },
          },
        });

        // Make file publicly accessible (or use signed URLs for private access)
        // await blob.makePublic();

        const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${cloudPath}`;

        console.log(`☁️  Uploaded to GCS: ${cloudPath}`);

        // Delete local temp file after upload
        if (fs.existsSync(localFilePath)) {
          fs.unlinkSync(localFilePath);
        }

        return {
          success: true,
          publicUrl,
          fileName: originalFileName,
        };
      } else {
        // Local storage (existing behavior)
        return {
          success: true,
          publicUrl: `/storage/users/${userId}/media/${category}/${subcategory}/${originalFileName}`,
          fileName: originalFileName,
        };
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Download file from cloud storage
   */
  async downloadFile(
    userId: string,
    category: string,
    subcategory: string,
    fileName: string
  ): Promise<Buffer | null> {
    try {
      if (this.storageType === 'gcs') {
        const cloudPath = `users/${userId}/media/${category}/${subcategory}/${fileName}`;
        const bucket = this.storage.bucket(this.bucketName);
        const file = bucket.file(cloudPath);

        const [contents] = await file.download();
        console.log(`☁️  Downloaded from GCS: ${cloudPath}`);

        return contents;
      } else {
        // Local storage - return null to use existing local file reading
        return null;
      }
    } catch (error: any) {
      console.error('Download error:', error);
      return null;
    }
  }

  /**
   * Delete file from cloud storage
   */
  async deleteFile(
    userId: string,
    category: string,
    subcategory: string,
    fileName: string
  ): Promise<boolean> {
    try {
      if (this.storageType === 'gcs') {
        const cloudPath = `users/${userId}/media/${category}/${subcategory}/${fileName}`;
        const bucket = this.storage.bucket(this.bucketName);
        const file = bucket.file(cloudPath);

        await file.delete();
        console.log(`☁️  Deleted from GCS: ${cloudPath}`);

        return true;
      } else {
        // Local storage - return false to use existing local file deletion
        return false;
      }
    } catch (error: any) {
      console.error('Delete error:', error);
      return false;
    }
  }

  /**
   * Get file size from cloud storage
   */
  async getFileSize(
    userId: string,
    category: string,
    subcategory: string,
    fileName: string
  ): Promise<number> {
    try {
      if (this.storageType === 'gcs') {
        const cloudPath = `users/${userId}/media/${category}/${subcategory}/${fileName}`;
        const bucket = this.storage.bucket(this.bucketName);
        const file = bucket.file(cloudPath);

        const [metadata] = await file.getMetadata();
        return parseInt(metadata.size || '0', 10);
      }
      return 0;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Calculate total storage used by user in cloud
   */
  async calculateUserStorage(userId: string): Promise<number> {
    try {
      if (this.storageType === 'gcs') {
        const bucket = this.storage.bucket(this.bucketName);
        const prefix = `users/${userId}/media/`;

        const [files] = await bucket.getFiles({ prefix });

        let totalSize = 0;
        for (const file of files) {
          const [metadata] = await file.getMetadata();
          totalSize += parseInt(metadata.size || '0', 10);
        }

        return totalSize;
      }
      return 0;
    } catch (error) {
      console.error('Error calculating user storage:', error);
      return 0;
    }
  }

  /**
   * Get content type from file extension
   */
  private getContentType(fileName: string): string {
    const ext = path.extname(fileName).toLowerCase();
    const contentTypes: { [key: string]: string } = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.mp4': 'video/mp4',
      '.mov': 'video/quicktime',
      '.avi': 'video/x-msvideo',
      '.mkv': 'video/x-matroska',
    };
    return contentTypes[ext] || 'application/octet-stream';
  }

  /**
   * Check if using cloud storage
   */
  isCloudStorage(): boolean {
    return this.storageType === 'gcs';
  }

  /**
   * Get signed URL for private file access (expires after specified time)
   */
  async getSignedUrl(
    userId: string,
    category: string,
    subcategory: string,
    fileName: string,
    expiresInMinutes: number = 60
  ): Promise<string | null> {
    try {
      if (this.storageType === 'gcs') {
        const cloudPath = `users/${userId}/media/${category}/${subcategory}/${fileName}`;
        const bucket = this.storage.bucket(this.bucketName);
        const file = bucket.file(cloudPath);

        const [url] = await file.getSignedUrl({
          version: 'v4',
          action: 'read',
          expires: Date.now() + expiresInMinutes * 60 * 1000,
        });

        return url;
      }
      return null;
    } catch (error: any) {
      console.error('Error generating signed URL:', error);
      return null;
    }
  }
}

export default new CloudStorageService();
