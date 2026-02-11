'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ArrowDownLeft,
  CreditCard,
  Wallet,
  Zap,
  CheckCircle2,
  AlertCircle,
  Gift,
  Ticket,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import { useUseGiftCode, useMyGiftCodeUsages } from '@/lib/requests/gift-codes';
import { useCreateRecharge, useMyRecharges } from '@/lib/requests/recharge';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';
import type { RechargeChannel, RechargeStatus } from '@/lib/types';

function RechargeModal({ onSuccess }: { onSuccess: () => void }) {
  const [amount, setAmount] = useState<number>(50);
  const [channel, setChannel] = useState<RechargeChannel>('alipay');
  const createRechargeMutation = useCreateRecharge();

  const presetAmounts = [10, 50, 100, 200, 500];

  const handleRecharge = async () => {
    try {
      const result = await createRechargeMutation.mutateAsync({
        amount,
        channel,
      });
      
      toast.success('充值订单创建成功');
      
      if (result.paymentUrl) {
        window.location.href = result.paymentUrl;
      } else {
        onSuccess();
      }
    } catch (error) {
      toast.error('创建充值订单失败：' + (error instanceof Error ? error.message : '未知错误'));
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px] bg-card/95 backdrop-blur-xl border-border/50">
      <DialogHeader>
        <DialogTitle>余额充值</DialogTitle>
        <DialogDescription>
          充值金额将实时到账，支持多种支付方式。
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid gap-6 py-4">
        <div className="space-y-3">
          <Label>选择金额 (CNY)</Label>
          <div className="grid grid-cols-3 gap-2">
            {presetAmounts.map((val) => (
              <div
                key={val}
                onClick={() => setAmount(val)}
                className={cn(
                  "cursor-pointer flex items-center justify-center py-2 rounded-md border text-sm font-medium transition-all",
                  amount === val 
                    ? "border-primary bg-primary/10 text-primary" 
                    : "border-border/50 hover:bg-muted"
                )}
              >
                ¥{val}
              </div>
            ))}
            <div className="relative col-span-1">
               <span className="absolute left-2 top-2 text-muted-foreground">¥</span>
               <Input 
                 type="number" 
                 className="h-9 pl-5 text-sm" 
                 placeholder="自定义" 
                 onChange={(e) => setAmount(Number(e.target.value))}
                 value={amount}
               />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label>支付方式</Label>
          <div className="grid grid-cols-1 gap-2">
            {[
              { id: 'alipay' as RechargeChannel, name: '支付宝 (Alipay)', icon: '🟦' },
              { id: 'wechat' as RechargeChannel, name: '微信支付 (WeChat)', icon: '🟩' },
              { id: 'stripe' as RechargeChannel, name: '信用卡 (Stripe)', icon: '💳' },
              { id: 'paypal' as RechargeChannel, name: 'PayPal', icon: '🅿️' },
            ].map((m) => (
              <div
                key={m.id}
                onClick={() => setChannel(m.id)}
                className={cn(
                  "cursor-pointer flex items-center gap-3 p-3 rounded-lg border transition-all",
                  channel === m.id
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border/50 hover:bg-muted/50"
                )}
              >
                <span className="text-xl">{m.icon}</span>
                <span className="text-sm font-medium">{m.name}</span>
                {channel === m.id && <CheckCircle2 className="w-4 h-4 text-primary ml-auto" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button 
          className="w-full shadow-lg shadow-primary/25 font-bold" 
          size="lg"
          onClick={handleRecharge}
          disabled={createRechargeMutation.isPending || amount <= 0}
        >
          {createRechargeMutation.isPending ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <ArrowDownLeft className="w-5 h-5 mr-2" />
          )}
          立即支付 ¥{amount}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

const getStatusBadge = (status: RechargeStatus) => {
  const statusMap: Record<RechargeStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | null | undefined }> = {
    pending: { label: '待支付', variant: 'outline' },
    paid: { label: '已支付', variant: 'default' },
    cancelled: { label: '已取消', variant: 'secondary' },
    failed: { label: '失败', variant: 'destructive' },
  };
  const config = statusMap[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

const getChannelLabel = (channel?: string) => {
  const channelMap: Record<string, string> = {
    alipay: '支付宝',
    wechat: '微信支付',
    stripe: '信用卡',
    paypal: 'PayPal',
  };
  return channel ? channelMap[channel] || channel : '-';
};

export default function BillingPage() {
  const { user, refreshUser } = useAuth();
  const [redeemCode, setRedeemCode] = useState('');
  const [isRechargeDialogOpen, setIsRechargeDialogOpen] = useState(false);

  // API Hooks
  const useGiftCodeMutation = useUseGiftCode();
  const { data: giftUsagesData, refetch: refetchGiftUsages } = useMyGiftCodeUsages({ page: 1, pageSize: 10 });
  const { data: rechargesData, refetch: refetchRecharges } = useMyRecharges({ page: 1, pageSize: 10 });

  const giftUsages = giftUsagesData?.list || [];
  const recharges = rechargesData?.list || [];

  const handleRedeem = async () => {
    if (!redeemCode) return;
    
    try {
      const result = await useGiftCodeMutation.mutateAsync({ code: redeemCode });
      
      if (result.success) {
        toast.success(result.message);
        setRedeemCode('');
        refetchGiftUsages();
        refreshUser(); // 刷新用户信息，更新余额
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('使用赠金码失败：' + (error instanceof Error ? error.message : '未知错误'));
    }
  };

  const handleRechargeSuccess = () => {
    setIsRechargeDialogOpen(false);
    refetchRecharges();
    refreshUser(); // 刷新用户信息，更新余额
  };

  return (
    <div className="space-y-8 p-1">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          财务管理
        </h1>
        <p className="text-muted-foreground text-lg">
          查看您的账户余额、充值记录及消费明细。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <Card className="relative overflow-hidden border-none shadow-xl bg-gradient-to-br from-primary/90 to-primary/70 text-primary-foreground">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 rounded-full bg-black/10 blur-2xl" />
          
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-base font-medium text-primary-foreground/80 flex items-center gap-2">
              <Wallet className="w-5 h-5" /> 账户余额 (CNY)
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-5xl font-bold tracking-tight mt-2">¥{user?.balance ?? '0.00'}</div>
            <div className="text-sm text-primary-foreground/70 mt-2 flex items-center gap-1">
              <Zap className="w-4 h-4" /> 账户状态正常
            </div>
          </CardContent>
          <CardFooter className="pt-4 relative z-10">
             <Dialog open={isRechargeDialogOpen} onOpenChange={setIsRechargeDialogOpen}>
               <DialogTrigger asChild>
                 <Button variant="secondary" size="lg" className="w-full font-bold shadow-sm hover:bg-white/90 text-primary">
                    <ArrowDownLeft className="w-5 h-5 mr-2" /> 立即充值
                 </Button>
               </DialogTrigger>
               <RechargeModal onSuccess={handleRechargeSuccess} />
             </Dialog>
          </CardFooter>
        </Card>

        <Card className="border-border/50 bg-card/60 backdrop-blur-md shadow-sm flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[80%] bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />
            
           <CardHeader className="pb-2">
             <CardTitle className="text-lg font-medium flex items-center gap-2">
               <Gift className="w-5 h-5 text-primary" /> 兑换赠金
             </CardTitle>
             <CardDescription>
                输入您的赠金码，金额将立即存入余额。
             </CardDescription>
           </CardHeader>
           <CardContent className="space-y-4">
             <div className="space-y-2">
                <Label htmlFor="code" className="text-xs text-muted-foreground">赠金码</Label>
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <Ticket className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                        <Input 
                            id="code"
                            placeholder="例如：NANO-GIFT-2024" 
                            className="pl-9 font-mono uppercase placeholder:normal-case"
                            value={redeemCode}
                            onChange={(e) => setRedeemCode(e.target.value)}
                        />
                    </div>
                    <Button 
                        onClick={handleRedeem} 
                        disabled={!redeemCode || useGiftCodeMutation.isPending}
                        className="min-w-[100px] shadow-lg shadow-primary/20"
                    >
                        {useGiftCodeMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : '兑换'}
                    </Button>
                </div>
             </div>
             <div className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground border border-border/50 flex gap-2">
                <AlertCircle className="w-4 h-4 text-primary shrink-0" />
                <p>赠金通常不可提现，且可能优先于现金余额扣除。请查阅活动条款。</p>
             </div>
           </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card/60 backdrop-blur-md shadow-sm">
        <CardContent className="p-6">
          <Tabs defaultValue="recharges" className="w-full">
            <TabsList className="grid w-full sm:w-[240px] grid-cols-2">
              <TabsTrigger value="recharges">充值记录</TabsTrigger>
              <TabsTrigger value="giftcodes">赠金使用记录</TabsTrigger>
            </TabsList>

            <TabsContent value="recharges" className="mt-6">
              {recharges.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Wallet className="h-8 w-8 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">暂无充值记录</h3>
                  <p className="mt-1 text-sm text-muted-foreground">您还没有任何充值记录</p>
                </div>
              ) : (
                <div className="rounded-md border border-border/50 overflow-hidden">
                    <Table>
                      <TableHeader className="bg-muted/30">
                        <TableRow className="border-border/50">
                          <TableHead>充值单号</TableHead>
                          <TableHead>充值金额</TableHead>
                          <TableHead>赠送金额</TableHead>
                          <TableHead>实际到账</TableHead>
                          <TableHead>支付渠道</TableHead>
                          <TableHead>状态</TableHead>
                          <TableHead>创建时间</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recharges.map((rec) => (
                          <TableRow key={rec.id} className="hover:bg-muted/50 border-border/50">
                            <TableCell className="font-mono text-xs text-muted-foreground">{rec.rechargeNo}</TableCell>
                            <TableCell>¥{rec.amount}</TableCell>
                            <TableCell className="text-green-600">
                              {Number(rec.bonusAmount) > 0 ? `+¥${rec.bonusAmount}` : '-'}
                            </TableCell>
                            <TableCell className="font-medium">¥{rec.finalAmount}</TableCell>
                            <TableCell>{getChannelLabel(rec.channel)}</TableCell>
                            <TableCell>{getStatusBadge(rec.status)}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{formatDate(rec.createdAt)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="giftcodes" className="mt-6">
              {giftUsages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Gift className="h-8 w-8 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">暂无使用记录</h3>
                  <p className="mt-1 text-sm text-muted-foreground">您还没有使用过任何赠金码</p>
                </div>
              ) : (
                <div className="rounded-md border border-border/50 overflow-hidden">
                    <Table>
                      <TableHeader className="bg-muted/30">
                        <TableRow className="border-border/50">
                          <TableHead>赠金码</TableHead>
                          <TableHead>赠金金额</TableHead>
                          <TableHead>使用时间</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {giftUsages.map((usage) => (
                          <TableRow key={usage.id} className="hover:bg-muted/50 border-border/50">
                            <TableCell className="font-mono">{usage.giftCode?.code}</TableCell>
                            <TableCell className="text-green-600 font-medium">+¥{usage.amount}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{formatDate(usage.createdAt)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
