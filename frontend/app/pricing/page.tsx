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
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';

export default function PricingPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const handleUpgrade = () => {
    if (!user) {
      alert('Please login first to view premium features');
      router.push('/login');
      return;
    }

    if (user.subscription?.tier === 'premium') {
      alert('You are already a premium member!');
      return;
    }

    // Payment system removed - Demo version
    alert('💡 Premium features coming soon! This is a demo version for the hackathon.');
  };

  return (
    <div className="min-h-screen bg-premium-950 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(212, 175, 55) 1px, transparent 0)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Premium Header */}
      <header className="bg-premium-900/80 backdrop-blur-xl border-b border-gold-500/20 sticky top-0 z-40 relative">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-gold flex items-center justify-center">
                <span className="text-premium-950 font-display text-lg">IS</span>
              </div>
              <h1 className="text-lg font-display font-bold text-gold-500 tracking-wide uppercase">
                Intelligent Storage
              </h1>
            </Link>
            <div className="flex gap-3">
              <Link href="/dashboard">
                <button className="btn bg-premium-800 text-gold-500 border border-gold-500/30 hover:bg-premium-700">
                  <span className="uppercase tracking-wider text-xs">Dashboard</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-16 relative z-10">
        {/* Premium Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-6xl font-display font-bold mb-6">
            <span className="text-gold-500">Choose Your</span>{' '}
            <span className="gradient-text-luxury">Premium Plan</span>
          </h1>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-6"></div>
          <p className="text-xl text-gold-100/70 tracking-wide">
            Begin with excellence, ascend to greatness
          </p>
        </motion.div>

        {/* Premium Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-20">
          {/* FREE PLAN */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="card-dark border-2 border-gold-500/20 hover:border-gold-500/40 transition-all duration-500"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-premium-900 border border-gold-500/30 mb-6">
                <Cloud className="w-10 h-10 text-gold-500/70" />
              </div>
              <h2 className="text-4xl font-display font-bold mb-4 text-gold-500 tracking-wide">Free</h2>
              <div className="text-5xl font-display font-bold mb-3 text-gold-200">
                ₹0<span className="text-xl text-gold-200/50 font-sans">/year</span>
              </div>
              <p className="text-gold-100/60 tracking-wide mb-6">Perfect for getting started</p>
              <div className="inline-block px-6 py-3 bg-premium-900 border border-gold-500/20">
                <p className="text-sm font-display font-bold text-gold-500 uppercase tracking-wider">100 GB Storage</p>
              </div>
            </div>

            <ul className="space-y-4 mb-10">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                <span className="text-gold-100"><strong>100 GB</strong> Storage</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                <span className="text-gold-100">AI-Powered Categorization</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                <span className="text-gold-100">File Organization</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                <span className="text-gold-100">Dashboard Analytics</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-gold-500/20 flex-shrink-0 mt-0.5" />
                <span className="text-gold-200/30">Advanced AI Search</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-gold-500/20 flex-shrink-0 mt-0.5" />
                <span className="text-gold-200/30">Duplicate Detection</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-gold-500/20 flex-shrink-0 mt-0.5" />
                <span className="text-gold-200/30">Priority Support</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-gold-500/20 flex-shrink-0 mt-0.5" />
                <span className="text-gold-200/30">🌙 Dark Mode</span>
              </li>
            </ul>

            <button
              className="btn bg-premium-800 text-gold-200/70 border border-gold-500/20 w-full cursor-not-allowed"
              disabled
            >
              <span className="uppercase tracking-wider text-sm">
                {user?.subscription?.tier === 'free' || !user?.subscription ? 'Current Plan' : 'Free Plan'}
              </span>
            </button>
          </motion.div>

          {/* PREMIUM PLAN */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="card-dark bg-gradient-to-br from-premium-900 via-premium-950 to-premium-900 border-4 border-gold-500 relative overflow-hidden luxury-pulse"
          >
            {/* Premium Badge */}
            <div className="absolute top-6 right-6 premium-badge flex items-center gap-1">
              <Crown className="w-4 h-4" />
              PREMIUM
            </div>

            {/* Gold Shimmer Effect */}
            <div className="absolute inset-0 gold-shimmer opacity-20"></div>

            <div className="text-center mb-8 relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-gold mb-6">
                <Sparkles className="w-10 h-10 text-premium-950" />
              </div>
              <h2 className="text-4xl font-display font-bold mb-4 text-gold-500 tracking-wide">Premium</h2>
              <div className="text-5xl font-display font-bold mb-3 text-gold-200">
                ₹499<span className="text-xl text-gold-200/70 font-sans">/year</span>
              </div>
              <p className="text-gold-100/80 tracking-wide mb-6">Everything you need to scale</p>
              <div className="inline-block px-6 py-3 bg-gold-500/10 border-2 border-gold-500">
                <p className="text-sm font-display font-bold text-gold-500 uppercase tracking-wider">500 GB Storage</p>
                <p className="text-xs text-gold-200/70 tracking-wide">5x more than Free</p>
              </div>
            </div>

            <ul className="space-y-4 mb-10 relative z-10">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                <span className="font-bold text-lg text-gold-200">500 GB Storage (5x more!)</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                <span className="text-gold-100">Unlimited File Uploads</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                <span className="text-gold-100">Advanced AI Search</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                <span className="text-gold-100">Smart Duplicate Detection</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                <span className="text-gold-100">Auto Face Recognition</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                <span className="text-gold-100">Smart Photo Albums</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                <span className="text-gold-100">Priority Support (24/7)</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                <span className="font-bold text-lg text-gold-200">🌙 Premium Dark Mode</span>
              </li>
            </ul>

            <motion.button
              onClick={handleUpgrade}
              className="btn-luxury w-full text-base flex items-center justify-center gap-3 py-5 relative z-10"
              whileHover={{ scale: user?.subscription?.tier === 'premium' ? 1 : 1.02 }}
              whileTap={{ scale: user?.subscription?.tier === 'premium' ? 1 : 0.98 }}
              disabled={user?.subscription?.tier === 'premium'}
            >
              <span className="uppercase tracking-wider">
                {user?.subscription?.tier === 'premium' ? 'Current Plan' : 'Upgrade Now'}
              </span>
              {user?.subscription?.tier !== 'premium' && <ArrowRight className="w-5 h-5" />}
            </motion.button>
          </motion.div>
        </div>

        {/* Premium Features Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <h2 className="text-4xl font-display font-bold text-center mb-4">
            <span className="text-gold-500">Why Upgrade to </span>
            <span className="gradient-text-luxury">Premium?</span>
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-16"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              className="card-dark border-2 border-gold-500/20 text-center hover-lift"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-500/10 border border-gold-500/30 mb-6">
                <Zap className="w-8 h-8 text-gold-500" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3 text-gold-500 tracking-wide">5x More Storage</h3>
              <p className="text-gold-100/70 leading-relaxed">
                Get 500GB instead of 100GB - perfect for large media libraries
              </p>
            </motion.div>

            <motion.div
              className="card-dark border-2 border-gold-500/20 text-center hover-lift"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-500/10 border border-gold-500/30 mb-6">
                <Search className="w-8 h-8 text-gold-500" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3 text-gold-500 tracking-wide">Smart AI Search</h3>
              <p className="text-gold-100/70 leading-relaxed">
                Find photos by content: "beach sunset" or "my dog playing"
              </p>
            </motion.div>

            <motion.div
              className="card-dark border-2 border-gold-500 text-center hover-lift luxury-pulse"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-gold mb-6">
                <span className="text-4xl">🌙</span>
              </div>
              <h3 className="text-xl font-display font-bold mb-3 text-gold-500 tracking-wide">Premium Dark Mode</h3>
              <p className="text-gold-100/70 leading-relaxed">
                Exclusive dark theme for a sophisticated, eye-friendly experience
              </p>
            </motion.div>

            <motion.div
              className="card-dark border-2 border-gold-500/20 text-center hover-lift"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-500/10 border border-gold-500/30 mb-6">
                <Shield className="w-8 h-8 text-gold-500" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3 text-gold-500 tracking-wide">Priority Support</h3>
              <p className="text-gold-100/70 leading-relaxed">
                Get help instantly with 24/7 priority customer support
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Link href="/" className="inline-flex items-center gap-2 text-gold-200/80 hover:text-gold-500 transition-colors text-sm uppercase tracking-wider font-display">
            <ArrowLeft size={16} />
            <span>Return Home</span>
          </Link>
        </motion.div>
      </div>

    </div>
  );
}
