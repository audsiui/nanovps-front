/**
 * 实例 API 请求
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post, del } from "@/lib/api";
import type {
  Instance,
  InstanceDetail,
  InstanceListResponse,
  InstanceStatusData,
  InstanceHistoryResponse,
  InstanceOperationResponse,
  Pagination,
} from "@/lib/types";

// Query keys
export const instanceKeys = {
  all: ["instances"] as const,
  lists: () => [...instanceKeys.all, "list"] as const,
  list: (query: InstanceListQuery) => [...instanceKeys.lists(), query] as const,
  details: () => [...instanceKeys.all, "detail"] as const,
  detail: (id: number) => [...instanceKeys.details(), id] as const,
  status: (id: number) => [...instanceKeys.all, "status", id] as const,
  history: (id: number, params?: { startTime?: number; endTime?: number }) => 
    [...instanceKeys.all, "history", id, params] as const,
};

/** 实例列表查询参数 */
export interface InstanceListQuery {
  page?: number;
  pageSize?: number;
  status?: number;
}

/**
 * 获取我的实例列表
 * GET /instances/my
 */
export function useMyInstances(query: InstanceListQuery = {}) {
  return useQuery<InstanceListResponse>({
    queryKey: instanceKeys.list(query),
    queryFn: () =>
      get("/instances/my", {
        params: {
          page: query.page?.toString(),
          pageSize: query.pageSize?.toString(),
          status: query.status?.toString(),
        },
      }),
  });
}

/**
 * 获取实例详情
 * GET /instances/:id
 */
export function useInstanceDetail(id: number) {
  return useQuery<InstanceDetail>({
    queryKey: instanceKeys.detail(id),
    queryFn: () => get(`/instances/${id}`),
    enabled: id > 0,
  });
}

/**
 * 获取实例实时状态
 * GET /instances/:id/status
 */
export function useInstanceStatus(id: number, options?: { refetchInterval?: number }) {
  return useQuery<InstanceStatusData>({
    queryKey: instanceKeys.status(id),
    queryFn: () => get(`/instances/${id}/status`),
    enabled: id > 0,
    refetchInterval: options?.refetchInterval ?? 30000, // 默认 30 秒刷新
  });
}

/**
 * 获取实例历史监控数据
 * GET /instances/:id/history
 */
export function useInstanceHistory(
  id: number,
  params?: { startTime?: number; endTime?: number }
) {
  return useQuery<InstanceHistoryResponse>({
    queryKey: instanceKeys.history(id, params),
    queryFn: () =>
      get(`/instances/${id}/history`, {
        params: {
          startTime: params?.startTime?.toString(),
          endTime: params?.endTime?.toString(),
        },
      }),
    enabled: id > 0,
  });
}

/**
 * 启动实例
 * POST /instances/:id/start
 */
export function useStartInstance() {
  const queryClient = useQueryClient();

  return useMutation<InstanceOperationResponse, Error, number>({
    mutationFn: (id) => post(`/instances/${id}/start`, {}),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: instanceKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: instanceKeys.status(id) });
    },
  });
}

/**
 * 停止实例
 * POST /instances/:id/stop
 */
export function useStopInstance() {
  const queryClient = useQueryClient();

  return useMutation<InstanceOperationResponse, Error, number>({
    mutationFn: (id) => post(`/instances/${id}/stop`, {}),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: instanceKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: instanceKeys.status(id) });
    },
  });
}

/**
 * 重启实例
 * POST /instances/:id/restart
 */
export function useRestartInstance() {
  const queryClient = useQueryClient();

  return useMutation<InstanceOperationResponse, Error, number>({
    mutationFn: (id) => post(`/instances/${id}/restart`, {}),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: instanceKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: instanceKeys.status(id) });
    },
  });
}

/**
 * 删除实例
 * DELETE /instances/:id
 */
export function useDeleteInstance() {
  const queryClient = useQueryClient();

  return useMutation<InstanceOperationResponse, Error, number>({
    mutationFn: (id) => del(`/instances/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: instanceKeys.lists() });
    },
  });
}

/**
 * 重装实例
 * POST /instances/:id/reinstall
 */
export function useReinstallInstance() {
  const queryClient = useQueryClient();

  return useMutation<
    InstanceOperationResponse,
    Error,
    { id: number; imageId?: number; password?: string }
  >({
    mutationFn: ({ id, imageId, password }) =>
      post(`/instances/${id}/reinstall`, { imageId, password }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: instanceKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: instanceKeys.status(id) });
    },
  });
}
