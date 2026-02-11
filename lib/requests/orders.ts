/**
 * 订单 API 请求
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post } from "@/lib/api";
import type {
  Order,
  OrderDetail,
  OrderListQuery,
  OrderListResponse,
  CalculateOrderQuery,
  CalculateOrderResponse,
  CreateOrderRequest,
  CreateOrderResponse,
} from "@/lib/types";

// Query keys
export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (query: OrderListQuery) => [...orderKeys.lists(), query] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: number) => [...orderKeys.details(), id] as const,
  calculate: () => [...orderKeys.all, "calculate"] as const,
};

/**
 * 计算订单金额（预览）
 * GET /orders/calculate
 */
export function useCalculateOrder() {
  return useMutation<CalculateOrderResponse, Error, CalculateOrderQuery>({
    mutationFn: (query) =>
      get("/orders/calculate", {
        params: query,
      }),
  });
}

/**
 * 创建订单
 * POST /orders/create
 */
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation<CreateOrderResponse, Error, CreateOrderRequest>({
    mutationFn: (data) => post("/orders/create", data),
    onSuccess: () => {
      // 创建成功后刷新订单列表
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
}

/**
 * 获取我的订单列表
 * GET /orders/my-orders
 */
export function useMyOrders(query: OrderListQuery = {}) {
  return useQuery<OrderListResponse>({
    queryKey: orderKeys.list(query),
    queryFn: () =>
      get("/orders/my-orders", {
        params: query,
      }),
  });
}

/**
 * 获取订单详情
 * GET /orders/detail/:id
 */
export function useOrderDetail(id: number) {
  return useQuery<OrderDetail>({
    queryKey: orderKeys.detail(id),
    queryFn: () => get(`/orders/detail/${id}`),
    enabled: id > 0,
  });
}
