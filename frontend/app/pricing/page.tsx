'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Check,
  X,
  Zap,
  Shield,
  Cloud,
  Search,
  Users,
  Crown,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function PricingPage() {
  const router = useRouter();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleUpgrade = () => {
    setShowPaymentModal(true);
  };

  const handleMockPayment = () => {
    // Mock payment success
    setTimeout(() => {
      setShowPaymentModal(false);
      alert('🎉 Payment Successful! You are now a PREMIUM member!');
      // In real implementation, this would call backend to upgrade user
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold gradient-text">
              🎯 Intelligent Storage
            </Link>
            <div className="flex gap-4">
              <Link href="/dashboard">
                <button className="btn btn-secondary">Dashboard</button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4">
            Choose Your <span className="gradient-text">Perfect Plan</span>
          </h1>
          <p className="text-xl text-gray-600">
            Start free, upgrade when you need more power
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* FREE PLAN */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="card bg-white border-2 border-gray-200"
          >
            <div className="text-center mb-6">
              <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                <Cloud className="w-12 h-12 text-gray-600" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Free</h2>
              <div className="text-4xl font-bold mb-2">
                ₹0<span className="text-lg text-gray-500">/month</span>
              </div>
              <p className="text-gray-600">Perfect for getting started</p>
              <div className="mt-3 px-4 py-2 bg-gray-100 rounded-lg">
                <p className="text-sm font-bold text-gray-700">100 GB Storage</p>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span><strong>100 GB</strong> Storage</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>AI-Powered Categorization</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>File Organization</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Dashboard Analytics</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">Advanced AI Search</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">Duplicate Detection</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400">Priority Support</span>
              </li>
            </ul>

            <button className="btn btn-secondary w-full" disabled>
              Current Plan
            </button>
          </motion.div>

          {/* PREMIUM PLAN */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card bg-gradient-to-br from-orange-500 to-purple-600 text-white border-4 border-orange-400 relative overflow-hidden"
          >
            {/* Popular Badge */}
            <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
              <Crown className="w-4 h-4" />
              POPULAR
            </div>

            <div className="text-center mb-6">
              <div className="inline-block p-4 bg-white/20 rounded-full mb-4">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Premium</h2>
              <div className="text-4xl font-bold mb-2">
                ₹49<span className="text-lg text-white/80">/month</span>
              </div>
              <p className="text-white/90">Everything you need to scale</p>
              <div className="mt-3 px-4 py-2 bg-white/20 rounded-lg border border-white/30">
                <p className="text-sm font-bold text-white">500 GB Storage</p>
                <p className="text-xs text-white/70">5x more than Free!</p>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                <span className="font-bold text-lg">500 GB Storage (5x more!)</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                <span>Unlimited File Uploads</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                <span>Advanced AI Search</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                <span>Smart Duplicate Detection</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                <span>Auto Face Recognition</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                <span>Smart Photo Albums</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                <span>Priority Support (24/7)</span>
              </li>
            </ul>

            <motion.button
              onClick={handleUpgrade}
              className="btn w-full bg-white text-orange-600 hover:bg-gray-100 font-bold text-lg flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Upgrade Now
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>

        {/* Features Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-20 max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Upgrade to <span className="gradient-text">Premium?</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="inline-block p-4 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full mb-4">
                <Zap className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">5x More Storage</h3>
              <p className="text-gray-600">
                Get 500GB instead of 100GB - perfect for large media libraries
              </p>
            </div>

            <div className="card text-center">
              <div className="inline-block p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full mb-4">
                <Search className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Smart AI Search</h3>
              <p className="text-gray-600">
                Find photos by content: "beach sunset" or "my dog playing"
              </p>
            </div>

            <div className="card text-center">
              <div className="inline-block p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-full mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Priority Support</h3>
              <p className="text-gray-600">
                Get help instantly with 24/7 priority customer support
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mock Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full"
          >
            <div className="text-center mb-6">
              <div className="inline-block p-4 bg-gradient-to-br from-orange-500 to-purple-600 rounded-full mb-4">
                <Crown className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Upgrade to Premium</h2>
              <p className="text-gray-600">Complete your payment</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-purple-50 rounded-xl p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Plan</span>
                <span className="font-bold">Premium Monthly</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Duration</span>
                <span className="font-bold">1 Month</span>
              </div>
              <div className="border-t border-gray-300 my-4"></div>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">Total</span>
                <span className="text-3xl font-bold gradient-text">₹49</span>
              </div>
            </div>

            <div className="space-y-3">
              <motion.button
                onClick={handleMockPayment}
                className="btn btn-primary w-full text-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Pay ₹49
              </motion.button>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="btn btn-secondary w-full"
              >
                Cancel
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              🔒 Secure payment • Cancel anytime
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
