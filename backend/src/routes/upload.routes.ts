
import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import archiver from 'archiver';
import storageService from '../services/storage.service';
import jsonAnalyzer from '../services/json-analyzer.service';
import analyticsService from '../services/analytics.service';
import { authMiddleware } from '../middleware/auth.middleware';
import { getUserById } from '../controllers/auth.controller';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../storage/temp');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max
  },
  fileFilter: (req, file, cb) => {
    // Allow all file types - AI will categorize them
    cb(null, true);
  }
});

// Upload endpoint with AI categorization (PROTECTED)
router.post('/', authMiddleware, upload.array('files', 10), async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const files = req.files as Express.Multer.File[];
    const aiCategories = req.body.aiCategories ? JSON.parse(req.body.aiCategories) : [];
    const metadata = req.body.metadata ? JSON.parse(req.body.metadata) : {};

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Get user subscription tier
    const user = await getUserById(userId);
    const tier = user?.subscription?.tier || 'free';

    // Check storage limit
    const totalSize = files.reduce((sum, f) => sum + f.size, 0);
    const storageCheck = storageService.checkStorageLimit(userId, totalSize, tier);

    if (!storageCheck.allowed) {
      const usedGB = (storageCheck.currentSize / (1024 * 1024 * 1024)).toFixed(2);
      const limitGB = tier === 'premium' ? 500 : 100;
      return res.status(413).json({
        error: `Storage limit exceeded! You've used ${usedGB}GB of your ${limitGB}GB limit.`,
        currentSize: storageCheck.currentSize,
        limit: storageCheck.limit
      });
    }

    console.log(`📥 User ${userId} (${tier.toUpperCase()}): Received ${files.length} files`);

    // Organize files using storage service
    const filesInfo = files.map(f => ({
      path: f.path,
      originalName: f.originalname
    }));

    const organized = storageService.organizeFiles(userId, filesInfo, aiCategories, tier);

    console.log(`✅ User ${userId}: Organized ${organized.length} files`);

    // Track analytics events for each upload
    for (const org of organized) {
      if (org.success) {
        const categoryParts = org.folder.split('/');
        await analyticsService.trackEvent(userId, 'upload', {
          category: categoryParts[0],
          subcategory: categoryParts[1],
          fileSize: org.size,
        });
      }
    }

    // Get updated storage stats
    const stats = storageService.getStorageStats(userId, tier);

    res.json({
      success: true,
      message: `${files.length} file(s) uploaded and organized successfully!`,
      files: organized.map((org: any, i: number) => ({
        originalName: org.originalName,
        folder: org.folder,
        size: org.size,
        type: files[i].mimetype,
        aiCategory: aiCategories.find((c: any) => c.filename === org.originalName)
      })),
      metadata,
      storage: {
        usedGB: stats.usedGB.toFixed(2),
        limitGB: stats.limitGB,
        percentUsed: stats.percentUsed.toFixed(1)
      }
    });

  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Upload failed' });
  }
});

// JSON upload endpoint
router.post('/json', async (req: Request, res: Response) => {
    try {
      const { json, metadata } = req.body;

      if (!json) {
        return res.status(400).json({ error: 'No JSON data provided' });
      }

      // Parse JSON
      const data = typeof json === 'string' ? JSON.parse(json) : json;

      // Import the analyzer

      // Analyze with AI
      const analysis = jsonAnalyzer.analyzeJSON(data);

      console.log('📊 JSON Analysis Complete:', {
        recommendation: analysis.recommendation,
        confidence: analysis.confidence,
        depth: analysis.structure.depth
      });

      res.json({
        success: true,
        message: `JSON analyzed! Recommendation: ${analysis.recommendation}`,
        analysis: {
          recommendation: analysis.recommendation,
          confidence: analysis.confidence,
          reasons: analysis.reasons,
          structure: analysis.structure
        },
        dataType: Array.isArray(data) ? 'array' : typeof data,
        recordCount: Array.isArray(data) ? data.length : 1,
        metadata,
      });

    } catch (error: any) {
      console.error('JSON upload error:', error);
      res.status(500).json({ error: error.message || 'JSON processing failed' });
    }
  });


// Get folder structure endpoint (PROTECTED)
router.get('/structure', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;

    // Get user subscription tier
    const user = await getUserById(userId);
    const tier = user?.subscription?.tier || 'free';

    const structure = storageService.getFolderStructure(userId);
    const stats = storageService.getStorageStats(userId, tier);

    res.json({
      success: true,
      structure,
      stats
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Download file endpoint (PROTECTED)
router.get('/download/:category/:subcategory/:filename', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const { category, subcategory, filename } = req.params;

    // Sanitize inputs to prevent path traversal
    const sanitizedCategory = path.basename(category);
    const sanitizedSubcategory = path.basename(subcategory);
    const sanitizedFilename = path.basename(filename);

    const userStoragePath = path.resolve(__dirname, '../../storage/users', userId, 'media');
    const filePath = path.resolve(userStoragePath, sanitizedCategory, sanitizedSubcategory, sanitizedFilename);

    // Security check: ensure file is within user's directory
    if (!filePath.startsWith(userStoragePath)) {
      console.warn(`⚠️  Path traversal attempt by user ${userId}: ${filePath}`);
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    console.log(`📥 User ${userId} downloading: ${sanitizedCategory}/${sanitizedSubcategory}/${sanitizedFilename}`);

    // Track download event
    await analyticsService.trackEvent(userId, 'download', {
      category: sanitizedCategory,
      subcategory: sanitizedSubcategory,
    });

    res.download(filePath, sanitizedFilename);

  } catch (error: any) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Download failed' });
  }
});

// Delete file endpoint (PROTECTED)
router.delete('/delete/:category/:subcategory/:filename', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const { category, subcategory, filename } = req.params;

    // Get user subscription tier
    const user = await getUserById(userId);
    const tier = user?.subscription?.tier || 'free';

    const success = storageService.deleteFile(userId, category, subcategory, filename);

    if (success) {
      // Track delete event
      await analyticsService.trackEvent(userId, 'delete', {
        category,
        subcategory,
      });

      const stats = storageService.getStorageStats(userId, tier);
      res.json({
        success: true,
        message: 'File deleted successfully',
        stats
      });
    } else {
      res.status(404).json({ error: 'File not found' });
    }

  } catch (error: any) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Delete failed' });
  }
});

// Bulk download/ZIP endpoint (PROTECTED - PREMIUM ONLY)
router.post('/bulk-download', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const { files } = req.body; // Array of file paths like "category/subcategory/filename"

    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: 'No files specified' });
    }

    console.log(`📦 User ${userId}: Creating ZIP with ${files.length} files`);

    const userStoragePath = path.join(__dirname, '../../storage/users', userId, 'media');

    // Set response headers for ZIP download
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="download-${Date.now()}.zip"`);

    // Create archiver instance
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });

    // Pipe archive to response
    archive.pipe(res);

    // Add files to archive
    let addedCount = 0;
    for (const filePath of files) {
      const fullPath = path.join(userStoragePath, filePath);

      // Security check
      if (!fullPath.startsWith(userStoragePath)) {
        console.warn(`⚠️ Security: Blocked access to ${fullPath}`);
        continue;
      }

      if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
        const filename = path.basename(filePath);
        archive.file(fullPath, { name: filename });
        addedCount++;
      } else {
        console.warn(`⚠️ File not found: ${filePath}`);
      }
    }

    if (addedCount === 0) {
      return res.status(404).json({ error: 'No valid files found' });
    }

    console.log(`✅ User ${userId}: Added ${addedCount} files to ZIP`);

    // Finalize archive
    await archive.finalize();

  } catch (error: any) {
    console.error('Bulk download error:', error);
    res.status(500).json({ error: 'Bulk download failed' });
  }
});

export default router;
