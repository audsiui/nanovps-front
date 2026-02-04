/**
 * 套餐模板类型定义
 * 用于定义 VPS 套餐模板配置，仅作为模板使用
 */

/** 套餐模板对象 */
export interface PlanTemplate {
  /** 套餐唯一标识 */
  id: number;
  /** 套餐名称 */
  name: string;
  /** 套餐备注/描述 */
  remark: string | null;
  /** CPU 核心数 */
  cpu: number;
  /** 内存大小 (MB) */
  ramMb: number;
  /** 硬盘大小 (GB) */
  diskGb: number;
  /** 月度流量限制 (GB)，null 表示不限流量 */
  trafficGb: number | null;
  /** 带宽限制 (Mbps)，null 表示不限带宽 */
  bandwidthMbps: number | null;
  /** 端口数量限制，null 表示不限端口 */
  portCount: number | null;
  /** 记录创建时间 */
  createdAt: string;
  /** 记录最后更新时间 */
  updatedAt: string;
}

/** 套餐表单数据（用于创建/编辑） */
export interface PlanTemplateFormData {
  name: string;
  remark: string;
  cpu: number;
  ramMb: number;
  diskGb: number;
  trafficGb: number | null;
  bandwidthMbps: number | null;
  portCount: number | null;
}
