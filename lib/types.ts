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
  /** 页码 */
  page?: number;
  /** 每页数量 */
  pageSize?: number;
}

/** 节点列表响应 */
export interface NodeListResponse {
  list: Node[];
  total: number;
  page: number;
  pageSize: number;
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
