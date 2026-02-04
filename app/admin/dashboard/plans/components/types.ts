/**
 * 套餐模板类型定义
 * 用于定义容器实例的套餐规格，可分配给多个服务器并设置库存
 */

/** 套餐状态 */
export type PlanStatus = 0 | 1;

/** 服务器分配信息 */
export interface ServerAllocation {
  /** 服务器ID */
  serverId: number;
  /** 服务器名称 */
  serverName: string;
  /** 最大库存数量（该套餐在此服务器上最多可创建多少个实例） */
  maxStock: number;
  /** 已使用数量 */
  usedCount: number;
  /** 是否启用此服务器上的该套餐 */
  enabled: boolean;
  /** 套餐价格（月付） */
  price: string;
  /** 结算货币 */
  currency: string;
}

/** 套餐模板对象 */
export interface Plan {
  /** 套餐唯一标识 */
  id: number;
  /** 套餐名称 */
  name: string;
  /** CPU 核心数 */
  cpu: number;
  /** 内存大小 (MB) */
  memory: number;
  /** 硬盘容量 (GB) */
  disk: number;
  /** 月流量限制 (GB)，null 表示不限 */
  traffic: number | null;
  /** 带宽限制 (Mbps)，null 表示不限 */
  bandwidth: number | null;
  /** 端口数量限制 */
  ports: number;
  /** 套餐状态: 0=下架, 1=上架 */
  status: PlanStatus;
  /** 套餐描述 */
  description?: string | null;
  /** 排序权重，数字越小越靠前 */
  sortOrder: number;
  /** 分配的服务器列表及库存配置 */
  allocations: ServerAllocation[];
  /** 记录创建时间 */
  createdAt: string;
  /** 记录最后更新时间 */
  updatedAt: string;
}

/** 套餐状态映射 */
export const planStatusMap: Record<PlanStatus, { label: string; color: string }> = {
  0: { label: '已下架', color: 'bg-gray-500' },
  1: { label: '上架中', color: 'bg-green-500' },
};

/** 常用货币列表 */
export const currencies = ['CNY', 'USD'] as const;

/** 套餐表单数据（用于创建/编辑） */
export interface PlanFormData {
  name: string;
  cpu: number;
  memory: number;
  disk: number;
  traffic: number | null;
  bandwidth: number | null;
  ports: number;
  description?: string;
  status: PlanStatus;
  sortOrder: number;
}

/** 库存和价格设置表单数据 */
export interface StockFormData {
  serverId: number;
  maxStock: number;
  enabled: boolean;
  price: string;
  currency: string;
}
