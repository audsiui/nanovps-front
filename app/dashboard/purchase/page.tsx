'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
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
import {
  Check,
  Cpu,
  Globe,
  HardDrive,
  MemoryStick,
  Network,
  Server,
  ShieldCheck,
  Zap,
  CreditCard,
  Wifi,
  WifiOff,
  Terminal,
  Lock,
  Dice5,
  Tag,
  Loader2,
  AlertCircle,
  MapPin,
  Package,
  X,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCatalog } from '@/lib/requests/catalog';
import { useImageList } from '@/lib/requests/images';
import { useCalculateOrder, useCreateOrder } from '@/lib/requests/orders';
import { useValidatePromoCode } from '@/lib/requests/promo-codes';
import { useNodePlanStatus } from '@/lib/requests/nodes';
import { useAuth } from '@/contexts/auth-context';
import type { CatalogBillingCycle } from '@/lib/types';
import { toast } from 'sonner';

export default function PurchasePage() {
  const router = useRouter();
  const { user } = useAuth();

  // --- 数据获取 ---
  const {
    data: catalog,
    isLoading: isLoadingCatalog,
    error: catalogError,
  } = useCatalog();
  const { data: imagesData, isLoading: isLoadingImages } = useImageList({
    isActive: true,
    pageSize: 100,
  });

  // --- Mutations ---
  const calculateMutation = useCalculateOrder();
  const createOrderMutation = useCreateOrder();
  const validatePromoCodeMutation = useValidatePromoCode();

  // --- 状态管理 ---
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [selectedCycle, setSelectedCycle] =
    useState<CatalogBillingCycle | null>(null);

  // 实例信息
  const [serverName, setServerName] = useState('');
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const [rootPassword, setRootPassword] = useState('');

  // 订单选项
  const [autoRenew, setAutoRenew] = useState(true);

  // 优惠码
  const [promoCode, setPromoCode] = useState('');
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState<string>('0');

  // 计算结果
  const [calculatedPrice, setCalculatedPrice] = useState<string | null>(null);
  const [originalPrice, setOriginalPrice] = useState<string | null>(null);

  // 节点离线警告
  const [showOfflineWarning, setShowOfflineWarning] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(false);

  // 查询节点状态
  const { data: nodePlanStatus, refetch: refetchNodePlanStatus } =
    useNodePlanStatus(selectedPlanId || 0, {
      enabled: false,
    });

  // --- 计算属性 ---
  const regions = useMemo(() => catalog || [], [catalog]);

  const selectedRegion = useMemo(
    () => regions.find((r) => r.id === selectedRegionId),
    [regions, selectedRegionId],
  );

  const selectedNode = useMemo(
    () => selectedRegion?.nodes.find((n) => n.id === selectedNodeId),
    [selectedRegion, selectedNodeId],
  );

  const selectedPlan = useMemo(
    () => selectedNode?.plans.find((p) => p.id === selectedPlanId),
    [selectedNode, selectedPlanId],
  );

  const images = useMemo(() => imagesData?.list || [], [imagesData]);

  // 初始化选择
  useMemo(() => {
    if (regions.length > 0 && !selectedRegionId) {
      const firstRegion = regions[0];
      setSelectedRegionId(firstRegion.id);

      if (firstRegion.nodes.length > 0) {
        const firstNode = firstRegion.nodes[0];
        setSelectedNodeId(firstNode.id);

        if (firstNode.plans.length > 0) {
          const firstPlan = firstNode.plans[0];
          setSelectedPlanId(firstPlan.id);

          const firstEnabledCycle = firstPlan.billingCycles.find(
            (c) => c.enabled,
          );
          if (firstEnabledCycle) {
            setSelectedCycle(firstEnabledCycle);
          }
        }
      }
    }
  }, [regions, selectedRegionId]);

  // 计算订单金额
  useMemo(() => {
    const calculatePrice = async () => {
      if (!selectedPlanId || !selectedCycle) return;

      try {
        const result = await calculateMutation.mutateAsync({
          nodePlanId: selectedPlanId,
          billingCycle: selectedCycle.cycle,
          durationMonths: selectedCycle.months,
          promoCode: appliedPromoCode || undefined,
        });

        setCalculatedPrice(result.finalPrice);
        setOriginalPrice(result.originalPrice);
        setPromoDiscount(result.discountAmount);
      } catch (error) {
        toast.error(error.message);
      }
    };

    calculatePrice();
  }, [selectedPlanId, selectedCycle, appliedPromoCode]);

  // --- 辅助功能 ---
  const generatePassword = () => {
    const chars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let pass = '';
    for (let i = 0; i < 16; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setRootPassword(pass);
  };

  const handleValidatePromoCode = async () => {
    if (!promoCode || !selectedPlanId || !selectedCycle) return;

    setIsValidatingPromo(true);
    try {
      const result = await validatePromoCodeMutation.mutateAsync({
        code: promoCode,
        amount: selectedCycle.price,
      });

      if (result.valid) {
        setAppliedPromoCode(promoCode);
        toast.success(
          `优惠码 ${promoCode} 已应用，可优惠 ¥${result.discountAmount}`,
        );
      } else {
        toast.error(result.message || '优惠码无效');
      }
    } catch (error) {
      toast.error(
        '验证优惠码失败：' +
          (error instanceof Error ? error.message : '未知错误'),
      );
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const handleClearPromoCode = () => {
    setAppliedPromoCode(null);
    setPromoCode('');
    setPromoDiscount('0');
    toast.success('优惠码已取消');
  };

  const handleCreateOrder = async () => {
    if (!selectedPlanId || !selectedCycle) {
      toast.error('请选择套餐和计费周期');
      return;
    }

    if (!selectedImageId) {
      toast.error('请选择操作系统');
      return;
    }

    // 先检查节点状态
    if (!pendingOrder) {
      try {
        const statusResult = await refetchNodePlanStatus();
        const status = statusResult.data;

        if (status && !status.online) {
          setShowOfflineWarning(true);
          return;
        }
      } catch (error) {
        console.error('检查节点状态失败:', error);
      }
    }

    try {
      const result = await createOrderMutation.mutateAsync({
        nodePlanId: selectedPlanId,
        billingCycle: selectedCycle.cycle,
        durationMonths: selectedCycle.months,
        promoCode: appliedPromoCode || undefined,
        imageId: selectedImageId,
      });

      toast.success('实例创建成功，正在部署中...');

      router.push('/dashboard');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';

      toast.error(errorMessage);
    } finally {
      setPendingOrder(false);
    }
  };

  const handleConfirmOfflinePurchase = () => {
    setShowOfflineWarning(false);
    setPendingOrder(true);
    handleCreateOrder();
  };

  const handleRegionChange = (regionId: number) => {
    setSelectedRegionId(regionId);
    const region = regions.find((r) => r.id === regionId);

    if (region && region.nodes.length > 0) {
      const firstNode = region.nodes[0];
      setSelectedNodeId(firstNode.id);

      if (firstNode.plans.length > 0) {
        const firstPlan = firstNode.plans[0];
        setSelectedPlanId(firstPlan.id);

        const firstEnabledCycle = firstPlan.billingCycles.find(
          (c) => c.enabled,
        );
        setSelectedCycle(firstEnabledCycle || null);
      } else {
        setSelectedPlanId(null);
        setSelectedCycle(null);
      }
    } else {
      setSelectedNodeId(null);
      setSelectedPlanId(null);
      setSelectedCycle(null);
    }
    // 清除优惠码
    handleClearPromoCode();
  };

  const handleNodeChange = (nodeId: number) => {
    setSelectedNodeId(nodeId);
    const node = selectedRegion?.nodes.find((n) => n.id === nodeId);

    if (node && node.plans.length > 0) {
      const firstPlan = node.plans[0];
      setSelectedPlanId(firstPlan.id);

      const firstEnabledCycle = firstPlan.billingCycles.find((c) => c.enabled);
      setSelectedCycle(firstEnabledCycle || null);
    } else {
      setSelectedPlanId(null);
      setSelectedCycle(null);
    }
    // 清除优惠码
    handleClearPromoCode();
  };

  const handlePlanChange = (planId: number) => {
    setSelectedPlanId(planId);
    const plan = selectedNode?.plans.find((p) => p.id === planId);

    if (plan) {
      const firstEnabledCycle = plan.billingCycles.find((c) => c.enabled);
      setSelectedCycle(firstEnabledCycle || null);
    }
    // 清除优惠码
    handleClearPromoCode();
  };

  // --- 价格计算 ---
  const totalPrice =
    calculatedPrice || selectedCycle?.price.toFixed(2) || '0.00';

  // --- 加载状态 ---
  if (isLoadingCatalog || isLoadingImages) {
    return (
      <div className="space-y-8 p-1">
        <div className="space-y-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="lg:col-span-4">
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // --- 错误状态 ---
  if (catalogError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <AlertCircle className="w-16 h-16 text-destructive" />
        <h2 className="text-xl font-semibold">加载产品目录失败</h2>
        <p className="text-muted-foreground">请稍后重试或联系客服</p>
        <Button onClick={() => window.location.reload()}>重新加载</Button>
      </div>
    );
  }

  // --- 空状态 ---
  if (regions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Package className="w-16 h-16 text-muted-foreground" />
        <h2 className="text-xl font-semibold">暂无可用产品</h2>
        <p className="text-muted-foreground">
          请稍后查看，我们正在准备更多优质节点
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-1 pb-20 md:pb-0">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          新建实例
        </h1>
        <p className="text-muted-foreground text-lg">
          选择适合您的套餐，几分钟内即可完成部署。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* === 左侧：主配置表单 === */}
        <div className="lg:col-span-8 space-y-8">
          {/* 1. 区域选择 */}
          <Card className="border-border/50 bg-card/60 backdrop-blur-md shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-3">
                <Globe className="w-6 h-6 text-primary" /> 选择区域
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {regions.map((region) => {
                  const isSelected = selectedRegionId === region.id;
                  return (
                    <div
                      key={region.id}
                      onClick={() => handleRegionChange(region.id)}
                      className={cn(
                        'cursor-pointer relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 hover:bg-muted/50',
                        isSelected
                          ? 'border-primary bg-primary/5 shadow-[0_0_0_4px_rgba(var(--primary),0.1)]'
                          : 'border-border/50 bg-card',
                      )}
                    >
                      <MapPin
                        className={cn(
                          'w-6 h-6',
                          isSelected ? 'text-primary' : 'text-muted-foreground',
                        )}
                      />
                      <div className="text-center">
                        <div
                          className={cn(
                            'font-semibold text-sm',
                            isSelected ? 'text-primary' : 'text-foreground',
                          )}
                        >
                          {region.name}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono mt-0.5">
                          {region.code}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 text-primary">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* 2. 节点选择 */}
          {selectedRegion && selectedRegion.nodes.length > 0 && (
            <Card className="border-border/50 bg-card/60 backdrop-blur-md shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-3">
                  <Server className="w-6 h-6 text-primary" /> 选择节点
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedRegion.nodes.map((node) => {
                    const isSelected = selectedNodeId === node.id;
                    return (
                      <div
                        key={node.id}
                        onClick={() => handleNodeChange(node.id)}
                        className={cn(
                          'cursor-pointer relative flex items-start gap-4 p-4 rounded-xl border-2 transition-all duration-200',
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-border/50 bg-card hover:border-primary/30',
                        )}
                      >
                        <div
                          className={cn(
                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors',
                            isSelected
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground',
                          )}
                        >
                          <Zap className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-sm truncate">
                              {node.name}
                            </span>
                            <Badge
                              variant="secondary"
                              className="text-xs shrink-0 ml-2"
                            >
                              {node.plans.length} 个套餐
                            </Badge>
                          </div>
                          {node.ipv4 && (
                            <p className="text-xs text-muted-foreground font-mono truncate">
                              {node.ipv4}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 3. 套餐选择 */}
          {selectedNode && selectedNode.plans.length > 0 && (
            <Card className="border-border/50 bg-card/60 backdrop-blur-md shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-3">
                  <Package className="w-6 h-6 text-primary" /> 选择套餐
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedNode.plans.map((plan) => {
                    const isSelected = selectedPlanId === plan.id;
                    const { template } = plan;

                    return (
                      <div
                        key={plan.id}
                        onClick={() => handlePlanChange(plan.id)}
                        className={cn(
                          'cursor-pointer relative p-4 rounded-xl border-2 transition-all duration-200',
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-border/50 bg-card hover:border-primary/30',
                        )}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-bold text-base">
                                {template.name}
                              </span>
                              {plan.stock <= 5 && plan.stock > 0 && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  仅剩 {plan.stock} 台
                                </Badge>
                              )}
                              {plan.stock === 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  售罄
                                </Badge>
                              )}
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Cpu className="w-4 h-4" />
                                <span>{template.cpu} 核</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <MemoryStick className="w-4 h-4" />
                                <span>{template.ramMb} MB</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <HardDrive className="w-4 h-4" />
                                <span>{template.diskGb} GB</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Network className="w-4 h-4" />
                                <span>
                                  {template.bandwidthMbps || '-'} Mbps
                                </span>
                              </div>
                            </div>

                            {template.trafficGb && (
                              <p className="text-xs text-muted-foreground mt-2">
                                月流量: {template.trafficGb} GB
                              </p>
                            )}
                          </div>

                          {isSelected && (
                            <div className="text-primary shrink-0">
                              <Check className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 4. 计费周期选择 */}
          {selectedPlan && selectedPlan.billingCycles.length > 0 && (
            <Card className="border-border/50 bg-card/60 backdrop-blur-md shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-primary" /> 计费周期
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {selectedPlan.billingCycles
                    .filter((cycle) => cycle.enabled)
                    .map((cycle) => {
                      const isSelected = selectedCycle?.cycle === cycle.cycle;

                      return (
                        <div
                          key={cycle.cycle}
                          onClick={() => setSelectedCycle(cycle)}
                          className={cn(
                            'cursor-pointer relative p-3 rounded-lg border-2 transition-all duration-200 text-center',
                            isSelected
                              ? 'border-primary bg-primary/5'
                              : 'border-border/50 bg-card hover:border-primary/30',
                          )}
                        >
                          <div className="font-semibold text-sm">
                            {cycle.name}
                          </div>
                          <div className="text-lg font-bold text-primary mt-1">
                            ¥{cycle.price}
                          </div>
                          {isSelected && (
                            <div className="absolute top-1 right-1 text-primary">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 5. 系统配置 */}
          <Card className="border-border/50 bg-card/60 backdrop-blur-md shadow-sm">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl flex items-center gap-3">
                <Terminal className="w-6 h-6 text-primary" /> 系统配置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 px-6 sm:px-8">
              {/* 服务器名称 */}
              <div className="grid gap-2">
                <Label htmlFor="server-name" className="font-semibold">
                  服务器名称
                </Label>
                <Input
                  id="server-name"
                  placeholder="例如：My-Web-Server-01"
                  value={serverName}
                  onChange={(e) => setServerName(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              {/* 操作系统选择 */}
              <div className="grid gap-2">
                <Label className="font-semibold">操作系统</Label>
                {images.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    暂无可用的操作系统镜像
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {images.map((image) => {
                      const isSelected = selectedImageId === image.id;
                      return (
                        <div
                          key={image.id}
                          onClick={() => setSelectedImageId(image.id)}
                          className={cn(
                            'cursor-pointer flex items-center gap-3 p-3 rounded-lg border-2 transition-all',
                            isSelected
                              ? 'border-primary bg-primary/5'
                              : 'border-border/50 hover:bg-muted/50',
                          )}
                        >
                          <Terminal
                            className={cn(
                              'w-5 h-5 shrink-0',
                              isSelected
                                ? 'text-primary'
                                : 'text-muted-foreground',
                            )}
                          />
                          <div className="min-w-0">
                            <div className="font-medium text-sm truncate">
                              {image.name}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {image.family}
                            </div>
                          </div>
                          {isSelected && (
                            <Check className="w-4 h-4 text-primary ml-auto shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Root 密码 */}
              <div className="grid gap-2">
                <Label
                  htmlFor="root-password"
                  className="font-semibold flex items-center justify-between"
                >
                  <span>Root 密码</span>
                  <span
                    onClick={generatePassword}
                    className="text-xs text-primary cursor-pointer hover:underline flex items-center gap-1"
                  >
                    <Dice5 className="w-3 h-3" /> 随机生成
                  </span>
                </Label>
                <div className="relative">
                  <Input
                    id="root-password"
                    type="text"
                    placeholder="设置高强度密码"
                    value={rootPassword}
                    onChange={(e) => setRootPassword(e.target.value)}
                    className="bg-background/50 pr-10 font-mono"
                  />
                  <Lock className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* === 右侧：订单概览 (Sticky) === */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          <Card className="border-2 border-primary/20 bg-card/80 backdrop-blur-xl shadow-xl overflow-hidden">
            <CardHeader className="pb-4 bg-muted/30 border-b border-border/50">
              <CardTitle className="text-xl">订单概览</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              {/* 选中的配置 */}
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">区域</span>
                  <span className="font-medium">
                    {selectedRegion?.name || '-'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">节点</span>
                  <span className="font-medium truncate max-w-[150px]">
                    {selectedNode?.name || '-'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">套餐</span>
                  <span className="font-medium truncate max-w-[150px]">
                    {selectedPlan?.template.name || '-'}
                  </span>
                </div>

                <Separator />

                {selectedPlan && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">CPU / 内存</span>
                      <span className="font-medium">
                        {selectedPlan.template.cpu} 核 /{' '}
                        {selectedPlan.template.ramMb} MB
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">系统盘</span>
                      <span className="font-medium">
                        {selectedPlan.template.diskGb} GB
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">带宽</span>
                      <span className="font-medium">
                        {selectedPlan.template.bandwidthMbps || '-'} Mbps
                      </span>
                    </div>
                  </>
                )}

                {serverName && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">主机名</span>
                    <span className="font-medium truncate max-w-[150px]">
                      {serverName}
                    </span>
                  </div>
                )}

                {selectedImageId && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">操作系统</span>
                    <span className="font-medium">
                      {images.find((i) => i.id === selectedImageId)?.name ||
                        '-'}
                    </span>
                  </div>
                )}
              </div>

              <Separator />

              {/* 购买时长 */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">计费周期</Label>
                <div className="text-sm font-medium text-primary">
                  {selectedCycle?.name || '请选择计费周期'}
                </div>
              </div>

              {/* 优惠码 */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">优惠码</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="输入优惠码"
                      className="pl-9 h-9 text-sm"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      disabled={!!appliedPromoCode}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && handleValidatePromoCode()
                      }
                    />
                  </div>
                  {appliedPromoCode ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9 px-3"
                      onClick={handleClearPromoCode}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9 px-3"
                      onClick={handleValidatePromoCode}
                      disabled={
                        isValidatingPromo || !promoCode || !selectedCycle
                      }
                    >
                      {isValidatingPromo ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        '应用'
                      )}
                    </Button>
                  )}
                </div>
                {appliedPromoCode && Number(promoDiscount) > 0 && (
                  <div className="text-xs text-green-600 flex items-center gap-1">
                    <Check className="w-3 h-3" /> 已优惠 ¥{promoDiscount}
                  </div>
                )}
              </div>

              {/* 自动续费开关 */}
              <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg border border-border/50">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  <Label
                    htmlFor="auto-renew"
                    className="text-sm font-medium cursor-pointer"
                  >
                    到期自动续费
                  </Label>
                </div>
                <Switch
                  id="auto-renew"
                  checked={autoRenew}
                  onCheckedChange={setAutoRenew}
                />
              </div>

              {/* 总价与按钮 */}
              <div className="pt-2 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-end justify-between">
                    <span className="text-muted-foreground mb-1">应付总额</span>
                    <div className="text-right">
                      {Number(promoDiscount) > 0 && originalPrice && (
                        <div className="text-xs text-muted-foreground line-through decoration-red-500">
                          ¥{originalPrice}
                        </div>
                      )}
                      <span className="text-3xl font-bold text-primary">
                        ¥{totalPrice}
                      </span>
                      <span className="text-sm text-muted-foreground ml-1">
                        CNY
                      </span>
                    </div>
                  </div>

                  {/* 显示账户余额和购买后余额 */}
                  <div className="flex items-end justify-between text-sm">
                    <span className="text-muted-foreground">当前余额</span>
                    <span className="font-medium">
                      ¥{user?.balance ?? '0.00'}
                    </span>
                  </div>
                  <div className="flex items-end justify-between text-sm">
                    <span className="text-muted-foreground">购买后余额</span>
                    <span
                      className={cn(
                        'font-medium',
                        Number(user?.balance ?? 0) - Number(totalPrice) >= 0
                          ? 'text-green-600'
                          : 'text-red-600',
                      )}
                    >
                      ¥
                      {Math.max(
                        0,
                        Number(user?.balance ?? 0) - Number(totalPrice),
                      ).toFixed(2)}
                    </span>
                  </div>
                  {Number(user?.balance ?? 0) < Number(totalPrice) && (
                    <p className="text-xs text-red-500 text-right">
                      余额不足，还差 ¥
                      {(
                        Number(totalPrice) - Number(user?.balance ?? 0)
                      ).toFixed(2)}
                    </p>
                  )}
                </div>

                <Button
                  size="lg"
                  className="w-full text-lg h-12 shadow-lg shadow-primary/25 font-bold"
                  disabled={
                    !selectedPlan ||
                    !selectedCycle ||
                    !rootPassword ||
                    !selectedImageId ||
                    selectedPlan.stock === 0 ||
                    createOrderMutation.isPending
                  }
                  onClick={handleCreateOrder}
                >
                  {createOrderMutation.isPending ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <CreditCard className="w-5 h-5 mr-2" />
                  )}
                  {!selectedPlan
                    ? '请选择套餐'
                    : !selectedCycle
                      ? '请选择计费周期'
                      : !selectedImageId
                        ? '请选择操作系统'
                        : !rootPassword
                          ? '请设置密码'
                          : selectedPlan.stock === 0
                            ? '已售罄'
                            : '立即开通'}
                </Button>
                <p className="text-[10px] text-center text-muted-foreground">
                  点击即代表您同意服务条款与退款政策
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 辅助信息 */}
          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Wifi className="w-3 h-3" /> 99.9% SLA
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> DDoS 防护
            </span>
          </div>
        </div>
      </div>

      {/* 节点离线警告弹窗 */}
      <AlertDialog
        open={showOfflineWarning}
        onOpenChange={setShowOfflineWarning}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              节点离线提醒
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3 pt-2">
              <p>
                您选择的节点{' '}
                <strong>{nodePlanStatus?.nodeName || '该节点'}</strong>{' '}
                当前处于离线状态。
              </p>
              <p className="text-muted-foreground">
                您仍然可以购买此套餐，但容器将在节点上线后自动创建。这可能需要等待一段时间。
              </p>
              <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg text-sm">
                <WifiOff className="h-4 w-4 text-yellow-600" />
                <span className="text-yellow-700 dark:text-yellow-400">
                  节点上线后，系统将自动为您创建实例
                </span>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowOfflineWarning(false)}>
              取消
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmOfflinePurchase}>
              确认购买
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
