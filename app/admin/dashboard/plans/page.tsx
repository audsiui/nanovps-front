'use client';

import { useState, useMemo } from 'react';
import { Plus, Search, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  mockPlans,
  PlanCard,
  AddPlanForm,
  EditPlanForm,
  AllocationDialog,
  Plan,
  ServerAllocation,
} from './components';

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>(mockPlans);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAllocationDialogOpen, setIsAllocationDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  // 按 sortOrder 排序
  const sortedPlans = useMemo(() => {
    return [...plans].sort((a, b) => a.sortOrder - b.sortOrder);
  }, [plans]);

  // 筛选逻辑
  const filteredPlans = sortedPlans.filter((plan) => {
    const matchesSearch =
      plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.id.toString().includes(searchQuery) ||
      (plan.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && plan.status === 1) ||
      (statusFilter === 'inactive' && plan.status === 0);
    return matchesSearch && matchesStatus;
  });

  // 处理编辑
  const handleEdit = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsEditDialogOpen(true);
  };

  // 处理保存编辑
  const handleSaveEdit = (updatedPlan: Plan) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p))
    );
    setIsEditDialogOpen(false);
    setSelectedPlan(null);
  };

  // 处理切换状态
  const handleToggleStatus = (id: number) => {
    setPlans((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: p.status === 1 ? 0 : 1, updatedAt: new Date().toISOString() } : p
      )
    );
  };

  // 处理删除
  const handleDelete = (id: number) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
  };

  // 打开服务器分配管理
  const handleManageAllocations = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsAllocationDialogOpen(true);
  };

  // 更新服务器分配
  const handleUpdateAllocation = (planId: number, allocation: ServerAllocation) => {
    setPlans((prev) =>
      prev.map((p) =>
        p.id === planId
          ? {
              ...p,
              allocations: p.allocations.map((a) =>
                a.serverId === allocation.serverId ? allocation : a
              ),
              updatedAt: new Date().toISOString(),
            }
          : p
      )
    );
    // 同步更新 selectedPlan
    setSelectedPlan((prev) =>
      prev && prev.id === planId
        ? {
            ...prev,
            allocations: prev.allocations.map((a) =>
              a.serverId === allocation.serverId ? allocation : a
            ),
          }
        : prev
    );
  };

  // 添加服务器分配
  const handleAddAllocation = (planId: number, serverId: number, serverName: string, price: string, currency: string) => {
    setPlans((prev) =>
      prev.map((p) =>
        p.id === planId
          ? {
              ...p,
              allocations: [
                ...p.allocations,
                {
                  serverId,
                  serverName,
                  maxStock: 10,
                  usedCount: 0,
                  enabled: true,
                  price,
                  currency,
                },
              ],
              updatedAt: new Date().toISOString(),
            }
          : p
      )
    );
    // 同步更新 selectedPlan
    setSelectedPlan((prev) =>
      prev && prev.id === planId
        ? {
            ...prev,
            allocations: [
              ...prev.allocations,
              {
                serverId,
                serverName,
                maxStock: 10,
                usedCount: 0,
                enabled: true,
                price,
                currency,
              },
            ],
          }
        : prev
    );
  };

  // 移除服务器分配
  const handleRemoveAllocation = (planId: number, serverId: number) => {
    setPlans((prev) =>
      prev.map((p) =>
        p.id === planId
          ? {
              ...p,
              allocations: p.allocations.filter((a) => a.serverId !== serverId),
              updatedAt: new Date().toISOString(),
            }
          : p
      )
    );
    // 同步更新 selectedPlan
    setSelectedPlan((prev) =>
      prev && prev.id === planId
        ? {
            ...prev,
            allocations: prev.allocations.filter((a) => a.serverId !== serverId),
          }
        : prev
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索套餐名称或ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="active">上架中</SelectItem>
              <SelectItem value="inactive">已下架</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              添加套餐模板
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>添加新套餐模板</DialogTitle>
              <DialogDescription>
                填写套餐配置信息以创建新的容器实例套餐模板
              </DialogDescription>
            </DialogHeader>
            <AddPlanForm onSuccess={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* 套餐卡片网格 */}
      {filteredPlans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-4 rounded-full bg-muted">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-medium">暂无套餐模板</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            点击上方按钮添加第一个套餐模板
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onEdit={handleEdit}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDelete}
              onManageAllocations={handleManageAllocations}
            />
          ))}
        </div>
      )}

      {/* 编辑套餐对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>编辑套餐模板</DialogTitle>
            <DialogDescription>
              修改套餐的配置信息
            </DialogDescription>
          </DialogHeader>
          {selectedPlan && (
            <EditPlanForm
              plan={selectedPlan}
              onSuccess={handleSaveEdit}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedPlan(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* 服务器分配管理对话框 */}
      <AllocationDialog
        plan={selectedPlan}
        open={isAllocationDialogOpen}
        onOpenChange={setIsAllocationDialogOpen}
        onUpdateAllocation={handleUpdateAllocation}
        onAddAllocation={handleAddAllocation}
        onRemoveAllocation={handleRemoveAllocation}
      />
    </div>
  );
}
