
import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import storageService from '../services/storage.service';
import jsonAnalyzer from '../services/json-analyzer.service';
import { authMiddleware } from '../middleware/auth.middleware';

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
    const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mov|avi|mkv/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type!'));
    }
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

    // Check storage limit
    const totalSize = files.reduce((sum, f) => sum + f.size, 0);
    const storageCheck = storageService.checkStorageLimit(userId, totalSize);

    if (!storageCheck.allowed) {
      const usedGB = (storageCheck.currentSize / (1024 * 1024 * 1024)).toFixed(2);
      return res.status(413).json({
        error: `Storage limit exceeded! You've used ${usedGB}GB of your 100GB limit.`,
        currentSize: storageCheck.currentSize,
        limit: storageCheck.limit
      });
    }

    console.log(`📥 User ${userId}: Received ${files.length} files`);

    // Organize files using storage service
    const filesInfo = files.map(f => ({
      path: f.path,
      originalName: f.originalname
    }));

    const organized = storageService.organizeFiles(userId, filesInfo, aiCategories);

    console.log(`✅ User ${userId}: Organized ${organized.length} files`);

    // Get updated storage stats
    const stats = storageService.getStorageStats(userId);

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
router.get('/structure', authMiddleware, (req: Request, res: Response) => {
  try {
    const userId = req.userId!;

    const structure = storageService.getFolderStructure(userId);
    const stats = storageService.getStorageStats(userId);

    res.json({
      success: true,
      structure,
      stats
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
