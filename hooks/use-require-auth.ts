'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

interface UseRequireAuthOptions {
  /** 允许访问的角色列表，不传则表示任何登录用户都可访问 */
  allowedRoles?: string[];
  /** 未登录时的跳转地址，默认 '/auth' */
  redirectTo?: string;
  /** 无权限时的跳转地址，默认 '/' */
  unauthorizedRedirect?: string;
}

interface UseRequireAuthReturn {
  /** 是否正在加载或检查权限 */
  isLoading: boolean;
  /** 当前用户信息 */
  user: ReturnType<typeof useAuth>['user'];
  /** 当前用户角色 */
  role: string | null;
  /** 是否有权限访问 */
  hasPermission: boolean;
}

/**
 * 路由守卫 Hook - 用于需要登录的页面
 *
 * @example
 * // 普通登录用户可访问
 * function DashboardPage() {
 *   const { isLoading } = useRequireAuth();
 *   if (isLoading) return <Loading />;
 *   return <Dashboard />;
 * }
 *
 * @example
 * // 仅管理员可访问
 * function AdminPage() {
 *   const { isLoading, hasPermission } = useRequireAuth({
 *     allowedRoles: ['admin'],
 *     unauthorizedRedirect: '/dashboard'
 *   });
 *   if (isLoading) return <Loading />;
 *   return <AdminPanel />;
 * }
 */
export function useRequireAuth(options: UseRequireAuthOptions = {}): UseRequireAuthReturn {
  const { allowedRoles, redirectTo = '/auth', unauthorizedRedirect = '/' } = options;
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const router = useRouter();

  const role = user?.role ?? null;
  const hasPermission = !allowedRoles || (role !== null && allowedRoles.includes(role));

  useEffect(() => {
    // 等待认证状态初始化完成
    if (authLoading) return;

    // 未登录，重定向到登录页
    if (!isAuthenticated) {
      router.replace(redirectTo);
      return;
    }

    // 已登录但无权限，重定向到无权限页面
    if (!hasPermission) {
      router.replace(unauthorizedRedirect);
    }
  }, [isAuthenticated, authLoading, hasPermission, router, redirectTo, unauthorizedRedirect]);

  return {
    isLoading: authLoading || !isAuthenticated || !hasPermission,
    user,
    role,
    hasPermission,
  };
}

/**
 * 反向守卫 Hook - 用于登录页（已登录用户自动跳转）
 *
 * @example
 * function AuthPage() {
 *   const { isLoading, redirectTo } = useRedirectIfAuthenticated({
 *     adminRedirect: '/admin/dashboard',
 *     userRedirect: '/dashboard'
 *   });
 *
 *   if (isLoading) return <Loading />;
 *   return <LoginForm />;
 * }
 */
export function useRedirectIfAuthenticated(options: {
  /** 管理员跳转地址 */
  adminRedirect?: string;
  /** 普通用户跳转地址 */
  userRedirect?: string;
  /** 默认跳转地址（当角色未知时） */
  defaultRedirect?: string;
} = {}): { isLoading: boolean } {
  const { adminRedirect = '/admin/dashboard', userRedirect = '/dashboard', defaultRedirect = '/dashboard' } = options;
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;

    if (isAuthenticated && user) {
      const redirectPath = user.role === 'admin' ? adminRedirect : userRedirect;
      router.replace(redirectPath);
    }
  }, [isAuthenticated, authLoading, user, router, adminRedirect, userRedirect]);

  return {
    isLoading: authLoading || isAuthenticated,
  };
}
