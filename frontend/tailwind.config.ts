import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Premium Gold Palette
        gold: {
          50: '#fdfbf7',
          100: '#faf6ed',
          200: '#f4ead5',
          300: '#ecddb8',
          400: '#e1c992',
          500: '#d4af37', // Primary gold
          600: '#c19a2e',
          700: '#a17d26',
          800: '#826423',
          900: '#6b521d',
        },
        // Premium Black/Gray Palette
        premium: {
          50: '#f8f9fa',
          100: '#f1f3f5',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
          600: '#6c757d',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
          950: '#0a0a0a', // Deep black
        },
        // Accent colors
        accent: {
          bronze: '#cd7f32',
          champagne: '#f7e7ce',
          platinum: '#e5e4e2',
          sapphire: '#0f52ba',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cinzel', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'fade-in': 'fadeIn 0.8s ease-in',
        'slide-up': 'slideUp 0.8s ease-out',
        'slide-down': 'slideDown 0.8s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(40px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-40px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(212, 175, 55, 0.5), 0 0 10px rgba(212, 175, 55, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.8), 0 0 30px rgba(212, 175, 55, 0.4)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-luxury': 'linear-gradient(135deg, #0a0a0a 0%, #212529 50%, #0a0a0a 100%)',
        'gradient-gold': 'linear-gradient(135deg, #d4af37 0%, #f4ead5 50%, #d4af37 100%)',
        'shimmer': 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.3), transparent)',
      },
      boxShadow: {
        'luxury': '0 10px 40px rgba(0, 0, 0, 0.3)',
        'luxury-lg': '0 20px 60px rgba(0, 0, 0, 0.4)',
        'gold': '0 4px 20px rgba(212, 175, 55, 0.3)',
        'gold-lg': '0 10px 40px rgba(212, 175, 55, 0.4)',
        'inner-luxury': 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
};

export default config;
