import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (enabled: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: false,

      toggleDarkMode: () =>
        set((state) => {
          const newMode = !state.isDarkMode;
          // Apply theme to document
          if (newMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { isDarkMode: newMode };
        }),

      setDarkMode: (enabled: boolean) =>
        set(() => {
          // Apply theme to document
          if (enabled) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { isDarkMode: enabled };
        })
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({
        isDarkMode: state.isDarkMode
      })
    }
  )
);
