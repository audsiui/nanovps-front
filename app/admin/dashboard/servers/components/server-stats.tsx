'use client';

import { Server, Cpu, HardDrive, MemoryStick } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Node } from './types';

interface NodeStatsProps {
  nodes: Node[];
}

export function ServerStats({ nodes }: NodeStatsProps) {
  const totalCpu = nodes.reduce((sum, n) => sum + n.totalCpu, 0);
  const totalRamGb = nodes.reduce(
    (sum, n) => sum + Math.round(n.totalRamMb / 1024),
    0
  );
  const totalDiskGb = nodes.reduce((sum, n) => sum + n.allocatableDiskGb, 0);
  const usedDiskGb = nodes.reduce((sum, n) => sum + (n.usedDiskGb || 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">总节点数</CardTitle>
          <Server className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{nodes.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">总 CPU 核心</CardTitle>
          <Cpu className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCpu} 核</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">总内存</CardTitle>
          <MemoryStick className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRamGb} GB</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">硬盘使用</CardTitle>
          <HardDrive className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{usedDiskGb}/{totalDiskGb} GB</div>
          <p className="text-xs text-muted-foreground">
            {totalDiskGb > 0 ? Math.round((usedDiskGb / totalDiskGb) * 100) : 0}% 已分配
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
