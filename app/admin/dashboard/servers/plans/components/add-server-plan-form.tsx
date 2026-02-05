'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Cpu,
  MemoryStick,
  HardDrive,
  Globe,
  Check,
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
import type { PlanTemplate } from '@/lib/types';

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
const serverPlanSchema = z.object({
  planTemplateId: z.number().min(1, '请选择套餐模板'),
  stock: z.number().min(-1, '库存不能小于-1'),
  sortOrder: z.number(),
  status: z.number(),
  billingCycles: z.array(billingCycleSchema).min(1, '至少添加一个计费周期'),
});

type ServerPlanSchemaType = z.infer<typeof serverPlanSchema>;

interface AddServerPlanFormProps {
  availableTemplates: PlanTemplate[];
  nodeId: number;
  onSuccess: (data: ServerPlanSchemaType) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function AddServerPlanForm({
  availableTemplates,
  nodeId,
  onSuccess,
  onCancel,
  isSubmitting = false,
}: AddServerPlanFormProps) {
  const form = useForm<ServerPlanSchemaType>({
    resolver: zodResolver(serverPlanSchema),
    defaultValues: {
      planTemplateId: 0,
      stock: 10,
      sortOrder: 0,
      status: 1,
      billingCycles: [
        {
          cycle: 'monthly',
          enabled: true,
          months: 1,
          name: '月付',
          price: 0,
          sortOrder: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'billingCycles',
  });

  const selectedTemplateId = form.watch('planTemplateId');
  const selectedTemplate = availableTemplates.find(
    (t) => t.id === selectedTemplateId
  );

  const onSubmit = (data: ServerPlanSchemaType) => {
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
        {/* 套餐模板选择 */}
        <Field>
          <FieldLabel>
            选择套餐模板 <span className="text-destructive">*</span>
          </FieldLabel>
          {availableTemplates.length === 0 ? (
            <div className="p-4 border rounded-lg bg-muted text-center text-muted-foreground">
              暂无可用的套餐模板，所有模板已添加到此服务器
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto p-1">
              {availableTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => form.setValue('planTemplateId', template.id)}
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
          {form.formState.errors.planTemplateId && (
            <FieldError errors={[form.formState.errors.planTemplateId]} />
          )}
        </Field>

        {/* 库存 */}
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

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
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
        <Button type="submit" disabled={availableTemplates.length === 0 || isSubmitting}>
          {isSubmitting ? '提交中...' : '确认添加'}
        </Button>
      </div>
    </form>
  );
}
