'use client';

import { Moon, Sun, Crown } from 'lucide-react';
import { useTheme } from '@/lib/theme-provider';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function ThemeToggle() {
  const { theme, setTheme, isPremium } = useTheme();

  const handleToggle = () => {
    if (!isPremium) {
      // Show upgrade prompt for free users
      return;
    }
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="relative">
      {isPremium ? (
        <motion.button
          onClick={handleToggle}
          className="flex items-center gap-2 px-4 py-2 bg-gold-500/10 border border-gold-500/30 hover:bg-gold-500/20 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-5 h-5 text-gold-500" />
              <span className="text-sm font-display text-gold-500 uppercase tracking-wider">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-5 h-5 text-gold-500" />
              <span className="text-sm font-display text-gold-500 uppercase tracking-wider">Dark</span>
            </>
          )}
        </motion.button>
      ) : (
        <Link href="/pricing">
          <motion.button
            className="flex items-center gap-2 px-4 py-2 bg-gradient-gold border border-gold-500 hover:shadow-gold transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Crown className="w-4 h-4 text-premium-950" />
            <Moon className="w-4 h-4 text-premium-950" />
            <span className="text-xs font-display font-bold text-premium-950 uppercase tracking-wider">Premium</span>
          </motion.button>
        </Link>
      )}
    </div>
  );
}
