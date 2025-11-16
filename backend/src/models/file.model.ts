import mongoose, { Document, Schema } from 'mongoose';

export interface IFile extends Document {
  userId: string;
  filename: string;
  originalName: string;
  path: string;
  size: number;
  mimeType: string;
  category: string;
  subcategory: string;
  aiCategory?: {
    prediction: string;
    confidence: number;
    keywords?: string[];
  };
  documentAnalysis?: {
    wordCount?: number;
    pageCount?: number;
    rowCount?: number;
    columnCount?: number;
    extractedText?: string;
    keywords?: string[];
  };
  uploadedAt: Date;
  tags: string[];
  isFavorite: boolean;
  hash?: string;
}

const FileSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    filename: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
      unique: true,
    },
    size: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    subcategory: {
      type: String,
      required: true,
      index: true,
    },
    aiCategory: {
      prediction: String,
      confidence: Number,
      keywords: [String],
    },
    documentAnalysis: {
      wordCount: Number,
      pageCount: Number,
      rowCount: Number,
      columnCount: Number,
      extractedText: String,
      keywords: [String],
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    hash: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
FileSchema.index({ userId: 1, uploadedAt: -1 });
FileSchema.index({ userId: 1, category: 1, subcategory: 1 });
FileSchema.index({ userId: 1, isFavorite: 1 });
FileSchema.index({ hash: 1 });

export const File = mongoose.model<IFile>('File', FileSchema);
