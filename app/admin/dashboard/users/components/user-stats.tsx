'use client';

import { Users, UserCheck, UserX, Wallet } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { User } from './types';

interface UserStatsProps {
  users: User[];
}

export function UserStats({ users }: UserStatsProps) {
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 1).length;
  const bannedUsers = users.filter((u) => u.status === 2).length;
  const unverifiedUsers = users.filter((u) => u.status === 0).length;
  const totalBalance = users.reduce((sum, u) => sum + parseFloat(u.balance || '0'), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">总用户数</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUsers}</div>
          <p className="text-xs text-muted-foreground">
            {activeUsers} 正常 / {unverifiedUsers} 未验证 / {bannedUsers} 封禁
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">正常用户</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeUsers}</div>
          <p className="text-xs text-muted-foreground">
            {totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0}% 占比
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">封禁用户</CardTitle>
          <UserX className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{bannedUsers}</div>
          <p className="text-xs text-muted-foreground">
            {totalUsers > 0 ? Math.round((bannedUsers / totalUsers) * 100) : 0}% 占比
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">用户总余额</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">¥{totalBalance.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            所有用户余额总和
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
