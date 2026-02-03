"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, type ReactNode } from "react";

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 数据过期时间（5分钟）
            staleTime: 5 * 60 * 1000,
            // 缓存垃圾回收时间（10分钟）
            gcTime: 10 * 60 * 1000,
            // 窗口重新获得焦点时刷新数据
            refetchOnWindowFocus: false,
            // 网络重连时刷新数据
            refetchOnReconnect: true,
            // 组件挂载时如果数据过期则重新获取
            refetchOnMount: true,
            // 失败重试次数
            retry: 1,
            // 重试延迟
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
          },
          mutations: {
            // 失败重试次数
            retry: 0,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
