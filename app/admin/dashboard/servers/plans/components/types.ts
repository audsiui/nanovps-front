/**
 * 服务器套餐类型定义
 * 用于定义服务器上可售卖的套餐配置
 */

/** 服务器套餐对象 - 基于套餐模板创建 */
export interface ServerPlan {
  /** 套餐唯一标识 */
  id: number;
  /** 所属服务器ID */
  serverId: number;
  /** 引用的套餐模板ID */
  templateId: number;
  /** 套餐名称（从模板复制） */
  name: string;
  /** CPU 核心数（从模板复制） */
  cpu: number;
  /** 内存大小 (MB)（从模板复制） */
  ramMb: number;
  /** 硬盘大小 (GB)（从模板复制） */
  diskGb: number;
  /** 月度流量限制 (GB)（从模板复制） */
  trafficGb: number | null;
  /** 带宽限制 (Mbps)（从模板复制） */
  bandwidthMbps: number | null;
  /** 端口数量限制（从模板复制） */
  portCount: number | null;
  /** 月付价格 (元) */
  priceMonthly: number;
  /** 年付价格 (元)，null 表示不支持年付 */
  priceYearly: number | null;
  /** 库存数量 */
  stock: number;
  /** 是否启用 */
  isActive: boolean;
  /** 记录创建时间 */
  createdAt: string;
  /** 记录最后更新时间 */
  updatedAt: string;
}

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
