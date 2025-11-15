'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import api from '@/lib/api';
import {
  Brain,
  TrendingUp,
  Award,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Crown,
  Sparkles,
  Target
} from 'lucide-react';

interface CategoryStats {
  category: string;
  count: number;
  accuracy: number;
  corrections: number;
}

interface TrainingStats {
  totalCorrections: number;
  totalPredictions: number;
  accuracy: number;
  categoryStats: CategoryStats[];
  recentCorrections: Array<{
    filename: string;
    originalCategory: string;
    correctedCategory: string;
    timestamp: string;
  }>;
}

export default function AITrainingPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [stats, setStats] = useState<TrainingStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      fetchTrainingStats();
    }
  }, [isAuthenticated, router]);

  const fetchTrainingStats = async () => {
    try {
      const response = await api.get('/ai-training/stats');
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch training stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-premium-950 flex items-center justify-center">
        <div className="text-center">
          <div className="luxury-spinner mx-auto mb-6"></div>
          <p className="text-gold-200 text-lg font-display tracking-wider">Loading AI statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-premium-950">
      {/* Premium Header */}
      <header className="bg-premium-900/80 backdrop-blur-xl shadow-luxury border-b border-gold-500/20 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-gold flex items-center justify-center">
                  <span className="text-premium-950 font-display text-2xl">IS</span>
                </div>
              </Link>
              <div>
                <h1 className="text-xl font-display font-bold text-gold-500 tracking-wide uppercase flex items-center gap-2">
                  <Brain className="w-6 h-6" />
                  AI Training Dashboard
                </h1>
                <p className="text-xs text-gold-200/60 tracking-wide">Model Performance & Training</p>
              </div>
            </div>
            <Link href="/dashboard">
              <button className="btn bg-premium-800 text-gold-500 border border-gold-500/30 hover:bg-premium-700 flex items-center gap-2">
                <ArrowLeft size={18} />
                <span className="uppercase tracking-wider text-xs">Dashboard</span>
              </button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Hero Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-4 gap-6 mb-8"
        >
          {/* Overall Accuracy */}
          <div className="card-dark border-4 border-gold-500/40 luxury-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-gold flex items-center justify-center">
                <Target className="w-7 h-7 text-premium-950" />
              </div>
              <Award className="w-10 h-10 text-gold-500/30" />
            </div>
            <div className="luxury-number text-4xl mb-2">{stats?.accuracy.toFixed(1)}%</div>
            <p className="text-gold-200 text-sm uppercase tracking-wider font-display">AI Accuracy</p>
          </div>

          {/* Total Predictions */}
          <div className="card-dark border-2 border-gold-500/20 hover:border-gold-500/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gold-500/10 border border-gold-500/30 flex items-center justify-center">
                <BarChart3 className="w-7 h-7 text-gold-500" />
              </div>
            </div>
            <div className="luxury-number text-4xl mb-2">{stats?.totalPredictions.toLocaleString()}</div>
            <p className="text-gold-200 text-sm uppercase tracking-wider font-display">Predictions Made</p>
          </div>

          {/* User Corrections */}
          <div className="card-dark border-2 border-gold-500/20 hover:border-gold-500/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gold-500/10 border border-gold-500/30 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-gold-500" />
              </div>
            </div>
            <div className="luxury-number text-4xl mb-2">{stats?.totalCorrections.toLocaleString()}</div>
            <p className="text-gold-200 text-sm uppercase tracking-wider font-display">User Corrections</p>
          </div>

          {/* Learning Rate */}
          <div className="card-dark border-2 border-gold-500/20 hover:border-gold-500/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gold-500/10 border border-gold-500/30 flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-gold-500" />
              </div>
            </div>
            <div className="luxury-number text-4xl mb-2">
              {stats && stats.totalPredictions > 0
                ? ((stats.totalCorrections / stats.totalPredictions) * 100).toFixed(1)
                : '0'}%
            </div>
            <p className="text-gold-200 text-sm uppercase tracking-wider font-display">Learning Rate</p>
          </div>
        </motion.div>

        {/* Category Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-dark border-2 border-gold-500/20 mb-8"
        >
          <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-3 text-gold-500">
            <BarChart3 size={28} />
            Category Performance
          </h2>

          <div className="space-y-4">
            {stats?.categoryStats.slice(0, 10).map((cat, index) => (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-5 bg-premium-950 border border-gold-500/20 hover:border-gold-500/40 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-display font-bold text-gold-500">#{index + 1}</span>
                    <div>
                      <h3 className="font-display font-bold text-gold-200 tracking-wide">{cat.category}</h3>
                      <p className="text-xs text-gold-200/50 tracking-wide">{cat.count} predictions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-display font-bold ${
                      cat.accuracy >= 90 ? 'text-green-500' :
                      cat.accuracy >= 75 ? 'text-yellow-500' :
                      'text-red-500'
                    }`}>
                      {cat.accuracy.toFixed(1)}%
                    </div>
                    <p className="text-xs text-gold-200/50">{cat.corrections} corrections</p>
                  </div>
                </div>

                {/* Accuracy Bar */}
                <div className="w-full bg-premium-900 h-3 border border-gold-500/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.accuracy}%` }}
                    transition={{ duration: 1, delay: index * 0.05 + 0.3 }}
                    className={`h-3 ${
                      cat.accuracy >= 90 ? 'bg-green-500' :
                      cat.accuracy >= 75 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Corrections */}
        {stats && stats.recentCorrections.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-dark border-2 border-gold-500/20"
          >
            <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-3 text-gold-500">
              <Clock size={28} />
              Recent Training Corrections
            </h2>

            <div className="space-y-3">
              {stats.recentCorrections.map((correction, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="p-4 bg-premium-950 border border-gold-500/10 hover:border-gold-500/30 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gold-100 mb-1">{correction.filename}</p>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-red-400">❌ {correction.originalCategory}</span>
                        <span className="text-gold-500">→</span>
                        <span className="text-green-400">✓ {correction.correctedCategory}</span>
                      </div>
                    </div>
                    <span className="text-xs text-gold-200/50">
                      {new Date(correction.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Help Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-dark bg-gradient-to-br from-gold-500/10 via-premium-900 to-premium-950 border-2 border-gold-500/30 mt-8"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-gold flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-premium-950" />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-gold-500 mb-2 tracking-wide">
                Help Improve Our AI
              </h3>
              <p className="text-gold-100/70 mb-4 leading-relaxed">
                Every time you correct a file's category in the dashboard, you're helping our AI learn and improve!
                The more corrections we receive, the smarter our categorization becomes.
              </p>
              <Link href="/upload">
                <button className="btn-luxury flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  <span className="uppercase tracking-wider text-sm">Upload & Train</span>
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
