'use client';

import {
  MoreHorizontal,
  Trash2,
  Pencil,
  Package,
  Cpu,
  HardDrive,
  Wifi,
  Gauge,
  Network,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PlanTemplate } from './types';

interface PlanCardProps {
  plan: PlanTemplate;
  onEdit: (plan: PlanTemplate) => void;
  onDelete: (id: number) => void;
}

export function PlanCard({
  plan,
  onEdit,
  onDelete,
}: PlanCardProps) {
  const formatMemory = (memoryMb: number) => {
    if (memoryMb >= 1024) {
      return `${(memoryMb / 1024).toFixed(0)}GB`;
    }
    return `${memoryMb}MB`;
  };

  const formatTraffic = (traffic: number | null) => {
    if (traffic === null) return '不限';
    if (traffic >= 1024) {
      return `${(traffic / 1024).toFixed(1)}TB`;
    }
    return `${traffic}GB`;
  };

  const formatBandwidth = (bandwidth: number | null) => {
    if (bandwidth === null) return '不限';
    return `${bandwidth}Mbps`;
  };

  const formatPortCount = (count: number | null) => {
    if (count === null) return '不限';
    return `${count}个`;
  };

  return (
    <Card className="overflow-hidden transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Package className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">{plan.name}</CardTitle>
              <CardDescription className="text-xs line-clamp-1 max-w-48">
                {plan.remark || '无备注'}
              </CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>操作</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(plan)}>
                <Pencil className="mr-2 h-4 w-4" />
                编辑模板
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(plan.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                删除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pb-4 space-y-3">
        {/* 资源配置 */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
            <Cpu className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-sm">{plan.cpu}核 / {formatMemory(plan.ramMb)}</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
            <HardDrive className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-sm">{plan.diskGb}GB</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
            <Wifi className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-sm">{formatTraffic(plan.trafficGb)}</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
            <Gauge className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-sm">{formatBandwidth(plan.bandwidthMbps)}</span>
          </div>
        </div>

        {/* 端口 */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Network className="h-3.5 w-3.5" />
          <span>端口数量: {formatPortCount(plan.portCount)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
