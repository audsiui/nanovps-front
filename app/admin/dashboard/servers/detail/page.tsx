'use client';

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
  Wifi,
  WifiOff,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useNodeDetail, useNodeRealtime } from '@/lib/requests/nodes';
import { ContainerDetail } from './components/container-detail';

function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  } else if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  } else if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  }
  return `${bytes} B`;
}

function formatTraffic(gb: number): string {
  if (gb >= 1024) {
    return `${(gb / 1024).toFixed(2)} TB`;
  }
  return `${gb.toFixed(2)} GB`;
}

function formatRate(bytesPerSec: number): string {
  const mbps = (bytesPerSec * 8) / (1024 * 1024);
  return `${mbps.toFixed(1)} Mbps`;
};

export default function ServerDetailPage() {
  const searchParams = useSearchParams();
  const nodeId = Number(searchParams.get('id'));

  const { data: nodeData, isLoading: nodeLoading, error: nodeError } = useNodeDetail(nodeId);
  const { data: realtimeData, isLoading: realtimeLoading } = useNodeRealtime(nodeId, { enabled: nodeId > 0 });

  const node = nodeData;
  const realtime = realtimeData;

  if (nodeLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-muted-foreground">加载中...</p>
      </div>
    );
  }

  if (nodeError || !node) {
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

  const memoryPercent = realtime?.host?.memory?.usagePercent ?? 0;
  const diskPercent = realtime?.host?.disks?.[0]?.usePercent ?? 0;

  return (
    <div className="space-y-6">
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
              {node.name}
              <Badge variant={node.status === 1 ? 'default' : 'destructive'}>
                {node.status === 1 ? '可分配' : '维护中'}
              </Badge>
              {realtime?.isOnline ? (
                <div className="flex items-center gap-1">
                  <Wifi className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-green-500">Agent 在线</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <WifiOff className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Agent 离线</span>
                </div>
              )}
            </h1>
            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
              <MapPin className="h-3 w-3" />
              {node.ipv4}
              {node.ipv6 && <span className="text-xs">/ {node.ipv6}</span>}
            </p>
          </div>
        </div>
        {realtime?.timestamp && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            最后更新: {new Date(realtime.timestamp * 1000).toLocaleTimeString()}
          </div>
        )}
      </div>

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
              <p className="text-lg font-semibold">{node.totalCpu} 核</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">内存容量</p>
              <p className="text-lg font-semibold">{(node.totalRamMb / 1024).toFixed(1)} GB</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">硬盘容量</p>
              <p className="text-lg font-semibold">{node.allocatableDiskGb} GB</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Agent Token</p>
              <p className="text-lg font-mono text-xs truncate">{node.agentToken}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {!realtime?.isOnline && (
        <Card className="border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20">
          <CardContent className="flex items-center gap-3 py-4">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="font-medium text-yellow-700 dark:text-yellow-400">Agent 离线</p>
              <p className="text-sm text-yellow-600 dark:text-yellow-500">
                节点 Agent 未连接，无法获取实时监控数据。请检查 Agent 是否正常运行。
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {realtimeLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-4 w-32 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : realtime?.host ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">CPU 使用率</CardTitle>
              <Cpu className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{realtime.host.cpu.usagePercent.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">{realtime.host.cpu.cores} 核心</p>
              <Progress value={realtime.host.cpu.usagePercent} className="h-2 mt-2" />
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
                {formatBytes(realtime.host.memory.used)} / {formatBytes(realtime.host.memory.total)}
              </p>
              <Progress value={memoryPercent} className="h-2 mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">硬盘使用</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{diskPercent.toFixed(1)}%</div>
              {realtime.host.disks[0] && (
                <p className="text-xs text-muted-foreground">
                  {formatBytes(realtime.host.disks[0].used)} / {formatBytes(realtime.host.disks[0].size)}
                </p>
              )}
              <Progress value={diskPercent} className="h-2 mt-2" />
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
                <span className="text-lg font-bold">{formatRate(realtime.host.network.txRate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-3 w-3 text-blue-500" />
                <span className="text-lg font-bold">{formatRate(realtime.host.network.rxRate)}</span>
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
                  <span className="font-semibold">{formatTraffic(realtime.host.network.txTotal / (1024 * 1024 * 1024))}</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-blue-500">↓</span>
                  <span className="font-semibold">{formatTraffic(realtime.host.network.rxTotal / (1024 * 1024 * 1024))}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center h-32 text-muted-foreground">
            <WifiOff className="h-5 w-5 mr-2" />
            <span>Agent 离线，无法获取实时数据</span>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="containers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="containers" className="flex items-center gap-1">
            <Container className="h-4 w-4" />
            容器实例 ({realtime?.containers?.length ?? 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="containers">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">容器实例列表</CardTitle>
            </CardHeader>
            <CardContent>
              {!realtime?.isOnline ? (
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                  <WifiOff className="h-5 w-5 mr-2" />
                  <span>Agent 离线，无法获取容器数据</span>
                </div>
              ) : realtime?.containers && realtime.containers.length > 0 ? (
                <div className="space-y-3">
                  {realtime.containers.map((container) => (
                    <ContainerDetail
                      key={container.id}
                      container={{
                        id: container.id,
                        name: container.name,
                        status: 'running',
                        cpuPercent: container.cpuPercent,
                        memoryUsedMb: Math.round(container.memory.usage / (1024 * 1024)),
                        memoryLimitMb: Math.round(container.memory.limit / (1024 * 1024)),
                        diskUsedGb: 0,
                        diskLimitGb: 0,
                        networkUpMbps: (container.network.txRate * 8) / (1024 * 1024),
                        networkDownMbps: (container.network.rxRate * 8) / (1024 * 1024),
                        trafficInGb: container.network.rxTotal / (1024 * 1024 * 1024),
                        trafficOutGb: container.network.txTotal / (1024 * 1024 * 1024),
                        historyData: [],
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                  <Container className="h-5 w-5 mr-2" />
                  <span>暂无容器实例</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
