'use client';

import {
  MoreHorizontal,
  Cpu,
  MemoryStick,
  HardDrive,
  Power,
  PowerOff,
  Trash2,
  Pencil,
  Globe,
  Clock,
  Eye,
} from 'lucide-react';
import Link from 'next/link';
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
import { Node } from './types';

interface NodeTableProps {
  nodes: Node[];
  onEdit: (node: Node) => void;
  onToggleStatus: (id: number) => void;
  onDelete: (id: number) => void;
}

export function ServerTable({
  nodes,
  onEdit,
  onToggleStatus,
  onDelete,
}: NodeTableProps) {
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

  const getHeartbeatColor = (lastHeartbeat: string | null) => {
    if (!lastHeartbeat) return 'text-muted-foreground';
    const date = new Date(lastHeartbeat);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 5) return 'text-green-500';
    if (minutes < 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getDiskUsageText = (total: number, used?: number) => {
    if (used === undefined || used === 0) {
      return `${total} GB (空闲)`;
    }
    const percent = Math.round((used / total) * 100);
    return `${used}/${total} GB (${percent}%)`;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>节点名称</TableHead>
            <TableHead>网络地址</TableHead>
            <TableHead>资源配置</TableHead>
            <TableHead>心跳状态</TableHead>
            <TableHead>状态</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {nodes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground h-32">
                暂无节点数据
              </TableCell>
            </TableRow>
          ) : (
            nodes.map((node) => (
              <TableRow key={node.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{node.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ID: {node.id}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col text-sm">
                    {node.ipv4 && (
                      <div className="flex items-center gap-1">
                        <Globe className="h-3 w-3 text-muted-foreground" />
                        <span>{node.ipv4}</span>
                      </div>
                    )}
                    {node.ipv6 && (
                      <span className="text-xs text-muted-foreground truncate max-w-50">
                        {node.ipv6}
                      </span>
                    )}
                    {!node.ipv4 && !node.ipv6 && (
                      <span className="text-muted-foreground">未配置</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col text-xs">
                    <div className="flex items-center gap-1">
                      <Cpu className="h-3 w-3 text-muted-foreground" />
                      <span>{node.totalCpu} 核</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MemoryStick className="h-3 w-3 text-muted-foreground" />
                      <span>{Math.round(node.totalRamMb / 1024)} GB</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <HardDrive className="h-3 w-3 text-muted-foreground" />
                      <span>{getDiskUsageText(node.allocatableDiskGb, node.usedDiskGb)}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={`flex items-center gap-1 text-xs ${getHeartbeatColor(node.lastHeartbeat)}`}>
                    <Clock className="h-3 w-3" />
                    <span>{formatLastHeartbeat(node.lastHeartbeat)}</span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(node.status)}</TableCell>
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
                      <Link href={`/admin/dashboard/servers/detail?id=${node.id}`}>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          查看详情
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onEdit(node)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        编辑
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onToggleStatus(node.id)}>
                        {node.status === 1 ? (
                          <>
                            <PowerOff className="mr-2 h-4 w-4" />
                            下线维护
                          </>
                        ) : (
                          <>
                            <Power className="mr-2 h-4 w-4" />
                            上线节点
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => onDelete(node.id)}
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
