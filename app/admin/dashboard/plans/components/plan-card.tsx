'use client';

import {
  MoreHorizontal,
  Trash2,
  Pencil,
  Power,
  PowerOff,
  Server,
  Package,
  Settings2,
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
  CardFooter,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plan } from './types';

interface PlanCardProps {
  plan: Plan;
  onEdit: (plan: Plan) => void;
  onToggleStatus: (id: number) => void;
  onDelete: (id: number) => void;
  onManageAllocations: (plan: Plan) => void;
}

export function PlanCard({
  plan,
  onEdit,
  onToggleStatus,
  onDelete,
  onManageAllocations,
}: PlanCardProps) {
  const formatMemory = (memoryMb: number) => {
    if (memoryMb >= 1024) {
      return `${(memoryMb / 1024).toFixed(0)}GB`;
    }
    return `${memoryMb}MB`;
  };

  const formatPrice = (price: string, currency: string) => {
    const symbol = currency === 'CNY' ? '¥' : currency === 'USD' ? '$' : currency;
    return `${symbol}${price}/月`;
  };

  const getPriceDisplay = () => {
    const enabledAllocations = plan.allocations.filter(a => a.enabled);
    if (enabledAllocations.length === 0) {
      return <span className="text-sm text-muted-foreground">未设置价格</span>;
    }

    const prices = enabledAllocations.map(a => ({ price: parseFloat(a.price), currency: a.currency }));
    const minPrice = Math.min(...prices.map(p => p.price));
    const maxPrice = Math.max(...prices.map(p => p.price));
    const currency = prices[0].currency;

    if (minPrice === maxPrice) {
      return <span className="text-lg font-bold text-primary">{formatPrice(minPrice.toFixed(2), currency)}</span>;
    }

    return (
      <span className="text-lg font-bold text-primary">
        {formatPrice(minPrice.toFixed(2), currency)} ~ {formatPrice(maxPrice.toFixed(2), currency)}
      </span>
    );
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

  const getTotalStock = () => {
    return plan.allocations.reduce((sum, a) => sum + (a.enabled ? a.maxStock : 0), 0);
  };

  const getTotalUsed = () => {
    return plan.allocations.reduce((sum, a) => sum + (a.enabled ? a.usedCount : 0), 0);
  };

  const getUtilizationRate = () => {
    const total = getTotalStock();
    if (total === 0) return 0;
    return Math.round((getTotalUsed() / total) * 100);
  };

  return (
    <Card className={`overflow-hidden transition-all duration-200 ${plan.status === 0 ? 'opacity-60' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Package className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">{plan.name}</CardTitle>
              <CardDescription className="text-xs line-clamp-1 max-w-48">
                {plan.description || '无描述'}
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
                编辑套餐
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onToggleStatus(plan.id)}>
                {plan.status === 1 ? (
                  <>
                    <PowerOff className="mr-2 h-4 w-4" />
                    下架套餐
                  </>
                ) : (
                  <>
                    <Power className="mr-2 h-4 w-4" />
                    上架套餐
                  </>
                )}
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

      <CardContent className="pb-3 space-y-4">
        {/* 资源配置 */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
            <Cpu className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-sm">{plan.cpu}核 / {formatMemory(plan.memory)}</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
            <HardDrive className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-sm">{plan.disk}GB</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
            <Wifi className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-sm">{formatTraffic(plan.traffic)}</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
            <Gauge className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-sm">{formatBandwidth(plan.bandwidth)}</span>
          </div>
        </div>

        {/* 端口和价格 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Network className="h-3.5 w-3.5" />
            <span>{plan.ports}个端口</span>
          </div>
          <div>
            {getPriceDisplay()}
          </div>
        </div>

        {/* 总体库存利用率 */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">总库存利用率</span>
            <span className="font-medium">{getTotalUsed()}/{getTotalStock()} ({getUtilizationRate()}%)</span>
          </div>
          <Progress value={getUtilizationRate()} className="h-1.5" />
        </div>

        {/* 分配的服务器摘要 */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="text-xs">
            <Server className="mr-1 h-3 w-3" />
            {plan.allocations.filter(a => a.enabled).length} 个服务器
          </Badge>
          {plan.status === 1 ? (
            <Badge className="bg-green-500 hover:bg-green-600 text-xs">上架中</Badge>
          ) : (
            <Badge variant="secondary" className="text-xs">已下架</Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0 pb-3">
        <Button
          variant="outline"
          size="sm"
          className="w-full h-8 text-xs gap-1"
          onClick={() => onManageAllocations(plan)}
        >
          <Settings2 className="h-3.5 w-3.5" />
          管理服务器分配
        </Button>
      </CardFooter>
    </Card>
  );
}
