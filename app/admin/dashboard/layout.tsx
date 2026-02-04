'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAccessToken } from '@/lib/token';
import {
  LayoutDashboard,
  Users,
  Server,
  ShoppingCart,
  CreditCard,
  Ticket,
  Settings,
  Shield,
  Menu,
  LogOut,
  Bell,
  ChevronRight,
  Home,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ModeToggle } from '@/components/theme-toggle';

// 管理员菜单项
const menuItems = [
  { icon: LayoutDashboard, label: '总览', href: '/admin/dashboard' },
  { icon: Users, label: '用户管理', href: '/admin/dashboard/users' },
  { icon: Server, label: '实例管理', href: '/admin/dashboard/instances' },
  { icon: ShoppingCart, label: '订单管理', href: '/admin/dashboard/orders' },
  { icon: CreditCard, label: '财务管理', href: '/admin/dashboard/finance' },
  { icon: Ticket, label: '工单管理', href: '/admin/dashboard/tickets' },
  { icon: Shield, label: '权限管理', href: '/admin/dashboard/roles' },
  { icon: Settings, label: '系统设置', href: '/admin/dashboard/settings' },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // 检查登录状态
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.replace('/auth');
    } else {
      setIsCheckingAuth(false);
    }
  }, [router]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-muted">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      {/* 顶部导航栏 - 传统风格 */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b border-border/50  z-50">
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
          {/* 左侧：Logo 和菜单按钮 */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
                <Shield className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-foreground hidden sm:block">
                NanoVPS 管理后台
              </span>
            </Link>
          </div>

          {/* 右侧：通知和用户 */}
          <div className="flex items-center gap-4">
            {/* 主题切换 */}
            <ModeToggle />

            {/* 通知 */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
            </Button>

            {/* 用户下拉 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" alt="@admin" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      AD
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-sm font-medium text-foreground">Administrator</span>
                    <span className="text-xs text-muted-foreground">超级管理员</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">Admin</p>
                    <p className="text-xs text-muted-foreground">admin@nanovps.io</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  个人设置
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <Link href="/dashboard">
                  <DropdownMenuItem>
                    <Home className="mr-2 h-4 w-4" />
                    返回前台
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* 桌面端侧边栏 - 传统固定左侧 */}
      <aside className="hidden lg:block fixed left-0 top-16 bottom-0 w-60 bg-background border-r border-border/50  overflow-y-auto">
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary border-l-4 border-primary -ml-4 pl-5'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* 移动端侧边栏 */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent side="left" className="p-0 w-64 bg-background border-r border-border/50 ">
          <SheetHeader className="sr-only">
            <SheetTitle>管理菜单</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col h-full">
            {/* 移动端 Logo */}
            <div className="flex items-center gap-2 p-4 border-b border-border/50 ">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
                <Shield className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-foreground">NanoVPS 后台</span>
            </div>

            {/* 移动端菜单 */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary border-l-4 border-primary -ml-4 pl-5'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* 主内容区域 */}
      <div className="pt-16 lg:pl-60 min-h-screen">
        <main className="p-4 lg:p-6">
          {/* 面包屑导航 */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/admin/dashboard" className="hover:text-foreground">
              首页
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">
              {menuItems.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))?.label ||
                '总览'}
            </span>
          </nav>

          {/* 页面标题 */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">
              {menuItems.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))?.label ||
                '总览'}
            </h1>
          </div>

 
            <div className="p-6">{children}</div>
          
        </main>
      </div>
    </div>
  );
}
