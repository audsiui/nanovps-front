'use client';

import { useState } from 'react';
import { ShoppingCart, Loader2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useMyOrders, useOrderDetail } from '@/lib/requests/orders';
import type { Order, OrderStatus } from '@/lib/types';
import { formatDate } from '@/lib/utils';

const statusOptions = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待支付' },
  { value: 'paid', label: '已支付' },
  { value: 'processing', label: '处理中' },
  { value: 'completed', label: '已完成' },
  { value: 'failed', label: '失败' },
  { value: 'cancelled', label: '已取消' },
  { value: 'refunded', label: '已退款' },
] as const;

const getStatusBadge = (status: OrderStatus) => {
  const statusMap: Record<OrderStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | null | undefined }> = {
    pending: { label: '待支付', variant: 'outline' },
    paid: { label: '已支付', variant: 'default' },
    processing: { label: '处理中', variant: 'secondary' },
    completed: { label: '已完成', variant: 'default' },
    failed: { label: '失败', variant: 'destructive' },
    cancelled: { label: '已取消', variant: 'secondary' },
    refunded: { label: '已退款', variant: 'outline' },
  };
  const config = statusMap[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

const getTypeLabel = (type: string) => {
  const typeMap: Record<string, string> = {
    new: '新购',
    renew: '续费',
    upgrade: '升级',
  };
  return typeMap[type] || type;
};

function OrderDetailDialog({ orderId, onClose }: { orderId: number; onClose: () => void }) {
  const { data: order, isLoading } = useOrderDetail(orderId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        加载订单详情失败
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">订单号</p>
          <p className="font-medium">{order.orderNo}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">订单类型</p>
          <p className="font-medium">{getTypeLabel(order.type)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">状态</p>
          <p>{getStatusBadge(order.status)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">创建时间</p>
          <p className="font-medium">{formatDate(order.createdAt)}</p>
        </div>
      </div>
      
      <div className="border-t pt-4">
        <h4 className="font-medium mb-2">套餐信息</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">节点</p>
            <p className="font-medium">{order.node.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">套餐</p>
            <p className="font-medium">{order.planTemplate.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">配置</p>
            <p className="font-medium">{order.planTemplate.cpu}核 / {order.planTemplate.ramMb}MB / {order.planTemplate.diskGb}GB</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">计费周期</p>
            <p className="font-medium">{order.billingCycle}</p>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-medium mb-2">金额信息</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">原价</span>
            <span>¥{order.originalPrice}</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span>优惠金额</span>
            <span>-¥{order.discountAmount}</span>
          </div>
          <div className="flex justify-between font-medium text-lg border-t pt-2">
            <span>实付金额</span>
            <span>¥{order.finalPrice}</span>
          </div>
        </div>
      </div>

      {order.instance && (
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">实例信息</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">实例名称</p>
              <p className="font-medium">{order.instance.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">状态</p>
              <p className="font-medium">{order.instance.status === 1 ? '运行中' : '已停止'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">到期时间</p>
              <p className="font-medium">{formatDate(order.instance.expiresAt)}</p>
            </div>
          </div>
        </div>
      )}

      {order.paidAt && (
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">支付信息</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">支付渠道</p>
              <p className="font-medium">{order.paymentChannel || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">支付时间</p>
              <p className="font-medium">{formatDate(order.paidAt)}</p>
            </div>
          </div>
        </div>
      )}

      {order.periodStartAt && order.periodEndAt && (
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">服务周期</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">开始时间</p>
              <p className="font-medium">{formatDate(order.periodStartAt)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">结束时间</p>
              <p className="font-medium">{formatDate(order.periodEndAt)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function UserOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const queryParams = {
    page: 1,
    pageSize: 100,
    status: statusFilter === 'all' ? undefined : (statusFilter as OrderStatus),
  };

  const { data, isLoading } = useMyOrders(queryParams);
  const orders = data?.list || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">我的订单</h1>
        <p className="text-muted-foreground mt-2">查看您的所有订单记录</p>
      </div>

      <div className="flex items-center gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="筛选状态" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">加载中...</p>
        </div>
      )}

      {!isLoading && orders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-4 rounded-full bg-muted">
            <ShoppingCart className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-medium">暂无订单</h3>
          <p className="mt-1 text-sm text-muted-foreground">您还没有任何订单记录</p>
        </div>
      )}

      {!isLoading && orders.length > 0 && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>订单号</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>套餐</TableHead>
                <TableHead>金额</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead className="w-[100px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono">{order.orderNo}</TableCell>
                  <TableCell>{getTypeLabel(order.type)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{order.planName}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>¥{order.finalPrice}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedOrderId(order.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!selectedOrderId} onOpenChange={() => setSelectedOrderId(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>订单详情</DialogTitle>
            <DialogDescription>查看订单详细信息</DialogDescription>
          </DialogHeader>
          {selectedOrderId && <OrderDetailDialog orderId={selectedOrderId} onClose={() => setSelectedOrderId(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
