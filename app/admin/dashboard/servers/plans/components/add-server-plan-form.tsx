'use client';

import { useState } from 'react';
import {
  Cpu,
  MemoryStick,
  HardDrive,
  Globe,
  Check,
  Tag,
  Boxes,
  ToggleRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { PlanTemplate } from '../../../plans/components';
import { ServerPlanFormData } from './types';

interface AddServerPlanFormProps {
  availableTemplates: PlanTemplate[];
  onSuccess: (data: ServerPlanFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function AddServerPlanForm({
  availableTemplates,
  onSuccess,
  onCancel,
  isSubmitting = false,
}: AddServerPlanFormProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    null
  );
  const [priceMonthly, setPriceMonthly] = useState('');
  const [priceYearly, setPriceYearly] = useState('');
  const [stock, setStock] = useState('10');
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedTemplate = availableTemplates.find(
    (t) => t.id === selectedTemplateId
  );

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedTemplateId) {
      newErrors.template = '请选择套餐模板';
    }

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
      templateId: selectedTemplateId!,
      priceMonthly: parseFloat(priceMonthly),
      priceYearly: priceYearly ? parseFloat(priceYearly) : null,
      stock: parseInt(stock),
      isActive,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 套餐模板选择 */}
      <div className="space-y-2">
        <Label>
          选择套餐模板 <span className="text-destructive">*</span>
        </Label>
        {availableTemplates.length === 0 ? (
          <div className="p-4 border rounded-lg bg-muted text-center text-muted-foreground">
            暂无可用的套餐模板，所有模板已添加到此服务器
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto p-1">
            {availableTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplateId(template.id)}
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-primary ${
                  selectedTemplateId === template.id
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="font-medium">{template.name}</div>
                  {selectedTemplateId === template.id && (
                    <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                </div>
                {template.remark && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {template.remark}
                  </p>
                )}
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Cpu className="h-3 w-3" />
                    {template.cpu} 核
                  </span>
                  <span className="flex items-center gap-1">
                    <MemoryStick className="h-3 w-3" />
                    {template.ramMb >= 1024
                      ? `${template.ramMb / 1024} GB`
                      : `${template.ramMb} MB`}{' '}
                    内存
                  </span>
                  <span className="flex items-center gap-1">
                    <HardDrive className="h-3 w-3" />
                    {template.diskGb} GB 硬盘
                  </span>
                  <span className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    {template.trafficGb
                      ? `${template.trafficGb} GB/月`
                      : '不限流量'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        {errors.template && (
          <p className="text-sm text-destructive">{errors.template}</p>
        )}
      </div>

      {/* 价格和库存 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="priceMonthly">
            月付价格 (元) <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Tag className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="priceMonthly"
              type="number"
              min="0"
              step="0.01"
              placeholder="29.00"
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
          <Label htmlFor="priceYearly">年付价格 (元)</Label>
          <div className="relative">
            <Tag className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="priceYearly"
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
          <Label htmlFor="stock">
            库存数量 <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Boxes className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="stock"
              type="number"
              min="0"
              placeholder="10"
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
          <Label htmlFor="isActive">启用状态</Label>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <ToggleRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">是否立即启用</span>
            </div>
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>
        </div>
      </div>

      {/* 预览 */}
      {selectedTemplate && (
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="text-sm font-medium mb-2">配置预览</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>
              <span className="font-medium text-foreground">套餐名称:</span>{' '}
              {selectedTemplate.name}
            </p>
            <p>
              <span className="font-medium text-foreground">资源配置:</span>{' '}
              {selectedTemplate.cpu} 核 /{' '}
              {selectedTemplate.ramMb >= 1024
                ? `${selectedTemplate.ramMb / 1024} GB`
                : `${selectedTemplate.ramMb} MB`}{' '}
              / {selectedTemplate.diskGb} GB
            </p>
            <p>
              <span className="font-medium text-foreground">价格:</span> ¥
              {priceMonthly || '0'}/月
              {priceYearly && ` / ¥${priceYearly}/年`}
            </p>
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          取消
        </Button>
        <Button type="submit" disabled={availableTemplates.length === 0 || isSubmitting}>
          {isSubmitting ? '提交中...' : '确认添加'}
        </Button>
      </div>
    </form>
  );
}
