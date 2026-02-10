'use client';

import { useState } from 'react';
import { Plus, Search, Tag, Loader2 } from 'lucide-react';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  PromoCodeTable,
  AddPromoCodeForm,
  EditPromoCodeForm,
} from './components';
import { usePromoCodeList } from '@/lib/requests/promo-codes';
import { statusOptions } from './components/data';
import type { PromoCode } from '@/lib/types';

export default function PromoCodesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPromoCode, setSelectedPromoCode] = useState<PromoCode | null>(null);

  // 构建查询参数
  const queryParams = {
    page: 1,
    pageSize: 100,
    keyword: searchQuery || undefined,
    isActive: statusFilter === 'all' ? undefined : statusFilter === 'active',
  };

  // 获取优惠码列表
  const { data, isLoading, refetch } = usePromoCodeList(queryParams);
  const promoCodes = data?.list || [];

  // 处理编辑
  const handleEdit = (promoCode: PromoCode) => {
    setSelectedPromoCode(promoCode);
    setIsEditDialogOpen(true);
  };

  // 处理添加成功
  const handleAddSuccess = () => {
    setIsAddDialogOpen(false);
    refetch();
  };

  // 处理编辑成功
  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    setSelectedPromoCode(null);
    refetch();
  };

  return (
    <div className="space-y-4">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">优惠码管理</h1>
          <p className="text-sm text-muted-foreground mt-1">
            管理优惠码，支持固定金额和百分比折扣
          </p>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索优惠码..."
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

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              创建优惠码
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>创建新优惠码</DialogTitle>
              <DialogDescription>
                填写优惠码信息，支持固定金额和百分比两种折扣类型
              </DialogDescription>
            </DialogHeader>
            <AddPromoCodeForm onSuccess={handleAddSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      {/* 加载状态 */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">加载中...</p>
        </div>
      )}

      {/* 空状态 */}
      {!isLoading && promoCodes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-4 rounded-full bg-muted">
            <Tag className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-medium">暂无优惠码</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            点击上方按钮创建第一个优惠码
          </p>
        </div>
      )}

      {/* 优惠码列表 */}
      {!isLoading && promoCodes.length > 0 && (
        <PromoCodeTable
          promoCodes={promoCodes}
          onEdit={handleEdit}
          onRefresh={refetch}
        />
      )}

      {/* 编辑对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>编辑优惠码</DialogTitle>
            <DialogDescription>修改优惠码的配置信息</DialogDescription>
          </DialogHeader>
          {selectedPromoCode && (
            <EditPromoCodeForm
              promoCode={selectedPromoCode}
              onSuccess={handleEditSuccess}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedPromoCode(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
