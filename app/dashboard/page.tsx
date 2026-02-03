'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
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
} from 'lucide-react';
import Link from 'next/link';

const servers = [
  {
    id: 'srv-001',
    name: 'Production-Web-01',
    region: 'HK',
    status: 'running',
    ip: '192.168.1.10',
    specs: {
      cpu: '4 vCore',
      ram: '8 GB',
      disk: '120 GB SSD',
    },
    billing: {
      price: '$24.00',
      expiry: '12天后到期',
      autoRenew: true,
    },
  },
  {
    id: 'srv-002',
    name: 'Dev-Database-Cluster',
    region: 'SG',
    status: 'running',
    ip: '10.0.0.52',
    specs: {
      cpu: '2 vCore',
      ram: '4 GB',
      disk: '80 GB NVMe',
    },
    billing: {
      price: '$12.00',
      expiry: '2024-10-20',
      autoRenew: true,
    },
  },
  {
    id: 'srv-003',
    name: 'Backup-Node-JPN',
    region: 'JP',
    status: 'stopped',
    ip: '172.16.0.3',
    specs: {
      cpu: '1 vCore',
      ram: '1 GB',
      disk: '500 GB HDD',
    },
    billing: {
      price: '$8.50',
      expiry: '已过期',
      autoRenew: false,
    },
  },
];

const regionNames: Record<string, string> = {
  HK: '中国香港',
  SG: '新加坡',
  JP: '日本',
};

const notices = [
  {
    id: 1,
    title: 'HKG 区域网络维护通知',
    date: '05-20',
    type: 'alert',
    content: '我们将于本周五凌晨 2:00 进行核心交换机升级，预计中断 15 分钟。',
  },
  {
    id: 2,
    title: '新功能上线：快照备份',
    date: '05-18',
    type: 'info',
    content: '控制面板现已支持一键快照功能，欢迎体验。',
  },
];

const operationHistory = [
  { id: 1, type: 'login', time: '05-21 14:30', description: '从 114.23.xx.xx (上海) 登录' },
  { id: 2, type: 'reinstall', time: '05-21 10:15', description: '重装了服务器 Production-Web-01' },
  { id: 3, type: 'recharge', time: '05-20 15:42', description: '充值 $50.00 到账户余额' },
  { id: 4, type: 'purchase', time: '05-20 09:12', description: '购买了实例 Dev-Database-Cluster' },
  { id: 5, type: 'restart', time: '05-19 22:15', description: '重启了服务器 Backup-Node-JPN' },
  { id: 6, type: 'login', time: '05-18 18:30', description: '从 58.32.xx.xx (杭州) 登录' },
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

export default function DashboardPage() {
  return (
    <div className="space-y-8 p-1">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            工作台
          </h1>
          <p className="text-muted-foreground mt-2 text-base">
            欢迎回来，John。您有 <span className="text-foreground font-semibold">2</span> 台实例正在运行。
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" size="lg" className="gap-2 shadow-sm bg-card/50 border-border/50 backdrop-blur-sm h-11 px-6">
            <Ticket className="w-5 h-5" />
            工单
          </Button>
          <Button size="lg" className="gap-2 shadow-lg shadow-primary/25 h-11 px-6 text-base">
            <Plus className="w-5 h-5" />
            新建实例
          </Button>
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

          <div className="space-y-4">
            {servers.map((server) => (
              <Link
                key={server.id}
                href={`/dashboard/servers?id=${server.id}`}
                className="block"
              >
                <div className="group relative p-5 rounded-xl border border-border/50 bg-card/60 backdrop-blur-md transition-all duration-200 hover:bg-card/90 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="relative flex h-2.5 w-2.5 shrink-0">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${server.status === 'running' ? 'bg-green-500' : 'hidden'}`}></span>
                      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${server.status === 'running' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    </div>

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-3">
                      <div className="flex items-center gap-2.5">
                        <span className="font-semibold text-foreground">{server.name}</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
                          {server.region}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Globe className="w-3.5 h-3.5 text-primary/60" />
                        <span className="font-mono text-xs">{server.ip}</span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-primary/60" />
                          {server.specs.cpu}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MemoryStick className="w-3.5 h-3.5 text-primary/60" />
                          {server.specs.ram}
                        </span>
                      </div>

                      <div className="flex items-center justify-between sm:justify-start gap-4">
                        <div className="text-sm">
                          <span className="font-bold text-foreground">{server.billing.price}</span>
                          <span className="text-muted-foreground text-xs">/月</span>
                        </div>
                        <div className={`text-xs flex items-center gap-1 ${server.billing.autoRenew ? 'text-green-600' : 'text-orange-500'}`}>
                          <CalendarClock className="w-3 h-3" />
                          {server.billing.expiry}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
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