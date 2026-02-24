'use client';

import { useState } from 'react';
import { ContainerInstance } from '../types';
import { CpuMemoryChart, NetworkChart } from './charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Container, ChevronDown, ChevronUp, ArrowUpDown } from 'lucide-react';
import { formatTraffic } from './utils';

interface ContainerDetailProps {
  container: ContainerInstance;
}

export function ContainerDetail({ container }: ContainerDetailProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* 容器概览 - 始终显示 */}
      <div
        className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Container className="h-5 w-5 text-primary" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{container.name}</span>
                {container.status === 'running' ? (
                  <Badge variant="outline" className="text-green-500 border-green-500 text-xs">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    运行中
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-gray-500 border-gray-500 text-xs">
                    <XCircle className="h-3 w-3 mr-1" />
                    已停止
                  </Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground font-mono">{container.id}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {container.status === 'running' && (
              <div className="hidden md:flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">CPU</span>
                  <Progress value={container.cpuPercent} className="h-2 w-16" />
                  <span className="font-medium w-12">{container.cpuPercent.toFixed(1)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">内存</span>
                  <span className="font-medium">
                    {container.memoryUsedMb} / {container.memoryLimitMb} MB
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">网络</span>
                  <span className="font-medium text-xs">
                    ↑ {container.networkUpMbps.toFixed(1)} / ↓ {container.networkDownMbps.toFixed(1)} Mbps
                  </span>
                </div>
              </div>
            )}
            {expanded ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </div>
      </div>

      {/* 展开详情 - 48小时监控图表 */}
      {expanded && container.status === 'running' && (
        <div className="border-t bg-muted/20">
          {/* 详细指标 */}
          <div className="p-4 grid grid-cols-3 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">CPU 使用率</p>
              <div className="flex items-center gap-2">
                <Progress value={container.cpuPercent} className="h-2 flex-1" />
                <span className="font-medium text-sm">{container.cpuPercent.toFixed(1)}%</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">内存使用</p>
              <div className="flex items-center gap-2">
                <Progress
                  value={(container.memoryUsedMb / container.memoryLimitMb) * 100}
                  className="h-2 flex-1"
                />
                <span className="font-medium text-sm">
                  {((container.memoryUsedMb / container.memoryLimitMb) * 100).toFixed(1)}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {container.memoryUsedMb} / {container.memoryLimitMb} MB
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">当前网络速度</p>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-sm">
                  <ArrowUpDown className="h-3 w-3 text-green-500" />
                  <span className="font-medium">{container.networkUpMbps.toFixed(1)} Mbps ↑</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <ArrowUpDown className="h-3 w-3 text-blue-500" />
                  <span className="font-medium">{container.networkDownMbps.toFixed(1)} Mbps ↓</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* 总流量 */}
          <div className="px-4 py-2 flex items-center gap-4 text-xs text-muted-foreground bg-muted/30">
            <span>累计流量:</span>
            <span className="text-green-500">↑ {formatTraffic(container.trafficOutGb)}</span>
            <span className="text-blue-500">↓ {formatTraffic(container.trafficInGb)}</span>
          </div>

          {/* 48小时监控图表 */}
          <div className="p-4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">CPU & 内存使用率 (48小时)</CardTitle>
              </CardHeader>
              <CardContent>
                <CpuMemoryChart data={container.historyData} height="250px" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">网络速度 (48小时)</CardTitle>
              </CardHeader>
              <CardContent>
                <NetworkChart data={container.historyData} height="220px" />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
