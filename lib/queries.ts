import {
  useQuery,
  useMutation,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { get, post } from "./api";

// 查询键工厂
export const queryKeys = {
  // 用户相关
  user: {
    all: ["users"] as const,
    lists: () => [...queryKeys.user.all, "list"] as const,
    list: (params: unknown) => [...queryKeys.user.lists(), params] as const,
    details: () => [...queryKeys.user.all, "detail"] as const,
    detail: (id: string | number) => [...queryKeys.user.details(), id] as const,
  },
  // 服务器相关
  server: {
    all: ["servers"] as const,
    lists: () => [...queryKeys.server.all, "list"] as const,
    list: (params: unknown) => [...queryKeys.server.lists(), params] as const,
    details: () => [...queryKeys.server.all, "detail"] as const,
    detail: (id: string | number) =>
      [...queryKeys.server.details(), id] as const,
  },
  // 财务相关
  finance: {
    all: ["finances"] as const,
    lists: () => [...queryKeys.finance.all, "list"] as const,
    list: (params: unknown) => [...queryKeys.finance.lists(), params] as const,
  },
  // 工单相关
  ticket: {
    all: ["tickets"] as const,
    lists: () => [...queryKeys.ticket.all, "list"] as const,
    list: (params: unknown) => [...queryKeys.ticket.lists(), params] as const,
    details: () => [...queryKeys.ticket.all, "detail"] as const,
    detail: (id: string | number) =>
      [...queryKeys.ticket.details(), id] as const,
  },
};

// 封装 useQuery，配合 axios 使用
export function useApiQuery<T>(
  queryKey: string[],
  url: string,
  options?: Omit<UseQueryOptions<T, Error, T, string[]>, "queryKey" | "queryFn">
) {
  return useQuery<T, Error, T, string[]>({
    queryKey,
    queryFn: () => get<T>(url),
    ...options,
  });
}

// 封装 useMutation，用于 POST 请求
export function useApiPost<T, V = unknown>(
  url: string,
  options?: Omit<UseMutationOptions<T, Error, V>, "mutationFn">
) {
  return useMutation<T, Error, V>({
    mutationFn: (data: V) => post<T>(url, data),
    ...options,
  });
}

