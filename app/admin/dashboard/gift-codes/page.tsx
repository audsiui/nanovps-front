'use client';

import { useState } from 'react';
import { Plus, Search, Gift, Loader2, MoreHorizontal, Pencil, Trash2, Copy, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useGiftCodeList, useCreateGiftCode, useUpdateGiftCode, useDeleteGiftCode, useGiftCodeUsageRecords } from '@/lib/requests/gift-codes';
import { statusOptions } from './components/data';
import type { GiftCode } from '@/lib/types';
import { formatDate } from '@/lib/utils';

const formSchema = z.object({
  code: z.string().min(1, '请输入赠金码').max(50, '赠金码最多50个字符'),
  description: z.string().optional(),
  amount: z.string().min(1, '请输入赠金金额'),
  usageLimit: z.number().optional(),
  perUserLimit: z.number().min(1, '每用户限制至少为1'),
  startAt: z.string().optional(),
  endAt: z.string().optional(),
  isActive: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

function GiftCodeForm({ onSubmit, initialData, submitLabel }: { onSubmit: (data: FormData) => void; initialData?: Partial<FormData>; submitLabel: string }) {
  const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
      description: '',
      amount: '',
      perUserLimit: 1,
      isActive: true,
      ...initialData,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="code">赠金码 *</Label>
        <Input id="code" placeholder="输入赠金码" {...register('code')} />
        {errors.code && <p className="text-sm text-destructive">{errors.code.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">描述</Label>
        <Textarea id="description" placeholder="输入赠金码描述（可选）" {...register('description')} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">赠金金额 *</Label>
          <Input id="amount" type="number" step="0.01" placeholder="如：10.00" {...register('amount')} />
          {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="usageLimit">总使用次数限制（可选）</Label>
          <Input id="usageLimit" type="number" min={1} placeholder="留空表示无限制" {...register('usageLimit', { valueAsNumber: true })} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="perUserLimit">每用户使用次数限制 *</Label>
        <Input id="perUserLimit" type="number" min={1} defaultValue={1} {...register('perUserLimit', { valueAsNumber: true })} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startAt">生效时间（可选）</Label>
          <Input id="startAt" type="datetime-local" {...register('startAt')} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endAt">过期时间（可选）</Label>
          <Input id="endAt" type="datetime-local" {...register('endAt')} />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="isActive" defaultChecked={initialData?.isActive ?? true} onCheckedChange={(checked) => setValue('isActive', checked)} />
        <Label htmlFor="isActive">启用该赠金码</Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}

function GiftCodeUsageDialog({ giftCodeId, onClose }: { giftCodeId: number; onClose: () => void }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGiftCodeUsageRecords({ giftCodeId, page, pageSize: 10 });
  const usages = data?.list || [];
  const totalPages = Math.ceil((data?.total || 0) / 10);

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>用户</TableHead>
              <TableHead>赠金金额</TableHead>
              <TableHead>使用时间</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={3} className="h-24 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
            ) : usages.length === 0 ? (
              <TableRow><TableCell colSpan={3} className="h-24 text-center text-muted-foreground">暂无使用记录</TableCell></TableRow>
            ) : (
              usages.map((usage) => (
                <TableRow key={usage.id}>
                  <TableCell>{usage.user?.email || `用户#${usage.userId}`}</TableCell>
                  <TableCell className="text-green-600">+¥{usage.amount}</TableCell>
                  <TableCell>{formatDate(usage.createdAt)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>上一页</Button>
          <span className="flex items-center text-sm text-muted-foreground">{page} / {totalPages}</span>
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>下一页</Button>
        </div>
      )}
    </div>
  );
}

export default function GiftCodesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUsageDialogOpen, setIsUsageDialogOpen] = useState(false);
  const [selectedGiftCode, setSelectedGiftCode] = useState<GiftCode | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const queryParams = { page: 1, pageSize: 100, keyword: searchQuery || undefined, isActive: statusFilter === 'all' ? undefined : statusFilter === 'active' };
  const { data, isLoading, refetch } = useGiftCodeList(queryParams);
  const giftCodes = data?.list || [];

  const createMutation = useCreateGiftCode();
  const updateMutation = useUpdateGiftCode();
  const deleteMutation = useDeleteGiftCode();

  const handleAdd = async (data: FormData) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success('赠金码创建成功');
      setIsAddDialogOpen(false);
      refetch();
    } catch (error) {
      toast.error('创建失败：' + (error instanceof Error ? error.message : '未知错误'));
    }
  };

  const handleEdit = async (data: FormData) => {
    if (!selectedGiftCode) return;
    try {
      await updateMutation.mutateAsync({ ...data, id: selectedGiftCode.id });
      toast.success('赠金码更新成功');
      setIsEditDialogOpen(false);
      setSelectedGiftCode(null);
      refetch();
    } catch (error) {
      toast.error('更新失败：' + (error instanceof Error ? error.message : '未知错误'));
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync({ id: deleteId });
      toast.success('赠金码删除成功');
      setDeleteId(null);
      refetch();
    } catch (error) {
      toast.error('删除失败：' + (error instanceof Error ? error.message : '未知错误'));
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('赠金码已复制');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">赠金码管理</h1>
          <p className="text-sm text-muted-foreground mt-1">管理赠金码，用户使用后可直接获得余额赠金</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="搜索赠金码..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-8" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />创建赠金码</Button></DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>创建新赠金码</DialogTitle>
              <DialogDescription>填写赠金码信息，用户使用后可直接获得余额赠金</DialogDescription>
            </DialogHeader>
            <GiftCodeForm onSubmit={handleAdd} submitLabel="创建赠金码" />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && <div className="flex flex-col items-center justify-center py-16 text-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /><p className="mt-4 text-sm text-muted-foreground">加载中...</p></div>}

      {!isLoading && giftCodes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-4 rounded-full bg-muted"><Gift className="h-8 w-8 text-muted-foreground" /></div>
          <h3 className="mt-4 text-lg font-medium">暂无赠金码</h3>
          <p className="mt-1 text-sm text-muted-foreground">点击上方按钮创建第一个赠金码</p>
        </div>
      )}

      {!isLoading && giftCodes.length > 0 && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>赠金码</TableHead>
                <TableHead>赠金金额</TableHead>
                <TableHead>使用限制</TableHead>
                <TableHead>已用/限制</TableHead>
                <TableHead>有效期</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="w-[100px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {giftCodes.map((giftCode) => {
                const now = new Date();
                const expired = giftCode.endAt && new Date(giftCode.endAt) < now;
                return (
                  <TableRow key={giftCode.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium">{giftCode.code}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(giftCode.code)}><Copy className="h-3 w-3" /></Button>
                      </div>
                      {giftCode.description && <p className="text-xs text-muted-foreground mt-1">{giftCode.description}</p>}
                    </TableCell>
                    <TableCell className="text-green-600 font-medium">¥{giftCode.amount}</TableCell>
                    <TableCell><p className="text-sm">每用户限 {giftCode.perUserLimit} 次</p></TableCell>
                    <TableCell><span className="text-sm">{giftCode.usageCount} / {giftCode.usageLimit ?? '∞'}</span></TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        {giftCode.startAt && <p>开始: {formatDate(giftCode.startAt)}</p>}
                        {giftCode.endAt && <p>结束: {formatDate(giftCode.endAt)}</p>}
                        {!giftCode.startAt && !giftCode.endAt && <p className="text-muted-foreground">无限制</p>}
                      </div>
                    </TableCell>
                    <TableCell>
                      {!giftCode.isActive ? <Badge variant="secondary">已禁用</Badge> : expired ? <Badge variant="destructive">已过期</Badge> : <Badge className="bg-green-500 hover:bg-green-600">启用中</Badge>}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setSelectedGiftCode(giftCode); setIsEditDialogOpen(true); }}><Pencil className="mr-2 h-4 w-4" />编辑</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setSelectedGiftCode(giftCode); setIsUsageDialogOpen(true); }}><Eye className="mr-2 h-4 w-4" />查看使用记录</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteId(giftCode.id)}><Trash2 className="mr-2 h-4 w-4" />删除</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh]">
          <DialogHeader><DialogTitle>编辑赠金码</DialogTitle><DialogDescription>修改赠金码的配置信息</DialogDescription></DialogHeader>
          {selectedGiftCode && <GiftCodeForm onSubmit={handleEdit} initialData={{
            code: selectedGiftCode.code,
            description: selectedGiftCode.description || '',
            amount: selectedGiftCode.amount,
            usageLimit: selectedGiftCode.usageLimit,
            perUserLimit: selectedGiftCode.perUserLimit,
            startAt: selectedGiftCode.startAt ? new Date(selectedGiftCode.startAt).toISOString().slice(0, 16) : '',
            endAt: selectedGiftCode.endAt ? new Date(selectedGiftCode.endAt).toISOString().slice(0, 16) : '',
            isActive: selectedGiftCode.isActive,
          }} submitLabel="保存修改" />}
        </DialogContent>
      </Dialog>

      <Dialog open={isUsageDialogOpen} onOpenChange={setIsUsageDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader><DialogTitle>赠金码使用记录</DialogTitle><DialogDescription>查看该赠金码的使用情况</DialogDescription></DialogHeader>
          {selectedGiftCode && <GiftCodeUsageDialog giftCodeId={selectedGiftCode.id} onClose={() => setIsUsageDialogOpen(false)} />}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>确认删除</AlertDialogTitle><AlertDialogDescription>此操作将永久删除该赠金码。如果该赠金码已被使用，则无法删除。</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>取消</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">删除</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
