/**
 * NAT 端口映射 API 请求
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post, del } from "@/lib/api";
import type { NatPortMapping } from "@/lib/types";

// Query keys
export const natPortKeys = {
  all: ["nat-ports"] as const,
  lists: () => [...natPortKeys.all, "list"] as const,
  list: (instanceId: number) => [...natPortKeys.lists(), instanceId] as const,
};

/**
 * 获取实例的端口映射列表
 */
export function useNatPorts(instanceId: number) {
  return useQuery<{ list: NatPortMapping[]; total: number }>({
    queryKey: natPortKeys.list(instanceId),
    queryFn: () => get(`/nat-ports/instance/${instanceId}`),
    enabled: instanceId > 0,
  });
}

/**
 * 校验端口是否可用
 */
export function useValidatePort() {
  return useMutation<
    { available: boolean; message: string },
    Error,
    { instanceId: number; externalPort: number; protocol: 'tcp' | 'udp' }
  >({
    mutationFn: (params) => {
      const searchParams = new URLSearchParams({
        instanceId: String(params.instanceId),
        externalPort: String(params.externalPort),
        protocol: params.protocol,
      });
      return get(`/nat-ports/validate?${searchParams}`);
    },
  });
}

/**
 * 创建端口映射
 */
export function useCreateNatPort() {
  const queryClient = useQueryClient();

  return useMutation<
    NatPortMapping,
    Error,
    {
      instanceId: number;
      protocol: "tcp" | "udp";
      internalPort: number;
      externalPort: number;
      description?: string;
    }
  >({
    mutationFn: (data) => post("/nat-ports", data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: natPortKeys.list(variables.instanceId),
      });
    },
  });
}

/**
 * 删除端口映射
 */
export function useDeleteNatPort() {
  const queryClient = useQueryClient();

  return useMutation<{ status: string }, Error, { id: number; instanceId: number }>({
    mutationFn: ({ id }) => del(`/nat-ports/${id}`),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: natPortKeys.list(variables.instanceId),
      });
    },
  });
}
