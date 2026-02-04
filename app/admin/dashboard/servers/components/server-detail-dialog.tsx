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
import { Server } from './types';

interface ServerDetailDialogProps {
  server: Server | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ServerDetailDialog({
  server,
  open,
  onOpenChange,
}: ServerDetailDialogProps) {
  const getStatusBadge = (status: string, enabled: boolean) => {
    if (!enabled) {
      return <Badge variant="secondary">已禁用</Badge>;
    }
    switch (status) {
      case 'online':
        return <Badge className="bg-green-500 hover:bg-green-600">在线</Badge>;
      case 'offline':
        return <Badge variant="destructive">离线</Badge>;
      case 'maintenance':
        return <Badge variant="outline">维护中</Badge>;
      default:
        return <Badge variant="secondary">未知</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        {server && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {server.name}
                {getStatusBadge(server.status, server.enabled)}
              </DialogTitle>
              <DialogDescription>
                查看和管理此宿主机的详细信息
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
                      <span className="text-muted-foreground">公网 IP</span>
                      <span>{server.publicIp}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">内网 IP</span>
                      <span>{server.internalIp}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">带宽</span>
                      <span>{server.bandwidth} Mbps</span>
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
                      <span>{server.cpuCores} 核</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">内存</span>
                      <span>{server.memory} GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">硬盘</span>
                      <span>
                        {server.disk} GB {server.diskType}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">资源使用情况</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>CPU 使用率</span>
                      <span>{server.cpuUsage}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div
                        className={`h-full rounded-full ${
                          server.cpuUsage > 80
                            ? 'bg-red-500'
                            : 'bg-primary'
                        }`}
                        style={{ width: `${server.cpuUsage}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>内存使用率</span>
                      <span>{server.memoryUsage}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div
                        className={`h-full rounded-full ${
                          server.memoryUsage > 80
                            ? 'bg-red-500'
                            : 'bg-primary'
                        }`}
                        style={{ width: `${server.memoryUsage}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>虚拟机</span>
                      <span>
                        {server.currentVms} / {server.maxVms}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width: `${
                            (server.currentVms / server.maxVms) *
                            100
                          }%`,
                        }}
                      />
                    </div>
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
