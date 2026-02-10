/**
 * 优惠码 API 请求
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post } from "@/lib/api";
import type {
  PromoCode,
  PromoCodeListQuery,
  PromoCodeListResponse,
  CreatePromoCodeRequest,
  UpdatePromoCodeRequest,
  DeletePromoCodeRequest,
  PromoCodeUsageQuery,
  PromoCodeUsageResponse,
  ValidatePromoCodeQuery,
  ValidatePromoCodeResponse,
} from "@/lib/types";

// Query keys
export const promoCodeKeys = {
  all: ["promo-codes"] as const,
  lists: () => [...promoCodeKeys.all, "list"] as const,
  list: (query: PromoCodeListQuery) => [...promoCodeKeys.lists(), query] as const,
  details: () => [...promoCodeKeys.all, "detail"] as const,
  detail: (id: number) => [...promoCodeKeys.details(), id] as const,
  usages: () => [...promoCodeKeys.all, "usage"] as const,
  usageList: (query: PromoCodeUsageQuery) => [...promoCodeKeys.usages(), query] as const,
  myUsages: () => [...promoCodeKeys.all, "my-usages"] as const,
  myUsageList: (query: { page?: number; pageSize?: number }) =>
    [...promoCodeKeys.myUsages(), query] as const,
};

// ========== 管理员接口 ==========

/**
 * 获取优惠码列表（管理员）
 * GET /promo-codes/admin/list
 */
export function usePromoCodeList(query: PromoCodeListQuery = {}) {
  return useQuery<PromoCodeListResponse>({
    queryKey: promoCodeKeys.list(query),
    queryFn: () =>
      get("/promo-codes/admin/list", {
        params: query,
      }),
  });
}

/**
 * 获取优惠码详情（管理员）
 * GET /promo-codes/admin/detail/:id
 */
export function usePromoCodeDetail(id: number) {
  return useQuery<PromoCode>({
    queryKey: promoCodeKeys.detail(id),
    queryFn: () => get(`/promo-codes/admin/detail/${id}`),
    enabled: id > 0,
  });
}

/**
 * 创建优惠码（管理员）
 * POST /promo-codes/admin/create
 */
export function useCreatePromoCode() {
  const queryClient = useQueryClient();

  return useMutation<PromoCode, Error, CreatePromoCodeRequest>({
    mutationFn: (data) => post("/promo-codes/admin/create", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: promoCodeKeys.lists() });
    },
  });
}

/**
 * 更新优惠码（管理员）
 * POST /promo-codes/admin/update
 */
export function useUpdatePromoCode() {
  const queryClient = useQueryClient();

  return useMutation<PromoCode, Error, UpdatePromoCodeRequest>({
    mutationFn: (data) => post("/promo-codes/admin/update", data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: promoCodeKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: promoCodeKeys.detail(variables.id),
      });
    },
  });
}

/**
 * 删除优惠码（管理员）
 * POST /promo-codes/admin/delete
 */
export function useDeletePromoCode() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeletePromoCodeRequest>({
    mutationFn: (data) => post("/promo-codes/admin/delete", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: promoCodeKeys.lists() });
    },
  });
}

/**
 * 获取优惠码使用记录（管理员）
 * GET /promo-codes/admin/usage-records
 */
export function usePromoCodeUsageRecords(query: PromoCodeUsageQuery = {}) {
  return useQuery<PromoCodeUsageResponse>({
    queryKey: promoCodeKeys.usageList(query),
    queryFn: () =>
      get("/promo-codes/admin/usage-records", {
        params: query,
      }),
  });
}

// ========== 用户接口 ==========

/**
 * 验证优惠码（预览折扣）
 * GET /promo-codes/validate
 */
export function useValidatePromoCode() {
  return useMutation<ValidatePromoCodeResponse, Error, ValidatePromoCodeQuery>({
    mutationFn: (query) =>
      get("/promo-codes/validate", {
        params: query,
      }),
  });
}

/**
 * 获取我的优惠码使用记录
 * GET /promo-codes/my-usages
 */
export function useMyPromoCodeUsages(query: { page?: number; pageSize?: number } = {}) {
  return useQuery<PromoCodeUsageResponse>({
    queryKey: promoCodeKeys.myUsageList(query),
    queryFn: () =>
      get("/promo-codes/my-usages", {
        params: query,
      }),
  });
}
