import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post } from "@/lib/api";
import type {
  Region,
  RegionListQuery,
  RegionListResponse,
  CreateRegionRequest,
  UpdateRegionRequest,
  DeleteRegionRequest,
} from "@/lib/types";

// Query keys
export const regionKeys = {
  all: ["regions"] as const,
  lists: () => [...regionKeys.all, "list"] as const,
  list: (query: RegionListQuery) => [...regionKeys.lists(), query] as const,
  details: () => [...regionKeys.all, "detail"] as const,
  detail: (id: number) => [...regionKeys.details(), id] as const,
};

/**
 * 获取区域列表
 * GET /admin/regions/list
 */
export function useRegionList(query: RegionListQuery = {}) {
  return useQuery<RegionListResponse>({
    queryKey: regionKeys.list(query),
    queryFn: () =>
      get("/admin/regions/list", {
        params: query,
      }),
  });
}

/**
 * 获取区域详情
 * GET /admin/regions/detail/{id}
 */
export function useRegionDetail(id: number) {
  return useQuery<Region>({
    queryKey: regionKeys.detail(id),
    queryFn: () => get(`/admin/regions/detail/${id}`),
    enabled: id > 0, // id 有效时才发起请求
  });
}

/**
 * 创建区域
 * POST /admin/regions/create
 */
export function useCreateRegion() {
  const queryClient = useQueryClient();

  return useMutation<Region, Error, CreateRegionRequest>({
    mutationFn: (data) => post("/admin/regions/create", data),
    onSuccess: () => {
      // 创建成功后刷新列表
      queryClient.invalidateQueries({ queryKey: regionKeys.lists() });
    },
  });
}

/**
 * 更新区域
 * POST /admin/regions/update
 */
export function useUpdateRegion() {
  const queryClient = useQueryClient();

  return useMutation<Region, Error, UpdateRegionRequest>({
    mutationFn: (data) => post("/admin/regions/update", data),
    onSuccess: (_, variables) => {
      // 更新成功后刷新列表和详情
      queryClient.invalidateQueries({ queryKey: regionKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: regionKeys.detail(variables.id),
      });
    },
  });
}

/**
 * 删除区域
 * POST /admin/regions/delete
 */
export function useDeleteRegion() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteRegionRequest>({
    mutationFn: (data) => post("/admin/regions/delete", data),
    onSuccess: () => {
      // 删除成功后刷新列表
      queryClient.invalidateQueries({ queryKey: regionKeys.lists() });
    },
  });
}

/**
 * 切换区域启用状态
 * 使用 update API 封装
 */
export function useToggleRegionStatus() {
  const queryClient = useQueryClient();

  return useMutation<Region, Error, { id: number; isActive: boolean }>({
    mutationFn: ({ id, isActive }) =>
      post("/admin/regions/update", { id, isActive }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: regionKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: regionKeys.detail(variables.id),
      });
    },
  });
}
