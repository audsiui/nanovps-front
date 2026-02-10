import type { GiftCode } from '@/lib/types';

export type { GiftCode };

export interface GiftCodeFormData {
  code: string;
  description?: string;
  amount: string;
  usageLimit?: number;
  perUserLimit: number;
  startAt?: string;
  endAt?: string;
  isActive: boolean;
}

export const initialFormData: GiftCodeFormData = {
  code: '',
  description: '',
  amount: '',
  usageLimit: undefined,
  perUserLimit: 1,
  startAt: undefined,
  endAt: undefined,
  isActive: true,
};
