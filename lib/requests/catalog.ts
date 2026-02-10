import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api";
import type {
  CatalogRegion,
  CatalogPlanDetail,
} from "@/lib/types";

// Query keys
export const catalogKeys = {
  all: ["catalog"] as const,
  lists: () => [...catalogKeys.all, "list"] as const,
  detail: (id: number) => [...catalogKeys.all, "detail", id] as const,
};

/**
 * 获取完整产品目录
 * GET /catalog
 * 返回所有启用的区域及其在线节点和可售套餐的层级数据
 */
export function useCatalog() {
  return useQuery<CatalogRegion[]>({
    queryKey: catalogKeys.lists(),
    queryFn: () => get("/catalog"),
    staleTime: 5 * 60 * 1000, // 5分钟缓存
  });
}

/**
 * 获取指定区域的产品目录
 * GET /catalog/region/:id
 */
export function useCatalogByRegion(regionId: number) {
  return useQuery<CatalogRegion>({
    queryKey: [...catalogKeys.lists(), regionId],
    queryFn: () => get(`/catalog/region/${regionId}`),
    enabled: regionId > 0,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * 获取套餐详情
 * GET /catalog/plan/:id
 */
export function useCatalogPlanDetail(planId: number) {
  return useQuery<CatalogPlanDetail>({
    queryKey: catalogKeys.detail(planId),
    queryFn: () => get(`/catalog/plan/${planId}`),
    enabled: planId > 0,
    staleTime: 5 * 60 * 1000,
  });
}
