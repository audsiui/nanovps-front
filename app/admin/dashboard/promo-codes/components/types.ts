import type { PromoCode, PromoCodeType, PromoCodeUsageType } from '@/lib/types';

export type { PromoCode };

export interface PromoCodeFormData {
  code: string;
  description?: string;
  type: PromoCodeType;
  value: string;
  minAmount?: string;
  maxDiscount?: string;
  usageType: PromoCodeUsageType;
  usageLimit?: number;
  perUserLimit: number;
  startAt?: string;
  endAt?: string;
  isActive: boolean;
}

export const initialFormData: PromoCodeFormData = {
  code: '',
  description: '',
  type: 'fixed',
  value: '',
  minAmount: '',
  maxDiscount: '',
  usageType: 'purchase',
  usageLimit: undefined,
  perUserLimit: 1,
  startAt: undefined,
  endAt: undefined,
  isActive: true,
};
