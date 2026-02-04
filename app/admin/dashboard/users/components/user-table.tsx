'use client';

import {
  MoreHorizontal,
  Trash2,
  Pencil,
  Ban,
  CheckCircle,
  Mail,
  Key,
  Shield,
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
import { User, userStatusMap } from './types';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onToggleStatus: (id: number) => void;
  onDelete: (id: number) => void;
}

export function UserTable({
  users,
  onEdit,
  onToggleStatus,
  onDelete,
}: UserTableProps) {
  const getStatusBadge = (status: number) => {
    const config = userStatusMap[status as keyof typeof userStatusMap];
    if (!config) return <Badge variant="secondary">未知</Badge>;

    const variantMap: Record<number, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      0: 'secondary',  // 未验证 - yellow
      1: 'default',    // 正常 - green
      2: 'destructive', // 封禁 - red
    };

    return (
      <Badge
        variant={variantMap[status] || 'secondary'}
        className={status === 1 ? 'bg-green-500 hover:bg-green-600' : status === 0 ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
      >
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const formatBalance = (balance: string, currency: string) => {
    const symbol = currency === 'CNY' ? '¥' : currency === 'USD' ? '$' : currency;
    return `${symbol}${parseFloat(balance).toFixed(2)}`;
  };

  const maskApiKey = (apiKey: string | null | undefined) => {
    if (!apiKey) return null;
    return `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`;
  };

  return (

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>用户信息</TableHead>
            <TableHead>账户余额</TableHead>
            <TableHead>API密钥</TableHead>
            <TableHead>状态</TableHead>
            <TableHead>注册时间</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground h-32">
                暂无用户数据
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-medium">{user.email}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ID: {user.id}
                    </span>
                    {user.lastLoginIp && (
                      <span className="text-xs text-muted-foreground">
                        上次IP: {user.lastLoginIp}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {formatBalance(user.balance, user.currency)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {user.currency}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    {user.apiKey ? (
                      <>
                        <Key className="h-3.5 w-3.5 text-green-500" />
                        <span className="text-xs font-mono">{maskApiKey(user.apiKey)}</span>
                        {user.twoFactorAuth && (
                          <Shield className="h-3 w-3 text-blue-500" title="已开启2FA" />
                        )}
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground">未配置</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(user.status)}</TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(user.createdAt)}
                  </span>
                </TableCell>
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
                      <DropdownMenuItem onClick={() => onEdit(user)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        编辑
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onToggleStatus(user.id)}>
                        {user.status === 2 ? (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            解除封禁
                          </>
                        ) : (
                          <>
                            <Ban className="mr-2 h-4 w-4" />
                            封禁用户
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => onDelete(user.id)}
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
    
  );
}
