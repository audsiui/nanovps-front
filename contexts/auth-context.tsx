'use client';

import { createContext, useContext } from 'react';
import type { User } from '@/lib/types';

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (data: { accessToken: string; refreshToken: string; expiresIn: number; user: User }) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// 重新导出 Provider，方便使用
export { AuthProvider } from '@/providers/auth-provider';
