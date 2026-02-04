'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Globe, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import type { Region } from '@/lib/types';
import {
  useRegionList,
  useCreateRegion,
  useUpdateRegion,
  useDeleteRegion,
  useToggleRegionStatus,
} from '@/lib/requests/regions';

export function RegionDictionary() {
  // 查询参数
  const [query] = useState({
    page: 1,
    pageSize: 100,
    isActive: undefined as boolean | undefined,
  });

  // 对话框状态
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRegion, setEditingRegion] = useState<Region | null>(null);
  const [formData, setFormData] = useState<Partial<Region>>({
    name: '',
    code: '',
    sortOrder: 0,
    isActive: true,
  });

  // 删除确认对话框状态
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingRegionId, setDeletingRegionId] = useState<number | null>(null);

  // API hooks
  const { data, isLoading, refetch } = useRegionList(query);
  const createRegion = useCreateRegion();
  const updateRegion = useUpdateRegion();
  const deleteRegion = useDeleteRegion();
  const toggleStatus = useToggleRegionStatus();

  // 获取区域列表（后端已排序）
  const regions = data?.list || [];

  // 打开新增对话框
  const handleAdd = () => {
    setEditingRegion(null);
    setFormData({
      name: '',
      code: '',
      sortOrder: regions.length,
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  // 打开编辑对话框
  const handleEdit = (region: Region) => {
    setEditingRegion(region);
    setFormData({ ...region });
    setIsDialogOpen(true);
  };

  // 打开删除确认对话框
  const openDeleteDialog = (id: number) => {
    setDeletingRegionId(id);
    setDeleteDialogOpen(true);
  };

  // 确认删除
  const confirmDelete = async () => {
    if (!deletingRegionId) return;
    try {
      await deleteRegion.mutateAsync({ id: deletingRegionId });
      toast.success('删除成功');
      setDeleteDialogOpen(false);
      setDeletingRegionId(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '删除失败');
    }
  };

  // 切换启用状态
  const handleToggleActive = async (id: number, isActive: boolean) => {
    try {
      await toggleStatus.mutateAsync({ id, isActive: !isActive });
      toast.success('状态更新成功');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '状态更新失败');
    }
  };

  // 保存表单
  const handleSave = async () => {
    if (!formData.name || !formData.code) {
      toast.error('请填写完整信息');
      return;
    }

    try {
      if (editingRegion) {
        // 编辑模式
        await updateRegion.mutateAsync({
          id: editingRegion.id,
          name: formData.name,
          sortOrder: formData.sortOrder,
          isActive: formData.isActive,
        });
        toast.success('更新成功');
      } else {
        // 新增模式
        await createRegion.mutateAsync({
          name: formData.name!,
          code: formData.code!,
          sortOrder: formData.sortOrder ?? regions.length,
          isActive: formData.isActive ?? true,
        });
        toast.success('添加成功');
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '操作失败');
    }
  };

  // 是否正在提交
  const isSubmitting = createRegion.isPending || updateRegion.isPending;

  return (
    <div className="space-y-4">
      {/* 操作栏 */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isLoading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          刷新
        </Button>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          新增区域
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">排序</TableHead>
            <TableHead>区域名称</TableHead>
            <TableHead>区域代码</TableHead>
            <TableHead className="w-[100px]">状态</TableHead>
            <TableHead className="w-[150px] text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-8 text-muted-foreground"
              >
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                加载中...
              </TableCell>
            </TableRow>
          ) : regions.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-8 text-muted-foreground"
              >
                暂无数据
              </TableCell>
            </TableRow>
          ) : (
            regions.map((region) => (
              <TableRow key={region.id}>
                <TableCell>
                  <span className="text-muted-foreground">
                    {region.sortOrder}
                  </span>
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    {region.name}
                  </div>
                </TableCell>
                <TableCell>
                  <code className="bg-muted px-2 py-1 rounded text-sm">
                    {region.code}
                  </code>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={region.isActive}
                    onCheckedChange={() =>
                      handleToggleActive(region.id, region.isActive)
                    }
                    disabled={toggleStatus.isPending}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(region)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => openDeleteDialog(region.id)}
                      disabled={deleteRegion.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* 新增/编辑对话框 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-125">
          <DialogHeader>
            <DialogTitle>
              {editingRegion ? '编辑区域' : '新增区域'}
            </DialogTitle>
            <DialogDescription>
              {editingRegion
                ? '修改区域信息，代码不可更改'
                : '添加新的服务器区域'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                区域名称 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="例如：中国香港"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">
                区域代码 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="code"
                placeholder="例如：hk, us-la, sg"
                value={formData.code}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    code: e.target.value
                      .toLowerCase()
                      .replace(/\s/g, '-'),
                  })
                }
                disabled={!!editingRegion}
              />
              <p className="text-xs text-muted-foreground">
                用于查找国旗图片和逻辑识别，唯一不可重复
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sortOrder">排序权重</Label>
              <Input
                id="sortOrder"
                type="number"
                value={formData.sortOrder}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sortOrder: parseInt(e.target.value) || 0,
                  })
                }
              />
              <p className="text-xs text-muted-foreground">
                数字越小排序越靠前
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
              <Label htmlFor="isActive">启用该区域</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
            >
              取消
            </Button>
            <Button onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editingRegion ? '保存修改' : '确认添加'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除这个区域吗？此操作不可恢复。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setDeletingRegionId(null)}
              disabled={deleteRegion.isPending}
            >
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteRegion.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteRegion.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
