'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from '@/components/ui/field';
import { PlanTemplate } from './types';
import { useUpdatePlanTemplate } from '@/lib/requests/plan-templates';
import { toast } from 'sonner';

// 表单验证 Schema
const planSchema = z.object({
  name: z.string().min(1, '请输入套餐名称').max(50, '名称最多50个字符'),
  cpu: z.number().min(1, 'CPU至少1核'),
  ramMb: z.number().min(128, '内存至少128MB'),
  diskGb: z.number().min(1, '硬盘至少1GB'),
  trafficGb: z.number().nullable().optional(),
  bandwidthMbps: z.number().nullable().optional(),
  portCount: z.number().nullable().optional(),
  remark: z.string().optional(),
});

type PlanSchemaType = z.infer<typeof planSchema>;

interface EditPlanFormProps {
  plan: PlanTemplate;
  onSuccess: (updatedPlan: PlanTemplate) => void;
  onCancel: () => void;
}

export function EditPlanForm({ plan, onSuccess, onCancel }: EditPlanFormProps) {
  const updateMutation = useUpdatePlanTemplate();

  const form = useForm<PlanSchemaType>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: plan.name,
      cpu: plan.cpu,
      ramMb: plan.ramMb,
      diskGb: plan.diskGb,
      trafficGb: plan.trafficGb,
      bandwidthMbps: plan.bandwidthMbps,
      portCount: plan.portCount,
      remark: plan.remark || '',
    },
  });

  const onSubmit = async (data: PlanSchemaType) => {
    try {
      const updated = await updateMutation.mutateAsync({
        id: plan.id,
        name: data.name,
        remark: data.remark,
        cpu: data.cpu,
        ramMb: data.ramMb,
        diskGb: data.diskGb,
        trafficGb: data.trafficGb,
        bandwidthMbps: data.bandwidthMbps,
        portCount: data.portCount,
      });
      toast.success('套餐模板更新成功');
      onSuccess(updated);
    } catch (error) {
      toast.error('更新失败：' + (error instanceof Error ? error.message : '未知错误'));
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="gap-4">
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

        <Field>
          <FieldLabel>套餐备注</FieldLabel>
          <Textarea
            placeholder="套餐的简短描述..."
            {...form.register('remark')}
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

          <Field data-invalid={!!form.formState.errors.ramMb}>
            <FieldLabel>
              内存 (MB) <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              type="number"
              min={128}
              step={64}
              {...form.register('ramMb', { valueAsNumber: true })}
            />
            {form.formState.errors.ramMb && (
              <FieldError errors={[form.formState.errors.ramMb]} />
            )}
          </Field>

          <Field data-invalid={!!form.formState.errors.diskGb}>
            <FieldLabel>
              硬盘 (GB) <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              type="number"
              min={1}
              {...form.register('diskGb', { valueAsNumber: true })}
            />
            {form.formState.errors.diskGb && (
              <FieldError errors={[form.formState.errors.diskGb]} />
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
              {...form.register('trafficGb', { valueAsNumber: true, setValueAs: (v) => v === '' ? null : parseInt(v) })}
            />
          </Field>

          <Field>
            <FieldLabel>带宽 (Mbps)</FieldLabel>
            <Input
              type="number"
              min={0}
              placeholder="留空表示不限"
              {...form.register('bandwidthMbps', { valueAsNumber: true, setValueAs: (v) => v === '' ? null : parseInt(v) })}
            />
          </Field>

          <Field>
            <FieldLabel>端口数量</FieldLabel>
            <Input
              type="number"
              min={1}
              placeholder="留空表示不限"
              {...form.register('portCount', { valueAsNumber: true, setValueAs: (v) => v === '' ? null : parseInt(v) })}
            />
          </Field>
        </div>
      </FieldGroup>

      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={onCancel} disabled={updateMutation.isPending}>
          取消
        </Button>
        <Button type="submit" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? '保存中...' : '保存修改'}
        </Button>
      </DialogFooter>
    </form>
  );
}
