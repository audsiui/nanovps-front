'use client';

import { useState } from 'react';
import { Search, Wallet, Loader2, Eye } from 'lucide-react';
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
import { useMyRecharges } from '@/lib/requests/recharge';
import type { Recharge, RechargeStatus } from '@/lib/types';
import { formatDate } from '@/lib/utils';

const statusOptions = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待支付' },
  { value: 'paid', label: '已支付' },
  { value: 'cancelled', label: '已取消' },
  { value: 'failed', label: '失败' },
] as const;

const getStatusBadge = (status: RechargeStatus) => {
  const statusMap: Record<RechargeStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | null | undefined }> = {
    pending: { label: '待支付', variant: 'outline' },
    paid: { label: '已支付', variant: 'default' },
    cancelled: { label: '已取消', variant: 'secondary' },
    failed: { label: '失败', variant: 'destructive' },
  };
  const config = statusMap[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

const getChannelLabel = (channel?: string) => {
  const channelMap: Record<string, string> = {
    alipay: '支付宝',
    wechat: '微信支付',
    stripe: 'Stripe',
    paypal: 'PayPal',
  };
  return channel ? channelMap[channel] || channel : '-';
};

function RechargeDetailDialog({ recharge, onClose }: { recharge: Recharge; onClose: () => void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">充值单号</p>
          <p className="font-medium">{recharge.rechargeNo}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">状态</p>
          <p>{getStatusBadge(recharge.status)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">创建时间</p>
          <p className="font-medium">{formatDate(recharge.createdAt)}</p>
        </div>
        {recharge.paidAt && (
          <div>
            <p className="text-sm text-muted-foreground">支付时间</p>
            <p className="font-medium">{formatDate(recharge.paidAt)}</p>
          </div>
        )}
      </div>
      
      <div className="border-t pt-4">
        <h4 className="font-medium mb-2">金额信息</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">充值金额</span>
            <span>¥{recharge.amount}</span>
          </div>
          {Number(recharge.bonusAmount) > 0 && (
            <div className="flex justify-between text-green-600">
              <span>赠送金额</span>
              <span>+¥{recharge.bonusAmount}</span>
            </div>
          )}
          <div className="flex justify-between font-medium text-lg border-t pt-2">
            <span>实际到账</span>
            <span>¥{recharge.finalAmount}</span>
          </div>
        </div>
      </div>

      {recharge.channel && (
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">支付信息</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">支付渠道</p>
              <p className="font-medium">{getChannelLabel(recharge.channel)}</p>
            </div>
            {recharge.tradeNo && (
              <div>
                <p className="text-sm text-muted-foreground">第三方流水号</p>
                <p className="font-medium">{recharge.tradeNo}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function RechargesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRecharge, setSelectedRecharge] = useState<Recharge | null>(null);

  const queryParams = {
    page: 1,
    pageSize: 100,
    status: statusFilter === 'all' ? undefined : (statusFilter as RechargeStatus),
  };

  const { data, isLoading } = useMyRecharges(queryParams);
  const recharges = data?.list || [];

  // 过滤搜索结果
  const filteredRecharges = recharges.filter(recharge => 
    searchQuery === '' || 
    recharge.rechargeNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">充值管理</h1>
          <p className="text-sm text-muted-foreground mt-1">查看所有用户充值记录</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索充值单号..."
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

      {!isLoading && filteredRecharges.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-4 rounded-full bg-muted">
            <Wallet className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-medium">暂无充值记录</h3>
        </div>
      )}

      {!isLoading && filteredRecharges.length > 0 && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>充值单号</TableHead>
                <TableHead>充值金额</TableHead>
                <TableHead>赠送金额</TableHead>
                <TableHead>实际到账</TableHead>
                <TableHead>支付渠道</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead className="w-[100px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecharges.map((recharge) => (
                <TableRow key={recharge.id}>
                  <TableCell className="font-mono">{recharge.rechargeNo}</TableCell>
                  <TableCell>¥{recharge.amount}</TableCell>
                  <TableCell className="text-green-600">
                    {Number(recharge.bonusAmount) > 0 ? `+¥${recharge.bonusAmount}` : '-'}
                  </TableCell>
                  <TableCell className="font-medium">¥{recharge.finalAmount}</TableCell>
                  <TableCell>{getChannelLabel(recharge.channel)}</TableCell>
                  <TableCell>{getStatusBadge(recharge.status)}</TableCell>
                  <TableCell>{formatDate(recharge.createdAt)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedRecharge(recharge)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!selectedRecharge} onOpenChange={() => setSelectedRecharge(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>充值详情</DialogTitle>
            <DialogDescription>查看充值详细信息</DialogDescription>
          </DialogHeader>
          {selectedRecharge && <RechargeDetailDialog recharge={selectedRecharge} onClose={() => setSelectedRecharge(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
