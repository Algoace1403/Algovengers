'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuthStore } from './auth-store';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isPremium: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const [theme, setTheme] = useState<Theme>('light');

  // Check if user is premium
  const isPremium = user?.subscription?.tier === 'premium' || user?.subscriptionTier === 'premium';

  useEffect(() => {
    // Only allow dark mode if user is premium
    if (isPremium) {
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme === 'dark') {
        setTheme('dark');
        document.documentElement.classList.add('dark');
      }
    } else {
      // Force light mode for free users
      setTheme('light');
      document.documentElement.classList.remove('dark');
      localStorage.removeItem('theme');
    }
  }, [isPremium]);

  const handleSetTheme = (newTheme: Theme) => {
    if (!isPremium && newTheme === 'dark') {
      // Prevent free users from enabling dark mode
      alert('Dark mode is a premium feature! Upgrade to unlock.');
      return;
    }

    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, isPremium }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
