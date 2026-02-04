'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from '@/components/ui/field';
import { Plan, PlanStatus } from './types';

// 表单验证 Schema
const planSchema = z.object({
  name: z.string().min(1, '请输入套餐名称').max(50, '名称最多50个字符'),
  cpu: z.number().min(1, 'CPU至少1核'),
  memory: z.number().min(512, '内存至少512MB'),
  disk: z.number().min(5, '硬盘至少5GB'),
  traffic: z.number().nullable().optional(),
  bandwidth: z.number().nullable().optional(),
  ports: z.number().min(1, '至少1个端口'),
  description: z.string().optional(),
  status: z.union([z.literal(0), z.literal(1)]),
  sortOrder: z.number(),
});

type PlanSchemaType = z.infer<typeof planSchema>;

interface EditPlanFormProps {
  plan: Plan;
  onSuccess: (updatedPlan: Plan) => void;
  onCancel: () => void;
}

export function EditPlanForm({ plan, onSuccess, onCancel }: EditPlanFormProps) {
  const form = useForm<PlanSchemaType>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: plan.name,
      cpu: plan.cpu,
      memory: plan.memory,
      disk: plan.disk,
      traffic: plan.traffic,
      bandwidth: plan.bandwidth,
      ports: plan.ports,
      description: plan.description || '',
      status: plan.status,
      sortOrder: plan.sortOrder,
    },
  });

  const onSubmit = (data: PlanSchemaType) => {
    const updatedPlan: Plan = {
      ...plan,
      ...data,
      description: data.description || null,
      updatedAt: new Date().toISOString(),
    };
    console.log('Update plan data:', updatedPlan);
    // TODO: 调用 API 更新套餐
    onSuccess(updatedPlan);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Field data-invalid={!!form.formState.errors.name}>
            <FieldLabel>
              套餐名称 <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              placeholder="例如：入门版 - 1C1G"
              {...form.register('name')}
            />
            {form.formState.errors.name && (
              <FieldError errors={[form.formState.errors.name]} />
            )}
          </Field>

          <Field data-invalid={!!form.formState.errors.sortOrder}>
            <FieldLabel>排序权重</FieldLabel>
            <Input
              type="number"
              placeholder="数字越小越靠前"
              {...form.register('sortOrder', { valueAsNumber: true })}
            />
          </Field>
        </div>

        <Field>
          <FieldLabel>套餐描述</FieldLabel>
          <Textarea
            placeholder="套餐的简短描述..."
            {...form.register('description')}
          />
        </Field>

        <div className="grid grid-cols-3 gap-4">
          <Field data-invalid={!!form.formState.errors.cpu}>
            <FieldLabel>
              CPU 核心 <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              type="number"
              min={1}
              {...form.register('cpu', { valueAsNumber: true })}
            />
            {form.formState.errors.cpu && (
              <FieldError errors={[form.formState.errors.cpu]} />
            )}
          </Field>

          <Field data-invalid={!!form.formState.errors.memory}>
            <FieldLabel>
              内存 (MB) <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              type="number"
              min={512}
              step={512}
              {...form.register('memory', { valueAsNumber: true })}
            />
            {form.formState.errors.memory && (
              <FieldError errors={[form.formState.errors.memory]} />
            )}
          </Field>

          <Field data-invalid={!!form.formState.errors.disk}>
            <FieldLabel>
              硬盘 (GB) <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              type="number"
              min={5}
              {...form.register('disk', { valueAsNumber: true })}
            />
            {form.formState.errors.disk && (
              <FieldError errors={[form.formState.errors.disk]} />
            )}
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field>
            <FieldLabel>月流量 (GB)</FieldLabel>
            <Input
              type="number"
              min={0}
              placeholder="留空表示不限"
              {...form.register('traffic', { valueAsNumber: true, setValueAs: (v) => v === '' ? null : parseInt(v) })}
            />
          </Field>

          <Field>
            <FieldLabel>带宽 (Mbps)</FieldLabel>
            <Input
              type="number"
              min={0}
              placeholder="留空表示不限"
              {...form.register('bandwidth', { valueAsNumber: true, setValueAs: (v) => v === '' ? null : parseInt(v) })}
            />
          </Field>

          <Field data-invalid={!!form.formState.errors.ports}>
            <FieldLabel>
              端口数量 <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              type="number"
              min={1}
              {...form.register('ports', { valueAsNumber: true })}
            />
            {form.formState.errors.ports && (
              <FieldError errors={[form.formState.errors.ports]} />
            )}
          </Field>
        </div>

        <Field>
          <FieldLabel>状态</FieldLabel>
          <Select
            defaultValue={plan.status.toString()}
            onValueChange={(value) => form.setValue('status', parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">上架</SelectItem>
              <SelectItem value="0">下架</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </FieldGroup>

      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit">保存修改</Button>
      </DialogFooter>
    </form>
  );
}
