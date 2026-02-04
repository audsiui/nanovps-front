import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { post } from "@/lib/api";
import type { User, LoginRequest, RegisterRequest, LoginResponse } from "@/lib/types";

// 用户登录
export function useLogin(
  options?: Omit<UseMutationOptions<LoginResponse, Error, LoginRequest>, "mutationFn">
) {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: (data) => post<LoginResponse>("/auth/login", data),
    ...options,
  });
}

// 用户注册
export function useRegister(
  options?: Omit<UseMutationOptions<User, Error, RegisterRequest>, "mutationFn">
) {
  return useMutation<User, Error, RegisterRequest>({
    mutationFn: (data) => post<User>("/auth/register", data),
    ...options,
  });
}

// 用户登出（普通函数，非 hook，用于直接调用）
export async function logoutApi(refreshToken: string): Promise<void> {
  await post("/auth/logout", { refreshToken });
}
