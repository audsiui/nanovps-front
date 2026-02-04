'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Node } from './types';

interface NodeDetailDialogProps {
  node: Node | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ServerDetailDialog({
  node,
  open,
  onOpenChange,
}: NodeDetailDialogProps) {
  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return <Badge className="bg-green-500 hover:bg-green-600">在线</Badge>;
      case 0:
        return <Badge variant="destructive">离线</Badge>;
      default:
        return <Badge variant="secondary">维护中</Badge>;
    }
  };

  const formatLastHeartbeat = (lastHeartbeat: string | null) => {
    if (!lastHeartbeat) return '从未上报';
    const date = new Date(lastHeartbeat);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}小时前`;
    return `${Math.floor(hours / 24)}天前`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        {node && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {node.name}
                {getStatusBadge(node.status)}
              </DialogTitle>
              <DialogDescription>
                查看和管理此节点的详细信息
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">网络信息</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">IPv4</span>
                      <span>{node.ipv4 || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">IPv6</span>
                      <span className="truncate max-w-[150px]">
                        {node.ipv6 || '-'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">硬件配置</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">CPU</span>
                      <span>{node.totalCpu ?? '-'} 核</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">内存</span>
                      <span>
                        {node.totalRamMb
                          ? `${Math.round(node.totalRamMb / 1024)} GB`
                          : '-'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">节点信息</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">节点 ID</span>
                    <span>{node.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">区域 ID</span>
                    <span>{node.regionId ?? '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">最后心跳</span>
                    <span>{formatLastHeartbeat(node.lastHeartbeat)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">创建时间</span>
                    <span>
                      {new Date(node.createdAt).toLocaleString('zh-CN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">更新时间</span>
                    <span>
                      {new Date(node.updatedAt).toLocaleString('zh-CN')}
                    </span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">认证信息</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Agent Token</span>
                    <code className="bg-muted px-2 py-0.5 rounded text-xs">
                      {node.agentToken.slice(0, 12)}...
                    </code>
                  </div>
                </CardContent>
              </Card>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                关闭
              </Button>
              <Button>编辑配置</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
