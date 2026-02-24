'use client';

import { useState } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNatPorts, useCreateNatPort, useDeleteNatPort } from '@/lib/requests/nat-ports';
import { toast } from 'sonner';
import type { InstanceDetail } from '@/lib/types';

interface NatPortManagerProps {
  instance: InstanceDetail;
}

const NatPortStatusMap = {
  0: { label: '禁用', variant: 'secondary' as const },
  1: { label: '启用', variant: 'default' as const },
  2: { label: '同步中', variant: 'outline' as const },
  3: { label: '失败', variant: 'destructive' as const },
};

export function NatPortManager({ instance }: NatPortManagerProps) {
  const [open, setOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [protocol, setProtocol] = useState<'tcp' | 'udp'>('tcp');
  const [internalPort, setInternalPort] = useState('');
  const [externalPort, setExternalPort] = useState('');
  const [description, setDescription] = useState('');

  const { data: portsData, isLoading } = useNatPorts(instance.id);
  const createMutation = useCreateNatPort();
  const deleteMutation = useDeleteNatPort();

  const ports = portsData?.list || [];

  const handleCreate = async () => {
    if (!internalPort || !externalPort) {
      toast.error('请填写端口信息');
      return;
    }

    const intPort = Number(internalPort);
    const extPort = Number(externalPort);

    if (intPort < 1 || intPort > 65535) {
      toast.error('内网端口必须在 1-65535 之间');
      return;
    }
    if (extPort < 1 || extPort > 65535) {
      toast.error('外网端口必须在 1-65535 之间');
      return;
    }

    try {
      await createMutation.mutateAsync({
        instanceId: instance.id,
        protocol,
        internalPort: intPort,
        externalPort: extPort,
        description: description || undefined,
      });
      toast.success('端口映射创建成功');
      setOpen(false);
      setInternalPort('');
      setExternalPort('');
      setDescription('');
    } catch (error: any) {
      toast.error(error.message || '创建失败');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync({ id, instanceId: instance.id });
      toast.success('端口映射已删除');
      setDeleteConfirm(null);
    } catch (error: any) {
      toast.error(error.message || '删除失败');
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">端口映射</h3>
            <p className="text-sm text-muted-foreground">
              管理实例的 NAT 端口映射，所有端口通过 iptables 转发
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                添加映射
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>添加端口映射</DialogTitle>
                <DialogDescription>
                  创建新的 NAT 端口映射，将外部端口流量转发到容器内部
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>协议类型</Label>
                  <Select value={protocol} onValueChange={(v) => setProtocol(v as 'tcp' | 'udp')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tcp">TCP</SelectItem>
                      <SelectItem value="udp">UDP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>内网端口</Label>
                    <Input
                      type="number"
                      placeholder="如：80"
                      value={internalPort}
                      onChange={(e) => setInternalPort(e.target.value)}
                      min={1}
                      max={65535}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>外网端口</Label>
                    <Input
                      type="number"
                      placeholder="如：8080"
                      value={externalPort}
                      onChange={(e) => setExternalPort(e.target.value)}
                      min={1}
                      max={65535}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>描述（可选）</Label>
                  <Input
                    placeholder="如：HTTP, HTTPS, Game Server"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={50}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleCreate} disabled={createMutation.isPending}>
                  {createMutation.isPending && (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  创建
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center text-muted-foreground py-8">
            <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2" />
            加载中...
          </div>
        ) : (
          <div className="space-y-2">
            {ports.length > 0 ? (
              <div className="space-y-2">
                {ports.map((port) => {
                  const status = NatPortStatusMap[port.status];
                  const isSSH = port.description === 'SSH';
                  return (
                    <div
                      key={port.id}
                      className="p-3 border rounded-lg flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {port.status === 3 ? (
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        ) : (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        )}
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {port.description || '未命名'}
                            {isSSH && (
                              <Badge variant="secondary" className="text-xs">SSH</Badge>
                            )}
                            {port.syncError && (
                              <span className="text-xs text-red-600" title={port.syncError}>
                                ({port.syncError})
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {instance.node?.ipv4}:{port.externalPort} → {instance.internalIp}:{port.internalPort} (
                            {port.protocol.toUpperCase()})
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={status.variant}>{status.label}</Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setDeleteConfirm(port.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                暂无端口映射
              </div>
            )}
          </div>
        )}
      </div>

      {/* 删除确认对话框 */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              删除端口映射后，外部将无法访问此端口的服务。此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="bg-red-600 hover:bg-red-700"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
