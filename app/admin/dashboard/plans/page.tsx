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
  mockPlans,
  PlanCard,
  AddPlanForm,
  EditPlanForm,
  PlanTemplate,
} from './components';

export default function PlansPage() {
  const [plans, setPlans] = useState<PlanTemplate[]>(mockPlans);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanTemplate | null>(null);

  // 按名称排序
  const sortedPlans = useMemo(() => {
    return [...plans].sort((a, b) => a.name.localeCompare(b.name));
  }, [plans]);

  // 筛选逻辑
  const filteredPlans = sortedPlans.filter((plan) => {
    const matchesSearch =
      plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.id.toString().includes(searchQuery) ||
      (plan.remark?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    return matchesSearch;
  });

  // 处理编辑
  const handleEdit = (plan: PlanTemplate) => {
    setSelectedPlan(plan);
    setIsEditDialogOpen(true);
  };

  // 处理保存编辑
  const handleSaveEdit = (updatedPlan: PlanTemplate) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p))
    );
    setIsEditDialogOpen(false);
    setSelectedPlan(null);
  };

  // 处理删除
  const handleDelete = (id: number) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索套餐名称或ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
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
                填写套餐配置信息以创建新的 VPS 套餐模板
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
              onDelete={handleDelete}
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
    </div>
  );
}
