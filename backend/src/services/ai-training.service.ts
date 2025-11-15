import fs from 'fs';
import path from 'path';

interface TrainingData {
  filename: string;
  originalCategory: string;
  originalSubcategory: string;
  correctedCategory: string;
  correctedSubcategory: string;
  confidence: number;
  userId: string;
  timestamp: Date;
}

interface CategoryStats {
  category: string;
  count: number;
  accuracy: number;
  corrections: number;
}

class AITrainingService {
  private trainingDataPath: string;
  private modelAccuracyPath: string;

  constructor() {
    this.trainingDataPath = path.join(__dirname, '../../storage/ai-training/training-data.json');
    this.modelAccuracyPath = path.join(__dirname, '../../storage/ai-training/model-accuracy.json');
    this.ensureTrainingDirectories();
  }

  /**
   * Ensure training data directories exist
   */
  private ensureTrainingDirectories(): void {
    const trainingDir = path.join(__dirname, '../../storage/ai-training');
    if (!fs.existsSync(trainingDir)) {
      fs.mkdirSync(trainingDir, { recursive: true });
      console.log('📚 Created AI training directory');
    }

    // Initialize training data file if doesn't exist
    if (!fs.existsSync(this.trainingDataPath)) {
      fs.writeFileSync(this.trainingDataPath, JSON.stringify([], null, 2));
      console.log('📝 Initialized training data file');
    }

    // Initialize accuracy tracking file
    if (!fs.existsSync(this.modelAccuracyPath)) {
      fs.writeFileSync(this.modelAccuracyPath, JSON.stringify({
        totalPredictions: 0,
        correctPredictions: 0,
        accuracy: 100,
        categoryStats: {}
      }, null, 2));
      console.log('📊 Initialized model accuracy tracking');
    }
  }

  /**
   * Record AI prediction for training
   */
  async recordPrediction(data: {
    filename: string;
    category: string;
    subcategory: string;
    confidence: number;
    userId: string;
  }): Promise<void> {
    console.log(`📝 Recording prediction for ${data.filename}: ${data.category}/${data.subcategory}`);

    // Update model accuracy stats
    const accuracy = this.loadModelAccuracy();
    accuracy.totalPredictions++;

    if (!accuracy.categoryStats[data.category]) {
      accuracy.categoryStats[data.category] = {
        total: 0,
        correct: 0,
        corrections: 0
      };
    }

    accuracy.categoryStats[data.category].total++;
    accuracy.accuracy = (accuracy.correctPredictions / accuracy.totalPredictions) * 100;

    this.saveModelAccuracy(accuracy);
  }

  /**
   * Record user correction to improve model
   */
  async recordCorrection(data: {
    filename: string;
    originalCategory: string;
    originalSubcategory: string;
    correctedCategory: string;
    correctedSubcategory: string;
    confidence: number;
    userId: string;
  }): Promise<void> {
    const trainingData: TrainingData = {
      ...data,
      timestamp: new Date()
    };

    console.log(`🔄 Recording correction for ${data.filename}:`);
    console.log(`   Original: ${data.originalCategory}/${data.originalSubcategory}`);
    console.log(`   Corrected: ${data.correctedCategory}/${data.correctedSubcategory}`);

    // Load existing training data
    const allData = this.loadTrainingData();
    allData.push(trainingData);

    // Save updated training data
    fs.writeFileSync(this.trainingDataPath, JSON.stringify(allData, null, 2));

    // Update model accuracy
    const accuracy = this.loadModelAccuracy();

    if (!accuracy.categoryStats[data.originalCategory]) {
      accuracy.categoryStats[data.originalCategory] = {
        total: 0,
        correct: 0,
        corrections: 0
      };
    }

    accuracy.categoryStats[data.originalCategory].corrections++;

    // Recalculate accuracy
    const categoryStats = accuracy.categoryStats[data.originalCategory];
    categoryStats.correct = categoryStats.total - categoryStats.corrections;

    accuracy.correctPredictions = Object.values(accuracy.categoryStats).reduce(
      (sum: number, stat: any) => sum + stat.correct, 0
    );

    accuracy.accuracy = (accuracy.correctPredictions / accuracy.totalPredictions) * 100;

    this.saveModelAccuracy(accuracy);

    console.log(`✅ Model accuracy updated: ${accuracy.accuracy.toFixed(2)}%`);
  }

  /**
   * Get training statistics
   */
  getTrainingStats(): {
    totalCorrections: number;
    totalPredictions: number;
    accuracy: number;
    categoryStats: CategoryStats[];
    recentCorrections: TrainingData[];
  } {
    try {
      const trainingData = this.loadTrainingData();
      const accuracy = this.loadModelAccuracy();

      // Process category stats
      const categoryStats: CategoryStats[] = Object.entries(accuracy.categoryStats || {}).map(
        ([category, stats]: [string, any]) => ({
          category,
          count: stats.total || 0,
          accuracy: stats.total > 0 ? ((stats.correct / stats.total) * 100) : 100,
          corrections: stats.corrections || 0
        })
      );

      // Sort by count descending
      categoryStats.sort((a, b) => b.count - a.count);

      // Get recent corrections (last 20)
      const recentCorrections = trainingData.slice(-20).reverse();

      return {
        totalCorrections: trainingData.length || 0,
        totalPredictions: accuracy.totalPredictions || 0,
        accuracy: accuracy.accuracy || 100,
        categoryStats,
        recentCorrections
      };
    } catch (error) {
      console.error('Error getting training stats:', error);
      // Return empty stats if there's an error
      return {
        totalCorrections: 0,
        totalPredictions: 0,
        accuracy: 100,
        categoryStats: [],
        recentCorrections: []
      };
    }
  }

  /**
   * Get improved category suggestions based on training data
   */
  getCategorySuggestions(filename: string): string[] {
    const trainingData = this.loadTrainingData();
    const ext = path.extname(filename).toLowerCase();

    // Find similar files that were corrected
    const similarCorrections = trainingData.filter(data => {
      const dataExt = path.extname(data.filename).toLowerCase();
      return dataExt === ext;
    });

    // Get most common corrections
    const categoryCount: { [key: string]: number } = {};
    similarCorrections.forEach(data => {
      const category = `${data.correctedCategory}/${data.correctedSubcategory}`;
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    // Sort and return top 5 suggestions
    return Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([category]) => category);
  }

  /**
   * Load training data from file
   */
  private loadTrainingData(): TrainingData[] {
    try {
      const data = fs.readFileSync(this.trainingDataPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading training data:', error);
      return [];
    }
  }

  /**
   * Load model accuracy data
   */
  private loadModelAccuracy(): any {
    try {
      const data = fs.readFileSync(this.modelAccuracyPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading model accuracy:', error);
      return {
        totalPredictions: 0,
        correctPredictions: 0,
        accuracy: 100,
        categoryStats: {}
      };
    }
  }

  /**
   * Save model accuracy data
   */
  private saveModelAccuracy(data: any): void {
    fs.writeFileSync(this.modelAccuracyPath, JSON.stringify(data, null, 2));
  }

  /**
   * Export training data for analysis
   */
  exportTrainingData(): TrainingData[] {
    return this.loadTrainingData();
  }

  /**
   * Clear training data (admin only)
   */
  clearTrainingData(): void {
    fs.writeFileSync(this.trainingDataPath, JSON.stringify([], null, 2));
    fs.writeFileSync(this.modelAccuracyPath, JSON.stringify({
      totalPredictions: 0,
      correctPredictions: 0,
      accuracy: 100,
      categoryStats: {}
    }, null, 2));
    console.log('🗑️  Training data cleared');
  }
}

export default new AITrainingService();
