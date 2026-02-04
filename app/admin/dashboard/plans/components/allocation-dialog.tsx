'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Server,
  Plus,
  CheckCircle2,
  XCircle,
  Settings2,
  DollarSign,
} from 'lucide-react';
import { Plan, ServerAllocation } from './types';
import { availableServers, currencies } from './data';

interface AllocationDialogProps {
  plan: Plan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateAllocation: (planId: number, allocation: ServerAllocation) => void;
  onAddAllocation: (planId: number, serverId: number, serverName: string, defaultPrice: string, defaultCurrency: string) => void;
  onRemoveAllocation: (planId: number, serverId: number) => void;
}

export function AllocationDialog({
  plan,
  open,
  onOpenChange,
  onUpdateAllocation,
  onAddAllocation,
  onRemoveAllocation,
}: AllocationDialogProps) {
  const [editingStock, setEditingStock] = useState<number | null>(null);
  const [stockValue, setStockValue] = useState('');
  const [editingPrice, setEditingPrice] = useState<number | null>(null);
  const [priceValue, setPriceValue] = useState('');
  const [currencyValue, setCurrencyValue] = useState('CNY');
  const [defaultPrice, setDefaultPrice] = useState('29.90');
  const [defaultCurrency, setDefaultCurrency] = useState('CNY');

  if (!plan) return null;

  const getUnallocatedServers = () => {
    const allocatedIds = new Set(plan.allocations.map((a) => a.serverId));
    return availableServers.filter((s) => !allocatedIds.has(s.id));
  };

  const handleToggleAllocation = (allocation: ServerAllocation) => {
    onUpdateAllocation(plan.id, {
      ...allocation,
      enabled: !allocation.enabled,
    });
  };

  const handleStockEdit = (allocation: ServerAllocation) => {
    setEditingStock(allocation.serverId);
    setStockValue(allocation.maxStock.toString());
  };

  const handleStockSave = (serverId: number) => {
    const allocation = plan.allocations.find((a) => a.serverId === serverId);
    if (allocation) {
      onUpdateAllocation(plan.id, {
        ...allocation,
        maxStock: parseInt(stockValue) || 0,
      });
    }
    setEditingStock(null);
  };

  const handlePriceEdit = (allocation: ServerAllocation) => {
    setEditingPrice(allocation.serverId);
    setPriceValue(allocation.price);
    setCurrencyValue(allocation.currency);
  };

  const handlePriceSave = (serverId: number) => {
    const allocation = plan.allocations.find((a) => a.serverId === serverId);
    if (allocation) {
      onUpdateAllocation(plan.id, {
        ...allocation,
        price: priceValue || '0',
        currency: currencyValue,
      });
    }
    setEditingPrice(null);
  };

  const formatPrice = (price: string, currency: string) => {
    const symbol = currency === 'CNY' ? '¥' : currency === 'USD' ? '$' : currency;
    return `${symbol}${price}/月`;
  };

  const handleAddServer = (serverId: string) => {
    const server = availableServers.find((s) => s.id === parseInt(serverId));
    if (server) {
      onAddAllocation(plan.id, server.id, server.name, defaultPrice, defaultCurrency);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            管理服务器分配
          </DialogTitle>
          <DialogDescription>
            套餐：{plan.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 添加服务器 */}
          {getUnallocatedServers().length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Select onValueChange={handleAddServer}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="选择服务器添加分配..." />
                  </SelectTrigger>
                  <SelectContent>
                    {getUnallocatedServers().map((server) => (
                      <SelectItem key={server.id} value={server.id.toString()}>
                        {server.name} ({server.region})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">默认价格:</span>
                <Input
                  type="number"
                  step="0.01"
                  min={0}
                  value={defaultPrice}
                  onChange={(e) => setDefaultPrice(e.target.value)}
                  className="w-24 h-8"
                />
                <Select value={defaultCurrency} onValueChange={setDefaultCurrency}>
                  <SelectTrigger className="w-24 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* 服务器分配列表 */}
          <div className="space-y-3">
            {plan.allocations.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground border rounded-lg">
                暂无服务器分配
                <p className="text-xs mt-1">请从上方选择服务器添加</p>
              </div>
            ) : (
              plan.allocations.map((allocation) => (
                <div
                  key={allocation.serverId}
                  className={`p-4 rounded-lg border ${
                    allocation.enabled
                      ? 'bg-background'
                      : 'bg-muted/30 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={allocation.enabled}
                        onCheckedChange={() => handleToggleAllocation(allocation)}
                      />
                      <div>
                        <div className="font-medium">{allocation.serverName}</div>
                        <div className="text-xs text-muted-foreground">
                          已用: {allocation.usedCount} / 库存: {allocation.maxStock}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {editingStock === allocation.serverId ? (
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            value={stockValue}
                            onChange={(e) => setStockValue(e.target.value)}
                            className="w-20 h-8 text-sm"
                            min={0}
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleStockSave(allocation.serverId);
                              if (e.key === 'Escape') setEditingStock(null);
                            }}
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => handleStockSave(allocation.serverId)}
                          >
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs gap-1"
                          onClick={() => handleStockEdit(allocation)}
                        >
                          <Settings2 className="h-3 w-3" />
                          库存
                        </Button>
                      )}

                      {editingPrice === allocation.serverId ? (
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            step="0.01"
                            min={0}
                            value={priceValue}
                            onChange={(e) => setPriceValue(e.target.value)}
                            className="w-20 h-8 text-sm"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handlePriceSave(allocation.serverId);
                              if (e.key === 'Escape') setEditingPrice(null);
                            }}
                          />
                          <Select
                            value={currencyValue}
                            onValueChange={setCurrencyValue}
                          >
                            <SelectTrigger className="w-16 h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {currencies.map((c) => (
                                <SelectItem key={c} value={c}>
                                  {c}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => handlePriceSave(allocation.serverId)}
                          >
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs gap-1"
                          onClick={() => handlePriceEdit(allocation)}
                        >
                          <DollarSign className="h-3 w-3" />
                          {formatPrice(allocation.price, allocation.currency)}
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() =>
                          onRemoveAllocation(plan.id, allocation.serverId)
                        }
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* 利用率进度条 */}
                  {allocation.enabled && allocation.maxStock > 0 && (
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">利用率</span>
                        <span>
                          {Math.round(
                            (allocation.usedCount / allocation.maxStock) * 100
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        value={(allocation.usedCount / allocation.maxStock) * 100}
                        className="h-1"
                      />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>完成</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
