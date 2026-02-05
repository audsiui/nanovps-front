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
  FieldDescription,
  FieldGroup,
} from '@/components/ui/field';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useCreateNode } from '@/lib/requests/nodes';
import { useRegionList } from '@/lib/requests/regions';
import { toast } from 'sonner';

// 表单验证 Schema - 匹配 nodes 表结构
const nodeSchema = z.object({
  name: z.string().min(1, '请输入节点名称').max(50, '名称最多50个字符'),
  agentToken: z.string().min(1, '请输入 Agent Token').max(64, 'Token 最多64个字符'),
  ipv4: z.string().min(1, '请输入 IPv4 地址'),
  ipv6: z.string().optional(),
  totalCpu: z.number().min(1, 'CPU核心数至少为1'),
  totalRamMb: z.number().min(1, '内存至少为1MB'),
  allocatableDiskGb: z.number().min(1, '硬盘容量至少为1GB'),
  regionId: z.number().min(1, '请选择所属区域'),
  status: z.number(),
});

type NodeFormData = z.infer<typeof nodeSchema>;

interface AddServerFormProps {
  onSuccess: () => void;
}

export function AddServerForm({ onSuccess }: AddServerFormProps) {
  const [copied, setCopied] = useState(false);
  const createNode = useCreateNode();
  const { data: regionsData, isLoading: isLoadingRegions } = useRegionList({ isActive: true });

  const form = useForm<NodeFormData>({
    resolver: zodResolver(nodeSchema),
    defaultValues: {
      name: '',
      agentToken: '',
      ipv4: '',
      ipv6: '',
      totalCpu: 4,
      totalRamMb: 8192,
      allocatableDiskGb: 100,
      regionId: 0,
      status: 1,
    },
  });

  const copyInstallCommand = () => {
    navigator.clipboard.writeText('curl -fsSL https://raw.githubusercontent.com/audsiui/nanovps-agent/main/install.sh | sudo bash');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onSubmit = async (data: NodeFormData) => {
    try {
      await createNode.mutateAsync(data);
      toast.success('节点创建成功');
      onSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '节点创建失败');
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="gap-4">
        <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900">
          <Terminal className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertTitle className="text-blue-800 dark:text-blue-300">如何获取 Agent Token？</AlertTitle>
          <AlertDescription className="text-blue-700 dark:text-blue-400 text-sm mt-1">
            <p className="mb-2">在目标服务器上运行以下命令安装 NanoVPS Agent，安装完成后会显示 Agent Token：</p>
            <div className="flex items-center gap-2 bg-slate-900 text-slate-50 px-3 py-2 rounded-md font-mono text-xs">
              <code className="flex-1">curl -fsSL https://raw.githubusercontent.com/audsiui/nanovps-agent/main/install.sh | sudo bash</code>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-slate-400 hover:text-slate-100"
                onClick={copyInstallCommand}
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </Button>
            </div>
            <p className="mt-2 text-xs opacity-80">
              更多详情可参考{' '}
              <a
                href="https://github.com/audsiui/nanovps-agent"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:no-underline"
              >
                GitHub 仓库
              </a>
            </p>
          </AlertDescription>
        </Alert>

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
            <FieldLabel>初始状态</FieldLabel>
            <Select
              defaultValue="1"
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

          <Field data-invalid={!!form.formState.errors.allocatableDiskGb}>
            <FieldLabel>
              硬盘容量 (GB) <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              type="number"
              {...form.register('allocatableDiskGb', { valueAsNumber: true })}
            />
            {form.formState.errors.allocatableDiskGb && (
              <FieldError errors={[form.formState.errors.allocatableDiskGb]} />
            )}
          </Field>
        </div>
      </FieldGroup>

      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={onSuccess}>
          取消
        </Button>
        <Button type="submit" disabled={createNode.isPending || isLoadingRegions}>
          {createNode.isPending ? '创建中...' : '创建节点'}
        </Button>
      </DialogFooter>
    </form>
  );
}