import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post } from "@/lib/api";
import type {
  PlanTemplate,
  PlanTemplateListQuery,
  PlanTemplateListResponse,
  CreatePlanTemplateRequest,
  UpdatePlanTemplateRequest,
  DeletePlanTemplateRequest,
} from "@/lib/types";

// Query keys
export const planTemplateKeys = {
  all: ["plan-templates"] as const,
  lists: () => [...planTemplateKeys.all, "list"] as const,
  list: (query: PlanTemplateListQuery) =>
    [...planTemplateKeys.lists(), query] as const,
  details: () => [...planTemplateKeys.all, "detail"] as const,
  detail: (id: number) => [...planTemplateKeys.details(), id] as const,
};

/**
 * 获取套餐模板列表
 * GET /admin/plan-templates/list
 */
export function usePlanTemplateList(query: PlanTemplateListQuery = {}) {
  return useQuery<PlanTemplateListResponse>({
    queryKey: planTemplateKeys.list(query),
    queryFn: () =>
      get("/admin/plan-templates/list", {
        params: query,
      }),
  });
}

/**
 * 获取套餐模板详情
 * GET /admin/plan-templates/detail/{id}
 */
export function usePlanTemplateDetail(id: number) {
  return useQuery<PlanTemplate>({
    queryKey: planTemplateKeys.detail(id),
    queryFn: () => get(`/admin/plan-templates/detail/${id}`),
    enabled: id > 0,
  });
}

/**
 * 创建套餐模板
 * POST /admin/plan-templates/create
 */
export function useCreatePlanTemplate() {
  const queryClient = useQueryClient();

  return useMutation<PlanTemplate, Error, CreatePlanTemplateRequest>({
    mutationFn: (data) => post("/admin/plan-templates/create", data),
    onSuccess: () => {
      // 创建成功后刷新列表
      queryClient.invalidateQueries({ queryKey: planTemplateKeys.lists() });
    },
  });
}

/**
 * 更新套餐模板
 * POST /admin/plan-templates/update
 */
export function useUpdatePlanTemplate() {
  const queryClient = useQueryClient();

  return useMutation<PlanTemplate, Error, UpdatePlanTemplateRequest>({
    mutationFn: (data) => post("/admin/plan-templates/update", data),
    onSuccess: (_, variables) => {
      // 更新成功后刷新列表和详情
      queryClient.invalidateQueries({ queryKey: planTemplateKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: planTemplateKeys.detail(variables.id),
      });
    },
  });
}

/**
 * 删除套餐模板
 * POST /admin/plan-templates/delete
 */
export function useDeletePlanTemplate() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeletePlanTemplateRequest>({
    mutationFn: (data) => post("/admin/plan-templates/delete", data),
    onSuccess: () => {
      // 删除成功后刷新列表
      queryClient.invalidateQueries({ queryKey: planTemplateKeys.lists() });
    },
  });
}
