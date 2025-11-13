'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import {
  BarChart3,
  TrendingUp,
  Calendar,
  FolderTree,
  Clock,
  Crown,
  Lock,
  Zap
} from 'lucide-react';

export default function AnalyticsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const isPremium = user?.subscriptionTier === 'premium';

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isPremium) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card max-w-2xl text-center"
        >
          <div className="inline-block p-6 bg-gradient-to-br from-orange-100 to-purple-100 rounded-full mb-6">
            <Lock className="w-20 h-20 text-orange-600" />
          </div>

          <h1 className="text-3xl font-bold mb-4">
            Analytics is a <span className="gradient-text">Premium Feature</span>
          </h1>

          <p className="text-gray-600 mb-8 text-lg">
            Get detailed insights into your storage usage, upload patterns, and more with Premium!
          </p>

          <div className="bg-gradient-to-br from-orange-50 to-purple-50 rounded-xl p-6 mb-8">
            <h3 className="font-bold text-lg mb-4">Premium Analytics Includes:</h3>
            <ul className="space-y-3 text-left">
              <li className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <span>Storage usage trends over time</span>
              </li>
              <li className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                <span>Upload activity heatmap</span>
              </li>
              <li className="flex items-start gap-3">
                <BarChart3 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>Category breakdown charts</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Recent activity timeline</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-4 justify-center">
            <Link href="/pricing">
              <button className="btn bg-gradient-to-r from-orange-500 to-purple-600 text-white flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Upgrade to Premium - ₹49/month
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="btn btn-secondary">Back to Dashboard</button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Premium Analytics Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold gradient-text flex items-center gap-2">
              <BarChart3 />
              Analytics Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-purple-600 text-white text-xs font-bold rounded-full flex items-center gap-1">
                <Crown className="w-3 h-3" />
                PREMIUM
              </span>
              <Link href="/dashboard">
                <button className="btn btn-secondary">Dashboard</button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <p className="text-blue-100 text-sm mb-1">Total Uploads</p>
              <p className="text-4xl font-bold">247</p>
              <p className="text-blue-100 text-xs mt-2">+12% this week</p>
            </div>

            <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
              <p className="text-green-100 text-sm mb-1">Storage Used</p>
              <p className="text-4xl font-bold">45 GB</p>
              <p className="text-green-100 text-xs mt-2">9% of 500 GB</p>
            </div>

            <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <p className="text-purple-100 text-sm mb-1">Categories</p>
              <p className="text-4xl font-bold">12</p>
              <p className="text-purple-100 text-xs mt-2">Well organized!</p>
            </div>

            <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <p className="text-orange-100 text-sm mb-1">This Month</p>
              <p className="text-4xl font-bold">89</p>
              <p className="text-orange-100 text-xs mt-2">files uploaded</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Storage Trend */}
            <div className="card">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="text-blue-500" />
                Storage Growth
              </h3>
              <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                <div className="text-center text-gray-500">
                  <BarChart3 size={48} className="mx-auto mb-2 text-blue-500" />
                  <p>Interactive chart visualization</p>
                  <p className="text-sm">(Demo data shown)</p>
                </div>
              </div>
            </div>

            {/* Category Distribution */}
            <div className="card">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FolderTree className="text-purple-500" />
                Category Distribution
              </h3>
              <div className="h-64 flex items-center justify-center bg-gradient-to-br from-purple-50 to-orange-50 rounded-lg">
                <div className="text-center text-gray-500">
                  <FolderTree size={48} className="mx-auto mb-2 text-purple-500" />
                  <p>Pie chart visualization</p>
                  <p className="text-sm">(Demo data shown)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Activity Heatmap */}
          <div className="card mb-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Calendar className="text-green-500" />
              Upload Activity (Last 30 Days)
            </h3>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }).map((_, i) => {
                const intensity = Math.floor(Math.random() * 4);
                const colors = ['bg-gray-100', 'bg-green-200', 'bg-green-400', 'bg-green-600'];
                return (
                  <div
                    key={i}
                    className={`h-12 rounded ${colors[intensity]} hover:scale-110 transition-transform cursor-pointer`}
                    title={`${intensity} uploads`}
                  />
                );
              })}
            </div>
            <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
              <span>Less activity</span>
              <div className="flex gap-1">
                <div className="w-4 h-4 bg-gray-100 rounded"></div>
                <div className="w-4 h-4 bg-green-200 rounded"></div>
                <div className="w-4 h-4 bg-green-400 rounded"></div>
                <div className="w-4 h-4 bg-green-600 rounded"></div>
              </div>
              <span>More activity</span>
            </div>
          </div>

          {/* Recent Activity Timeline */}
          <div className="card">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Clock className="text-orange-500" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              {[
                { action: 'Uploaded', file: 'vacation-photo.jpg', time: '2 hours ago', color: 'blue' },
                { action: 'Deleted', file: 'old-screenshot.png', time: '5 hours ago', color: 'red' },
                { action: 'Downloaded', file: 'important-document.pdf', time: '1 day ago', color: 'green' },
                { action: 'Uploaded', file: 'presentation.pptx', time: '2 days ago', color: 'blue' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-orange-50 transition-colors">
                  <div className={`w-2 h-2 rounded-full bg-${activity.color}-500`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      <span className="text-gray-600">{activity.action}</span> {activity.file}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
