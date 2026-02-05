'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from '@/components/ui/field';
import { useRegionList } from '@/lib/requests/regions';
import { useUpdateNode } from '@/lib/requests/nodes';
import { toast } from 'sonner';
import type { Node } from '@/lib/types';

// 编辑表单验证 Schema - 硬盘不可编辑
const editNodeSchema = z.object({
  name: z.string().min(1, '请输入节点名称').max(50, '名称最多50个字符'),
  agentToken: z.string().min(1, '请输入 Agent Token').max(64, 'Token 最多64个字符'),
  ipv4: z.string().min(1, '请输入 IPv4 地址'),
  ipv6: z.string().optional(),
  totalCpu: z.number().min(1, 'CPU核心数至少为1'),
  totalRamMb: z.number().min(1, '内存至少为1MB'),
  regionId: z.number().min(1, '请选择所属区域'),
  status: z.number(),
});

type EditNodeFormData = z.infer<typeof editNodeSchema>;

interface EditServerFormProps {
  node: Node;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EditServerForm({ node, onSuccess, onCancel }: EditServerFormProps) {
  const { data: regionsData, isLoading: isLoadingRegions } = useRegionList({ isActive: true });
  const updateNode = useUpdateNode();

  const form = useForm<EditNodeFormData>({
    resolver: zodResolver(editNodeSchema),
    defaultValues: {
      name: node.name,
      agentToken: node.agentToken,
      ipv4: node.ipv4,
      ipv6: node.ipv6 || '',
      totalCpu: node.totalCpu,
      totalRamMb: node.totalRamMb,
      regionId: node.regionId,
      status: node.status,
    },
  });

  const onSubmit = async (data: EditNodeFormData) => {
    try {
      await updateNode.mutateAsync({
        id: node.id,
        ...data,
      });
      toast.success('节点更新成功');
      onSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '节点更新失败');
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="gap-4">
        <div className="grid grid-cols-3 gap-4">
          <Field data-invalid={!!form.formState.errors.name}>
            <FieldLabel>
              节点名称 <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              placeholder="例如：香港-01"
              {...form.register('name')}
            />
            {form.formState.errors.name && (
              <FieldError errors={[form.formState.errors.name]} />
            )}
          </Field>

          <Field data-invalid={!!form.formState.errors.agentToken}>
            <FieldLabel>
              Agent Token <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              placeholder="从 Agent 获取的 Token"
              {...form.register('agentToken')}
            />
            {form.formState.errors.agentToken && (
              <FieldError errors={[form.formState.errors.agentToken]} />
            )}
          </Field>

          <Field data-invalid={!!form.formState.errors.regionId}>
            <FieldLabel>
              所属区域 <span className="text-destructive">*</span>
            </FieldLabel>
            <Select
              defaultValue={String(node.regionId)}
              onValueChange={(value) => form.setValue('regionId', parseInt(value))}
              disabled={isLoadingRegions}
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoadingRegions ? '加载中...' : '选择区域'} />
              </SelectTrigger>
              <SelectContent>
                {regionsData?.list.map((region) => (
                  <SelectItem key={region.id} value={String(region.id)}>
                    {region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.regionId && (
              <FieldError errors={[form.formState.errors.regionId]} />
            )}
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field data-invalid={!!form.formState.errors.ipv4}>
            <FieldLabel>
              IPv4 地址 <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              placeholder="例如：203.0.113.1"
              {...form.register('ipv4')}
            />
            {form.formState.errors.ipv4 && (
              <FieldError errors={[form.formState.errors.ipv4]} />
            )}
          </Field>

          <Field data-invalid={!!form.formState.errors.ipv6}>
            <FieldLabel>IPv6 地址</FieldLabel>
            <Input
              placeholder="例如：2001:db8::1"
              {...form.register('ipv6')}
            />
          </Field>

          <Field>
            <FieldLabel>状态</FieldLabel>
            <Select
              defaultValue={String(node.status)}
              onValueChange={(value) => form.setValue('status', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">在线（接收实例）</SelectItem>
                <SelectItem value="0">维护中（不分配）</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field data-invalid={!!form.formState.errors.totalCpu}>
            <FieldLabel>
              CPU 核心数 <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              type="number"
              {...form.register('totalCpu', { valueAsNumber: true })}
            />
            {form.formState.errors.totalCpu && (
              <FieldError errors={[form.formState.errors.totalCpu]} />
            )}
          </Field>

          <Field data-invalid={!!form.formState.errors.totalRamMb}>
            <FieldLabel>
              内存容量 (MB) <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              type="number"
              {...form.register('totalRamMb', { valueAsNumber: true })}
            />
            {form.formState.errors.totalRamMb && (
              <FieldError errors={[form.formState.errors.totalRamMb]} />
            )}
          </Field>

          <Field>
            <FieldLabel>硬盘容量 (GB)</FieldLabel>
            <Input
              type="number"
              value={node.allocatableDiskGb}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground mt-1">硬盘容量不可修改</p>
          </Field>
        </div>
      </FieldGroup>

      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={onCancel} disabled={updateNode.isPending}>
          取消
        </Button>
        <Button type="submit" disabled={updateNode.isPending || isLoadingRegions}>
          {updateNode.isPending ? '保存中...' : '保存修改'}
        </Button>
      </DialogFooter>
    </form>
  );
}
