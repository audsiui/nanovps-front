import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { QueryProvider } from '@/providers/query-provider';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'NanoVPS - 高性价比云服务器',
  description: 'NanoVPS 提供极致性价比的云服务器和 VPS 解决方案。比传统云服务商便宜 50%，价格亲民，性能卓越，全球节点覆盖，助力您的业务快速发展。',
  keywords: ['VPS', '云服务器', '云主机', 'NanoVPS', '云计算', '服务器租用', '便宜VPS', '高性价比'],
  authors: [{ name: 'NanoVPS' }],
  creator: 'NanoVPS',
  metadataBase: new URL('https://nanovps.io'),
  openGraph: {
    title: 'NanoVPS - 高性价比云服务器',
    description: '比传统云服务商便宜 50%，价格亲民，性能卓越，全球节点覆盖，助力您的业务快速发展。',
    type: 'website',
    locale: 'zh_CN',
    siteName: 'NanoVPS',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NanoVPS - 高性价比云服务器',
    description: '比传统云服务商便宜 50%，价格亲民，性能卓越，全球节点覆盖。',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head />
      <body>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster richColors position={'top-center'} />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
