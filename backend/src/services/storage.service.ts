import fs from 'fs';
import path from 'path';

interface CategoryInfo {
  category: string;
  subcategory: string;
  confidence?: number;
}

interface FileInfo {
  path: string;
  originalName: string;
}

interface OrganizedFile {
  success: boolean;
  originalName: string;
  newPath: string;
  folder: string;
  size: number;
}

interface UserStorageStats {
  totalFiles: number;
  totalSize: number;
  usedGB: number;
  limitGB: number;
  percentUsed: number;
  categories: { [key: string]: number };
}

class StorageService {
  private baseStoragePath: string;
  private readonly STORAGE_LIMIT_GB = 100;
  private readonly STORAGE_LIMIT_BYTES = 100 * 1024 * 1024 * 1024; // 100GB in bytes

  constructor() {
    this.baseStoragePath = path.join(__dirname, '../../storage/users');
    this.ensureStorageStructure();
  }

  /**
   * Ensure base storage directories exist
   */
  private ensureStorageStructure(): void {
    if (!fs.existsSync(this.baseStoragePath)) {
      fs.mkdirSync(this.baseStoragePath, { recursive: true });
      console.log('📁 Created base storage directory:', this.baseStoragePath);
    }
  }

  /**
   * Get user's storage directory
   */
  private getUserStoragePath(userId: string): string {
    return path.join(this.baseStoragePath, userId, 'media');
  }

  /**
   * Create user's storage directory
   */
  private ensureUserStorage(userId: string): void {
    const userPath = this.getUserStoragePath(userId);
    if (!fs.existsSync(userPath)) {
      fs.mkdirSync(userPath, { recursive: true });
      console.log(`👤 Created storage for user: ${userId}`);
    }
  }

  /**
   * Calculate total storage used by user
   */
  private calculateUserStorage(userId: string): number {
    const userPath = this.getUserStoragePath(userId);

    if (!fs.existsSync(userPath)) {
      return 0;
    }

    let totalSize = 0;

    const calculateDirSize = (dirPath: string): void => {
      const items = fs.readdirSync(dirPath);

      items.forEach(item => {
        const itemPath = path.join(dirPath, item);
        const stats = fs.statSync(itemPath);

        if (stats.isDirectory()) {
          calculateDirSize(itemPath);
        } else {
          totalSize += stats.size;
        }
      });
    };

    calculateDirSize(userPath);
    return totalSize;
  }

  /**
   * Check if user has enough storage space
   */
  public checkStorageLimit(userId: string, additionalSize: number): {
    allowed: boolean;
    currentSize: number;
    newSize: number;
    limit: number;
  } {
    const currentSize = this.calculateUserStorage(userId);
    const newSize = currentSize + additionalSize;

    return {
      allowed: newSize <= this.STORAGE_LIMIT_BYTES,
      currentSize,
      newSize,
      limit: this.STORAGE_LIMIT_BYTES
    };
  }

  /**
   * Create category folder structure for user
   */
  private createCategoryFolder(userId: string, category: string, subcategory: string): string {
    const userPath = this.getUserStoragePath(userId);
    const categoryPath = path.join(userPath, category, subcategory);

    if (!fs.existsSync(categoryPath)) {
      fs.mkdirSync(categoryPath, { recursive: true });
      console.log(`📂 Created folder for user ${userId}: ${category}/${subcategory}`);
    }

    return categoryPath;
  }

  /**
   * Organize a single file into user's storage
   */
  public organizeFile(
    userId: string,
    tempFilePath: string,
    originalName: string,
    categoryInfo: CategoryInfo
  ): OrganizedFile {
    try {
      this.ensureUserStorage(userId);

      const { category, subcategory } = categoryInfo;

      // Get file size
      const fileStats = fs.statSync(tempFilePath);
      const fileSize = fileStats.size;

      // Check storage limit
      const storageCheck = this.checkStorageLimit(userId, fileSize);
      if (!storageCheck.allowed) {
        const usedGB = (storageCheck.currentSize / (1024 * 1024 * 1024)).toFixed(2);
        throw new Error(`Storage limit exceeded. You've used ${usedGB}GB of your 100GB limit.`);
      }

      // Create category folder
      const categoryFolder = this.createCategoryFolder(userId, category, subcategory);

      // Generate unique filename
      const ext = path.extname(originalName);
      const baseName = path.basename(originalName, ext);
      const timestamp = Date.now();
      const newFileName = `${baseName}_${timestamp}${ext}`;

      // Move file to organized location
      const newPath = path.join(categoryFolder, newFileName);
      fs.renameSync(tempFilePath, newPath);

      console.log(`✅ User ${userId}: ${originalName} → ${category}/${subcategory}`);

      return {
        success: true,
        originalName,
        newPath,
        folder: `${category}/${subcategory}`,
        size: fileSize
      };
    } catch (error: any) {
      console.error(`❌ Failed to organize ${originalName}:`, error.message);
      return {
        success: false,
        originalName,
        newPath: tempFilePath,
        folder: 'temp',
        size: 0
      };
    }
  }

  /**
   * Organize multiple files for user
   */
  public organizeFiles(
    userId: string,
    files: FileInfo[],
    aiCategories: Array<{
      filename: string;
      category: string;
      subcategory: string;
      confidence?: number;
    }>
  ): OrganizedFile[] {
    const results: OrganizedFile[] = [];

    for (const file of files) {
      const aiCategory = aiCategories.find(
        (c) => c.filename === file.originalName
      );

      if (aiCategory) {
        const result = this.organizeFile(userId, file.path, file.originalName, {
          category: aiCategory.category,
          subcategory: aiCategory.subcategory,
          confidence: aiCategory.confidence
        });
        results.push(result);
      } else {
        const result = this.organizeFile(userId, file.path, file.originalName, {
          category: 'Uncategorized',
          subcategory: 'General'
        });
        results.push(result);
      }
    }

    return results;
  }

  /**
   * Get folder structure for user
   */
  public getFolderStructure(userId: string): any {
    const structure: any = {};
    const userPath = this.getUserStoragePath(userId);

    if (!fs.existsSync(userPath)) {
      return structure;
    }

    const categories = fs.readdirSync(userPath);

    for (const category of categories) {
      const categoryPath = path.join(userPath, category);

      if (fs.statSync(categoryPath).isDirectory()) {
        structure[category] = {};

        const subcategories = fs.readdirSync(categoryPath);

        for (const subcategory of subcategories) {
          const subcategoryPath = path.join(categoryPath, subcategory);

          if (fs.statSync(subcategoryPath).isDirectory()) {
            const files = fs.readdirSync(subcategoryPath);
            structure[category][subcategory] = files.map(file => ({
              name: file,
              path: `${category}/${subcategory}/${file}`,
              size: fs.statSync(path.join(subcategoryPath, file)).size,
              created: fs.statSync(path.join(subcategoryPath, file)).birthtime
            }));
          }
        }
      }
    }

    return structure;
  }

  /**
   * Get storage statistics for user
   */
  public getStorageStats(userId: string): UserStorageStats {
    const userPath = this.getUserStoragePath(userId);

    const stats: UserStorageStats = {
      totalFiles: 0,
      totalSize: 0,
      usedGB: 0,
      limitGB: this.STORAGE_LIMIT_GB,
      percentUsed: 0,
      categories: {}
    };

    if (!fs.existsSync(userPath)) {
      return stats;
    }

    stats.totalSize = this.calculateUserStorage(userId);
    stats.usedGB = stats.totalSize / (1024 * 1024 * 1024);
    stats.percentUsed = (stats.usedGB / this.STORAGE_LIMIT_GB) * 100;

    const categories = fs.readdirSync(userPath);

    for (const category of categories) {
      const categoryPath = path.join(userPath, category);

      if (fs.statSync(categoryPath).isDirectory()) {
        let categoryFileCount = 0;

        const subcategories = fs.readdirSync(categoryPath);

        for (const subcategory of subcategories) {
          const subcategoryPath = path.join(categoryPath, subcategory);

          if (fs.statSync(subcategoryPath).isDirectory()) {
            const files = fs.readdirSync(subcategoryPath);
            categoryFileCount += files.length;
            stats.totalFiles += files.length;
          }
        }

        stats.categories[category] = categoryFileCount;
      }
    }

    return stats;
  }

  /**
   * Get files in a specific category for user
   */
  public getFilesByCategory(userId: string, category: string, subcategory?: string): any[] {
    const files: any[] = [];
    const userPath = this.getUserStoragePath(userId);
    const categoryPath = path.join(userPath, category);

    if (!fs.existsSync(categoryPath)) {
      return files;
    }

    if (subcategory) {
      const subcategoryPath = path.join(categoryPath, subcategory);
      if (fs.existsSync(subcategoryPath)) {
        const fileList = fs.readdirSync(subcategoryPath);
        fileList.forEach(file => {
          files.push({
            name: file,
            path: `${category}/${subcategory}/${file}`,
            fullPath: path.join(subcategoryPath, file)
          });
        });
      }
    } else {
      const subcategories = fs.readdirSync(categoryPath);
      subcategories.forEach(sub => {
        const subcategoryPath = path.join(categoryPath, sub);
        if (fs.statSync(subcategoryPath).isDirectory()) {
          const fileList = fs.readdirSync(subcategoryPath);
          fileList.forEach(file => {
            files.push({
              name: file,
              path: `${category}/${sub}/${file}`,
              fullPath: path.join(subcategoryPath, file)
            });
          });
        }
      });
    }

    return files;
  }

  /**
   * Delete a file from user's storage
   */
  public deleteFile(userId: string, category: string, subcategory: string, filename: string): boolean {
    try {
      const userPath = this.getUserStoragePath(userId);
      const filePath = path.join(userPath, category, subcategory, filename);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`🗑️  User ${userId} deleted: ${category}/${subcategory}/${filename}`);
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('Delete error:', error.message);
      return false;
    }
  }
}

export default new StorageService();
