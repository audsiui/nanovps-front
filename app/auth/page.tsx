'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Loader2,
  Github,
  Mail,
  Lock,
  ArrowLeft,
  Chrome, // 用作 Google 图标的替代
} from 'lucide-react';
import Link from 'next/link';

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);

  // 模拟登录/注册处理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // 模拟网络请求
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background font-sans selection:bg-primary/20 selection:text-primary relative overflow-hidden">
      {/* --- 背景特效 (保持与首页一致) --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="absolute bottom-0 left-[20%] w-[30%] h-[30%] rounded-full bg-muted/20 blur-[80px]" />
      </div>
      
      {/* 网格背景 */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.15] pointer-events-none" />

      {/* --- 返回首页按钮 --- */}
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors z-20"
      >
        <ArrowLeft className="w-4 h-4" />
        返回首页
      </Link>

      {/* --- 主体卡片 --- */}
      <div className="relative z-10 w-full max-w-md px-4">
        
        {/* Logo 展示 */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2 group cursor-default">
            <div className="relative h-10 w-10 transition-transform duration-300 group-hover:scale-110">
              <Image
                src="/logo.png"
                alt="NanoVPS"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">
              Nano<span className="text-primary">VPS</span>
            </span>
          </Link>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 h-12 bg-muted/50 backdrop-blur-sm p-1">
            <TabsTrigger value="login" className="text-sm font-medium transition-all duration-300">登录</TabsTrigger>
            <TabsTrigger value="register" className="text-sm font-medium transition-all duration-300">注册账户</TabsTrigger>
          </TabsList>

          {/* === 登录面板 === */}
          <TabsContent value="login">
            <Card className="border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight">欢迎回来</CardTitle>
                <CardDescription>
                  输入您的邮箱以访问控制台
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-login">邮箱地址</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="email-login" 
                        placeholder="name@example.com" 
                        type="email" 
                        className="pl-9 bg-background/50 border-border/50 focus:bg-background transition-colors"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password-login">密码</Label>
                      <Link 
                        href="#" 
                        className="text-xs text-primary hover:text-primary/80 underline-offset-4 hover:underline"
                      >
                        忘记密码?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="password-login" 
                        type="password" 
                        className="pl-9 bg-background/50 border-border/50 focus:bg-background transition-colors"
                        required
                      />
                    </div>
                  </div>
                  <Button className="w-full bg-primary font-semibold shadow-lg shadow-primary/20" type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "立即登录"
                    )}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/50" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      或者通过以下方式
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="border-border/50 hover:bg-muted/50 hover:border-primary/30 transition-all">
                    <Github className="mr-2 h-4 w-4" />
                    Github
                  </Button>
                  <Button variant="outline" className="border-border/50 hover:bg-muted/50 hover:border-primary/30 transition-all">
                    <Chrome className="mr-2 h-4 w-4" />
                    Google
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* === 注册面板 === */}
          <TabsContent value="register">
            <Card className="border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight">创建账户</CardTitle>
                <CardDescription>
                  注册即送 $10 体验金，无需信用卡
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-register">邮箱地址</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="email-register" 
                        placeholder="name@example.com" 
                        type="email" 
                        className="pl-9 bg-background/50 border-border/50 focus:bg-background transition-colors"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-register">设置密码</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="password-register" 
                        type="password" 
                        placeholder="至少 8 位字符"
                        className="pl-9 bg-background/50 border-border/50 focus:bg-background transition-colors"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* 服务条款勾选 */}
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox id="terms" required />
                    <Label 
                      htmlFor="terms" 
                      className="text-sm text-muted-foreground font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      我已阅读并同意{' '}
                      <Link href="#" className="text-primary hover:underline">
                        服务条款
                      </Link>{' '}
                      和{' '}
                      <Link href="#" className="text-primary hover:underline">
                        隐私政策
                      </Link>
                    </Label>
                  </div>

                  <Button className="w-full bg-primary font-semibold shadow-lg shadow-primary/20" type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "创建账户"
                    )}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/50" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      第三方账号注册
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="border-border/50 hover:bg-muted/50 hover:border-primary/30 transition-all">
                    <Github className="mr-2 h-4 w-4" />
                    Github
                  </Button>
                  <Button variant="outline" className="border-border/50 hover:bg-muted/50 hover:border-primary/30 transition-all">
                    <Chrome className="mr-2 h-4 w-4" />
                    Google
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}