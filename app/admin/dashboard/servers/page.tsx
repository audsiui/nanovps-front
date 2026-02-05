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
import { toast } from 'sonner';
import {
  ServerStats,
  ServerTable,
  AddServerForm,
  EditServerForm,
  Node,
} from './components';
import { useNodeList } from '@/lib/requests/nodes';
import { useRegionList } from '@/lib/requests/regions';
import type { NodeListQuery } from '@/lib/types';

export default function ServersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // 构建查询参数
  const query: NodeListQuery = {
    page,
    pageSize,
    ...(searchQuery && { keyword: searchQuery }),
    ...(regionFilter !== 'all' && { regionId: parseInt(regionFilter) }),
    ...(statusFilter !== 'all' && {
      status: statusFilter === 'online' ? 1 : 0,
    }),
  };

  // 获取节点列表
  const { data, isLoading, refetch } = useNodeList(query);
  const nodes = data?.list ?? [];
  const total = data?.pagination?.total ?? 0;
  const totalPages = data?.pagination?.totalPages ?? 0;

  // 获取区域列表用于筛选下拉框
  const { data: regionsData } = useRegionList({ isActive: true });

  // 处理编辑
  const handleEdit = (node: Node) => {
    setSelectedNode(node);
    setIsEditDialogOpen(true);
  };

  // 处理保存编辑
  const handleSaveEdit = () => {
    refetch();
    setIsEditDialogOpen(false);
    setSelectedNode(null);
  };

  // 处理切换状态 (0=离线, 1=在线)
  const handleToggleStatus = (id: number) => {
    // TODO: 调用切换状态 API
    toast.info('切换状态功能待实现');
  };

  // 处理删除
  const handleDelete = (id: number) => {
    // TODO: 调用删除 API
    toast.info('删除功能待实现');
  };

  // 处理添加成功
  const handleAddSuccess = () => {
    refetch();
    setIsAddDialogOpen(false);
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
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="pl-8"
            />
          </div>
          <Select
            value={regionFilter}
            onValueChange={(value) => {
              setRegionFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="区域" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部区域</SelectItem>
              {regionsData?.list.map((region) => (
                <SelectItem key={region.id} value={String(region.id)}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
          >
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
            <AddServerForm onSuccess={handleAddSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <ServerTable
        nodes={nodes}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
      />

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || isLoading}
          >
            上一页
          </Button>
          <span className="text-sm text-muted-foreground">
            第 {page} 页 / 共 {totalPages} 页 (共 {total} 条)
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || isLoading}
          >
            下一页
          </Button>
        </div>
      )}

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
