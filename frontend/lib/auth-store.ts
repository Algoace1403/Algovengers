import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  fullName: string;
  name?: string;
  subscriptionTier?: 'free' | 'premium';
  subscription?: {
    tier: 'free' | 'premium';
    startDate?: Date;
    endDate?: Date;
    paymentId?: string;
  };
  storageUsed?: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });

          const response = await axios.post(`${API_URL}/auth/login`, {
            email,
            password
          });

          const { token, user } = response.data;

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

        } catch (error: any) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.response?.data?.error || 'Login failed'
          });
          throw error;
        }
      },

      register: async (email: string, password: string, fullName: string) => {
        try {
          set({ isLoading: true, error: null });

          const response = await axios.post(`${API_URL}/auth/register`, {
            email,
            password,
            name: fullName // Backend expects "name" not "fullName"
          });

          const { token, user } = response.data;

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

        } catch (error: any) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: error.response?.data?.error || 'Registration failed'
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null
        });
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'auth-storage', // name of item in localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
