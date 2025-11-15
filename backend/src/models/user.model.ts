import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  subscription: {
    tier: 'free' | 'premium';
    startDate?: Date;
    endDate?: Date;
    paymentId?: string;
  };
  storageUsed: number;
  favorites: string[];
}

const UserSchema: Schema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    subscription: {
      tier: {
        type: String,
        enum: ['free', 'premium'],
        default: 'free',
      },
      startDate: {
        type: Date,
      },
      endDate: {
        type: Date,
      },
      paymentId: {
        type: String,
      },
    },
    storageUsed: {
      type: Number,
      default: 0,
    },
    favorites: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ id: 1 });

export const User = mongoose.model<IUser>('User', UserSchema);
