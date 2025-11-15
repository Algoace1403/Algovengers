import { Router, Request, Response } from 'express';
import aiTrainingService from '../services/ai-training.service';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Record AI prediction (called automatically during upload)
router.post('/record-prediction', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const { filename, category, subcategory, confidence } = req.body;

    if (!filename || !category || !subcategory) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await aiTrainingService.recordPrediction({
      filename,
      category,
      subcategory,
      confidence: confidence || 0,
      userId
    });

    res.json({
      success: true,
      message: 'Prediction recorded for training'
    });

  } catch (error: any) {
    console.error('Record prediction error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Submit user correction to train the AI
router.post('/correct-category', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const {
      filename,
      originalCategory,
      originalSubcategory,
      correctedCategory,
      correctedSubcategory,
      confidence
    } = req.body;

    if (!filename || !originalCategory || !correctedCategory) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await aiTrainingService.recordCorrection({
      filename,
      originalCategory,
      originalSubcategory: originalSubcategory || 'General',
      correctedCategory,
      correctedSubcategory: correctedSubcategory || 'General',
      confidence: confidence || 0,
      userId
    });

    console.log(`✅ User ${userId} corrected ${filename}: ${originalCategory} → ${correctedCategory}`);

    res.json({
      success: true,
      message: 'Thank you! Your correction helps improve our AI model.'
    });

  } catch (error: any) {
    console.error('Record correction error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get training statistics
router.get('/stats', authMiddleware, async (req: Request, res: Response) => {
  try {
    const stats = aiTrainingService.getTrainingStats();

    res.json({
      success: true,
      stats
    });

  } catch (error: any) {
    console.error('Get training stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get category suggestions based on training data
router.get('/suggestions/:filename', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    const suggestions = aiTrainingService.getCategorySuggestions(filename);

    res.json({
      success: true,
      suggestions
    });

  } catch (error: any) {
    console.error('Get suggestions error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Export training data (admin/analytics)
router.get('/export', authMiddleware, async (req: Request, res: Response) => {
  try {
    const data = aiTrainingService.exportTrainingData();

    res.json({
      success: true,
      count: data.length,
      data
    });

  } catch (error: any) {
    console.error('Export training data error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
