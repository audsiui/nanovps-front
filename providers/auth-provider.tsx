'use client';

import { useEffect, useState, useCallback } from 'react';
import { getAccessToken, getRefreshToken, clearTokens, saveTokens } from '@/lib/token';
import { logoutApi, useMe } from '@/lib/requests/auth';
import { AuthContext } from '@/contexts/auth-context';
import type { User } from '@/lib/types';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // 从服务器获取最新用户信息
  const { data: meData, refetch: refetchMe } = useMe({
    enabled: false, // 默认不自动获取，手动控制
  });

  // 初始化：从 localStorage 恢复登录状态，然后刷新服务器数据
  useEffect(() => {
    const initAuth = async () => {
      const token = getAccessToken();
      const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

      if (token && userStr) {
        try {
          const parsedUser: User = JSON.parse(userStr);
          setUser(parsedUser);
          // 从服务器刷新最新数据
          await refetchMe();
        } catch {
          clearTokens();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [refetchMe]);

  // 当获取到服务器用户信息时，更新本地状态
  useEffect(() => {
    if (meData) {
      localStorage.setItem('user', JSON.stringify(meData));
      setUser(meData);
    }
  }, [meData]);

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

  // 登出：调用后端接口，清除所有数据
  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        await logoutApi(refreshToken);
      } catch {
        // 即使接口调用失败也要继续清除本地数据
      }
    }
    clearTokens();
    setUser(null);
  }, []);

  // 更新用户信息
  const updateUser = useCallback((newUser: User) => {
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  }, []);

  // 刷新用户信息（从服务器获取最新数据）
  const refreshUser = useCallback(() => {
    return refetchMe();
  }, [refetchMe]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        isLoading,
        user,
        login,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
