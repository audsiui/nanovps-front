'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
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
import { AuthGuard } from '@/components/auth-guard';
import { useAuth } from '@/contexts/auth-context';

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
  return (
    <AuthGuard allowedRoles={['admin']} unauthorizedRedirect="/dashboard">
      <AdminDashboardContent>{children}</AdminDashboardContent>
    </AuthGuard>
  );
}

function AdminDashboardContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-muted">
      <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b border-border/50  z-50">
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
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

          <div className="flex items-center gap-4">
            <ModeToggle />

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" alt={user?.email} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {user?.email?.[0]?.toUpperCase() ?? 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-sm font-medium text-foreground">
                      {user?.email?.split('@')[0] ?? 'Admin'}
                    </span>
                    <span className="text-xs text-muted-foreground">超级管理员</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">{user?.email?.split('@')[0]}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
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
                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

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

      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent side="left" className="p-0 w-64 bg-background border-r border-border/50 ">
          <SheetHeader className="sr-only">
            <SheetTitle>管理菜单</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 p-4 border-b border-border/50 ">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
                <Shield className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-foreground">NanoVPS 后台</span>
            </div>

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

      <div className="pt-16 lg:pl-60 min-h-screen">
        <main className="p-4 lg:p-6">
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
