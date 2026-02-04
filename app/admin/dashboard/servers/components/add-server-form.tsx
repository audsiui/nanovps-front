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

// 表单验证 Schema - 匹配 nodes 表结构
const nodeSchema = z.object({
  name: z.string().min(1, '请输入节点名称').max(50, '名称最多50个字符'),
  agentToken: z.string().min(1, '请输入 Agent Token').max(64, 'Token 最多64个字符'),
  ipv4: z.string().optional().or(z.literal('')),
  ipv6: z.string().optional().or(z.literal('')),
  totalCpu: z.coerce.number().min(1, 'CPU核心数至少为1').nullable(),
  totalRamMb: z.coerce.number().min(1, '内存至少为1MB').nullable(),
  regionId: z.coerce.number().nullable(),
  status: z.coerce.number().default(1),
});

type NodeFormData = z.infer<typeof nodeSchema>;

interface AddServerFormProps {
  onSuccess: () => void;
}

export function AddServerForm({ onSuccess }: AddServerFormProps) {
  const [copied, setCopied] = useState(false);

  const form = useForm<NodeFormData>({
    resolver: zodResolver(nodeSchema),
    defaultValues: {
      name: '',
      agentToken: '',
      ipv4: '',
      ipv6: '',
      totalCpu: 4,
      totalRamMb: 8192,
      regionId: null,
      status: 1,
    },
  });

  const copyInstallCommand = () => {
    navigator.clipboard.writeText('curl -fsSL https://raw.githubusercontent.com/audsiui/nanovps-agent/main/install.sh | sudo bash');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onSubmit = (data: NodeFormData) => {
    console.log('Submit node data:', data);
    // TODO: 调用 API 创建节点
    onSuccess();
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

        <div className="grid grid-cols-2 gap-4">
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
              placeholder="输入从 Agent 安装后获取的 Token"
              {...form.register('agentToken')}
            />
            <FieldDescription>
              从服务器运行安装脚本后获取的认证令牌
            </FieldDescription>
            {form.formState.errors.agentToken && (
              <FieldError errors={[form.formState.errors.agentToken]} />
            )}
          </Field>
        </div>

        <Field data-invalid={!!form.formState.errors.regionId}>
          <FieldLabel>所属区域</FieldLabel>
          <Select
            onValueChange={(value) => form.setValue('regionId', parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择区域" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">香港</SelectItem>
              <SelectItem value="2">日本</SelectItem>
              <SelectItem value="3">新加坡</SelectItem>
              <SelectItem value="4">美国</SelectItem>
              <SelectItem value="5">德国</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field data-invalid={!!form.formState.errors.ipv4}>
            <FieldLabel>IPv4 地址</FieldLabel>
            <Input
              placeholder="例如：203.0.113.1"
              {...form.register('ipv4')}
            />
            <FieldDescription>宿主机公网 IPv4 地址</FieldDescription>
          </Field>

          <Field data-invalid={!!form.formState.errors.ipv6}>
            <FieldLabel>IPv6 地址</FieldLabel>
            <Input
              placeholder="例如：2001:db8::1"
              {...form.register('ipv6')}
            />
            <FieldDescription>宿主机公网 IPv6 地址（可选）</FieldDescription>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field data-invalid={!!form.formState.errors.totalCpu}>
            <FieldLabel>CPU 核心数</FieldLabel>
            <Input
              type="number"
              {...form.register('totalCpu', { valueAsNumber: true })}
            />
            <FieldDescription>宿主机总 CPU 核心数</FieldDescription>
            {form.formState.errors.totalCpu && (
              <FieldError errors={[form.formState.errors.totalCpu]} />
            )}
          </Field>

          <Field data-invalid={!!form.formState.errors.totalRamMb}>
            <FieldLabel>内存容量 (MB)</FieldLabel>
            <Input
              type="number"
              {...form.register('totalRamMb', { valueAsNumber: true })}
            />
            <FieldDescription>宿主机总内存，单位 MB</FieldDescription>
            {form.formState.errors.totalRamMb && (
              <FieldError errors={[form.formState.errors.totalRamMb]} />
            )}
          </Field>
        </div>

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
          <FieldDescription>节点创建后的初始运行状态</FieldDescription>
        </Field>
      </FieldGroup>

      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={onSuccess}>
          取消
        </Button>
        <Button type="submit">创建节点</Button>
      </DialogFooter>
    </form>
  );
}
