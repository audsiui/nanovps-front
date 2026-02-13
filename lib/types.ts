// 用户类型
export interface User {
  id: string;
  email: string;
  balance: string;
  currency: string;
  role: string;
  status: number;
  apiKey: string | null;
  lastLoginIp: string | null;
  createdAt: string;
  updatedAt: string;
}

// 登录请求参数
export interface LoginRequest {
  email: string;
  password: string;
}

// 注册请求参数
export interface RegisterRequest {
  email: string;
  password: string;
}

// 登录响应数据
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // 秒
  user: User;
}

// API 通用响应包装
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// ==================== 区域管理类型 ====================

/** 区域 */
export interface Region {
  id: number;
  name: string;
  code: string;
  sortOrder: number;
  isActive: boolean;
}

/** 区域列表查询参数 */
export interface RegionListQuery {
  /** 是否启用 */
  isActive?: boolean;
  /** 排序字段 */
  orderBy?: string;
  /** 排序方式: asc | desc */
  order?: string;
  /** 页码 */
  page?: number;
  /** 每页数量 */
  pageSize?: number;
}

/** 区域列表响应 */
export interface RegionListResponse {
  list: Region[];
  total: number;
  page: number;
  pageSize: number;
}

/** 创建区域请求 */
export interface CreateRegionRequest {
  code: string;
  name: string;
  sortOrder?: number;
  isActive?: boolean;
}

/** 更新区域请求 */
export interface UpdateRegionRequest {
  id: number;
  code?: string;
  name?: string;
  sortOrder?: number;
  isActive?: boolean;
}

/** 删除区域请求 */
export interface DeleteRegionRequest {
  id: number;
}

// ==================== 镜像管理类型 ====================

/** 镜像 */
export interface Image {
  id: number;
  name: string;
  family: string;
  description: string;
  imageRef: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** 镜像列表查询参数 */
export interface ImageListQuery {
  /** 是否启用 */
  isActive?: boolean;
  /** 镜像家族 */
  family?: string;
  /** 排序字段 */
  orderBy?: string;
  /** 排序方式: asc | desc */
  order?: string;
  /** 页码 */
  page?: number;
  /** 每页数量 */
  pageSize?: number;
}

/** 镜像列表响应 */
export interface ImageListResponse {
  list: Image[];
  total: number;
  page: number;
  pageSize: number;
}

/** 创建镜像请求 */
export interface CreateImageRequest {
  name: string;
  family: string;
  description?: string;
  imageRef: string;
  defaultCmd?: string;
  isActive?: boolean;
}

/** 更新镜像请求 */
export interface UpdateImageRequest {
  id: number;
  name?: string;
  family?: string;
  description?: string;
  imageRef?: string;
  defaultCmd?: string;
  isActive?: boolean;
}

/** 删除镜像请求 */
export interface DeleteImageRequest {
  id: number;
}


// ==================== 节点管理类型 ====================

/** 节点 */
export interface Node {
  id: number;
  name: string;
  agentToken: string;
  ipv4: string;
  ipv6?: string;
  totalCpu: number;
  totalRamMb: number;
  allocatableDiskGb: number;
  usedDiskGb?: number;
  lastHeartbeat: string | null;
  status: number;
  regionId: number;
  createdAt: string;
  updatedAt: string;
}

/** 节点列表查询参数 */
export interface NodeListQuery {
  /** 区域ID */
  regionId?: number;
  /** 状态 */
  status?: number;
  /** 关键词搜索 */
  keyword?: string;
  /** 页码 */
  page?: number;
  /** 每页数量 */
  pageSize?: number;
}

/** 分页信息 */
export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/** 节点列表响应 */
export interface NodeListResponse {
  list: Node[];
  pagination: Pagination;
}

/** 创建节点请求 */
export interface CreateNodeRequest {
  name: string;
  agentToken: string;
  ipv4: string;
  ipv6?: string;
  totalCpu: number;
  totalRamMb: number;
  allocatableDiskGb: number;
  regionId: number;
  status: number;
}

/** 更新节点请求 */
export interface UpdateNodeRequest {
  id: number;
  name?: string;
  agentToken?: string;
  ipv4?: string;
  ipv6?: string;
  totalCpu?: number;
  totalRamMb?: number;
  regionId?: number;
  status?: number;
}

// ==================== 套餐模板管理类型 ====================

/** 套餐模板 */
export interface PlanTemplate {
  id: number;
  name: string;
  remark: string | null;
  cpu: number;
  ramMb: number;
  diskGb: number;
  trafficGb: number | null;
  bandwidthMbps: number | null;
  portCount: number | null;
  createdAt: string;
  updatedAt: string;
}

/** 套餐模板列表查询参数 */
export interface PlanTemplateListQuery {
  /** 关键词搜索（名称/备注） */
  keyword?: string;
  /** 页码 */
  page?: number;
  /** 每页数量 */
  pageSize?: number;
}

/** 套餐模板列表响应 */
export interface PlanTemplateListResponse {
  list: PlanTemplate[];
  pagination: Pagination;
}

/** 创建套餐模板请求 */
export interface CreatePlanTemplateRequest {
  name: string;
  remark?: string;
  cpu: number;
  ramMb: number;
  diskGb: number;
  trafficGb?: number | null;
  bandwidthMbps?: number | null;
  portCount?: number | null;
}

/** 更新套餐模板请求 */
export interface UpdatePlanTemplateRequest {
  id: number;
  name?: string;
  remark?: string;
  cpu?: number;
  ramMb?: number;
  diskGb?: number;
  trafficGb?: number | null;
  bandwidthMbps?: number | null;
  portCount?: number | null;
}

/** 删除套餐模板请求 */
export interface DeletePlanTemplateRequest {
  id: number;
}

// ==================== 产品目录类型 (Catalog) ====================

/** 计费周期 */
export interface CatalogBillingCycle {
  cycle: string;
  name: string;
  months: number;
  price: number;
  enabled: boolean;
  sortOrder: number;
}

/** 套餐模板信息 */
export interface CatalogTemplate {
  id: number;
  name: string;
  cpu: number;
  ramMb: number;
  diskGb: number;
  trafficGb: number | null;
  bandwidthMbps: number | null;
  portCount: number | null;
}

/** 目录中的套餐 */
export interface CatalogPlan {
  id: number;
  stock: number;
  soldCount: number;
  billingCycles: CatalogBillingCycle[];
  sortOrder: number;
  template: CatalogTemplate;
}

/** 目录中的节点 */
export interface CatalogNode {
  id: number;
  name: string;
  ipv4: string | null;
  status: number;
  plans: CatalogPlan[];
}

/** 目录中的区域 */
export interface CatalogRegion {
  id: number;
  name: string;
  code: string;
  nodes: CatalogNode[];
}

/** 套餐详情 */
export interface CatalogPlanDetail {
  id: number;
  stock: number;
  soldCount: number;
  billingCycles: CatalogBillingCycle[];
  template: CatalogTemplate;
  node: {
    id: number;
    name: string;
    ipv4: string | null;
  };
  region: {
    id: number;
    name: string;
    code: string;
  };
}

// ==================== 服务器套餐管理类型 ====================

/** 服务器套餐 - 基于套餐模板创建 */
export interface NodePlan {
  id: number;
  nodeId: number;
  planTemplateId: number;
  stock: number;
  soldCount: number;
  billingCycles: BillingCycle[];
  status: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

/** 服务器套餐列表查询参数 */
export interface NodePlanListQuery {
  /** 页码 */
  page?: number;
  /** 每页数量 */
  pageSize?: number;
}

/** 服务器套餐列表响应 */
export interface NodePlanListResponse {
  list: NodePlan[];
  pagination: Pagination;
}

/** 计费周期 */
export interface BillingCycle {
  cycle: string;
  enabled: boolean;
  months: number;
  name: string;
  price: number;
  sortOrder: number;
}

/** 创建服务器套餐请求 */
export interface CreateNodePlanRequest {
  nodeId: number;
  planTemplateId: number;
  billingCycles: BillingCycle[];
  sortOrder?: number;
  status?: number;
  stock: number;
}

/** 更新服务器套餐请求 */
export interface UpdateNodePlanRequest {
  id: number;
  billingCycles?: BillingCycle[];
  sortOrder?: number;
  status?: number;
  stock?: number;
}

/** 删除服务器套餐请求 */
export interface DeleteNodePlanRequest {
  id: number;
}

// ==================== 优惠码管理类型 ====================

/** 优惠码折扣类型 */
export type PromoCodeType = 'fixed' | 'percentage';

/** 优惠码使用场景 */
export type PromoCodeUsageType = 'purchase';

/** 优惠码 */
export interface PromoCode {
  id: number;
  code: string;
  description?: string;
  type: PromoCodeType;
  value: string;
  minAmount?: string;
  maxDiscount?: string;
  usageType: PromoCodeUsageType;
  usageLimit?: number;
  usageCount: number;
  perUserLimit: number;
  startAt?: string;
  endAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** 优惠码列表查询参数 */
export interface PromoCodeListQuery {
  page?: number;
  pageSize?: number;
  keyword?: string;
  isActive?: boolean;
}

/** 优惠码列表响应 */
export interface PromoCodeListResponse {
  list: PromoCode[];
  total: number;
  page: number;
  pageSize: number;
}

/** 创建优惠码请求 */
export interface CreatePromoCodeRequest {
  code: string;
  description?: string;
  type: PromoCodeType;
  value: string;
  minAmount?: string;
  maxDiscount?: string;
  usageType?: PromoCodeUsageType;
  usageLimit?: number;
  perUserLimit?: number;
  startAt?: string;
  endAt?: string;
  isActive?: boolean;
}

/** 更新优惠码请求 */
export interface UpdatePromoCodeRequest {
  id: number;
  code?: string;
  description?: string;
  type?: PromoCodeType;
  value?: string;
  minAmount?: string;
  maxDiscount?: string;
  usageType?: PromoCodeUsageType;
  usageLimit?: number;
  perUserLimit?: number;
  startAt?: string;
  endAt?: string;
  isActive?: boolean;
}

/** 删除优惠码请求 */
export interface DeletePromoCodeRequest {
  id: number;
}

/** 优惠码使用记录 */
export interface PromoCodeUsage {
  id: number;
  promoCodeId: number;
  userId: number;
  orderId?: number;
  originalAmount: string;
  discountAmount: string;
  finalAmount: string;
  createdAt: string;
  promoCode?: PromoCode;
  user?: {
    id: number;
    email: string;
  };
}

/** 优惠码使用记录查询参数 */
export interface PromoCodeUsageQuery {
  promoCodeId?: number;
  userId?: number;
  page?: number;
  pageSize?: number;
}

/** 优惠码使用记录响应 */
export interface PromoCodeUsageResponse {
  list: PromoCodeUsage[];
  total: number;
  page: number;
  pageSize: number;
}

/** 验证优惠码请求 */
export interface ValidatePromoCodeQuery {
  code: string;
  amount: number;
}

/** 验证优惠码响应 */
export interface ValidatePromoCodeResponse {
  valid: boolean;
  code: string;
  type: PromoCodeType;
  value: string;
  discountAmount: string;
  finalAmount: string;
  message?: string;
}

// ==================== 赠金码管理类型 ====================

/** 赠金码 */
export interface GiftCode {
  id: number;
  code: string;
  description?: string;
  amount: string;
  usageLimit?: number;
  usageCount: number;
  perUserLimit: number;
  startAt?: string;
  endAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** 赠金码列表查询参数 */
export interface GiftCodeListQuery {
  page?: number;
  pageSize?: number;
  keyword?: string;
  isActive?: boolean;
}

/** 赠金码列表响应 */
export interface GiftCodeListResponse {
  list: GiftCode[];
  total: number;
  page: number;
  pageSize: number;
}

/** 创建赠金码请求 */
export interface CreateGiftCodeRequest {
  code: string;
  description?: string;
  amount: string;
  usageLimit?: number;
  perUserLimit?: number;
  startAt?: string;
  endAt?: string;
  isActive?: boolean;
}

/** 更新赠金码请求 */
export interface UpdateGiftCodeRequest {
  id: number;
  code?: string;
  description?: string;
  amount?: string;
  usageLimit?: number;
  perUserLimit?: number;
  startAt?: string;
  endAt?: string;
  isActive?: boolean;
}

/** 删除赠金码请求 */
export interface DeleteGiftCodeRequest {
  id: number;
}

/** 赠金码使用记录 */
export interface GiftCodeUsage {
  id: number;
  giftCodeId: number;
  userId: number;
  amount: string;
  createdAt: string;
  giftCode?: GiftCode;
  user?: {
    id: number;
    email: string;
  };
}

/** 赠金码使用记录查询参数 */
export interface GiftCodeUsageQuery {
  giftCodeId?: number;
  userId?: number;
  page?: number;
  pageSize?: number;
}

/** 赠金码使用记录响应 */
export interface GiftCodeUsageResponse {
  list: GiftCodeUsage[];
  total: number;
  page: number;
  pageSize: number;
}

/** 使用赠金码请求 */
export interface UseGiftCodeRequest {
  code: string;
}

/** 使用赠金码响应 */
export interface UseGiftCodeResponse {
  success: boolean;
  message: string;
  amount?: string;
  balance?: string;
}

// ==================== 订单管理类型 ====================

/** 订单类型 */
export type OrderType = 'new' | 'renew' | 'upgrade';

/** 订单状态 */
export type OrderStatus = 'pending' | 'paid' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';

/** 支付渠道 */
export type PaymentChannel = 'alipay' | 'wechat' | 'stripe' | 'paypal' | 'balance';

/** 订单（列表用 - 简洁信息） */
export interface Order {
  id: number;
  orderNo: string;
  nodeName: string;
  type: OrderType;
  planName: string;
  finalPrice: string;
  status: OrderStatus;
  createdAt: string;
}

/** 订单详情中的节点信息 */
export interface OrderDetailNode {
  id: number;
  name: string;
  ipv4?: string;
  ipv6?: string;
}

/** 套餐模板（详情用） */
export interface PlanTemplate {
  id: number;
  name: string;
  cpu: number;
  ramMb: number;
  diskGb: number;
}

/** 节点套餐（详情用） */
export interface OrderDetailNodePlan {
  id: number;
  billingCycles: CatalogBillingCycle[];
  status: number;
}

/** 订单详情（完整信息） */
export interface OrderDetail {
  id: number;
  orderNo: string;
  userId: number;
  nodePlanId: number;
  type: OrderType;
  status: OrderStatus;
  billingCycle: string;
  durationMonths: number;
  originalPrice: string;
  discountAmount: string;
  finalPrice: string;
  paymentChannel?: PaymentChannel;
  paidAt?: string;
  paymentTradeNo?: string;
  periodStartAt?: string;
  periodEndAt?: string;
  remark?: string;
  createdAt: string;
  updatedAt: string;
  node: OrderDetailNode;
  nodePlan: OrderDetailNodePlan;
  instance: Instance;
  planTemplate: PlanTemplate;
}

/** 订单列表查询参数 */
export interface OrderListQuery {
  page?: number;
  pageSize?: number;
  status?: OrderStatus;
}

/** 订单列表响应 */
export interface OrderListResponse {
  list: Order[];
  total: number;
  page: number;
  pageSize: number;
}

/** 计算订单金额查询参数 */
export interface CalculateOrderQuery {
  nodePlanId: number;
  billingCycle: string;
  durationMonths: number;
  promoCode?: string;
}

/** 计算订单金额响应 */
export interface CalculateOrderResponse {
  nodePlanId: number;
  billingCycle: string;
  durationMonths: number;
  originalPrice: string;
  discountAmount: string;
  finalPrice: string;
  promoCode?: string;
  promoCodeValid: boolean;
  promoCodeMessage?: string;
}

/** 创建订单请求 */
export interface CreateOrderRequest {
  nodePlanId: number;
  billingCycle: string;
  durationMonths: number;
  promoCode?: string;
  imageId: number;
}

/** 创建订单响应 */
export interface CreateOrderResponse {
  order: Order;
  instanceId: number;
  discountInfo?: {
    promoCode: string;
    originalAmount: number;
    discountAmount: number;
    finalAmount: number;
  };
}

// ==================== 实例管理类型 ====================

/** 实例状态枚举 */
export type InstanceStatus = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** 实例状态文本映射 */
export const InstanceStatusText: Record<number, string> = {
  0: '创建中',
  1: '运行中',
  2: '已停止',
  3: '暂停',
  4: '异常',
  5: '销毁中',
  6: '已销毁',
};

/** 实例（列表用） */
export interface Instance {
  id: number;
  userId: number;
  nodeId: number;
  nodePlanId: number;
  imageId: number;
  name: string;
  hostname: string | null;
  cpu: number;
  ramMb: number;
  diskGb: number;
  trafficGb: number | null;
  bandwidthMbps: number | null;
  internalIp: string | null;
  sshPort: number | null;
  status: InstanceStatus;
  containerId: string | null;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  lastStartedAt: string | null;
  destroyedAt: string | null;
  autoRenew: boolean;
}

/** 实例详情（包含关联信息） */
export interface InstanceDetail extends Instance {
  node: {
    id: number;
    name: string;
    ipv4: string | null;
    ipv6: string | null;
    status: number;
  };
  image: {
    id: number;
    name: string;
    imageRef: string;
    family: string;
  };
}

/** 实例列表响应 */
export interface InstanceListResponse {
  list: Instance[];
  pagination: Pagination;
}

/** 实例实时状态 */
export interface InstanceStatusData {
  status: 'online' | 'offline' | 'creating';
  instanceStatus: InstanceStatus;
  message?: string;
  containerId?: string;
  containerName?: string;
  timestamp?: number;
  cpuPercent?: number;
  memory?: {
    usage: number;
    limit: number;
    usagePercent: number;
  };
  network?: {
    rxRate: number;
    txRate: number;
    rxTotal: number;
    txTotal: number;
  };
}

/** 实例历史数据点 */
export interface InstanceHistoryPoint {
  timestamp: number;
  cpuPercent: number;
  memoryUsagePercent: number;
  memoryUsage: number;
  memoryLimit: number;
  networkRxRate: number;
  networkTxRate: number;
  networkRxTotal: number;
  networkTxTotal: number;
}

/** 实例历史数据响应 */
export interface InstanceHistoryResponse {
  list: InstanceHistoryPoint[];
  total: number;
}

/** 实例操作响应 */
export interface InstanceOperationResponse {
  status: string;
}

// ==================== 充值管理类型 ====================

/** 充值状态 */
export type RechargeStatus = 'pending' | 'paid' | 'cancelled' | 'failed';

/** 充值渠道 */
export type RechargeChannel = 'alipay' | 'wechat' | 'stripe' | 'paypal';

/** 充值记录 */
export interface Recharge {
  id: number;
  rechargeNo: string;
  userId: number;
  amount: string;
  bonusAmount: string;
  finalAmount: string;
  status: RechargeStatus;
  channel?: RechargeChannel;
  paidAt?: string;
  tradeNo?: string;
  createdAt: string;
  updatedAt: string;
}

/** 充值列表查询参数 */
export interface RechargeListQuery {
  page?: number;
  pageSize?: number;
  status?: RechargeStatus;
}

/** 充值列表响应 */
export interface RechargeListResponse {
  list: Recharge[];
  total: number;
  page: number;
  pageSize: number;
}

/** 创建充值请求 */
export interface CreateRechargeRequest {
  amount: number;
  channel: RechargeChannel;
}

/** 创建充值响应 */
export interface CreateRechargeResponse {
  recharge: Recharge;
  paymentUrl?: string;
}
