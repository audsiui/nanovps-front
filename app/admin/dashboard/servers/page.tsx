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
  AddServerForm,
  EditServerForm,
  Node,
} from './components';

export default function ServersPage() {
  const [nodes, setNodes] = useState<Node[]>(mockServers);
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // 筛选逻辑
  const filteredNodes = nodes.filter((node) => {
    const matchesSearch =
      node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (node.ipv4?.includes(searchQuery) ?? false) ||
      (node.ipv6?.includes(searchQuery) ?? false);
    const matchesRegion =
      regionFilter === 'all' ||
      (regionFilter === '1' && node.regionId === 1) ||
      (regionFilter === '2' && node.regionId === 2) ||
      (regionFilter === '3' && node.regionId === 3) ||
      (regionFilter === '4' && node.regionId === 4);
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'online' && node.status === 1) ||
      (statusFilter === 'offline' && node.status === 0);
    return matchesSearch && matchesRegion && matchesStatus;
  });

  // 处理编辑
  const handleEdit = (node: Node) => {
    setSelectedNode(node);
    setIsEditDialogOpen(true);
  };

  // 处理保存编辑
  const handleSaveEdit = (updatedNode: Node) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === updatedNode.id ? updatedNode : n))
    );
    setIsEditDialogOpen(false);
    setSelectedNode(null);
  };

  // 处理切换状态 (0=离线, 1=在线)
  const handleToggleStatus = (id: number) => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, status: n.status === 1 ? 0 : 1 } : n
      )
    );
  };

  // 处理删除
  const handleDelete = (id: number) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-4">
      <ServerStats nodes={nodes} />

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索节点名称或IP..."
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
              <SelectItem value="1">香港</SelectItem>
              <SelectItem value="2">日本</SelectItem>
              <SelectItem value="3">新加坡</SelectItem>
              <SelectItem value="4">美国</SelectItem>
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
            </SelectContent>
          </Select>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              添加节点
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>添加新节点</DialogTitle>
              <DialogDescription>
                填写节点信息以将其添加到系统中
              </DialogDescription>
            </DialogHeader>
            <AddServerForm onSuccess={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <ServerTable
        nodes={filteredNodes}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
      />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>编辑节点</DialogTitle>
            <DialogDescription>
              修改节点信息（硬盘容量不可修改）
            </DialogDescription>
          </DialogHeader>
          {selectedNode && (
            <EditServerForm
              node={selectedNode}
              onSuccess={handleSaveEdit}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedNode(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
