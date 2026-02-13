'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  Copy,
  Play,
  Square,
  RotateCw,
  Cpu,
  HardDrive,
  Network,
  Activity,
  Calendar,
  AlertCircle,
  Loader2,
  Terminal,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  useInstanceDetail,
  useInstanceStatus,
  useStartInstance,
  useStopInstance,
  useRestartInstance,
} from '@/lib/requests/instances';
import { InstanceStatusText } from '@/lib/types';
import { cn } from '@/lib/utils';

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

function formatRate(bytesPerSec: number): string {
  return `${formatBytes(bytesPerSec)}/s`;
}

function getStatusBadgeVariant(status: number): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 1: return 'default';
    case 0: return 'secondary';
    case 4: return 'destructive';
    default: return 'outline';
  }
}

function getStatusBadgeClass(status: number): string {
  switch (status) {
    case 1: return 'bg-green-500 hover:bg-green-600';
    case 0: return 'bg-yellow-500 hover:bg-yellow-600';
    case 4: return '';
    default: return '';
  }
}

export default function ServerDetailPageClient() {
  const params = useSearchParams();
  const instanceId = Number(params.get('id'));

  const { data: instance, isLoading: isLoadingInstance, error: instanceError } = useInstanceDetail(instanceId);
  const { data: statusData, isLoading: isLoadingStatus } = useInstanceStatus(instanceId, { refetchInterval: 15000 });
  
  const startMutation = useStartInstance();
  const stopMutation = useStopInstance();
  const restartMutation = useRestartInstance();

  const isRunning = instance?.status === 1;
  const isCreating = instance?.status === 0;
  const isError = instance?.status === 4;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('已复制到剪贴板');
  };

  const handleStart = async () => {
    if (!instance) return;
    try {
      await startMutation.mutateAsync(instance.id);
      toast.success('实例已启动');
    } catch (error: any) {
      toast.error(error.message || '启动失败');
    }
  };

  const handleStop = async () => {
    if (!instance) return;
    try {
      await stopMutation.mutateAsync(instance.id);
      toast.success('实例已停止');
    } catch (error: any) {
      toast.error(error.message || '停止失败');
    }
  };

  const handleRestart = async () => {
    if (!instance) return;
    try {
      await restartMutation.mutateAsync(instance.id);
      toast.success('实例已重启');
    } catch (error: any) {
      toast.error(error.message || '重启失败');
    }
  };

  if (isLoadingInstance) {
    return (
      <div className="space-y-6 p-1">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (instanceError || !instance) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <AlertCircle className="w-16 h-16 text-destructive" />
        <h2 className="text-xl font-semibold">加载实例失败</h2>
        <p className="text-muted-foreground">{instanceError?.message || '实例不存在'}</p>
        <Link href="/dashboard">
          <Button variant="outline">返回工作台</Button>
        </Link>
      </div>
    );
  }

  const cpuPercent = statusData?.cpuPercent ?? 0;
  const memoryPercent = statusData?.memory?.usagePercent ?? 0;

  return (
    <div className="space-y-6 p-1">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {instance.name || instance.hostname || `实例 ${instance.id}`}
            </h1>
            <Badge variant={getStatusBadgeVariant(instance.status)} className={getStatusBadgeClass(instance.status)}>
              {InstanceStatusText[instance.status]}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm mt-1">ID: {instance.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* Connection Info */}
          <Card className="border-border/50 bg-card/60 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Terminal className="h-5 w-5 text-primary" />
                连接信息
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isCreating ? (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>实例创建中，请稍候...</span>
                </div>
              ) : (
                <>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                    <p className="text-sm text-muted-foreground mb-2">SSH 连接命令</p>
                    <code className="text-sm font-mono bg-background px-3 py-2 rounded block">
                      ssh root@{instance.node?.ipv4 || 'N/A'} -p {instance.sshPort || 'N/A'}
                    </code>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <p className="text-sm text-muted-foreground">NAT IP (公网)</p>
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono bg-muted px-2.5 py-1 rounded">
                          {instance.node?.ipv4 || 'N/A'}
                        </code>
                        {instance.node?.ipv4 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => copyToClipboard(instance.node!.ipv4!)}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-sm text-muted-foreground">SSH 端口</p>
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono bg-muted px-2.5 py-1 rounded">
                          {instance.sshPort || 'N/A'}
                        </code>
                        {instance.sshPort && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => copyToClipboard(String(instance.sshPort))}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-sm text-muted-foreground">内网 IP</p>
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono bg-muted px-2.5 py-1 rounded">
                          {instance.internalIp || 'N/A'}
                        </code>
                        {instance.internalIp && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => copyToClipboard(instance.internalIp!)}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-sm text-muted-foreground">节点</p>
                      <code className="text-sm font-mono bg-muted px-2.5 py-1 rounded">
                        {instance.node?.name || 'N/A'}
                      </code>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Config Info */}
          <Card className="border-border/50 bg-card/60 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">配置信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Cpu className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">CPU</p>
                    <p className="font-semibold">{instance.cpu} 核</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">内存</p>
                    <p className="font-semibold">{instance.ramMb >= 1024 ? `${(instance.ramMb / 1024).toFixed(0)} GB` : `${instance.ramMb} MB`}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <HardDrive className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">存储</p>
                    <p className="font-semibold">{instance.diskGb} GB</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Network className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">带宽</p>
                    <p className="font-semibold">{instance.bandwidthMbps ? `${instance.bandwidthMbps} Mbps` : '不限'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">流量</p>
                    <p className="font-semibold">{instance.trafficGb ? `${instance.trafficGb} GB` : '不限'}</p>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>操作系统: <span className="text-foreground font-medium">{instance.image?.name || 'N/A'}</span></span>
                <span>创建时间: <span className="text-foreground">{new Date(instance.createdAt).toLocaleString('zh-CN')}</span></span>
              </div>
            </CardContent>
          </Card>

          {/* System Monitoring */}
          <Card className="border-border/50 bg-card/60 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">实时监控</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {isLoadingStatus ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : statusData?.status === 'creating' ? (
                <div className="flex items-center gap-3 text-muted-foreground py-4">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>实例创建中，监控数据暂不可用</span>
                </div>
              ) : statusData?.status === 'offline' ? (
                <div className="flex items-center gap-3 text-muted-foreground py-4">
                  <AlertCircle className="h-5 w-5" />
                  <span>节点离线或数据暂不可用</span>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">CPU 使用率</span>
                      <span className="text-sm font-medium">{cpuPercent.toFixed(1)}%</span>
                    </div>
                    <Progress value={cpuPercent} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">内存使用率</span>
                      <span className="text-sm font-medium">{memoryPercent.toFixed(1)}%</span>
                    </div>
                    <Progress value={memoryPercent} className="h-2" />
                    {statusData?.memory && (
                      <p className="text-xs text-muted-foreground">
                        {formatBytes(statusData.memory.usage)} / {formatBytes(statusData.memory.limit)}
                      </p>
                    )}
                  </div>

                  {statusData?.network && (
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">下载速率</p>
                        <p className="text-lg font-semibold text-green-600">
                          {formatRate(statusData.network.rxRate)}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">上传速率</p>
                        <p className="text-lg font-semibold text-blue-600">
                          {formatRate(statusData.network.txRate)}
                        </p>
                      </div>
                    </div>
                  )}

                  {statusData?.timestamp && (
                    <p className="text-xs text-muted-foreground text-right">
                      更新时间: {new Date(statusData.timestamp).toLocaleString('zh-CN')}
                    </p>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Server Operations */}
          <Card className="border-border/50 bg-card/60 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">服务器操作</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <Button
                  variant={isRunning ? 'outline' : 'default'}
                  className="gap-2 justify-start"
                  disabled={isCreating || startMutation.isPending}
                  onClick={handleStart}
                >
                  {startMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                  开机
                </Button>
                <Button
                  variant={isRunning ? 'default' : 'outline'}
                  className="gap-2 justify-start"
                  disabled={isCreating || !isRunning || stopMutation.isPending}
                  onClick={handleStop}
                >
                  {stopMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Square className="h-4 w-4" />}
                  关机
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 justify-start"
                  disabled={isCreating || !isRunning || restartMutation.isPending}
                  onClick={handleRestart}
                >
                  {restartMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCw className="h-4 w-4" />}
                  重启
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Billing Info */}
          <Card className="border-border/50 bg-card/60 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">计费信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">到期时间</span>
                <div className="flex items-center gap-1.5 text-sm">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className={cn(
                    new Date(instance.expiresAt) < new Date() ? 'text-red-500' : 'text-foreground'
                  )}>
                    {new Date(instance.expiresAt).toLocaleDateString('zh-CN')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">自动续费</span>
                <Badge variant={instance.autoRenew ? 'default' : 'secondary'}>
                  {instance.autoRenew ? '已开启' : '未开启'}
                </Badge>
              </div>

              <Separator />

              <Button className="w-full gap-2" variant="outline">
                <Calendar className="h-4 w-4" />
                续费
              </Button>
            </CardContent>
          </Card>

          {/* Status Info */}
          <Card className="border-border/50 bg-card/60 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">状态信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">容器 ID</span>
                <code className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
                  {instance.containerId ? instance.containerId.substring(0, 12) : 'N/A'}
                </code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">镜像</span>
                <span>{instance.image?.name || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">节点</span>
                <span>{instance.node?.name || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">主机名</span>
                <span>{instance.hostname || 'N/A'}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
