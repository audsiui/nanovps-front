'use client';

import { useState } from 'react';
import { Search, ShoppingCart, Loader2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { useMyOrders } from '@/lib/requests/orders';
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

function OrderDetailDialog({ order, onClose }: { order: Order; onClose: () => void }) {
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
            <p className="font-medium">{order.nodePlan?.node.name || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">套餐</p>
            <p className="font-medium">{order.nodePlan?.template.name || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">计费周期</p>
            <p className="font-medium">{order.billingCycle}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">购买时长</p>
            <p className="font-medium">{order.durationMonths} 个月</p>
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
            {order.paymentTradeNo && (
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">支付流水号</p>
                <p className="font-medium">{order.paymentTradeNo}</p>
              </div>
            )}
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

      {order.remark && (
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">备注</h4>
          <p className="text-sm">{order.remark}</p>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const queryParams = {
    page: 1,
    pageSize: 100,
    status: statusFilter === 'all' ? undefined : (statusFilter as OrderStatus),
  };

  const { data, isLoading } = useMyOrders(queryParams);
  const orders = data?.list || [];

  // 过滤搜索结果
  const filteredOrders = orders.filter(order => 
    searchQuery === '' || 
    order.orderNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">订单管理</h1>
          <p className="text-sm text-muted-foreground mt-1">查看所有用户订单</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索订单号..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
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
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">加载中...</p>
        </div>
      )}

      {!isLoading && filteredOrders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-4 rounded-full bg-muted">
            <ShoppingCart className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-medium">暂无订单</h3>
        </div>
      )}

      {!isLoading && filteredOrders.length > 0 && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>订单号</TableHead>
                <TableHead>类型</TableHead>
                <TableHead>节点/套餐</TableHead>
                <TableHead>周期/时长</TableHead>
                <TableHead>金额</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead className="w-[100px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono">{order.orderNo}</TableCell>
                  <TableCell>{getTypeLabel(order.type)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{order.nodePlan?.node.name || '-'}</p>
                      <p className="text-muted-foreground">{order.nodePlan?.template.name || '-'}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{order.billingCycle}</p>
                      <p className="text-muted-foreground">{order.durationMonths} 个月</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>¥{order.finalPrice}</p>
                      {Number(order.discountAmount) > 0 && (
                        <p className="text-muted-foreground line-through">¥{order.originalPrice}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>订单详情</DialogTitle>
            <DialogDescription>查看订单详细信息</DialogDescription>
          </DialogHeader>
          {selectedOrder && <OrderDetailDialog order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
