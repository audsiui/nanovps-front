'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Server,
  Cpu,
  HardDrive,
  MemoryStick,
  Network,
  Activity,
  Container,
  Clock,
  MapPin,
  Shield,
  ArrowUpDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Node } from '../components/types';
import { mockServers } from '../components/data';
import { ServerRealtimeStats } from './types';
import { CpuMemoryChart, NetworkChart, DiskChart } from './components/charts';
import { ContainerDetail } from './components/container-detail';
import { generateHistoryData, generateContainers, formatTraffic } from './components/utils';

// 模拟实时数据
const mockRealtimeStats: ServerRealtimeStats = {
  cpuPercent: 42.5,
  memoryUsedMb: 16384,
  memoryTotalMb: 32768,
  diskUsedGb: 245,
  diskTotalGb: 500,
  networkUpMbps: 45.2,
  networkDownMbps: 128.5,
  trafficInGb: 1256.8,
  trafficOutGb: 2048.4,
};

export default function ServerDetailPage() {
  const searchParams = useSearchParams();
  const serverId = searchParams.get('id');
  const [server, setServer] = useState<Node | null>(null);
  const [realtimeStats, setRealtimeStats] = useState<ServerRealtimeStats>(mockRealtimeStats);
  const [historyData, setHistoryData] = useState(generateHistoryData());
  const [containers, setContainers] = useState(generateContainers());
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    const found = mockServers.find((s) => s.id === Number(serverId));
    if (found) {
      setServer(found);
    }
  }, [serverId]);

  // 模拟实时数据更新
  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeStats((prev) => ({
        ...prev,
        cpuPercent: Math.max(0, Math.min(100, prev.cpuPercent + (Math.random() - 0.5) * 10)),
        memoryUsedMb: Math.max(0, Math.min(prev.memoryTotalMb, prev.memoryUsedMb + (Math.random() - 0.5) * 512)),
        networkUpMbps: Math.max(0, prev.networkUpMbps + (Math.random() - 0.5) * 20),
        networkDownMbps: Math.max(0, prev.networkDownMbps + (Math.random() - 0.5) * 30),
      }));
      setLastUpdate(new Date());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!server) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Server className="h-16 w-16 text-muted-foreground" />
        <p className="text-lg text-muted-foreground">未找到服务器信息</p>
        <Link href="/admin/dashboard/servers">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回服务器列表
          </Button>
        </Link>
      </div>
    );
  }

  const memoryPercent = (realtimeStats.memoryUsedMb / realtimeStats.memoryTotalMb) * 100;
  const diskPercent = (realtimeStats.diskUsedGb / realtimeStats.diskTotalGb) * 100;

  return (
    <div className="space-y-6">
      {/* 头部导航 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard/servers">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Server className="h-6 w-6 text-primary" />
              {server.name}
              <Badge variant={server.status === 1 ? 'default' : 'destructive'}>
                {server.status === 1 ? '在线' : '离线'}
              </Badge>
            </h1>
            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
              <MapPin className="h-3 w-3" />
              {server.ipv4}
              {server.ipv6 && <span className="text-xs">/ {server.ipv6}</span>}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          最后更新: {lastUpdate.toLocaleTimeString()}
        </div>
      </div>

      {/* 配置信息卡片 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4" />
            服务器配置
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">CPU 核心</p>
              <p className="text-lg font-semibold">{server.totalCpu} 核</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">内存容量</p>
              <p className="text-lg font-semibold">{(server.totalRamMb / 1024).toFixed(1)} GB</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">硬盘容量</p>
              <p className="text-lg font-semibold">{server.allocatableDiskGb} GB</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Agent Token</p>
              <p className="text-lg font-mono text-xs truncate">{server.agentToken}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 实时指标 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">CPU 使用率</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realtimeStats.cpuPercent.toFixed(1)}%</div>
            <Progress value={realtimeStats.cpuPercent} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">内存使用</CardTitle>
            <MemoryStick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{memoryPercent.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {(realtimeStats.memoryUsedMb / 1024).toFixed(1)} / {(realtimeStats.memoryTotalMb / 1024).toFixed(1)} GB
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">硬盘使用</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{diskPercent.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {realtimeStats.diskUsedGb.toFixed(1)} / {realtimeStats.diskTotalGb} GB
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">网络速度</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-3 w-3 text-green-500" />
              <span className="text-lg font-bold">{realtimeStats.networkUpMbps.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">Mbps ↑</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-3 w-3 text-blue-500" />
              <span className="text-lg font-bold">{realtimeStats.networkDownMbps.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">Mbps ↓</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">总流量</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-sm">
                <span className="text-green-500">↑</span>
                <span className="font-semibold">{formatTraffic(realtimeStats.trafficOutGb)}</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-blue-500">↓</span>
                <span className="font-semibold">{formatTraffic(realtimeStats.trafficInGb)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 图表和容器 */}
      <Tabs defaultValue="charts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="charts">监控图表</TabsTrigger>
          <TabsTrigger value="containers" className="flex items-center gap-1">
            <Container className="h-4 w-4" />
            容器实例 ({containers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-4">
          {/* CPU & 内存图表 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">CPU & 内存使用率 (48小时)</CardTitle>
            </CardHeader>
            <CardContent>
              <CpuMemoryChart data={historyData} height="320px" />
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {/* 网络图表 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">网络速度 (48小时)</CardTitle>
              </CardHeader>
              <CardContent>
                <NetworkChart data={historyData} height="280px" />
              </CardContent>
            </Card>

            {/* 硬盘图表 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">硬盘使用率 (48小时)</CardTitle>
              </CardHeader>
              <CardContent>
                <DiskChart data={historyData} height="280px" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="containers">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">容器实例列表</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {containers.map((container) => (
                  <ContainerDetail key={container.id} container={container} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
