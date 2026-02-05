/**
 * 服务器套餐类型定义
 * 从全局类型重新导出，保持代码一致性
 */

export type {
  NodePlan,
} from '@/lib/types';

/** 服务器套餐表单数据（用于创建） */
export interface ServerPlanFormData {
  /** 引用的套餐模板ID */
  templateId: number;
  /** 月付价格 (元) */
  priceMonthly: number;
  /** 年付价格 (元) */
  priceYearly: number | null;
  /** 库存数量 */
  stock: number;
  /** 是否启用 */
  isActive: boolean;
}
