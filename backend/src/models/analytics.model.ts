import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalyticsEvent extends Document {
  userId: string;
  eventType: 'upload' | 'download' | 'delete' | 'view';
  category?: string;
  subcategory?: string;
  fileSize?: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

const AnalyticsEventSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    eventType: {
      type: String,
      required: true,
      enum: ['upload', 'download', 'delete', 'view'],
    },
    category: {
      type: String,
    },
    subcategory: {
      type: String,
    },
    fileSize: {
      type: Number,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
AnalyticsEventSchema.index({ userId: 1, timestamp: -1 });
AnalyticsEventSchema.index({ userId: 1, eventType: 1 });

export const AnalyticsEvent = mongoose.model<IAnalyticsEvent>(
  'AnalyticsEvent',
  AnalyticsEventSchema
);
