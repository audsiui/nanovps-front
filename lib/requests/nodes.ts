import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post } from "@/lib/api";
import type {
  Node,
  NodeListQuery,
  NodeListResponse,
  CreateNodeRequest,
  UpdateNodeRequest,
} from "@/lib/types";

// Query keys
export const nodeKeys = {
  all: ["nodes"] as const,
  lists: () => [...nodeKeys.all, "list"] as const,
  list: (query: NodeListQuery) => [...nodeKeys.lists(), query] as const,
  details: () => [...nodeKeys.all, "detail"] as const,
  detail: (id: number) => [...nodeKeys.details(), id] as const,
};

/**
 * 获取节点列表
 * GET /admin/nodes/list
 */
export function useNodeList(query: NodeListQuery = {}) {
  return useQuery<NodeListResponse>({
    queryKey: nodeKeys.list(query),
    queryFn: () =>
      get("/admin/nodes/list", {
        params: query,
      }),
  });
}

/**
 * 获取节点详情
 * GET /admin/nodes/detail/{id}
 */
export function useNodeDetail(id: number) {
  return useQuery<Node>({
    queryKey: nodeKeys.detail(id),
    queryFn: () => get(`/admin/nodes/detail/${id}`),
    enabled: id > 0,
  });
}

/**
 * 创建节点
 * POST /admin/nodes/create
 */
export function useCreateNode() {
  const queryClient = useQueryClient();

  return useMutation<Node, Error, CreateNodeRequest>({
    mutationFn: (data) => post("/admin/nodes/create", data),
    onSuccess: () => {
      // 创建成功后刷新列表
      queryClient.invalidateQueries({ queryKey: nodeKeys.lists() });
    },
  });
}

/**
 * 更新节点
 * POST /admin/nodes/update
 */
export function useUpdateNode() {
  const queryClient = useQueryClient();

  return useMutation<Node, Error, UpdateNodeRequest>({
    mutationFn: (data) => post("/admin/nodes/update", data),
    onSuccess: (_, variables) => {
      // 更新成功后刷新列表和详情
      queryClient.invalidateQueries({ queryKey: nodeKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: nodeKeys.detail(variables.id),
      });
    },
  });
}
