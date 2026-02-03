import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// 统一响应格式
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 创建 axios 实例
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  // 允许返回所有 HTTP 状态码，不自动抛出错误
  validateStatus: () => true,
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

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

    // 根据业务状态码处理
    switch (data.code) {
      case 200:
      case 201:
        // 成功响应，返回原始 response
        return response;
      case 401:
        // 未授权，清除 token 并跳转到登录页
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          window.location.href = '/auth';
        }
        throw new Error(data.message || '请先登录');
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
  (error: AxiosError) => {
    // 网络错误或请求未发出
    if (!error.response) {
      console.error('网络错误，请检查网络连接');
      throw new Error('网络错误，请检查网络连接');
    }
    throw error;
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

export default api;
