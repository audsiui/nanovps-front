import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post } from "@/lib/api";
import type {
  Image,
  ImageListQuery,
  ImageListResponse,
  CreateImageRequest,
  UpdateImageRequest,
  DeleteImageRequest,
} from "@/lib/types";

// Query keys
export const imageKeys = {
  all: ["images"] as const,
  lists: () => [...imageKeys.all, "list"] as const,
  list: (query: ImageListQuery) => [...imageKeys.lists(), query] as const,
  details: () => [...imageKeys.all, "detail"] as const,
  detail: (id: number) => [...imageKeys.details(), id] as const,
  available: () => [...imageKeys.all, "available"] as const,
};

/**
 * 获取可用镜像列表（用户端）
 * GET /images/available
 */
export function useAvailableImages() {
  return useQuery<ImageListResponse>({
    queryKey: imageKeys.available(),
    queryFn: () => get("/images/available"),
  });
}

/**
 * 获取镜像列表
 * GET /admin/images/list
 */
export function useImageList(query: ImageListQuery = {}) {
  return useQuery<ImageListResponse>({
    queryKey: imageKeys.list(query),
    queryFn: () =>
      get("/admin/images/list", {
        params: query,
      }),
  });
}

/**
 * 获取镜像详情
 * GET /admin/images/detail/{id}
 */
export function useImageDetail(id: number) {
  return useQuery<Image>({
    queryKey: imageKeys.detail(id),
    queryFn: () => get(`/admin/images/detail/${id}`),
    enabled: id > 0, // id 有效时才发起请求
  });
}

/**
 * 创建镜像
 * POST /admin/images/create
 */
export function useCreateImage() {
  const queryClient = useQueryClient();

  return useMutation<Image, Error, CreateImageRequest>({
    mutationFn: (data) => post("/admin/images/create", data),
    onSuccess: () => {
      // 创建成功后刷新列表
      queryClient.invalidateQueries({ queryKey: imageKeys.lists() });
    },
  });
}

/**
 * 更新镜像
 * POST /admin/images/update
 */
export function useUpdateImage() {
  const queryClient = useQueryClient();

  return useMutation<Image, Error, UpdateImageRequest>({
    mutationFn: (data) => post("/admin/images/update", data),
    onSuccess: (_, variables) => {
      // 更新成功后刷新列表和详情
      queryClient.invalidateQueries({ queryKey: imageKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: imageKeys.detail(variables.id),
      });
    },
  });
}

/**
 * 删除镜像
 * POST /admin/images/delete
 */
export function useDeleteImage() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteImageRequest>({
    mutationFn: (data) => post("/admin/images/delete", data),
    onSuccess: () => {
      // 删除成功后刷新列表
      queryClient.invalidateQueries({ queryKey: imageKeys.lists() });
    },
  });
}

/**
 * 切换镜像启用状态
 * 使用 update API 封装
 */
export function useToggleImageStatus() {
  const queryClient = useQueryClient();

  return useMutation<Image, Error, { id: number; isActive: boolean }>({
    mutationFn: ({ id, isActive }) =>
      post("/admin/images/update", { id, isActive }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: imageKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: imageKeys.detail(variables.id),
      });
    },
  });
}
