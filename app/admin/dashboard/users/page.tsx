'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  mockUsers,
  UserStats,
  UserTable,
  User,
} from './components';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // 筛选逻辑
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toString().includes(searchQuery);
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && user.status === 1) ||
      (statusFilter === 'unverified' && user.status === 0) ||
      (statusFilter === 'banned' && user.status === 2);
    return matchesSearch && matchesStatus;
  });

  // 处理编辑（预留）
  const handleEdit = (user: User) => {
    // TODO: 实现编辑功能
    console.log('编辑用户:', user);
  };

  // 处理切换状态（封禁/解封）
  const handleToggleStatus = (id: number) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === 2 ? 1 : 2, updatedAt: new Date().toISOString() }
          : u
      )
    );
  };

  // 处理删除
  const handleDelete = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className="space-y-4">
      <UserStats users={users} />

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索邮箱或用户ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="active">正常</SelectItem>
              <SelectItem value="unverified">未验证</SelectItem>
              <SelectItem value="banned">封禁</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <UserTable
        users={filteredUsers}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
      />
    </div>
  );
}
