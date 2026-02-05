'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Cpu,
  MemoryStick,
  HardDrive,
  Globe,
  Tag,
  Boxes,
  Plus,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from '@/components/ui/field';
import type { NodePlan, PlanTemplate } from '@/lib/types';

// 计费周期 Schema
const billingCycleSchema = z.object({
  cycle: z.string().min(1, '请输入周期标识'),
  enabled: z.boolean(),
  months: z.number().min(1, '月份数至少为1'),
  name: z.string().min(1, '请输入周期名称'),
  price: z.number().min(0, '价格不能为负数'),
  sortOrder: z.number(),
});

// 表单验证 Schema
const editServerPlanSchema = z.object({
  stock: z.number().min(-1, '库存不能小于-1'),
  sortOrder: z.number(),
  status: z.number(),
  billingCycles: z.array(billingCycleSchema).min(1, '至少添加一个计费周期'),
});

type EditServerPlanSchemaType = z.infer<typeof editServerPlanSchema>;

interface EditServerPlanFormProps {
  plan: NodePlan;
  template?: PlanTemplate;
  onSuccess: (data: EditServerPlanSchemaType) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function EditServerPlanForm({
  plan,
  template,
  onSuccess,
  onCancel,
  isSubmitting = false,
}: EditServerPlanFormProps) {
  const form = useForm<EditServerPlanSchemaType>({
    resolver: zodResolver(editServerPlanSchema),
    defaultValues: {
      stock: plan.stock,
      sortOrder: plan.sortOrder,
      status: plan.status,
      billingCycles: plan.billingCycles?.length > 0
        ? plan.billingCycles
        : [{ cycle: 'monthly', enabled: true, months: 1, name: '月付', price: 0, sortOrder: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'billingCycles',
  });

  const onSubmit = (data: EditServerPlanSchemaType) => {
    onSuccess(data);
  };

  const addBillingCycle = () => {
    append({
      cycle: '',
      enabled: true,
      months: 1,
      name: '',
      price: 0,
      sortOrder: fields.length,
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup className="gap-4">
        {/* 套餐信息（只读） */}
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="text-sm font-medium mb-3">套餐信息</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">套餐名称</span>
              <span className="font-medium">{template?.name || '未知套餐'}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Cpu className="h-3 w-3" />
                {template?.cpu || '-'} 核
              </span>
              <span className="flex items-center gap-1">
                <MemoryStick className="h-3 w-3" />
                {template?.ramMb === undefined
                  ? '- MB'
                  : template.ramMb >= 1024
                    ? `${template.ramMb / 1024} GB`
                    : `${template.ramMb} MB`}{' '}
                内存
              </span>
              <span className="flex items-center gap-1">
                <HardDrive className="h-3 w-3" />
                {template?.diskGb || '-'} GB 硬盘
              </span>
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                {template?.trafficGb ? `${template.trafficGb} GB/月` : '不限流量'}
              </span>
            </div>
          </div>
        </div>

        {/* 库存和状态 */}
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>
              库存数量 <span className="text-destructive">*</span>
            </FieldLabel>
            <div className="relative">
              <Boxes className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                min="-1"
                placeholder="-1表示不限"
                className="pl-9"
                {...form.register('stock', { valueAsNumber: true })}
              />
            </div>
            {form.formState.errors.stock && (
              <FieldError errors={[form.formState.errors.stock]} />
            )}
          </Field>

          <Field>
            <FieldLabel>排序</FieldLabel>
            <Input
              type="number"
              min="0"
              {...form.register('sortOrder', { valueAsNumber: true })}
            />
          </Field>
        </div>

        <Field>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm">启用状态</span>
            </div>
            <Switch
              checked={form.watch('status') === 1}
              onCheckedChange={(checked) => form.setValue('status', checked ? 1 : 0)}
            />
          </div>
        </Field>

        {/* 计费周期 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FieldLabel>计费周期配置</FieldLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addBillingCycle}
            >
              <Plus className="h-4 w-4 mr-1" />
              添加周期
            </Button>
          </div>

          {form.formState.errors.billingCycles && (
            <p className="text-sm text-destructive">
              {form.formState.errors.billingCycles.message}
            </p>
          )}

          <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="p-3 border rounded-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">周期 #{index + 1}</span>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={form.watch(`billingCycles.${index}.enabled`)}
                      onCheckedChange={(checked) =>
                        form.setValue(`billingCycles.${index}.enabled`, checked)
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => remove(index)}
                      disabled={fields.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Field>
                    <Label className="text-xs">周期名称</Label>
                    <Input
                      placeholder="如：月付、年付"
                      {...form.register(`billingCycles.${index}.name`)}
                    />
                  </Field>

                  <Field>
                    <Label className="text-xs">周期标识</Label>
                    <Input
                      placeholder="如：monthly、yearly"
                      {...form.register(`billingCycles.${index}.cycle`)}
                    />
                  </Field>

                  <Field>
                    <Label className="text-xs">月份数</Label>
                    <Input
                      type="number"
                      min="1"
                      {...form.register(`billingCycles.${index}.months`, {
                        valueAsNumber: true,
                      })}
                    />
                  </Field>

                  <Field>
                    <Label className="text-xs">价格 (元)</Label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        className="pl-9"
                        {...form.register(`billingCycles.${index}.price`, {
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                  </Field>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FieldGroup>

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
