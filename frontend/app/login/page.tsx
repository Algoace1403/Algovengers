'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { LogIn, Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      router.push('/dashboard');
    } catch (err) {
      // Error is handled by zustand store
    } finally {
      setLoading(false);
    }
  };

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
          className="absolute top-20 left-20 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl"
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
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl"
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
            Welcome Back
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-4"></div>
          <p className="text-gold-100/70 text-lg tracking-wide">Access your intelligent storage</p>
        </div>

        {/* Premium Login Card */}
        <motion.div
          className="card-dark p-12 border-2 border-gold-500/20"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl font-display font-bold mb-8 text-center text-gold-500 tracking-wide">
            Login
          </h2>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-900/20 border border-red-500/30 flex items-center gap-3 text-red-300"
            >
              <AlertCircle size={20} />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  <span className="uppercase tracking-wider text-sm">Authenticating...</span>
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  <span className="uppercase tracking-wider text-sm">Enter</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-gold-200/70 text-sm">
              Don't have an account?{' '}
              <Link href="/register" className="text-gold-500 hover:text-gold-400 font-medium transition-colors uppercase tracking-wider font-display">
                Create Account
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
