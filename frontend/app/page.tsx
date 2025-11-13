'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Upload, Database, FolderTree, Sparkles, Zap, Shield, LogIn, UserPlus } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: Upload,
      title: 'Smart Upload',
      description: 'Drag & drop any file - images, videos, or JSON data. Our AI handles the rest.',
      color: 'orange',
    },
    {
      icon: Sparkles,
      title: 'AI Categorization',
      description: 'Automatically categorize and organize media files using advanced AI.',
      color: 'purple',
    },
    {
      icon: Database,
      title: 'Intelligent Storage',
      description: 'Auto-detect SQL vs NoSQL requirements and generate optimal schemas.',
      color: 'blue',
    },
    {
      icon: FolderTree,
      title: 'Auto Organization',
      description: 'Files grouped intelligently into hierarchical folder structures.',
      color: 'green',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Real-time processing with instant categorization and storage.',
      color: 'yellow',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade storage with data consistency and optimization.',
      color: 'red',
    },
  ];

  return (
    <div className="min-h-screen animated-gradient-bg relative overflow-hidden">
      {/* Floating particles background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: -20,
            }}
            animate={{
              y: [-20, -1000],
              x: [0, Math.random() * 100 - 50],
              opacity: [0.3, 0.7, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Navigation Header */}
      <header className="glass sticky top-0 z-50 border-b border-white/30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="text-3xl">🗂️</div>
              <div>
                <h1 className="text-xl font-bold gradient-text">Intelligent Storage</h1>
                <p className="text-xs text-gray-600">AI-Powered Organization</p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <button className="btn btn-secondary flex items-center gap-2">
                  <LogIn size={18} />
                  Login
                </button>
              </Link>
              <Link href="/register">
                <button className="btn btn-primary flex items-center gap-2">
                  <UserPlus size={18} />
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-block mb-6"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <div className="text-6xl">🎯</div>
          </motion.div>

          <h1 className="text-6xl font-bold mb-6">
            <span className="gradient-text">Intelligent Storage</span>
            <br />
            <span className="text-gray-900">System</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Store anything. Organized everything. Powered by AI.
            <br />
            Upload media or data, and watch our intelligent system categorize and store it perfectly.
          </p>

          <div className="flex gap-4 justify-center">
            <Link href="/upload">
              <motion.button
                className="btn btn-primary text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started →
              </motion.button>
            </Link>
            <Link href="/dashboard">
              <motion.button
                className="btn btn-secondary text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Dashboard
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Demo Upload Zone Preview */}
        <motion.div
          className="max-w-4xl mx-auto mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="card bg-white/80 backdrop-blur-sm border-2 border-dashed border-orange-300 p-12 text-center">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Upload className="w-16 h-16 mx-auto mb-4 text-orange-500" />
            </motion.div>
            <h3 className="text-2xl font-bold mb-2">Upload Anything</h3>
            <p className="text-gray-600">
              Images, Videos, JSON data - all in one place
            </p>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="mb-20">
          <motion.h2
            className="text-4xl font-bold text-center mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Why Choose <span className="gradient-text">Intelligent Storage?</span>
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="card group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -5 }}
              >
                <div className={`w-14 h-14 rounded-xl bg-${feature.color}-100 flex items-center justify-center mb-4 group-hover:scale-110 
transition-transform`}>
                  <feature.icon className={`w-7 h-7 text-${feature.color}-600`} />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          className="text-center bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-12 text-white"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Experience the future of intelligent data storage
          </p>
          <Link href="/upload">
            <motion.button
              className="bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-shadow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Uploading Now →
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
