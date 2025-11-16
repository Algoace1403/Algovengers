import { AnalyticsEvent } from '../models/analytics.model';
import { isConnected } from '../config/database';
import fs from 'fs/promises';
import path from 'path';

const ANALYTICS_FILE = path.join(__dirname, '../../storage/analytics.json');

interface AnalyticsData {
  userId: string;
  eventType: string;
  category?: string;
  subcategory?: string;
  fileSize?: number;
  timestamp: string;
}

class AnalyticsService {
  // Track an analytics event
  async trackEvent(
    userId: string,
    eventType: 'upload' | 'download' | 'delete' | 'view',
    data?: {
      category?: string;
      subcategory?: string;
      fileSize?: number;
      metadata?: Record<string, any>;
    }
  ): Promise<void> {
    try {
      // Use MongoDB if connected, otherwise fall back to file-based storage
      if (isConnected()) {
        await AnalyticsEvent.create({
          userId,
          eventType,
          category: data?.category,
          subcategory: data?.subcategory,
          fileSize: data?.fileSize,
          metadata: data?.metadata,
          timestamp: new Date(),
        });
        console.log(`📊 MongoDB: Tracked ${eventType} event for user ${userId}`);
      } else {
        // File-based fallback
        const events = await this.loadEventsFromFile();
        events.push({
          userId,
          eventType,
          category: data?.category,
          subcategory: data?.subcategory,
          fileSize: data?.fileSize,
          timestamp: new Date().toISOString(),
        });
        await this.saveEventsToFile(events);
        console.log(`📂 File: Tracked ${eventType} event for user ${userId}`);
      }
    } catch (error) {
      console.error('Error tracking analytics event:', error);
    }
  }

  // Get analytics summary for user
  async getUserAnalytics(userId: string, days: number = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      let userEvents: any[] = [];

      // Use MongoDB if connected, otherwise fall back to file-based storage
      if (isConnected()) {
        const events = await AnalyticsEvent.find({
          userId,
          timestamp: { $gte: startDate },
        }).sort({ timestamp: -1 });

        userEvents = events.map((e) => ({
          userId: e.userId,
          eventType: e.eventType,
          category: e.category,
          subcategory: e.subcategory,
          fileSize: e.fileSize,
          timestamp: e.timestamp.toISOString(),
        }));
        console.log(`📊 MongoDB: Retrieved ${userEvents.length} analytics events for user ${userId}`);
      } else {
        // File-based fallback
        const allEvents = await this.loadEventsFromFile();
        userEvents = allEvents.filter(
          (e) =>
            e.userId === userId &&
            new Date(e.timestamp) >= startDate
        );
        console.log(`📂 File: Retrieved ${userEvents.length} analytics events for user ${userId}`);
      }

      return this.processAnalytics(userEvents, days);
    } catch (error) {
      console.error('Error getting user analytics:', error);
      return this.getDefaultAnalytics();
    }
  }

  // Process analytics data
  private processAnalytics(events: any[], days: number) {
    const totalEvents = events.length;
    const uploads = events.filter((e) => e.eventType === 'upload').length;
    const downloads = events.filter((e) => e.eventType === 'download').length;
    const views = events.filter((e) => e.eventType === 'view').length;
    const deletes = events.filter((e) => e.eventType === 'delete').length;

    // Calculate total size uploaded
    const totalSizeUploaded = events
      .filter((e) => e.eventType === 'upload' && e.fileSize)
      .reduce((sum, e) => sum + (e.fileSize || 0), 0);

    // Category breakdown
    const categoryBreakdown: Record<string, number> = {};
    events.forEach((e) => {
      if (e.category) {
        categoryBreakdown[e.category] = (categoryBreakdown[e.category] || 0) + 1;
      }
    });

    // Activity over time (daily breakdown)
    const activityByDay: Record<string, number> = {};
    events.forEach((e) => {
      const date = new Date(e.timestamp).toISOString().split('T')[0];
      activityByDay[date] = (activityByDay[date] || 0) + 1;
    });

    // Recent activity (last 10 events)
    const recentActivity = events.slice(0, 10).map((e) => ({
      type: e.eventType,
      category: e.category,
      subcategory: e.subcategory,
      timestamp: e.timestamp,
    }));

    // Activity heatmap (7 days x 24 hours)
    const heatmap: number[][] = Array(7)
      .fill(0)
      .map(() => Array(24).fill(0));

    events.forEach((e) => {
      const date = new Date(e.timestamp);
      const dayOfWeek = date.getDay();
      const hour = date.getHours();
      heatmap[dayOfWeek][hour]++;
    });

    return {
      totalEvents,
      uploads,
      downloads,
      views,
      deletes,
      totalSizeUploadedMB: (totalSizeUploaded / (1024 * 1024)).toFixed(2),
      categoryBreakdown,
      activityByDay,
      recentActivity,
      heatmap,
      period: `Last ${days} days`,
    };
  }

  // Default analytics when no data available
  private getDefaultAnalytics() {
    return {
      totalEvents: 0,
      uploads: 0,
      downloads: 0,
      views: 0,
      deletes: 0,
      totalSizeUploadedMB: '0',
      categoryBreakdown: {},
      activityByDay: {},
      recentActivity: [],
      heatmap: Array(7)
        .fill(0)
        .map(() => Array(24).fill(0)),
      period: 'Last 30 days',
    };
  }

  // File-based fallback methods
  private async loadEventsFromFile(): Promise<AnalyticsData[]> {
    try {
      const data = await fs.readFile(ANALYTICS_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  private async saveEventsToFile(events: AnalyticsData[]): Promise<void> {
    try {
      const dir = path.dirname(ANALYTICS_FILE);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(ANALYTICS_FILE, JSON.stringify(events, null, 2));
    } catch (error) {
      console.error('Error saving analytics to file:', error);
    }
  }
}

export default new AnalyticsService();
