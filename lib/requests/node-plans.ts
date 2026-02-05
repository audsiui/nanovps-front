import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post } from "@/lib/api";
import type {
  NodePlan,
  NodePlanListQuery,
  NodePlanListResponse,
  CreateNodePlanRequest,
  UpdateNodePlanRequest,
  DeleteNodePlanRequest,
} from "@/lib/types";

// Query keys
export const nodePlanKeys = {
  all: ["node-plans"] as const,
  lists: () => [...nodePlanKeys.all, "list"] as const,
  list: (nodeId: number, query: NodePlanListQuery) =>
    [...nodePlanKeys.lists(), nodeId, query] as const,
  details: () => [...nodePlanKeys.all, "detail"] as const,
  detail: (id: number) => [...nodePlanKeys.details(), id] as const,
};

/**
 * 获取指定节点的套餐列表
 * GET /admin/node-plans/node/{nodeId}
 */
export function useNodePlanList(nodeId: number, query: NodePlanListQuery = {}) {
  return useQuery<NodePlanListResponse>({
    queryKey: nodePlanKeys.list(nodeId, query),
    queryFn: () =>
      get(`/admin/node-plans/node/${nodeId}`, {
        params: query,
      }),
    enabled: nodeId > 0,
  });
}

/**
 * 创建服务器套餐
 * POST /admin/node-plans/create
 */
export function useCreateNodePlan() {
  const queryClient = useQueryClient();

  return useMutation<NodePlan, Error, CreateNodePlanRequest>({
    mutationFn: (data) => post("/admin/node-plans/create", data),
    onSuccess: (_, variables) => {
      // 创建成功后刷新列表
      queryClient.invalidateQueries({
        queryKey: nodePlanKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: nodePlanKeys.list(variables.nodeId, {}),
      });
    },
  });
}

/**
 * 更新服务器套餐
 * POST /admin/node-plans/update
 */
export function useUpdateNodePlan() {
  const queryClient = useQueryClient();

  return useMutation<NodePlan, Error, UpdateNodePlanRequest>({
    mutationFn: (data) => post("/admin/node-plans/update", data),
    onSuccess: () => {
      // 更新成功后刷新列表
      queryClient.invalidateQueries({ queryKey: nodePlanKeys.lists() });
    },
  });
}

/**
 * 删除服务器套餐
 * POST /admin/node-plans/delete
 */
export function useDeleteNodePlan() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteNodePlanRequest>({
    mutationFn: (data) => post("/admin/node-plans/delete", data),
    onSuccess: () => {
      // 删除成功后刷新列表
      queryClient.invalidateQueries({ queryKey: nodePlanKeys.lists() });
    },
  });
}
