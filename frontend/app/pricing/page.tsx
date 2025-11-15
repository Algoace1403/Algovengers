'use client';

import { useState, useEffect } from 'react';
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
import api from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PricingPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleUpgrade = async () => {
    if (!user) {
      alert('Please login first to upgrade');
      router.push('/login');
      return;
    }

    if (user.subscription?.tier === 'premium') {
      alert('You are already a premium member!');
      return;
    }

    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Create order on backend
      const { data } = await api.post('/payment/create-order');

      if (!data.success) {
        throw new Error('Failed to create order');
      }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'Intelligent Storage',
        description: 'Premium Subscription',
        order_id: data.orderId,
        handler: async function (response: any) {
          try {
            // Verify payment on backend
            const verifyData = await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyData.data.success) {
              setShowPaymentModal(false);
              alert('🎉 Payment Successful! You are now a PREMIUM member!');

              // Update user in auth store
              const updatedUser = { ...user!, subscription: verifyData.data.subscription };
              useAuthStore.setState({ user: updatedUser as any });

              router.push('/dashboard');
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error: any) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        theme: {
          color: '#d4af37', // Gold color
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            setShowPaymentModal(false);
          }
        }
      };

      if (window.Razorpay && scriptLoaded) {
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        alert('Payment gateway not loaded. Please refresh the page and try again.');
      }

      setLoading(false);
    } catch (error: any) {
      console.error('Payment error:', error);
      alert('Failed to initiate payment. Please try again.');
      setLoading(false);
    }
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

      {/* Premium Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-premium-900 border-2 border-gold-500/30 p-10 max-w-lg w-full"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-gold mb-6">
                <Crown className="w-10 h-10 text-premium-950" />
              </div>
              <h2 className="text-3xl font-display font-bold mb-3 text-gold-500 tracking-wide">Upgrade to Premium</h2>
              <p className="text-gold-200/70 tracking-wide">Complete your payment</p>
            </div>

            <div className="bg-premium-950 border border-gold-500/20 p-6 mb-8">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gold-500/10">
                <span className="text-gold-200/70">Plan</span>
                <span className="font-display font-bold text-gold-200">Premium Yearly</span>
              </div>
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gold-500/10">
                <span className="text-gold-200/70">Duration</span>
                <span className="font-display font-bold text-gold-200">1 Year</span>
              </div>
              <div className="flex justify-between items-center mb-6 pb-6 border-b border-gold-500/10">
                <span className="text-gold-200/70">Storage</span>
                <span className="font-display font-bold text-gold-200">500 GB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xl font-display font-bold text-gold-500 uppercase tracking-wider">Total</span>
                <span className="text-4xl font-display font-bold text-gold-500">₹499</span>
              </div>
            </div>

            <div className="space-y-3">
              <motion.button
                onClick={handlePayment}
                disabled={loading}
                className="btn-luxury w-full text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                <span className="uppercase tracking-wider">
                  {loading ? 'Processing...' : 'Pay ₹499'}
                </span>
              </motion.button>
              <button
                onClick={() => setShowPaymentModal(false)}
                disabled={loading}
                className="btn bg-premium-800 text-gold-500 border border-gold-500/30 hover:bg-premium-700 w-full disabled:opacity-50"
              >
                <span className="uppercase tracking-wider text-sm">Cancel</span>
              </button>
            </div>

            <p className="text-xs text-gold-200/50 text-center mt-6 tracking-wide">
              Secure payment via Razorpay • Cancel anytime
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
