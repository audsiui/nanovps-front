import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
  isTokenExpiringSoon,
} from './token';

// 统一响应格式
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 刷新 token 的响应
interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// 创建 axios 实例
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 刷新 token 的 Promise 锁（防止并发刷新）
let refreshPromise: Promise<void> | null = null;

// 执行刷新 token
const doRefreshToken = async (): Promise<void> => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await axios.post<ApiResponse<RefreshTokenResponse>>(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/refresh`,
      { refreshToken }
    );

    const data = response.data;

    if (data.code !== 200) {
      throw new Error(data.message || '刷新 token 失败');
    }

    // 保存新的 token
    saveTokens({
      accessToken: data.data.accessToken,
      refreshToken: data.data.refreshToken,
      expiresIn: data.data.expiresIn,
    });
  } catch (error) {
    // 刷新失败，清除所有 token 并跳转登录
    clearTokens();
    if (typeof window !== 'undefined') {
      window.location.href = '/auth';
    }
    throw error;
  }
};

// 获取刷新 Promise（确保并发请求只刷新一次）
const getRefreshPromise = (): Promise<void> => {
  if (!refreshPromise) {
    refreshPromise = doRefreshToken().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

// 请求拦截器
api.interceptors.request.use(
  async (config) => {
    // 跳过刷新 token 请求本身
    if (config.url?.includes('/auth/refresh')) {
      return config;
    }

    // 检查 token 是否即将过期，需要刷新
    if (isTokenExpiringSoon(5)) {
      try {
        await getRefreshPromise();
      } catch {
        // 刷新失败，让请求继续（会返回 401，由响应拦截器处理）
      }
    }

    // 获取最新的 accessToken
    const token = getAccessToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse) => {
    const data = response.data as ApiResponse<unknown>;

    // 根据业务状态码处理（HTTP 2xx 但业务可能返回错误码）
    switch (data.code) {
      case 200:
      case 201:
        // 成功响应，返回原始 response
        return response;
      case 403:
        throw new Error(data.message || '权限不足');
      case 404:
        throw new Error(data.message || '资源不存在');
      case 400:
        throw new Error(data.message || '请求参数错误');
      case 409:
        throw new Error(data.message || '资源已存在');
      case 422:
        throw new Error(data.message || '数据验证失败');
      case 500:
        throw new Error(data.message || '服务器内部错误');
      default:
        throw new Error(data.message || '请求失败');
    }
  },
  async (error: AxiosError<ApiResponse<unknown>>) => {
    // 网络错误或请求未发出
    if (!error.response) {
      console.error('网络错误，请检查网络连接');
      throw new Error('网络错误，请检查网络连接');
    }

    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    const status = error.response.status;
    const data = error.response.data;

    // HTTP 401 或业务状态码 401：尝试刷新 token
    if ((status === 401 || data?.code === 401) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await getRefreshPromise();
        const newToken = getAccessToken();

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        // 重试原请求
        return api(originalRequest);
      } catch (refreshError) {
        // 刷新失败，清除 token 并跳转
        clearTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/auth';
        }
        throw new Error(data?.message || '登录已过期，请重新登录');
      }
    }

    // 其他 HTTP 错误，根据状态码提示
    switch (status) {
      case 403:
        throw new Error(data?.message || '权限不足');
      case 404:
        throw new Error(data?.message || '资源不存在');
      case 500:
        throw new Error(data?.message || '服务器内部错误');
      default:
        throw new Error(data?.message || `请求失败 (${status})`);
    }
  }
);

// 封装 GET 请求 - 返回 data 字段
export const get = <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return api.get(url, config).then((res) => (res.data as ApiResponse<T>).data);
};

// 封装 POST 请求 - 返回 data 字段
export const post = <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
  return api.post(url, data, config).then((res) => (res.data as ApiResponse<T>).data);
};

// 封装 DELETE 请求 - 返回 data 字段
export const del = <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return api.delete(url, config).then((res) => (res.data as ApiResponse<T>).data);
};

export default api;
