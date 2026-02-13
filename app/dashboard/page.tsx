'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Cpu,
  Globe,
  MemoryStick,
  MessageSquare,
  Plus,
  Server,
  Ticket,
  CalendarClock,
  History,
  LogIn,
  RefreshCw,
  DollarSign,
  ShoppingCart,
  RotateCw,
  HardDrive,
  AlertCircle,
  Package,
} from 'lucide-react';
import { useMyInstances } from '@/lib/requests/instances';
import { useAuth } from '@/contexts/auth-context';
import { InstanceStatusText, type Instance } from '@/lib/types';
import { cn } from '@/lib/utils';

const notices = [
  {
    id: 1,
    title: '系统升级通知',
    date: '02-13',
    type: 'alert',
    content: '我们将于本周进行系统升级，届时控制面板可能短暂不可用。',
  },
  {
    id: 2,
    title: '新功能上线：实例监控',
    date: '02-10',
    type: 'info',
    content: '控制面板现已支持实时监控功能，可查看 CPU、内存使用情况。',
  },
];

const operationHistory = [
  { id: 1, type: 'login', time: '02-13 14:30', description: '登录成功' },
  { id: 2, type: 'purchase', time: '02-12 10:15', description: '购买了新实例' },
  { id: 3, type: 'recharge', time: '02-11 15:42', description: '充值 ¥100.00' },
  { id: 4, type: 'restart', time: '02-10 22:15', description: '重启了实例' },
];

const operationIcons: Record<string, React.ElementType> = {
  login: LogIn,
  reinstall: RotateCw,
  recharge: DollarSign,
  purchase: ShoppingCart,
  restart: RefreshCw,
};

const operationLabels: Record<string, { text: string; color: string }> = {
  login: { text: '登录', color: 'text-blue-600 bg-blue-500/10' },
  reinstall: { text: '重装', color: 'text-orange-600 bg-orange-500/10' },
  recharge: { text: '充值', color: 'text-green-600 bg-green-500/10' },
  purchase: { text: '购买', color: 'text-purple-600 bg-purple-500/10' },
  restart: { text: '重启', color: 'text-cyan-600 bg-cyan-500/10' },
};

function formatBytes(mb: number): string {
  if (mb >= 1024) {
    return `${(mb / 1024).toFixed(1)} GB`;
  }
  return `${mb} MB`;
}

function formatExpiry(expiresAt: string): string {
  const expiry = new Date(expiresAt);
  const now = new Date();
  const diffMs = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return '已过期';
  } else if (diffDays === 0) {
    return '今天到期';
  } else if (diffDays <= 7) {
    return `${diffDays}天后到期`;
  } else {
    return expiry.toLocaleDateString('zh-CN');
  }
}

function InstanceCard({ instance }: { instance: Instance }) {
  const isRunning = instance.status === 1;
  const isCreating = instance.status === 0;
  const isError = instance.status === 4;
  
  return (
    <Link
      href={`/dashboard/servers?id=${instance.id}`}
      className="block"
    >
      <div className="group relative p-5 rounded-xl border border-border/50 bg-card/60 backdrop-blur-md transition-all duration-200 hover:bg-card/90 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 cursor-pointer">
        <div className="flex items-center gap-4">
          <div className="relative flex h-2.5 w-2.5 shrink-0">
            {isRunning && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-green-500"></span>
            )}
            <span className={cn(
              "relative inline-flex rounded-full h-2.5 w-2.5",
              isRunning ? "bg-green-500" : 
              isCreating ? "bg-yellow-500" : 
              isError ? "bg-red-500" : "bg-gray-400"
            )}></span>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-3">
            <div className="flex items-center gap-2.5">
              <span className="font-semibold text-foreground">{instance.name || instance.hostname || `实例 ${instance.id}`}</span>
              <Badge variant="outline" className="text-xs">
                {InstanceStatusText[instance.status]}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe className="w-3.5 h-3.5 text-primary/60" />
              <span className="font-mono text-xs">
                {instance.internalIp || '分配中...'}
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-primary/60" />
                {instance.cpu} 核
              </span>
              <span className="flex items-center gap-1.5">
                <MemoryStick className="w-3.5 h-3.5 text-primary/60" />
                {formatBytes(instance.ramMb)}
              </span>
              <span className="flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-primary/60" />
                {instance.diskGb} GB
              </span>
            </div>

            <div className="flex items-center justify-between sm:justify-start gap-4">
              <div className="text-sm">
                <span className="font-bold text-foreground">
                  {instance.sshPort ? `:${instance.sshPort}` : '创建中'}
                </span>
              </div>
              <div className={cn(
                "text-xs flex items-center gap-1",
                new Date(instance.expiresAt) > new Date() ? "text-green-600" : "text-red-500"
              )}>
                <CalendarClock className="w-3 h-3" />
                {formatExpiry(instance.expiresAt)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: instancesData, isLoading, error } = useMyInstances({ pageSize: 100 });
  
  const instances = instancesData?.list || [];
  const runningCount = instances.filter(i => i.status === 1).length;

  return (
    <div className="space-y-8 p-1">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            工作台
          </h1>
          <p className="text-muted-foreground mt-2 text-base">
            欢迎回来，{user?.email || '用户'}。您有 <span className="text-foreground font-semibold">{runningCount}</span> 台实例正在运行。
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" size="lg" className="gap-2 shadow-sm bg-card/50 border-border/50 backdrop-blur-sm h-11 px-6">
            <Ticket className="w-5 h-5" />
            工单
          </Button>
          <Link href="/dashboard/purchase">
            <Button size="lg" className="gap-2 shadow-lg shadow-primary/25 h-11 px-6 text-base">
              <Plus className="w-5 h-5" />
              新建实例
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center px-1">
            <h2 className="text-xl font-semibold flex items-center gap-3">
              <Server className="w-6 h-6 text-primary" />
              实例列表
            </h2>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <AlertCircle className="w-12 h-12 text-destructive" />
              <p className="text-muted-foreground">加载实例列表失败</p>
              <Button variant="outline" onClick={() => window.location.reload()}>重试</Button>
            </div>
          ) : instances.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4 border-2 border-dashed border-border/50 rounded-xl">
              <Package className="w-12 h-12 text-muted-foreground" />
              <p className="text-muted-foreground">暂无实例</p>
              <Link href="/dashboard/purchase">
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  立即购买
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {instances.map((instance) => (
                <InstanceCard key={instance.id} instance={instance} />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-8">
          <Card className="border-border/50 bg-card/60 backdrop-blur-md shadow-sm">
            <CardHeader className="py-5 px-6 border-b border-border/40">
              <CardTitle className="text-base font-semibold flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-primary" />
                系统公告
              </CardTitle>
            </CardHeader>
            <div className="p-0">
                <ScrollArea className="h-[280px]">
                    <div className="flex flex-col">
                        {notices.map((notice, index) => (
                            <div key={notice.id}>
                                <div className="p-5 hover:bg-muted/50 transition-colors cursor-pointer group">
                                    <div className="flex items-center justify-between mb-2">
                                        <Badge variant="outline" className={`text-xs font-medium h-6 px-2 border-0 ${notice.type === 'alert' ? 'bg-red-500/10 text-red-600' : 'bg-blue-500/10 text-blue-600'}`}>
                                            {notice.type === 'alert' ? '紧急维护' : '系统通知'}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground/70 font-mono">
                                            {notice.date}
                                        </span>
                                    </div>
                                    <h4 className="text-sm font-semibold text-foreground/90 group-hover:text-primary transition-colors line-clamp-1 mb-1.5">
                                        {notice.title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                                        {notice.content}
                                    </p>
                                </div>
                                {index < notices.length - 1 && <Separator className="bg-border/40 mx-5 w-auto" />}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>
          </Card>

          <Card className="border-border/50 bg-card/60 backdrop-blur-md shadow-sm">
             <CardHeader className="py-5 px-6 border-b border-border/40">
              <CardTitle className="text-base font-semibold flex items-center gap-3">
                <History className="w-5 h-5 text-primary" />
                最近操作记录
              </CardTitle>
            </CardHeader>
            <div className="p-0">
                <ScrollArea className="h-[320px]">
                    <div className="text-sm">
                        {operationHistory.map((op) => {
                          const Icon = operationIcons[op.type];
                          const label = operationLabels[op.type];
                          return (
                            <div key={op.id} className="flex items-start gap-3 p-4 px-6 hover:bg-muted/50 transition-colors border-b border-border/30 last:border-0">
                              <div className={`p-2 rounded-lg ${label.color} shrink-0 mt-0.5`}>
                                <Icon className="h-3.5 w-3.5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-foreground font-medium truncate">{op.description}</p>
                                <span className="text-xs text-muted-foreground">{op.time}</span>
                              </div>
                              <Badge variant="outline" className={`text-xs font-medium h-6 px-2 border-0 shrink-0 ${label.color}`}>
                                {label.text}
                              </Badge>
                            </div>
                          );
                        })}
                    </div>
                </ScrollArea>
            </div>
             <div className="p-3 border-t border-border/40">
                <Button variant="ghost" className="w-full text-sm text-muted-foreground hover:text-primary">
                    查看完整操作记录
                </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}