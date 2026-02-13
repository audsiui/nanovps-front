'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { PromoCode } from '@/lib/types';
import { useUpdatePromoCode } from '@/lib/requests/promo-codes';
import { promoCodeTypeOptions } from './data';

const formSchema = z.object({
  id: z.number(),
  code: z.string().min(1, '请输入优惠码').max(50, '优惠码最多50个字符'),
  description: z.string().optional(),
  type: z.enum(['fixed', 'percentage']),
  value: z.string().min(1, '请输入优惠值'),
  minAmount: z.string().optional(),
  maxDiscount: z.string().optional(),
  usageLimit: z.number().optional(),
  perUserLimit: z.number().min(1, '每用户限制至少为1'),
  startAt: z.string().optional(),
  endAt: z.string().optional(),
  isActive: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

interface EditPromoCodeFormProps {
  promoCode: PromoCode;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EditPromoCodeForm({ promoCode, onSuccess, onCancel }: EditPromoCodeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateMutation = useUpdatePromoCode();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: promoCode.id,
      code: promoCode.code,
      description: promoCode.description || '',
      type: promoCode.type,
      value: promoCode.value,
      minAmount: promoCode.minAmount || '',
      maxDiscount: promoCode.maxDiscount || '',
      usageLimit: promoCode.usageLimit,
      perUserLimit: promoCode.perUserLimit,
      startAt: promoCode.startAt ? new Date(promoCode.startAt).toISOString().slice(0, 16) : '',
      endAt: promoCode.endAt ? new Date(promoCode.endAt).toISOString().slice(0, 16) : '',
      isActive: promoCode.isActive,
    },
  });

  const type = watch('type');

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await updateMutation.mutateAsync({
        ...data,
        usageType: 'purchase',
      });
      toast.success('优惠码更新成功');
      onSuccess();
    } catch (error) {
      toast.error('更新失败：' + (error instanceof Error ? error.message : '未知错误'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="code">优惠码 *</Label>
          <Input
            id="code"
            placeholder="输入优惠码"
            {...register('code')}
          />
          {errors.code && (
            <p className="text-sm text-destructive">{errors.code.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">折扣类型 *</Label>
          <Select
            value={type}
            onValueChange={(value) => setValue('type', value as 'fixed' | 'percentage')}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {promoCodeTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">描述</Label>
        <Textarea
          id="description"
          placeholder="输入优惠码描述（可选）"
          {...register('description')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="value">
            优惠值 * ({type === 'fixed' ? '固定金额' : '百分比'})
          </Label>
          <Input
            id="value"
            type="number"
            step={type === 'fixed' ? '0.01' : '1'}
            placeholder={type === 'fixed' ? '如：10.00' : '如：20'}
            {...register('value')}
          />
          {errors.value && (
            <p className="text-sm text-destructive">{errors.value.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="minAmount">最低使用金额（可选）</Label>
          <Input
            id="minAmount"
            type="number"
            step="0.01"
            placeholder="订单金额需大于此值"
            {...register('minAmount')}
          />
        </div>
      </div>

      {type === 'percentage' && (
        <div className="space-y-2">
          <Label htmlFor="maxDiscount">最大优惠金额（可选）</Label>
          <Input
            id="maxDiscount"
            type="number"
            step="0.01"
            placeholder="设置最大优惠金额上限"
            {...register('maxDiscount')}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="usageLimit">总使用次数限制（可选）</Label>
          <Input
            id="usageLimit"
            type="number"
            min={1}
            placeholder="留空表示无限制"
            {...register('usageLimit', { valueAsNumber: true })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="perUserLimit">每用户使用次数限制 *</Label>
          <Input
            id="perUserLimit"
            type="number"
            min={1}
            {...register('perUserLimit', { valueAsNumber: true })}
          />
          {errors.perUserLimit && (
            <p className="text-sm text-destructive">{errors.perUserLimit.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startAt">生效时间（可选）</Label>
          <Input
            id="startAt"
            type="datetime-local"
            {...register('startAt')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endAt">过期时间（可选）</Label>
          <Input
            id="endAt"
            type="datetime-local"
            {...register('endAt')}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={watch('isActive')}
          onCheckedChange={(checked) => setValue('isActive', checked)}
        />
        <Label htmlFor="isActive">启用该优惠码</Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          保存修改
        </Button>
      </div>
    </form>
  );
}
