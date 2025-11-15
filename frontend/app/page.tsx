'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Shield, Zap, Crown, HardDrive } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-premium-950 text-premium-950 dark:text-white">
      {/* Elegant Navigation */}
      <motion.header
        className="fixed top-0 w-full z-50 bg-white/90 dark:bg-premium-950/80 backdrop-blur-xl border-b border-gold-500/20"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-gradient-gold flex items-center justify-center">
                <span className="text-premium-950 font-display text-2xl">IS</span>
              </div>
              <div>
                <h1 className="luxury-title text-gold-500 text-xl tracking-[0.2em]">Intelligent</h1>
                <p className="text-gold-600 dark:text-gold-200 text-xs tracking-[0.3em] uppercase">Storage</p>
              </div>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/login">
                <button className="text-gold-500 hover:text-gold-400 transition-colors duration-300 uppercase tracking-wider text-sm font-display">
                  Login
                </button>
              </Link>
              <Link href="/register">
                <button className="btn-luxury">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section - Ultra Premium */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(212, 175, 55) 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="container mx-auto px-8 relative z-10">
          <motion.div
            className="max-w-5xl mx-auto text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {/* Premium Badge */}
            <motion.div
              className="inline-flex items-center gap-3 px-6 py-3 bg-gold-500/10 border border-gold-500/30 mb-12"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Crown className="w-5 h-5 text-gold-500" />
              <span className="text-gold-500 uppercase tracking-[0.3em] text-sm font-display">Premium Storage Solution</span>
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-7xl md:text-8xl font-display font-bold mb-8 leading-tight">
              <span className="text-premium-950 dark:text-white">The Art of</span>
              <br />
              <span className="gradient-text-luxury">Intelligent Storage</span>
            </h1>

            {/* Luxury Divider */}
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-8"></div>

            {/* Subtitle */}
            <p className="text-2xl text-premium-700 dark:text-gold-100/80 mb-16 font-light tracking-wide max-w-3xl mx-auto leading-relaxed">
              Experience unparalleled organization powered by artificial intelligence.
              <br className="hidden md:block" />
              Where sophistication meets innovation.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/register">
                <motion.button
                  className="btn-luxury px-12 py-5 text-base"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center gap-3">
                    Begin Your Journey
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </motion.button>
              </Link>
              <Link href="/pricing">
                <motion.button
                  className="btn-secondary px-12 py-5 text-base border-gold-500/30 hover:border-gold-500"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Plans
                </motion.button>
              </Link>
            </div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-8 mt-24 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <div className="text-center">
                <div className="luxury-number mb-2">500GB</div>
                <p className="text-premium-700 dark:text-gold-200 text-sm uppercase tracking-wider">Premium Storage</p>
              </div>
              <div className="text-center">
                <div className="luxury-number mb-2">AI</div>
                <p className="text-premium-700 dark:text-gold-200 text-sm uppercase tracking-wider">Powered</p>
              </div>
              <div className="text-center">
                <div className="luxury-number mb-2">24/7</div>
                <p className="text-premium-700 dark:text-gold-200 text-sm uppercase tracking-wider">Support</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-gold-500/30 rounded-full flex justify-center p-2">
            <div className="w-1 h-3 bg-gold-500 rounded-full"></div>
          </div>
        </motion.div>
      </section>

      {/* Features Section - Premium Grid */}
      <section className="premium-section bg-gradient-to-b from-white to-gray-50 dark:from-premium-950 dark:to-premium-900">
        <div className="container mx-auto px-8">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-display font-bold mb-6">
              <span className="text-premium-950 dark:text-white">Crafted for</span> <span className="gradient-text">Excellence</span>
            </h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto"></div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <motion.div
              className="card-dark hover-lift group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="w-16 h-16 bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mb-6 group-hover:bg-gold-500/20 transition-all duration-500">
                <Shield className="w-8 h-8 text-gold-500" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-4 text-gold-500">Uncompromising Security</h3>
              <p className="text-premium-700 dark:text-gold-100/70 leading-relaxed">
                Enterprise-grade protection with end-to-end encryption. Your data remains sovereign and secure.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              className="card-dark hover-lift group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-16 h-16 bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mb-6 group-hover:bg-gold-500/20 transition-all duration-500">
                <Zap className="w-8 h-8 text-gold-500" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-4 text-gold-500">Instantaneous Intelligence</h3>
              <p className="text-premium-700 dark:text-gold-100/70 leading-relaxed">
                AI-powered categorization that understands your content. Organization happens in milliseconds.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              className="card-dark hover-lift group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="w-16 h-16 bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mb-6 group-hover:bg-gold-500/20 transition-all duration-500">
                <Crown className="w-8 h-8 text-gold-500" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-4 text-gold-500">Premium Experience</h3>
              <p className="text-premium-700 dark:text-gold-100/70 leading-relaxed">
                Meticulously crafted interface. Every interaction designed for sophistication and efficiency.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Premium Plan Showcase */}
      <section className="premium-section bg-gray-100 dark:bg-premium-900">
        <div className="container mx-auto px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-display font-bold mb-6">
              <span className="text-premium-950 dark:text-white">Unlock</span> <span className="gradient-text">Premium Features</span>
            </h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-6"></div>
            <p className="text-xl text-premium-700 dark:text-gold-100/70 max-w-3xl mx-auto leading-relaxed">
              Experience the full power of intelligent storage with our premium plan
            </p>
          </motion.div>

          <motion.div
            className="card-dark border-4 border-gold-500/30 bg-gradient-to-br from-premium-950 via-premium-900 to-premium-950 relative overflow-hidden max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Gold Shimmer Effect */}
            <div className="absolute inset-0 gold-shimmer opacity-10"></div>

            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-10 pb-8 border-b border-gold-500/20 flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-gold flex items-center justify-center">
                    <Crown className="w-8 h-8 text-premium-950" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-display font-bold text-gold-500 tracking-wide">Premium Plan</h3>
                    <p className="text-premium-700 dark:text-gold-100/70 tracking-wide">Everything you need and more</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-display font-bold text-gold-500 mb-1">₹499<span className="text-xl text-premium-700 dark:text-gold-200/70">/year</span></div>
                  <p className="text-sm text-premium-600 dark:text-gold-200/60 tracking-wide">Just ₹41/month</p>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {/* Feature 1 */}
                <motion.div
                  className="flex items-start gap-3 p-5 bg-premium-950 border border-gold-500/20 hover:border-gold-500/40 transition-all duration-300 hover-lift"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="w-12 h-12 bg-gold-500/10 border border-gold-500/30 flex items-center justify-center flex-shrink-0">
                    <HardDrive className="w-6 h-6 text-gold-500" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-gold-500 mb-2 text-lg tracking-wide">500 GB Storage</h4>
                    <p className="text-sm text-premium-700 dark:text-gold-100/60 leading-relaxed">5x more storage space for all your media files</p>
                  </div>
                </motion.div>

                {/* Feature 2 */}
                <motion.div
                  className="flex items-start gap-3 p-5 bg-premium-950 border border-gold-500/20 hover:border-gold-500/40 transition-all duration-300 hover-lift"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="w-12 h-12 bg-gold-500/10 border border-gold-500/30 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-gold-500" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-gold-500 mb-2 text-lg tracking-wide">Advanced AI Search</h4>
                    <p className="text-sm text-gold-100/60 leading-relaxed">Find files instantly by content and context</p>
                  </div>
                </motion.div>

                {/* Feature 3 */}
                <motion.div
                  className="flex items-start gap-3 p-5 bg-premium-950 border border-gold-500/20 hover:border-gold-500/40 transition-all duration-300 hover-lift"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="w-12 h-12 bg-gold-500/10 border border-gold-500/30 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-gold-500" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-gold-500 mb-2 text-lg tracking-wide">Priority Support</h4>
                    <p className="text-sm text-gold-100/60 leading-relaxed">24/7 premium customer support team</p>
                  </div>
                </motion.div>

                {/* Feature 4 */}
                <motion.div
                  className="flex items-start gap-3 p-5 bg-premium-950 border border-gold-500/20 hover:border-gold-500/40 transition-all duration-300 hover-lift"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="w-12 h-12 bg-gold-500/10 border border-gold-500/30 flex items-center justify-center flex-shrink-0">
                    <Crown className="w-6 h-6 text-gold-500" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-gold-500 mb-2 text-lg tracking-wide">Bulk Operations</h4>
                    <p className="text-sm text-gold-100/60 leading-relaxed">Download multiple files as ZIP archives</p>
                  </div>
                </motion.div>

                {/* Feature 5 */}
                <motion.div
                  className="flex items-start gap-3 p-5 bg-premium-950 border border-gold-500/20 hover:border-gold-500/40 transition-all duration-300 hover-lift"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="w-12 h-12 bg-gold-500/10 border border-gold-500/30 flex items-center justify-center flex-shrink-0">
                    <Crown className="w-6 h-6 text-gold-500" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-gold-500 mb-2 text-lg tracking-wide">Smart Favorites</h4>
                    <p className="text-sm text-gold-100/60 leading-relaxed">Mark and organize your favorite files</p>
                  </div>
                </motion.div>

                {/* Feature 6 */}
                <motion.div
                  className="flex items-start gap-3 p-5 bg-premium-950 border border-gold-500/20 hover:border-gold-500/40 transition-all duration-300 hover-lift"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="w-12 h-12 bg-gold-500/10 border border-gold-500/30 flex items-center justify-center flex-shrink-0">
                    <Crown className="w-6 h-6 text-gold-500" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-gold-500 mb-2 text-lg tracking-wide">Advanced Analytics</h4>
                    <p className="text-sm text-gold-100/60 leading-relaxed">Detailed insights into your storage usage</p>
                  </div>
                </motion.div>
              </div>

              {/* CTA Footer */}
              <div className="bg-premium-950 p-8 border-t-2 border-gold-500/30 flex items-center justify-between flex-wrap gap-6">
                <div>
                  <p className="text-gold-100 font-display text-xl mb-2">
                    <span className="text-gold-500 font-bold">Limited Time:</span> Get premium for just ₹499/year
                  </p>
                  <p className="text-gold-200/60 tracking-wide">
                    Join thousands of satisfied premium users • Cancel anytime
                  </p>
                </div>
                <Link href="/pricing">
                  <motion.button
                    className="btn-luxury px-12 py-5 text-base flex items-center gap-3"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Crown className="w-5 h-5" />
                    <span className="uppercase tracking-wider">View Pricing</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Luxury */}
      <section className="premium-section bg-gradient-to-b from-gray-50 to-white dark:from-premium-900 dark:to-premium-950">
        <div className="container mx-auto px-8">
          <motion.div
            className="card-luxury max-w-4xl mx-auto text-center py-20"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-display font-bold mb-6">
              <span className="gradient-text">Elevate Your Storage</span>
            </h2>
            <p className="text-xl text-premium-700 dark:text-premium-700 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join the discerning few who demand excellence in digital organization.
            </p>
            <Link href="/register">
              <button className="btn-luxury px-16 py-6 text-lg luxury-pulse">
                <span className="flex items-center gap-3">
                  Become a Member
                  <ArrowRight className="w-6 h-6" />
                </span>
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer - Minimal & Elegant */}
      <footer className="border-t border-gold-500/20 py-12 bg-white dark:bg-premium-950">
        <div className="container mx-auto px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-gold flex items-center justify-center">
                <span className="text-premium-950 font-display text-lg">IS</span>
              </div>
              <div>
                <p className="text-gold-500 font-display text-sm tracking-[0.2em]">INTELLIGENT STORAGE</p>
                <p className="text-premium-600 dark:text-gold-200/60 text-xs">© 2024 All Rights Reserved</p>
              </div>
            </div>
            <div className="flex gap-8">
              <Link href="/pricing" className="text-premium-700 dark:text-gold-200/80 hover:text-gold-500 transition-colors text-sm uppercase tracking-wider">
                Pricing
              </Link>
              <Link href="/dashboard" className="text-premium-700 dark:text-gold-200/80 hover:text-gold-500 transition-colors text-sm uppercase tracking-wider">
                Dashboard
              </Link>
              <Link href="/login" className="text-premium-700 dark:text-gold-200/80 hover:text-gold-500 transition-colors text-sm uppercase tracking-wider">
                Login
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
