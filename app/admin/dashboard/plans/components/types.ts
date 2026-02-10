/**
 * 套餐模板类型定义
 * 从全局类型重新导出，保持代码一致性
 */

export type {
  PlanTemplate,
} from '@/lib/types';

/**
 * 套餐模板表单数据类型
 */
export interface PlanTemplateFormData {
  name: string;
  remark?: string;
  cpu: number;
  ramMb: number;
  diskGb: number;
  trafficGb?: number | null;
  bandwidthMbps?: number | null;
  portCount?: number | null;
}
