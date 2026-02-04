'use client';

import { useEffect, useState, useCallback } from 'react';
import { getAccessToken, clearTokens, saveTokens } from '@/lib/token';
import { AuthContext } from '@/contexts/auth-context';
import type { User } from '@/lib/types';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // 初始化：从 localStorage 恢复登录状态
  useEffect(() => {
    const initAuth = () => {
      const token = getAccessToken();
      const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

      if (token && userStr) {
        try {
          const parsedUser: User = JSON.parse(userStr);
          setUser(parsedUser);
        } catch {
          clearTokens();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // 登录：保存 token 和用户信息
  const login = useCallback((data: { accessToken: string; refreshToken: string; expiresIn: number; user: User }) => {
    saveTokens({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresIn: data.expiresIn,
    });
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
  }, []);

  // 登出：清除所有数据
  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
  }, []);

  // 更新用户信息
  const updateUser = useCallback((newUser: User) => {
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        isLoading,
        user,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
