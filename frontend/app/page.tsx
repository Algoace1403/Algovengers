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
        <div className="container mx-auto px-12 lg:px-16 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-gradient-gold flex items-center justify-center rounded-lg shadow-lg">
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
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-32">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(212, 175, 55) 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: 'linear-gradient(135deg, #d4af37, #f4e4c1)',
                left: `${(i * 8 + 10) % 90}%`,
                top: `${(i * 13 + 20) % 80}%`,
                opacity: 0.3,
              }}
              animate={{
                y: [-20, -60, -20],
                x: [0, 20, 0],
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Radial glow effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gold-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-12 lg:px-16 relative z-10">
          <motion.div
            className="max-w-5xl mx-auto text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {/* Premium Badge */}
            <motion.div
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gold-500/10 via-gold-500/20 to-gold-500/10 border-2 border-gold-500/40 mb-12 rounded-full shadow-lg backdrop-blur-sm"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(212, 175, 55, 0.3)" }}
            >
              <Crown className="w-5 h-5 text-gold-500" />
              <span className="text-gold-500 uppercase tracking-[0.3em] text-sm font-display font-semibold">Premium Storage Solution</span>
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
            <motion.p
              className="text-2xl text-premium-700 dark:text-gold-100/80 mb-20 font-light tracking-wide max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Experience unparalleled organization powered by artificial intelligence.
              <br className="hidden md:block" />
              <span className="text-gold-500 font-medium">Where sophistication meets innovation.</span>
            </motion.p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-8">
              <Link href="/register">
                <motion.button
                  className="relative px-16 py-7 text-lg font-bold rounded-2xl overflow-hidden group shadow-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #d4af37 0%, #f4e4c1 50%, #d4af37 100%)',
                    boxShadow: '0 20px 60px rgba(212, 175, 55, 0.4), 0 0 0 1px rgba(212, 175, 55, 0.3)',
                  }}
                  whileHover={{
                    scale: 1.1,
                    y: -4,
                    boxShadow: '0 30px 80px rgba(212, 175, 55, 0.6), 0 0 40px rgba(212, 175, 55, 0.4), 0 0 0 2px rgba(212, 175, 55, 0.5)'
                  }}
                  whileTap={{ scale: 0.98 }}
                  animate={{
                    boxShadow: [
                      '0 20px 60px rgba(212, 175, 55, 0.4), 0 0 0 1px rgba(212, 175, 55, 0.3)',
                      '0 20px 60px rgba(212, 175, 55, 0.6), 0 0 20px rgba(212, 175, 55, 0.3), 0 0 0 1px rgba(212, 175, 55, 0.4)',
                      '0 20px 60px rgba(212, 175, 55, 0.4), 0 0 0 1px rgba(212, 175, 55, 0.3)',
                    ]
                  }}
                  transition={{
                    boxShadow: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                  {/* Button content */}
                  <span className="flex items-center gap-4 relative z-10 text-premium-950 uppercase tracking-[0.2em] font-display">
                    <motion.div
                      animate={{ rotate: [0, 5, 0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Crown className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    </motion.div>
                    Begin Your Journey
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </span>
                </motion.button>
              </Link>

              <Link href="/pricing">
                <motion.button
                  className="relative px-16 py-7 text-lg font-bold border-3 rounded-2xl overflow-hidden group bg-white/5 backdrop-blur-sm"
                  style={{
                    borderWidth: '2px',
                    borderImage: 'linear-gradient(135deg, #d4af37, #f4e4c1, #d4af37) 1',
                    boxShadow: '0 10px 40px rgba(212, 175, 55, 0.2)'
                  }}
                  whileHover={{
                    scale: 1.08,
                    y: -3,
                    boxShadow: '0 20px 60px rgba(212, 175, 55, 0.4), 0 0 20px rgba(212, 175, 55, 0.2)'
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-gold-500/0 via-gold-500/20 to-gold-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <span className="relative z-10 flex items-center gap-3 text-gold-500 uppercase tracking-[0.2em] font-display">
                    <Zap className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                    Explore Plans
                    <Shield className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                  </span>
                </motion.button>
              </Link>
            </div>

            {/* Trust indicators */}
            <motion.div
              className="flex items-center justify-center gap-6 flex-wrap text-sm text-premium-600 dark:text-gold-200/60 mb-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium">No credit card required</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-gold-500/30"></div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gold-500" />
                <span className="font-medium">100% Secure</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-gold-500/30"></div>
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-gold-500" />
                <span className="font-medium">Premium Features Included</span>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-12 mt-16 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <motion.div
                className="text-center group"
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative inline-block">
                  <div className="luxury-number mb-3 group-hover:scale-110 transition-transform">500GB</div>
                  <div className="absolute -inset-4 bg-gold-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <p className="text-premium-700 dark:text-gold-200 text-sm uppercase tracking-wider font-semibold">Premium Storage</p>
                <p className="text-xs text-premium-600 dark:text-gold-200/60 mt-1">5x more space</p>
              </motion.div>
              <motion.div
                className="text-center group"
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative inline-block">
                  <div className="luxury-number mb-3 group-hover:scale-110 transition-transform">AI</div>
                  <div className="absolute -inset-4 bg-gold-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <p className="text-premium-700 dark:text-gold-200 text-sm uppercase tracking-wider font-semibold">Powered</p>
                <p className="text-xs text-premium-600 dark:text-gold-200/60 mt-1">Smart categorization</p>
              </motion.div>
              <motion.div
                className="text-center group"
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative inline-block">
                  <div className="luxury-number mb-3 group-hover:scale-110 transition-transform">24/7</div>
                  <div className="absolute -inset-4 bg-gold-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <p className="text-premium-700 dark:text-gold-200 text-sm uppercase tracking-wider font-semibold">Support</p>
                <p className="text-xs text-premium-600 dark:text-gold-200/60 mt-1">Always here for you</p>
              </motion.div>
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
        <div className="container mx-auto px-12 lg:px-16">
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
              <div className="w-16 h-16 bg-gold-500/10 border border-gold-500/30 rounded-xl flex items-center justify-center mb-6 group-hover:bg-gold-500/20 transition-all duration-500">
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
              <div className="w-16 h-16 bg-gold-500/10 border border-gold-500/30 rounded-xl flex items-center justify-center mb-6 group-hover:bg-gold-500/20 transition-all duration-500">
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
              <div className="w-16 h-16 bg-gold-500/10 border border-gold-500/30 rounded-xl flex items-center justify-center mb-6 group-hover:bg-gold-500/20 transition-all duration-500">
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
        <div className="container mx-auto px-12 lg:px-16">
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
            className="card-dark border-4 border-gold-500/30 bg-gradient-to-br from-premium-950 via-premium-900 to-premium-950 relative overflow-hidden max-w-6xl mx-auto rounded-2xl"
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
                  <div className="w-16 h-16 bg-gradient-gold flex items-center justify-center rounded-xl shadow-lg">
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
                  className="flex items-start gap-3 p-5 bg-premium-950 border border-gold-500/20 hover:border-gold-500/40 transition-all duration-300 hover-lift rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="w-12 h-12 bg-gold-500/10 border border-gold-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HardDrive className="w-6 h-6 text-gold-500" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-gold-500 mb-2 text-lg tracking-wide">500 GB Storage</h4>
                    <p className="text-sm text-premium-700 dark:text-gold-100/60 leading-relaxed">5x more storage space for all your media files</p>
                  </div>
                </motion.div>

                {/* Feature 2 */}
                <motion.div
                  className="flex items-start gap-3 p-5 bg-premium-950 border border-gold-500/20 hover:border-gold-500/40 transition-all duration-300 hover-lift rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="w-12 h-12 bg-gold-500/10 border border-gold-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-gold-500" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-gold-500 mb-2 text-lg tracking-wide">Advanced AI Search</h4>
                    <p className="text-sm text-gold-100/60 leading-relaxed">Find files instantly by content and context</p>
                  </div>
                </motion.div>

                {/* Feature 3 */}
                <motion.div
                  className="flex items-start gap-3 p-5 bg-premium-950 border border-gold-500/20 hover:border-gold-500/40 transition-all duration-300 hover-lift rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="w-12 h-12 bg-gold-500/10 border border-gold-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-gold-500" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-gold-500 mb-2 text-lg tracking-wide">Priority Support</h4>
                    <p className="text-sm text-gold-100/60 leading-relaxed">24/7 premium customer support team</p>
                  </div>
                </motion.div>

                {/* Feature 4 */}
                <motion.div
                  className="flex items-start gap-3 p-5 bg-premium-950 border border-gold-500/20 hover:border-gold-500/40 transition-all duration-300 hover-lift rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="w-12 h-12 bg-gold-500/10 border border-gold-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Crown className="w-6 h-6 text-gold-500" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-gold-500 mb-2 text-lg tracking-wide">Bulk Operations</h4>
                    <p className="text-sm text-gold-100/60 leading-relaxed">Download multiple files as ZIP archives</p>
                  </div>
                </motion.div>

                {/* Feature 5 */}
                <motion.div
                  className="flex items-start gap-3 p-5 bg-premium-950 border border-gold-500/20 hover:border-gold-500/40 transition-all duration-300 hover-lift rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="w-12 h-12 bg-gold-500/10 border border-gold-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Crown className="w-6 h-6 text-gold-500" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-gold-500 mb-2 text-lg tracking-wide">Smart Favorites</h4>
                    <p className="text-sm text-gold-100/60 leading-relaxed">Mark and organize your favorite files</p>
                  </div>
                </motion.div>

                {/* Feature 6 */}
                <motion.div
                  className="flex items-start gap-3 p-5 bg-premium-950 border border-gold-500/20 hover:border-gold-500/40 transition-all duration-300 hover-lift rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="w-12 h-12 bg-gold-500/10 border border-gold-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Crown className="w-6 h-6 text-gold-500" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-gold-500 mb-2 text-lg tracking-wide">Advanced Analytics</h4>
                    <p className="text-sm text-gold-100/60 leading-relaxed">Detailed insights into your storage usage</p>
                  </div>
                </motion.div>
              </div>

              {/* CTA Footer */}
              <div className="bg-premium-950 p-8 border-t-2 border-gold-500/30 rounded-b-2xl flex items-center justify-between flex-wrap gap-6">
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
                    className="btn-luxury px-12 py-5 text-base flex items-center gap-3 rounded-xl shadow-xl relative overflow-hidden group"
                    whileHover={{ scale: 1.08, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Crown className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    <span className="uppercase tracking-wider relative z-10">View Pricing</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-r from-gold-500/20 to-gold-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Luxury */}
      <section className="premium-section bg-gradient-to-b from-gray-50 to-white dark:from-premium-900 dark:to-premium-950">
        <div className="container mx-auto px-12 lg:px-16">
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
              <motion.button
                className="btn-luxury px-16 py-6 text-lg luxury-pulse rounded-xl shadow-2xl relative overflow-hidden group"
                whileHover={{ scale: 1.08, y: -4 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center gap-3 relative z-10">
                  <Crown className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  Become a Member
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-gold-500/30 to-gold-600/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer - Minimal & Elegant */}
      <footer className="border-t border-gold-500/20 py-12 bg-white dark:bg-premium-950">
        <div className="container mx-auto px-12 lg:px-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-gold flex items-center justify-center rounded-lg shadow-md">
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
