'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Check,
  Cpu,
  Globe,
  HardDrive,
  MemoryStick,
  Network,
  Rocket,
  Server,
  ShieldCheck,
  Zap,
  CreditCard,
  Wifi,
  Terminal,
  Lock,
  Dice5,
  Tag,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

// --- 模拟数据 ---

const regions = [
  { id: 'hk', name: '中国香港', flag: '🇭🇰', code: 'HKG' },
  { id: 'tw', name: '中国台湾', flag: '🇹🇼', code: 'TPE' },
  { id: 'us', name: '美国洛杉矶', flag: '🇺🇸', code: 'LAX' },
  { id: 'gb', name: '英国伦敦', flag: '🇬🇧', code: 'LDN' },
  { id: 'de', name: '德国法兰克福', flag: '🇩🇪', code: 'FRA' },
];

const nodesData: Record<string, any[]> = {
  hk: [
    { id: 'hk-bwg', name: '搬瓦工联名节点', type: 'CN2 GIA', stock: '充足' },
    { id: 'hk-azure', name: 'Azure 专线', type: 'BGP', stock: '紧张' },
  ],
  tw: [
    { id: 'tw-hinet', name: 'HiNet 动态', type: '原生IP', stock: '充足' },
  ],
  us: [
    { id: 'us-9929', name: '联通 9929', type: '三网优化', stock: '充足' },
    { id: 'us-4837', name: 'Cera高防', type: '500G防御', stock: '充足' },
  ],
  gb: [{ id: 'gb-london', name: 'London Core', type: 'BGP', stock: '充足' }],
  de: [{ id: 'de-fra', name: 'Frankfurt Edge', type: 'CN2', stock: '少量' }],
};

const periods = [
  { value: 1, label: '1 个月' },
  { value: 3, label: '3 个月' },
  { value: 6, label: '半年' },
  { value: 12, label: '1 年' },
];

const osOptions = [
  { id: 'alpine-3.22', name: 'Alpine Linux', version: '3.22', icon: Terminal },
  { id: 'debian-12', name: 'Debian', version: '12', icon: Server },
];

export default function BuyPage() {
  // --- 状态管理 ---
  const [selectedRegion, setSelectedRegion] = useState(regions[0].id);
  const [selectedNode, setSelectedNode] = useState<string | null>(nodesData[regions[0].id][0].id);
  
  // 实例信息
  const [serverName, setServerName] = useState('');
  const [selectedOs, setSelectedOs] = useState(osOptions[1].id); // 默认 Debian
  const [rootPassword, setRootPassword] = useState('');
  
  // 硬件配置
  const [cpu, setCpu] = useState([1]);
  const [ram, setRam] = useState([512]); // MB
  const [disk, setDisk] = useState([20]);
  const [bandwidth, setBandwidth] = useState([100]);
  
  // 订单选项
  const [period, setPeriod] = useState(1);
  const [autoRenew, setAutoRenew] = useState(true);

  // 优惠券
  const [couponCode, setCouponCode] = useState('');
  const [isVerifyingCoupon, setIsVerifyingCoupon] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0); // 0.1 means 10% off
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  // --- 辅助功能 ---

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let pass = "";
    for (let i = 0; i < 16; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setRootPassword(pass);
  };

  const handleVerifyCoupon = () => {
    if (!couponCode) return;
    setIsVerifyingCoupon(true);
    
    // 模拟API请求
    setTimeout(() => {
      setIsVerifyingCoupon(false);
      if (couponCode.toUpperCase() === 'NANO') {
        setCouponDiscount(0.1); // 9折
        setAppliedCoupon('NANO');
        // toast.success("优惠码已应用！");
      } else {
        setCouponDiscount(0);
        setAppliedCoupon(null);
        // toast.error("无效的优惠码");
        alert("无效的优惠码 (试一下 'NANO')");
      }
    }, 800);
  };

  // --- 价格计算逻辑 ---
  const totalPrice = useMemo(() => {
    let base = 2; // 基础费用
    
    // 硬件费用
    base += cpu[0] * 2;             // $2 per core
    base += (ram[0] / 512) * 1;     // $1 per 512MB
    base += disk[0] * 0.05;         // $0.05 per GB
    base += bandwidth[0] * 0.01;    // $0.01 per Mbps

    // 周期乘积 (无折扣)
    let total = base * period;

    // 优惠券折扣
    if (couponDiscount > 0) {
      total = total * (1 - couponDiscount);
    }
    
    return total.toFixed(2);
  }, [cpu, ram, disk, bandwidth, period, couponDiscount]);

  // 处理区域切换，重置节点
  const handleRegionChange = (regionId: string) => {
    setSelectedRegion(regionId);
    if (nodesData[regionId] && nodesData[regionId].length > 0) {
      setSelectedNode(nodesData[regionId][0].id);
    } else {
      setSelectedNode(null);
    }
  };

  return (
    <div className="space-y-8 p-1 pb-20 md:pb-0">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          新建实例
        </h1>
        <p className="text-muted-foreground text-lg">
          配置您的云服务器，几分钟内即可完成部署。
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {regions.map((region) => {
                  const isSelected = selectedRegion === region.id;
                  return (
                    <div
                      key={region.id}
                      onClick={() => handleRegionChange(region.id)}
                      className={cn(
                        "cursor-pointer relative flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 hover:bg-muted/50",
                        isSelected 
                          ? "border-primary bg-primary/5 shadow-[0_0_0_4px_rgba(var(--primary),0.1)]" 
                          : "border-border/50 bg-card"
                      )}
                    >
                      <span className="text-4xl filter drop-shadow-sm">{region.flag}</span>
                      <div className="text-center">
                        <div className={cn("font-semibold text-sm", isSelected ? "text-primary" : "text-foreground")}>
                          {region.name}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono mt-0.5">{region.code}</div>
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
          <Card className="border-border/50 bg-card/60 backdrop-blur-md shadow-sm">
             <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-3">
                <Server className="w-6 h-6 text-primary" /> 选择节点 (母鸡)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {nodesData[selectedRegion]?.map((node) => {
                  const isSelected = selectedNode === node.id;
                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(node.id)}
                      className={cn(
                        "cursor-pointer relative flex items-start gap-4 p-5 rounded-xl border-2 transition-all duration-200",
                        isSelected 
                          ? "border-primary bg-primary/5" 
                          : "border-border/50 bg-card hover:border-primary/30"
                      )}
                    >
                      <div className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg transition-colors",
                        isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      )}>
                        <Zap className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                           <span className="font-bold text-base">{node.name}</span>
                           <Badge variant={node.stock === '紧张' ? 'destructive' : 'secondary'} className="text-xs">
                             {node.stock}
                           </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{node.type}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* 3. 系统配置 (新) */}
          <Card className="border-border/50 bg-card/60 backdrop-blur-md shadow-sm">
             <CardHeader className="pb-6">
              <CardTitle className="text-xl flex items-center gap-3">
                <Terminal className="w-6 h-6 text-primary" /> 系统配置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 px-6 sm:px-8">
              
              {/* 服务器名称 */}
              <div className="grid gap-2">
                <Label htmlFor="server-name" className="font-semibold">服务器名称</Label>
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
                 <div className="grid grid-cols-2 gap-4">
                    {osOptions.map((os) => {
                      const isSelected = selectedOs === os.id;
                      return (
                        <div 
                          key={os.id}
                          onClick={() => setSelectedOs(os.id)}
                          className={cn(
                            "cursor-pointer flex items-center gap-3 p-3 rounded-lg border-2 transition-all",
                            isSelected ? "border-primary bg-primary/5" : "border-border/50 hover:bg-muted/50"
                          )}
                        >
                          <os.icon className={cn("w-5 h-5", isSelected ? "text-primary" : "text-muted-foreground")} />
                          <div>
                            <div className="font-medium text-sm">{os.name}</div>
                            <div className="text-xs text-muted-foreground">{os.version}</div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-primary ml-auto" />}
                        </div>
                      )
                    })}
                 </div>
              </div>

              {/* Root 密码 */}
              <div className="grid gap-2">
                <Label htmlFor="root-password" className="font-semibold flex items-center justify-between">
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
                    type="text" // 显示明文以便用户复制
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

          {/* 4. 资源配置 */}
          <Card className="border-border/50 bg-card/60 backdrop-blur-md shadow-sm">
             <CardHeader className="pb-6">
              <CardTitle className="text-xl flex items-center gap-3">
                <Rocket className="w-6 h-6 text-primary" /> 资源规格
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-10 px-6 sm:px-8">
              
              {/* CPU */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <Label className="text-base font-semibold flex items-center gap-2">
                     <Cpu className="w-5 h-5 text-muted-foreground" /> 处理器核心
                   </Label>
                   <div className="text-lg font-bold text-primary font-mono bg-primary/10 px-3 py-1 rounded-md">
                     {cpu[0]} <span className="text-sm text-muted-foreground ml-1 font-sans">vCore</span>
                   </div>
                </div>
                <Slider 
                  defaultValue={[1]} max={16} min={1} step={1} 
                  value={cpu} onValueChange={setCpu}
                  className="py-4"
                />
              </div>

              <Separator />

              {/* RAM (MB) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <Label className="text-base font-semibold flex items-center gap-2">
                     <MemoryStick className="w-5 h-5 text-muted-foreground" /> 内存大小
                   </Label>
                   <div className="text-lg font-bold text-primary font-mono bg-primary/10 px-3 py-1 rounded-md">
                     {ram[0]} <span className="text-sm text-muted-foreground ml-1 font-sans">MB</span>
                   </div>
                </div>
                {/* 256MB 到 16GB (16384MB)，步长 256MB */}
                <Slider 
                  defaultValue={[512]} max={16384} min={256} step={256} 
                  value={ram} onValueChange={setRam}
                  className="py-4"
                />
                 <div className="flex justify-between text-xs text-muted-foreground px-1 font-mono">
                  <span>256 MB</span>
                  <span>8192 MB</span>
                  <span>16384 MB</span>
                </div>
              </div>

              <Separator />

              {/* Disk */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <Label className="text-base font-semibold flex items-center gap-2">
                     <HardDrive className="w-5 h-5 text-muted-foreground" /> 系统盘 (NVMe)
                   </Label>
                   <div className="text-lg font-bold text-primary font-mono bg-primary/10 px-3 py-1 rounded-md">
                     {disk[0]} <span className="text-sm text-muted-foreground ml-1 font-sans">GB</span>
                   </div>
                </div>
                <Slider 
                  defaultValue={[20]} max={500} min={10} step={10} 
                  value={disk} onValueChange={setDisk}
                  className="py-4"
                />
              </div>

              <Separator />

              {/* Bandwidth */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <Label className="text-base font-semibold flex items-center gap-2">
                     <Network className="w-5 h-5 text-muted-foreground" /> 峰值带宽
                   </Label>
                   <div className="text-lg font-bold text-primary font-mono bg-primary/10 px-3 py-1 rounded-md">
                     {bandwidth[0]} <span className="text-sm text-muted-foreground ml-1 font-sans">Mbps</span>
                   </div>
                </div>
                <Slider 
                  defaultValue={[100]} max={1000} min={10} step={10} 
                  value={bandwidth} onValueChange={setBandwidth}
                  className="py-4"
                />
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
                     <span className="text-muted-foreground">区域节点</span>
                     <div className="flex items-center gap-2 font-medium">
                        <span>{regions.find(r => r.id === selectedRegion)?.flag}</span>
                        <span className="truncate max-w-[140px]">{nodesData[selectedRegion]?.find(n => n.id === selectedNode)?.name || '未选择'}</span>
                     </div>
                   </div>
                   
                   {serverName && (
                     <div className="flex justify-between items-center">
                       <span className="text-muted-foreground">主机名</span>
                       <span className="font-medium truncate max-w-[150px]">{serverName}</span>
                     </div>
                   )}
                   
                   <div className="flex justify-between items-center">
                     <span className="text-muted-foreground">操作系统</span>
                     <span className="font-medium">
                       {osOptions.find(o => o.id === selectedOs)?.name} {osOptions.find(o => o.id === selectedOs)?.version}
                     </span>
                   </div>

                   <Separator />

                   <div className="flex justify-between items-center">
                     <span className="text-muted-foreground">CPU / 内存</span>
                     <span className="font-medium">{cpu[0]} vCore / {ram[0]} MB</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-muted-foreground">系统盘</span>
                     <span className="font-medium">{disk[0]} GB NVMe</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-muted-foreground">峰值带宽</span>
                     <span className="font-medium">{bandwidth[0]} Mbps</span>
                   </div>
                </div>

                <Separator />

                {/* 购买时长 */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">购买时长</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {periods.map((p) => (
                      <div
                        key={p.value}
                        onClick={() => setPeriod(p.value)}
                        className={cn(
                          "cursor-pointer text-center py-2 rounded-lg border text-sm transition-all",
                          period === p.value 
                            ? "border-primary bg-primary/10 text-primary font-bold" 
                            : "border-border/50 hover:bg-muted"
                        )}
                      >
                        {p.label}
                      </div>
                    ))}
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
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          disabled={!!appliedCoupon}
                        />
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-9 px-3"
                        onClick={handleVerifyCoupon}
                        disabled={isVerifyingCoupon || !couponCode || !!appliedCoupon}
                      >
                        {isVerifyingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : (appliedCoupon ? '已应用' : '验证')}
                      </Button>
                   </div>
                   {appliedCoupon && (
                     <div className="text-xs text-green-600 flex items-center gap-1">
                       <Check className="w-3 h-3" /> 已应用 9折优惠 (Code: {appliedCoupon})
                     </div>
                   )}
                </div>

                {/* 自动续费开关 */}
                <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg border border-border/50">
                   <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-green-500" />
                      <Label htmlFor="auto-renew" className="text-sm font-medium cursor-pointer">到期自动续费</Label>
                   </div>
                   <Switch id="auto-renew" checked={autoRenew} onCheckedChange={setAutoRenew} />
                </div>

                {/* 总价与按钮 */}
                <div className="pt-2 space-y-4">
                   <div className="flex items-end justify-between">
                      <span className="text-muted-foreground mb-1">应付总额</span>
                      <div className="text-right">
                         {appliedCoupon && (
                           <div className="text-xs text-muted-foreground line-through decoration-red-500">
                             ${(parseFloat(totalPrice) / (1 - couponDiscount)).toFixed(2)}
                           </div>
                         )}
                         <span className="text-3xl font-bold text-primary">${totalPrice}</span>
                         <span className="text-sm text-muted-foreground ml-1">USD</span>
                      </div>
                   </div>
                   
                   <Button size="lg" className="w-full text-lg h-12 shadow-lg shadow-primary/25 font-bold" disabled={!rootPassword}>
                     <CreditCard className="w-5 h-5 mr-2" />
                     {rootPassword ? '立即开通' : '请设置密码'}
                   </Button>
                   <p className="text-[10px] text-center text-muted-foreground">
                     点击即代表您同意服务条款与退款政策
                   </p>
                </div>

             </CardContent>
          </Card>

          {/* 辅助信息 */}
          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Wifi className="w-3 h-3" /> 99.9% SLA</span>
              <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> DDoS 防护</span>
          </div>
        </div>

      </div>
    </div>
  );
}