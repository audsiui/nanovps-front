'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  ShoppingBag,
  Wallet,
  Ticket,
  Search,
  Menu,
  LogOut,
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
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ModeToggle } from '@/components/theme-toggle';
import { AuthGuard } from '@/components/auth-guard';
import { useAuth } from '@/contexts/auth-context';

const sidebarItems = [
  { icon: LayoutDashboard, label: '工作台', href: '/dashboard' },
  { icon: ShoppingBag, label: '购买实例', href: '/dashboard/purchase' },
  { icon: Wallet, label: '财务管理', href: '/dashboard/finance' },
  { icon: Ticket, label: '工单管理', href: '/dashboard/tickets' },
];

interface SidebarProps {
  pathname: string;
  onNavigate?: () => void;
}

function Sidebar({ pathname, onNavigate }: SidebarProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/25 transition-transform duration-300 group-hover:scale-110">
            <span className="text-lg font-bold text-primary-foreground">N</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            Nano<span className="text-primary">VPS</span>
          </span>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-4 py-2">
        <div className="space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                    : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                }`}
              >
                {isActive && (
                    <div className="absolute inset-0 bg-white/20 mix-blend-overlay" />
                )}
                <item.icon className={`h-4 w-4 ${isActive ? 'text-primary-foreground' : ''}`} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <DashboardContent>{children}</DashboardContent>
    </AuthGuard>
  );
}

// 实际的布局内容（已登录后才能渲染）
function DashboardContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-muted/20 font-sans selection:bg-primary/20 selection:text-primary">

      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.1]" />
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      <aside className="hidden md:block fixed top-4 left-4 bottom-4 z-50 w-64 rounded-2xl border border-border/50 bg-card/70 backdrop-blur-xl shadow-xl shadow-black/5 overflow-hidden">
        <Sidebar pathname={pathname} />
      </aside>

      <div className="md:hidden">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetContent side="left" className="p-0 w-72 border-r-border/50 bg-card/95 backdrop-blur-xl">
             <SheetHeader className="sr-only">
                <SheetTitle>导航菜单</SheetTitle>
             </SheetHeader>
             <Sidebar
               pathname={pathname}
               onNavigate={() => setIsMobileOpen(false)}
             />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex flex-col min-h-screen transition-all duration-300 md:pl-72 md:pr-4">

        <header className="sticky top-2 md:top-4 z-40 mx-2 md:mx-0 rounded-xl md:rounded-2xl border border-border/50 bg-card/70 backdrop-blur-xl px-4 shadow-sm transition-all duration-200">
            <div className="flex h-16 items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden -ml-2 text-muted-foreground"
                        onClick={() => setIsMobileOpen(true)}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>

                    <div className="relative hidden sm:block w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground/70" />
                        <Input
                            type="search"
                            placeholder="搜索资源 (⌘K)"
                            className="pl-9 h-9 bg-background/50 border-transparent focus:bg-background focus:border-primary/50 transition-all rounded-lg"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">

                    <div className="hidden sm:block">
                        <ModeToggle />
                    </div>

                    <div className="h-8 w-px bg-border/50 hidden sm:block" />

                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="h-10 pl-2 pr-1 rounded-full flex items-center gap-2 hover:bg-muted/80 transition-all border border-transparent hover:border-border/50"
                        >
                             <div className="flex items-center gap-1.5 mr-1">
                                <Wallet className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="text-sm font-medium text-foreground tabular-nums">
                                    ${user?.balance ?? '0.00'}
                                </span>
                             </div>

                            <Avatar className="h-8 w-8 border border-border/50">
                                <AvatarImage src="https://github.com/shadcn.png" alt={user?.email} />
                                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                  {user?.email?.[0]?.toUpperCase() ?? 'U'}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <div className="sm:hidden px-2 py-1.5">
                           <ModeToggle />
                        </div>
                        <DropdownMenuSeparator className="sm:hidden"/>

                        <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user?.email?.split('@')[0] ?? 'User'}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                            {user?.email}
                            </p>
                        </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Wallet className="mr-2 h-4 w-4" />
                            <span>充值余额</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>个人资料</DropdownMenuItem>
                        <DropdownMenuItem>API 密钥</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20" onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        退出登录
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>

        <main className="flex-1 py-6 px-2 md:px-0">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {children}
            </div>
        </main>
      </div>
    </div>
  );
}
