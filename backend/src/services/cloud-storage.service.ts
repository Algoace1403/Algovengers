// Google Cloud Storage disabled - no external API calls allowed
// import { Storage } from '@google-cloud/storage';
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
  private storage: any;
  private bucketName: string;
  private storageType: string;

  constructor() {
    // Force local storage only - Google Cloud Storage disabled for hackathon compliance
    this.storageType = 'local';
    this.bucketName = process.env.GCS_BUCKET_NAME || 'intelligent-storage-bucket';
    console.log('💾 Using local file storage (Google Cloud Storage disabled)');
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
      // Local storage only - Google Cloud Storage disabled
      return {
        success: true,
        publicUrl: `/storage/users/${userId}/media/${category}/${subcategory}/${originalFileName}`,
        fileName: originalFileName,
      };
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
    // Local storage only - return null to use existing local file reading
    return null;
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
    // Local storage only - return false to use existing local file deletion
    return false;
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
    // Local storage only
    return 0;
  }

  /**
   * Calculate total storage used by user in cloud
   */
  async calculateUserStorage(userId: string): Promise<number> {
    // Local storage only
    return 0;
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
    // Local storage only - no signed URLs needed
    return null;
  }
}

export default new CloudStorageService();
