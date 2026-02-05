'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  Package,
  Server,
  Cpu,
  MemoryStick,
  HardDrive,
  Globe,
  Trash2,
  Pencil,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { useNodeDetail } from '@/lib/requests/nodes';
import {
  useNodePlanList,
  useCreateNodePlan,
  useUpdateNodePlan,
  useDeleteNodePlan,
} from '@/lib/requests/node-plans';
import { usePlanTemplateList } from '@/lib/requests/plan-templates';
import type { NodePlan } from '@/lib/types';
import { AddServerPlanForm } from './components/add-server-plan-form';
import { EditServerPlanForm } from './components/edit-server-plan-form';
import { ServerPlanFormData } from './components/types';
import { toast } from 'sonner';

export default function ServerPlansPage() {
  const searchParams = useSearchParams();
  const serverId = searchParams.get('id');
  const nodeId = serverId ? parseInt(serverId) : 0;

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<NodePlan | null>(null);

  // 获取服务器详情
  const { data: server, isLoading: isLoadingServer } = useNodeDetail(nodeId);

  // 获取服务器套餐列表
  const { data: plansData, isLoading: isLoadingPlans, refetch } = useNodePlanList(
    nodeId,
    { page: 1, pageSize: 100 }
  );

  // 获取所有套餐模板
  const { data: templatesData } = usePlanTemplateList({ page: 1, pageSize: 100 });

  // API mutations
  const createMutation = useCreateNodePlan();
  const updateMutation = useUpdateNodePlan();
  const deleteMutation = useDeleteNodePlan();

  // 套餐列表
  const currentServerPlans = useMemo(() => plansData?.list || [], [plansData]);

  // 获取已使用的套餐模板ID
  const usedTemplateIds = useMemo(() => {
    return new Set(currentServerPlans.map((p) => p.planTemplateId));
  }, [currentServerPlans]);

  // 获取可选的套餐模板（排除已使用的）
  const availableTemplates = useMemo(() => {
    const allTemplates = templatesData?.list || [];
    return allTemplates.filter((t) => !usedTemplateIds.has(t.id));
  }, [templatesData, usedTemplateIds]);

  // 处理添加套餐
  const handleAddPlan = async (data: ServerPlanFormData) => {
    try {
      await createMutation.mutateAsync({
        nodeId,
        planTemplateId: data.templateId,
        priceMonthly: data.priceMonthly,
        priceYearly: data.priceYearly,
        stock: data.stock,
        isActive: data.isActive,
      });
      toast.success('套餐添加成功');
      setIsAddDialogOpen(false);
      refetch();
    } catch (error) {
      toast.error('添加失败：' + (error instanceof Error ? error.message : '未知错误'));
    }
  };

  // 处理编辑套餐
  const handleEditPlan = async (data: ServerPlanFormData) => {
    if (!selectedPlan) return;

    try {
      await updateMutation.mutateAsync({
        id: selectedPlan.id,
        priceMonthly: data.priceMonthly,
        priceYearly: data.priceYearly,
        stock: data.stock,
        isActive: data.isActive,
      });
      toast.success('套餐更新成功');
      setIsEditDialogOpen(false);
      setSelectedPlan(null);
      refetch();
    } catch (error) {
      toast.error('更新失败：' + (error instanceof Error ? error.message : '未知错误'));
    }
  };

  // 处理删除套餐
  const handleDeletePlan = async () => {
    if (!selectedPlan) return;

    try {
      await deleteMutation.mutateAsync({ id: selectedPlan.id });
      toast.success('套餐删除成功');
      setIsDeleteDialogOpen(false);
      setSelectedPlan(null);
      refetch();
    } catch (error) {
      toast.error('删除失败：' + (error instanceof Error ? error.message : '未知错误'));
    }
  };

  // 打开编辑对话框
  const openEditDialog = (plan: NodePlan) => {
    setSelectedPlan(plan);
    setIsEditDialogOpen(true);
  };

  // 打开删除确认对话框
  const openDeleteDialog = (plan: NodePlan) => {
    setSelectedPlan(plan);
    setIsDeleteDialogOpen(true);
  };

  // 获取状态徽章
  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-500 hover:bg-green-600">启用</Badge>
    ) : (
      <Badge variant="secondary">禁用</Badge>
    );
  };

  // 获取库存状态
  const getStockBadge = (stock: number) => {
    if (stock === 0) return <Badge variant="destructive">缺货</Badge>;
    if (stock < 5) return <Badge variant="secondary">紧张</Badge>;
    return <Badge variant="outline">充足</Badge>;
  };

  // 如果没有服务器ID，显示错误
  if (!serverId) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="p-4 rounded-full bg-muted">
          <Server className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-medium">参数错误</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          未找到服务器ID，请从服务器列表页面进入
        </p>
        <Link href="/admin/dashboard/servers" className="mt-4">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回服务器列表
          </Button>
        </Link>
      </div>
    );
  }

  // 加载中
  if (isLoadingServer || isLoadingPlans) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-4 text-sm text-muted-foreground">加载中...</p>
      </div>
    );
  }

  // 如果服务器不存在，显示错误
  if (!server) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="p-4 rounded-full bg-muted">
          <Server className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-medium">服务器不存在</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          未找到ID为 {serverId} 的服务器
        </p>
        <Link href="/admin/dashboard/servers" className="mt-4">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回服务器列表
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面头部 */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard/servers">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">配置套餐</h1>
            <p className="text-sm text-muted-foreground">
              为服务器配置可售卖的套餐
            </p>
          </div>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          disabled={availableTemplates.length === 0}
        >
          <Plus className="mr-2 h-4 w-4" />
          添加套餐
        </Button>
      </div>

      {/* 服务器信息卡片 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Server className="h-5 w-5 text-muted-foreground" />
            服务器信息
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">节点名称</p>
              <p className="font-medium">{server.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">IPv4 地址</p>
              <div className="flex items-center gap-1">
                <Globe className="h-3 w-3 text-muted-foreground" />
                <span>{server.ipv4 || '未配置'}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">总资源</p>
              <div className="flex items-center gap-3 text-sm">
                <span className="flex items-center gap-1">
                  <Cpu className="h-3 w-3" />
                  {server.totalCpu} 核
                </span>
                <span className="flex items-center gap-1">
                  <MemoryStick className="h-3 w-3" />
                  {Math.round(server.totalRamMb / 1024)} GB
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">硬盘容量</p>
              <div className="flex items-center gap-1">
                <HardDrive className="h-3 w-3 text-muted-foreground" />
                <span>{server.allocatableDiskGb} GB</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 套餐列表 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="h-5 w-5 text-muted-foreground" />
            套餐配置
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentServerPlans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 rounded-full bg-muted">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-medium">暂无套餐配置</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                点击上方按钮为此服务器添加第一个套餐
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>套餐名称</TableHead>
                  <TableHead>资源配置</TableHead>
                  <TableHead>网络配置</TableHead>
                  <TableHead>价格</TableHead>
                  <TableHead>库存</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentServerPlans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{plan.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ID: {plan.id}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs">
                        <span className="flex items-center gap-1">
                          <Cpu className="h-3 w-3 text-muted-foreground" />
                          {plan.cpu} 核
                        </span>
                        <span className="flex items-center gap-1">
                          <MemoryStick className="h-3 w-3 text-muted-foreground" />
                          {plan.ramMb >= 1024
                            ? `${plan.ramMb / 1024} GB`
                            : `${plan.ramMb} MB`}{' '}
                          内存
                        </span>
                        <span className="flex items-center gap-1">
                          <HardDrive className="h-3 w-3 text-muted-foreground" />
                          {plan.diskGb} GB 硬盘
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs">
                        <span>
                          {plan.trafficGb
                            ? `流量: ${plan.trafficGb} GB/月`
                            : '流量: 不限'}
                        </span>
                        <span>
                          {plan.bandwidthMbps
                            ? `带宽: ${plan.bandwidthMbps} Mbps`
                            : '带宽: 不限'}
                        </span>
                        <span>端口: {plan.portCount || '不限'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs">
                        <span className="font-medium text-green-600">
                          ¥{plan.priceMonthly}/月
                        </span>
                        {plan.priceYearly && (
                          <span className="text-muted-foreground">
                            ¥{plan.priceYearly}/年
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{plan.stock}</span>
                        {getStockBadge(plan.stock)}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(plan.isActive)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(plan)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => openDeleteDialog(plan)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* 添加套餐对话框 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>添加套餐</DialogTitle>
            <DialogDescription>
              选择套餐模板并配置价格和库存
            </DialogDescription>
          </DialogHeader>
          <AddServerPlanForm
            availableTemplates={availableTemplates}
            onSuccess={handleAddPlan}
            onCancel={() => setIsAddDialogOpen(false)}
            isSubmitting={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* 编辑套餐对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>编辑套餐</DialogTitle>
            <DialogDescription>修改套餐的价格、库存和状态</DialogDescription>
          </DialogHeader>
          {selectedPlan && (
            <EditServerPlanForm
              plan={selectedPlan}
              onSuccess={handleEditPlan}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedPlan(null);
              }}
              isSubmitting={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除套餐「{selectedPlan?.name}」吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedPlan(null);
              }}
            >
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePlan}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? '删除中...' : '删除'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
