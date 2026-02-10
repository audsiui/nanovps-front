'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MoreHorizontal, Pencil, Trash2, Copy, Eye, Percent, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import type { PromoCode } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { useUpdatePromoCode, useDeletePromoCode } from '@/lib/requests/promo-codes';
import { PromoCodeUsageRecords } from './promo-code-usage-records';

interface PromoCodeTableProps {
  promoCodes: PromoCode[];
  onEdit: (promoCode: PromoCode) => void;
  onRefresh: () => void;
}

export function PromoCodeTable({ promoCodes, onEdit, onRefresh }: PromoCodeTableProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [usagePromoCodeId, setUsagePromoCodeId] = useState<number | null>(null);
  const updateMutation = useUpdatePromoCode();
  const deleteMutation = useDeletePromoCode();

  // 切换状态
  const handleToggleStatus = async (promoCode: PromoCode) => {
    try {
      await updateMutation.mutateAsync({
        id: promoCode.id,
        isActive: !promoCode.isActive,
      });
      toast.success(promoCode.isActive ? '已禁用优惠码' : '已启用优惠码');
      onRefresh();
    } catch (error) {
      toast.error('操作失败：' + (error instanceof Error ? error.message : '未知错误'));
    }
  };

  // 删除优惠码
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync({ id: deleteId });
      toast.success('优惠码删除成功');
      setDeleteId(null);
      onRefresh();
    } catch (error) {
      toast.error('删除失败：' + (error instanceof Error ? error.message : '未知错误'));
    }
  };

  // 复制优惠码
  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('优惠码已复制');
  };

  // 格式化折扣显示
  const formatDiscount = (type: string, value: string) => {
    if (type === 'fixed') {
      return `¥${value}`;
    }
    return `${value}%`;
  };

  // 获取使用场景标签
  const getUsageTypeLabel = (type: string) => {
    switch (type) {
      case 'purchase':
        return <Badge variant="outline">购买</Badge>;
      case 'recharge':
        return <Badge variant="outline">充值</Badge>;
      case 'both':
        return <Badge variant="outline">通用</Badge>;
      default:
        return null;
    }
  };

  // 获取状态标签
  const getStatusBadge = (isActive: boolean, endAt?: string) => {
    const now = new Date();
    const expired = endAt && new Date(endAt) < now;
    
    if (!isActive) {
      return <Badge variant="secondary">已禁用</Badge>;
    }
    if (expired) {
      return <Badge variant="destructive">已过期</Badge>;
    }
    return <Badge className="bg-green-500 hover:bg-green-600">启用中</Badge>;
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>优惠码</TableHead>
              <TableHead>折扣类型</TableHead>
              <TableHead>使用场景</TableHead>
              <TableHead>使用限制</TableHead>
              <TableHead>已用/限制</TableHead>
              <TableHead>有效期</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="w-[100px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promoCodes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  暂无优惠码
                </TableCell>
              </TableRow>
            ) : (
              promoCodes.map((promoCode) => (
                <TableRow key={promoCode.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium">{promoCode.code}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleCopy(promoCode.code)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    {promoCode.description && (
                      <p className="text-xs text-muted-foreground mt-1">{promoCode.description}</p>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {promoCode.type === 'fixed' ? (
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Percent className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span>{formatDiscount(promoCode.type, promoCode.value)}</span>
                    </div>
                    {promoCode.type === 'percentage' && promoCode.maxDiscount && (
                      <p className="text-xs text-muted-foreground">
                        最高优惠 ¥{promoCode.maxDiscount}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>{getUsageTypeLabel(promoCode.usageType)}</TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm">
                      {promoCode.minAmount && (
                        <p>最低 ¥{promoCode.minAmount}</p>
                      )}
                      <p>每用户限 {promoCode.perUserLimit} 次</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {promoCode.usageCount} / {promoCode.usageLimit ?? '∞'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm">
                      {promoCode.startAt && <p>开始: {formatDate(promoCode.startAt)}</p>}
                      {promoCode.endAt && <p>结束: {formatDate(promoCode.endAt)}</p>}
                      {!promoCode.startAt && !promoCode.endAt && <p className="text-muted-foreground">无限制</p>}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(promoCode.isActive, promoCode.endAt)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(promoCode)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          编辑
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setUsagePromoCodeId(promoCode.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          查看使用记录
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(promoCode)}>
                          <Switch checked={promoCode.isActive} className="mr-2 h-4 w-4" />
                          {promoCode.isActive ? '禁用' : '启用'}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeleteId(promoCode.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 删除确认对话框 */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              此操作将永久删除该优惠码。如果该优惠码已被使用，则无法删除。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 使用记录对话框 */}
      <Dialog open={!!usagePromoCodeId} onOpenChange={() => setUsagePromoCodeId(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>优惠码使用记录</DialogTitle>
            <DialogDescription>
              查看该优惠码的使用情况
            </DialogDescription>
          </DialogHeader>
          {usagePromoCodeId && (
            <PromoCodeUsageRecords promoCodeId={usagePromoCodeId} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
