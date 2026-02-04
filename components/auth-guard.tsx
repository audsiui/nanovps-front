'use client';

import { Loader2 } from 'lucide-react';
import { useRequireAuth, useRedirectIfAuthenticated } from '@/hooks/use-require-auth';
import type { ReactNode } from 'react';

interface AuthGuardProps {
  children: ReactNode;
  /** 允许访问的角色列表 */
  allowedRoles?: string[];
  /** 未登录时的跳转地址 */
  redirectTo?: string;
  /** 无权限时的跳转地址 */
  unauthorizedRedirect?: string;
  /** 自定义加载组件 */
  loadingComponent?: ReactNode;
}

/**
 * 认证守卫组件 - 包裹需要登录才能访问的页面内容
 *
 * @example
 * // 任何登录用户可访问
 * <AuthGuard>
 *   <DashboardContent />
 * </AuthGuard>
 *
 * @example
 * // 仅管理员可访问
 * <AuthGuard allowedRoles={['admin']} unauthorizedRedirect="/dashboard">
 *   <AdminContent />
 * </AuthGuard>
 */
export function AuthGuard({
  children,
  allowedRoles,
  redirectTo = '/auth',
  unauthorizedRedirect = '/',
  loadingComponent,
}: AuthGuardProps) {
  const { isLoading } = useRequireAuth({
    allowedRoles,
    redirectTo,
    unauthorizedRedirect,
  });

  if (isLoading) {
    return (
      <>{loadingComponent ?? <DefaultLoading />}</>
    );
  }

  return <>{children}</>;
}

interface GuestGuardProps {
  children: ReactNode;
  /** 管理员跳转地址 */
  adminRedirect?: string;
  /** 普通用户跳转地址 */
  userRedirect?: string;
  /** 自定义加载组件 */
  loadingComponent?: ReactNode;
}

/**
 * 访客守卫组件 - 仅未登录用户可访问（用于登录页）
 * 已登录用户会自动跳转到对应页面
 *
 * @example
 * <GuestGuard>
 *   <LoginForm />
 * </GuestGuard>
 */
export function GuestGuard({
  children,
  adminRedirect = '/admin/dashboard',
  userRedirect = '/dashboard',
  loadingComponent,
}: GuestGuardProps) {
  const { isLoading } = useRedirectIfAuthenticated({
    adminRedirect,
    userRedirect,
  });

  if (isLoading) {
    return <>{loadingComponent ?? <DefaultLoading />}</>;
  }

  return <>{children}</>;
}

// 默认加载组件
function DefaultLoading() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
