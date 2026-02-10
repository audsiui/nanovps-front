/**
 * 赠金码 API 请求
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post } from "@/lib/api";
import type {
  GiftCode,
  GiftCodeListQuery,
  GiftCodeListResponse,
  CreateGiftCodeRequest,
  UpdateGiftCodeRequest,
  DeleteGiftCodeRequest,
  GiftCodeUsageQuery,
  GiftCodeUsageResponse,
  UseGiftCodeRequest,
  UseGiftCodeResponse,
} from "@/lib/types";

// Query keys
export const giftCodeKeys = {
  all: ["gift-codes"] as const,
  lists: () => [...giftCodeKeys.all, "list"] as const,
  list: (query: GiftCodeListQuery) => [...giftCodeKeys.lists(), query] as const,
  details: () => [...giftCodeKeys.all, "detail"] as const,
  detail: (id: number) => [...giftCodeKeys.details(), id] as const,
  usages: () => [...giftCodeKeys.all, "usage"] as const,
  usageList: (query: GiftCodeUsageQuery) => [...giftCodeKeys.usages(), query] as const,
  myUsages: () => [...giftCodeKeys.all, "my-usages"] as const,
  myUsageList: (query: { page?: number; pageSize?: number }) =>
    [...giftCodeKeys.myUsages(), query] as const,
};

// ========== 管理员接口 ==========

/**
 * 获取赠金码列表（管理员）
 * GET /gift-codes/admin/list
 */
export function useGiftCodeList(query: GiftCodeListQuery = {}) {
  return useQuery<GiftCodeListResponse>({
    queryKey: giftCodeKeys.list(query),
    queryFn: () =>
      get("/gift-codes/admin/list", {
        params: query,
      }),
  });
}

/**
 * 获取赠金码详情（管理员）
 * GET /gift-codes/admin/detail/:id
 */
export function useGiftCodeDetail(id: number) {
  return useQuery<GiftCode>({
    queryKey: giftCodeKeys.detail(id),
    queryFn: () => get(`/gift-codes/admin/detail/${id}`),
    enabled: id > 0,
  });
}

/**
 * 创建赠金码（管理员）
 * POST /gift-codes/admin/create
 */
export function useCreateGiftCode() {
  const queryClient = useQueryClient();

  return useMutation<GiftCode, Error, CreateGiftCodeRequest>({
    mutationFn: (data) => post("/gift-codes/admin/create", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: giftCodeKeys.lists() });
    },
  });
}

/**
 * 更新赠金码（管理员）
 * POST /gift-codes/admin/update
 */
export function useUpdateGiftCode() {
  const queryClient = useQueryClient();

  return useMutation<GiftCode, Error, UpdateGiftCodeRequest>({
    mutationFn: (data) => post("/gift-codes/admin/update", data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: giftCodeKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: giftCodeKeys.detail(variables.id),
      });
    },
  });
}

/**
 * 删除赠金码（管理员）
 * POST /gift-codes/admin/delete
 */
export function useDeleteGiftCode() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteGiftCodeRequest>({
    mutationFn: (data) => post("/gift-codes/admin/delete", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: giftCodeKeys.lists() });
    },
  });
}

/**
 * 获取赠金码使用记录（管理员）
 * GET /gift-codes/admin/usage-records
 */
export function useGiftCodeUsageRecords(query: GiftCodeUsageQuery = {}) {
  return useQuery<GiftCodeUsageResponse>({
    queryKey: giftCodeKeys.usageList(query),
    queryFn: () =>
      get("/gift-codes/admin/usage-records", {
        params: query,
      }),
  });
}

// ========== 用户接口 ==========

/**
 * 使用赠金码
 * POST /gift-codes/use
 */
export function useUseGiftCode() {
  const queryClient = useQueryClient();

  return useMutation<UseGiftCodeResponse, Error, UseGiftCodeRequest>({
    mutationFn: (data) => post("/gift-codes/use", data),
    onSuccess: () => {
      // 使用后刷新使用记录
      queryClient.invalidateQueries({ queryKey: giftCodeKeys.myUsages() });
    },
  });
}

/**
 * 获取我的赠金码使用记录
 * GET /gift-codes/my-usages
 */
export function useMyGiftCodeUsages(query: { page?: number; pageSize?: number } = {}) {
  return useQuery<GiftCodeUsageResponse>({
    queryKey: giftCodeKeys.myUsageList(query),
    queryFn: () =>
      get("/gift-codes/my-usages", {
        params: query,
      }),
  });
}
