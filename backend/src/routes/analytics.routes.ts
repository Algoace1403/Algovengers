import { Router, Request, Response } from 'express';
import analyticsService from '../services/analytics.service';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Get user analytics (PROTECTED)
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const days = parseInt(req.query.days as string) || 30;

    const analytics = await analyticsService.getUserAnalytics(userId, days);

    res.json({
      success: true,
      analytics,
    });
  } catch (error: any) {
    console.error('Error getting analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get analytics',
      error: error.message,
    });
  }
});

// Track a custom event (PROTECTED)
router.post('/track', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const { eventType, category, subcategory, fileSize, metadata } = req.body;

    await analyticsService.trackEvent(userId, eventType, {
      category,
      subcategory,
      fileSize,
      metadata,
    });

    res.json({
      success: true,
      message: 'Event tracked successfully',
    });
  } catch (error: any) {
    console.error('Error tracking event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track event',
      error: error.message,
    });
  }
});

export default router;
