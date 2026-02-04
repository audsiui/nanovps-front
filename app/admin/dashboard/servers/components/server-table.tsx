'use client';

import {
  MoreHorizontal,
  Cpu,
  HardDrive,
  Power,
  PowerOff,
  Trash2,
  Pencil,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Server } from './types';

interface ServerTableProps {
  servers: Server[];
  onViewDetail: (server: Server) => void;
  onToggleEnabled: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ServerTable({
  servers,
  onViewDetail,
  onToggleEnabled,
  onDelete,
}: ServerTableProps) {
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

  const getUsageColor = (usage: number) => {
    if (usage >= 80) return 'text-red-500';
    if (usage >= 60) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>服务器</TableHead>
            <TableHead>区域/数据中心</TableHead>
            <TableHead>配置</TableHead>
            <TableHead>资源使用</TableHead>
            <TableHead>虚拟机</TableHead>
            <TableHead>状态</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {servers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground h-32">
                暂无服务器数据
              </TableCell>
            </TableRow>
          ) : (
            servers.map((server) => (
              <TableRow key={server.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{server.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {server.publicIp}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{server.region}</span>
                    <span className="text-xs text-muted-foreground">
                      {server.datacenter}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col text-xs">
                    <span>{server.cpu}</span>
                    <span className="text-muted-foreground">
                      {server.cpuCores}核 · {server.memory}GB · {server.disk}GB {server.diskType}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {server.enabled ? (
                    <div className="flex flex-col gap-1 text-xs">
                      <div className="flex items-center gap-1">
                        <Cpu className="h-3 w-3" />
                        <span className={getUsageColor(server.cpuUsage)}>
                          {server.cpuUsage}%
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <HardDrive className="h-3 w-3" />
                        <span className={getUsageColor(server.memoryUsage)}>
                          {server.memoryUsage}%
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>
                      {server.currentVms} / {server.maxVms}
                    </span>
                    <div className="w-20 h-1 bg-muted rounded-full mt-1">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width: `${(server.currentVms / server.maxVms) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(server.status, server.enabled)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>操作</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onViewDetail(server)}>
                        <Eye className="mr-2 h-4 w-4" />
                        查看详情
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" />
                        编辑配置
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onToggleEnabled(server.id)}
                      >
                        {server.enabled ? (
                          <>
                            <PowerOff className="mr-2 h-4 w-4" />
                            禁用服务器
                          </>
                        ) : (
                          <>
                            <Power className="mr-2 h-4 w-4" />
                            启用服务器
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => onDelete(server.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        删除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
