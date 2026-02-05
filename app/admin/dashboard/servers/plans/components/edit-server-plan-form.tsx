'use client';

import { useState } from 'react';
import {
  Cpu,
  MemoryStick,
  HardDrive,
  Globe,
  Tag,
  Boxes,
  ToggleRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { NodePlan } from '@/lib/types';
import { ServerPlanFormData } from './types';

interface EditServerPlanFormProps {
  plan: NodePlan;
  onSuccess: (data: ServerPlanFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function EditServerPlanForm({
  plan,
  onSuccess,
  onCancel,
  isSubmitting = false,
}: EditServerPlanFormProps) {
  const [priceMonthly, setPriceMonthly] = useState(plan.priceMonthly.toString());
  const [priceYearly, setPriceYearly] = useState(
    plan.priceYearly?.toString() || ''
  );
  const [stock, setStock] = useState(plan.stock.toString());
  const [isActive, setIsActive] = useState(plan.isActive);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    const monthlyPrice = parseFloat(priceMonthly);
    if (isNaN(monthlyPrice) || monthlyPrice < 0) {
      newErrors.priceMonthly = '请输入有效的月付价格';
    }

    if (priceYearly) {
      const yearlyPrice = parseFloat(priceYearly);
      if (isNaN(yearlyPrice) || yearlyPrice < 0) {
        newErrors.priceYearly = '请输入有效的年付价格';
      }
    }

    const stockNum = parseInt(stock);
    if (isNaN(stockNum) || stockNum < 0) {
      newErrors.stock = '请输入有效的库存数量';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSuccess({
      templateId: plan.templateId,
      priceMonthly: parseFloat(priceMonthly),
      priceYearly: priceYearly ? parseFloat(priceYearly) : null,
      stock: parseInt(stock),
      isActive,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 套餐信息（只读） */}
      <div className="p-4 bg-muted rounded-lg">
        <h4 className="text-sm font-medium mb-3">套餐信息</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">套餐名称</span>
            <span className="font-medium">{plan.name}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Cpu className="h-3 w-3" />
              {plan.cpu} 核
            </span>
            <span className="flex items-center gap-1">
              <MemoryStick className="h-3 w-3" />
              {plan.ramMb >= 1024
                ? `${plan.ramMb / 1024} GB`
                : `${plan.ramMb} MB`}{' '}
              内存
            </span>
            <span className="flex items-center gap-1">
              <HardDrive className="h-3 w-3" />
              {plan.diskGb} GB 硬盘
            </span>
            <span className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              {plan.trafficGb ? `${plan.trafficGb} GB/月` : '不限流量'}
            </span>
          </div>
        </div>
      </div>

      {/* 价格和库存 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="editPriceMonthly">
            月付价格 (元) <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Tag className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="editPriceMonthly"
              type="number"
              min="0"
              step="0.01"
              value={priceMonthly}
              onChange={(e) => setPriceMonthly(e.target.value)}
              className="pl-9"
            />
          </div>
          {errors.priceMonthly && (
            <p className="text-sm text-destructive">{errors.priceMonthly}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="editPriceYearly">年付价格 (元)</Label>
          <div className="relative">
            <Tag className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="editPriceYearly"
              type="number"
              min="0"
              step="0.01"
              placeholder="留空表示不支持年付"
              value={priceYearly}
              onChange={(e) => setPriceYearly(e.target.value)}
              className="pl-9"
            />
          </div>
          {errors.priceYearly && (
            <p className="text-sm text-destructive">{errors.priceYearly}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="editStock">
            库存数量 <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Boxes className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="editStock"
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="pl-9"
            />
          </div>
          {errors.stock && (
            <p className="text-sm text-destructive">{errors.stock}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="editIsActive">启用状态</Label>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <ToggleRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">是否启用</span>
            </div>
            <Switch
              id="editIsActive"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          取消
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '保存中...' : '保存修改'}
        </Button>
      </div>
    </form>
  );
}
