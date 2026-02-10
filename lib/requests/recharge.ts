/**
 * 充值 API 请求
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post } from "@/lib/api";
import type {
  Recharge,
  RechargeListQuery,
  RechargeListResponse,
  CreateRechargeRequest,
  CreateRechargeResponse,
} from "@/lib/types";

// Query keys
export const rechargeKeys = {
  all: ["recharges"] as const,
  lists: () => [...rechargeKeys.all, "list"] as const,
  list: (query: RechargeListQuery) => [...rechargeKeys.lists(), query] as const,
  details: () => [...rechargeKeys.all, "detail"] as const,
  detail: (id: number) => [...rechargeKeys.details(), id] as const,
};

/**
 * 创建充值
 * POST /recharge/create
 */
export function useCreateRecharge() {
  const queryClient = useQueryClient();

  return useMutation<CreateRechargeResponse, Error, CreateRechargeRequest>({
    mutationFn: (data) => post("/recharge/create", data),
    onSuccess: () => {
      // 创建成功后刷新充值列表
      queryClient.invalidateQueries({ queryKey: rechargeKeys.lists() });
    },
  });
}

/**
 * 获取我的充值记录
 * GET /recharge/my-recharges
 */
export function useMyRecharges(query: RechargeListQuery = {}) {
  return useQuery<RechargeListResponse>({
    queryKey: rechargeKeys.list(query),
    queryFn: () =>
      get("/recharge/my-recharges", {
        params: query,
      }),
  });
}

/**
 * 获取充值详情
 * GET /recharge/detail/:id
 */
export function useRechargeDetail(id: number) {
  return useQuery<Recharge>({
    queryKey: rechargeKeys.detail(id),
    queryFn: () => get(`/recharge/detail/${id}`),
    enabled: id > 0,
  });
}
