import mongoose from 'mongoose';

export const connectDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/intelligent-storage';

    await mongoose.connect(mongoUri);

    console.log('✅ MongoDB connected successfully');

     mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    console.log('⚠️  Continuing without database - using file-based storage');
  }
};

export const isConnected = () => {
  return mongoose.connection.readyState === 1;
};
