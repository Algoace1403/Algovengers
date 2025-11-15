'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { UserPlus, Mail, Lock, User, AlertCircle, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register(formData.email, formData.password, formData.fullName);
      router.push('/dashboard');
    } catch (err) {
      // Error is handled by zustand store
    } finally {
      setLoading(false);
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-premium-950 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(212, 175, 55) 1px, transparent 0)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Elegant Gold Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-32 right-32 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-32 left-32 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative max-w-md w-full z-10"
      >
        {/* Premium Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
            <div className="w-16 h-16 bg-gradient-gold flex items-center justify-center">
              <span className="text-premium-950 font-display text-3xl">IS</span>
            </div>
          </Link>
          <h1 className="text-5xl font-display font-bold text-gold-500 mb-3 tracking-wide">
            Join the Elite
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-4"></div>
          <p className="text-gold-100/70 text-lg tracking-wide">Begin your journey to excellence</p>
        </div>

        {/* Premium Register Card */}
        <motion.div
          className="card-dark p-12 border-2 border-gold-500/20"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl font-display font-bold mb-8 text-center text-gold-500 tracking-wide">
            Create Account
          </h2>

          {displayError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-900/20 border border-red-500/30 flex items-center gap-3 text-red-300"
            >
              <AlertCircle size={20} />
              <span className="text-sm">{displayError}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gold-200 mb-3 uppercase tracking-wider font-display">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gold-500/50" size={20} />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-premium-900 border-2 border-gold-500/30 text-gold-100 placeholder-gold-500/30 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all duration-300 font-sans"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gold-200 mb-3 uppercase tracking-wider font-display">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gold-500/50" size={20} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-premium-900 border-2 border-gold-500/30 text-gold-100 placeholder-gold-500/30 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all duration-300 font-sans"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gold-200 mb-3 uppercase tracking-wider font-display">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gold-500/50" size={20} />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-premium-900 border-2 border-gold-500/30 text-gold-100 placeholder-gold-500/30 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all duration-300 font-sans"
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
              </div>
              <p className="text-xs text-gold-500/50 mt-2 tracking-wide">Minimum 6 characters</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gold-200 mb-3 uppercase tracking-wider font-display">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gold-500/50" size={20} />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-premium-900 border-2 border-gold-500/30 text-gold-100 placeholder-gold-500/30 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all duration-300 font-sans"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="btn-luxury w-full flex items-center justify-center gap-3 py-5 mt-8"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
                  <span className="uppercase tracking-wider text-sm">Creating...</span>
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  <span className="uppercase tracking-wider text-sm">Become a Member</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gold-200/70 text-sm">
              Already a member?{' '}
              <Link href="/login" className="text-gold-500 hover:text-gold-400 font-medium transition-colors uppercase tracking-wider font-display">
                Login
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link href="/" className="inline-flex items-center gap-2 text-gold-200/80 hover:text-gold-500 transition-colors text-sm uppercase tracking-wider font-display">
            <ArrowLeft size={16} />
            <span>Return Home</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
