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
