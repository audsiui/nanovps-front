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
  Download,
  Wallet,
  Zap,
  CheckCircle2,
  AlertCircle,
  Gift,
  Ticket,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';


const transactions = [
  { id: 'TRX-9823', date: '2024-05-21', desc: '实例续费: My-Web-Server-01', type: 'expense', amount: 24.00, status: 'success' },
  { id: 'TRX-9822', date: '2024-05-20', desc: '余额充值 (Alipay)', type: 'income', amount: 100.00, status: 'success' },
  { id: 'TRX-9821', date: '2024-05-15', desc: '新购实例: Dev-DB-Node', type: 'expense', amount: 12.00, status: 'success' },
  { id: 'TRX-9820', date: '2024-05-01', desc: '赠金兑换: 新手礼包', type: 'income', amount: 5.00, status: 'success' },
  { id: 'TRX-9819', date: '2024-04-28', desc: '退款: 实例销毁', type: 'income', amount: 2.50, status: 'refund' },
];

const recharges = [
  { id: 'PAY-3321', date: '2024-05-20 14:30', method: 'Alipay', amount: 100.00, status: 'completed' },
  { id: 'PAY-3320', date: '2024-04-10 09:15', method: 'USDT (TRC20)', amount: 50.00, status: 'completed' },
  { id: 'PAY-3319', date: '2024-03-01 22:00', method: 'WeChat Pay', amount: 200.00, status: 'completed' },
  { id: 'PAY-3318', date: '2024-02-28 11:20', method: 'Gift Card', amount: 10.00, status: 'completed' },
];

function RechargeModal() {
  const [amount, setAmount] = useState<number>(50);
  const [method, setMethod] = useState('alipay');

  const presetAmounts = [10, 50, 100, 200, 500];

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
          <Label>选择金额 (USD)</Label>
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
                ${val}
              </div>
            ))}
            <div className="relative col-span-1">
               <span className="absolute left-2 top-2 text-muted-foreground">$</span>
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
              { id: 'alipay', name: '支付宝 (Alipay)', icon: '🟦' },
              { id: 'wechat', name: '微信支付 (WeChat)', icon: '🟩' },
              { id: 'crypto', name: '加密货币 (USDT/BTC)', icon: '🪙' },
            ].map((m) => (
              <div
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={cn(
                  "cursor-pointer flex items-center gap-3 p-3 rounded-lg border transition-all",
                  method === m.id
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border/50 hover:bg-muted/50"
                )}
              >
                <span className="text-xl">{m.icon}</span>
                <span className="text-sm font-medium">{m.name}</span>
                {method === m.id && <CheckCircle2 className="w-4 h-4 text-primary ml-auto" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button className="w-full shadow-lg shadow-primary/25 font-bold" size="lg">
          立即支付 ${amount}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

export default function BillingPage() {
  const [redeemCode, setRedeemCode] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);

  const handleRedeem = () => {
    if (!redeemCode) return;
    setIsRedeeming(true);
    setTimeout(() => {
        setIsRedeeming(false);
        setRedeemCode('');
        alert('兑换成功！资金已到账。');
    }, 1000);
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
              <Wallet className="w-5 h-5" /> 账户余额 (USD)
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-5xl font-bold tracking-tight mt-2">$12.50</div>
            <div className="text-sm text-primary-foreground/70 mt-2 flex items-center gap-1">
              <Zap className="w-4 h-4" /> 账户状态正常
            </div>
          </CardContent>
          <CardFooter className="pt-4 relative z-10">
             <Dialog>
               <DialogTrigger asChild>
                 <Button variant="secondary" size="lg" className="w-full font-bold shadow-sm hover:bg-white/90 text-primary">
                    <ArrowDownLeft className="w-5 h-5 mr-2" /> 立即充值
                 </Button>
               </DialogTrigger>
               <RechargeModal />
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
                输入您的礼品卡代码或活动充值码，金额将立即存入余额。
             </CardDescription>
           </CardHeader>
           <CardContent className="space-y-4">
             <div className="space-y-2">
                <Label htmlFor="code" className="text-xs text-muted-foreground">兑换代码</Label>
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
                        disabled={!redeemCode || isRedeeming}
                        className="min-w-[100px] shadow-lg shadow-primary/20"
                    >
                        {isRedeeming ? <Loader2 className="w-4 h-4 animate-spin" /> : '兑换'}
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
          <Tabs defaultValue="transactions" className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <TabsList className="grid w-full sm:w-[240px] grid-cols-2">
                <TabsTrigger value="transactions">交易明细</TabsTrigger>
                <TabsTrigger value="recharges">充值记录</TabsTrigger>
              </TabsList>
              <Button variant="outline" size="sm" className="gap-2 text-xs w-full sm:w-auto">
                <Download className="w-3.5 h-3.5" /> 导出账单 (CSV)
              </Button>
            </div>

            <TabsContent value="transactions" className="mt-0">
              <div className="rounded-md border border-border/50 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow className="border-border/50">
                        <TableHead>交易ID</TableHead>
                        <TableHead>时间</TableHead>
                        <TableHead>摘要</TableHead>
                        <TableHead>类型</TableHead>
                        <TableHead className="text-right">金额</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((trx) => (
                        <TableRow key={trx.id} className="hover:bg-muted/50 border-border/50">
                          <TableCell className="font-mono text-xs text-muted-foreground">{trx.id}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{trx.date}</TableCell>
                          <TableCell className="font-medium">{trx.desc}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn(
                              "text-[10px] h-5 px-1.5 capitalize border-0", 
                              trx.type === 'income' ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"
                            )}>
                              {trx.type === 'income' ? '充值/入账' : '消费/支出'}
                            </Badge>
                          </TableCell>
                          <TableCell className={cn(
                            "text-right font-bold tabular-nums",
                            trx.type === 'income' ? "text-green-600" : "text-foreground"
                          )}>
                            {trx.type === 'income' ? '+' : '-'}${trx.amount.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
              </div>
            </TabsContent>

            <TabsContent value="recharges" className="mt-0">
               <div className="rounded-md border border-border/50 overflow-hidden">
                   <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow className="border-border/50">
                        <TableHead>流水号</TableHead>
                        <TableHead>充值时间</TableHead>
                        <TableHead>支付方式</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead className="text-right">充值金额</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recharges.map((rec) => (
                        <TableRow key={rec.id} className="hover:bg-muted/50 border-border/50">
                          <TableCell className="font-mono text-xs text-muted-foreground">{rec.id}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{rec.date}</TableCell>
                          <TableCell className="flex items-center gap-2 text-sm">
                             {rec.method.includes('Alipay') && <span className="text-blue-500">🟦</span>}
                             {rec.method.includes('WeChat') && <span className="text-green-500">🟩</span>}
                             {rec.method.includes('USDT') && <span className="text-yellow-500">🪙</span>}
                             {rec.method.includes('Gift') && <Gift className="w-4 h-4 text-purple-500"/>}
                             {rec.method}
                          </TableCell>
                          <TableCell>
                             {rec.status === 'completed' ? (
                                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 gap-1 text-[10px] h-5 px-1.5 border-0">
                                   <CheckCircle2 className="w-3 h-3" /> 成功
                                </Badge>
                             ) : (
                                <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20 gap-1 text-[10px] h-5 px-1.5 border-0">
                                   <AlertCircle className="w-3 h-3" /> 失败
                                </Badge>
                             )}
                          </TableCell>
                          <TableCell className="text-right font-bold tabular-nums">
                            ${rec.amount.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
               </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}