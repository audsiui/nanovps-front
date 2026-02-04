'use client';

import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  mockServers,
  ServerStats,
  ServerTable,
  ServerDetailDialog,
  AddServerForm,
  Server,
} from './components';

export default function ServersPage() {
  const [servers, setServers] = useState<Server[]>(mockServers);
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);

  // 筛选逻辑
  const filteredServers = servers.filter((server) => {
    const matchesSearch =
      server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      server.publicIp.includes(searchQuery) ||
      server.internalIp.includes(searchQuery);
    const matchesRegion = regionFilter === 'all' || server.region === regionFilter;
    const matchesStatus = statusFilter === 'all' || server.status === statusFilter;
    return matchesSearch && matchesRegion && matchesStatus;
  });

  // 处理查看详情
  const handleViewDetail = (server: Server) => {
    setSelectedServer(server);
    setIsDetailDialogOpen(true);
  };

  // 处理切换启用状态
  const handleToggleEnabled = (id: string) => {
    setServers(
      servers.map((s) =>
        s.id === id ? { ...s, enabled: !s.enabled } : s
      )
    );
  };

  // 处理删除
  const handleDelete = (id: string) => {
    setServers(servers.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-4">
      <ServerStats servers={servers} />

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索服务器名称或IP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="区域" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部区域</SelectItem>
              <SelectItem value="香港">香港</SelectItem>
              <SelectItem value="日本">日本</SelectItem>
              <SelectItem value="新加坡">新加坡</SelectItem>
              <SelectItem value="美国">美国</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="online">在线</SelectItem>
              <SelectItem value="offline">离线</SelectItem>
              <SelectItem value="maintenance">维护中</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              上架服务器
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>上架新服务器</DialogTitle>
              <DialogDescription>
                填写宿主机信息以将其添加到系统中
              </DialogDescription>
            </DialogHeader>
            <AddServerForm onSuccess={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <ServerTable
        servers={filteredServers}
        onViewDetail={handleViewDetail}
        onToggleEnabled={handleToggleEnabled}
        onDelete={handleDelete}
      />

      <ServerDetailDialog
        server={selectedServer}
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
      />
    </div>
  );
}
