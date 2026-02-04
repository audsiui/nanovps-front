'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Loader2,
  Mail,
  Lock,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { useLogin, useRegister } from '@/lib/requests/auth';
import { useAuth } from '@/contexts/auth-context';
import { GuestGuard } from '@/components/auth-guard';
import { toast } from 'sonner';
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from '@/components/ui/field';

// 登录表单验证 Schema
const loginSchema = z.object({
  email: z.string().min(1, '请输入邮箱').email('邮箱格式不正确'),
  password: z.string().min(1, '请输入密码'),
});

// 注册表单验证 Schema
const registerSchema = z.object({
  email: z.string().min(1, '请输入邮箱').email('邮箱格式不正确'),
  password: z.string().min(8, '密码至少需要 8 位字符'),
  terms: z.boolean().refine((val) => val === true, {
    message: '请同意服务条款和隐私政策',
  }),
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <GuestGuard adminRedirect="/admin/dashboard" userRedirect="/dashboard">
      <AuthPageContent activeTab={activeTab} setActiveTab={setActiveTab} />
    </GuestGuard>
  );
}

function AuthPageContent({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const { login } = useAuth();

  // 登录表单
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // 注册表单
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      terms: false,
    },
  });

  // 登录 mutation
  const loginMutation = useLogin({
    onSuccess: (data) => {
      login({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresIn: data.expiresIn,
        user: data.user,
      });
      toast.success('登录成功');
    },
    onError: (error) => {
      toast.error(error.message || '登录失败');
    },
  });

  // 注册 mutation
  const registerMutation = useRegister({
    onSuccess: () => {
      toast.success('注册成功，请登录');
      setActiveTab('login');
      registerForm.reset();
    },
    onError: (error) => {
      toast.error(error.message || '注册失败');
    },
  });

  // 登录提交
  const onLoginSubmit = (data: LoginFormData) => {
    loginMutation.mutate({
      email: data.email,
      password: data.password,
    });
  };

  // 注册提交
  const onRegisterSubmit = (data: RegisterFormData) => {
    registerMutation.mutate({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background font-sans selection:bg-primary/20 selection:text-primary relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="absolute bottom-0 left-[20%] w-[30%] h-[30%] rounded-full bg-muted/20 blur-[80px]" />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.15] pointer-events-none" />

      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors z-20"
      >
        <ArrowLeft className="w-4 h-4" />
        返回首页
      </Link>

      <div className="relative z-10 w-full max-w-md px-4">
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 h-12 bg-muted/50 backdrop-blur-sm p-1">
            <TabsTrigger value="login" className="text-sm font-medium transition-all duration-300">登录</TabsTrigger>
            <TabsTrigger value="register" className="text-sm font-medium transition-all duration-300">注册账户</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight">欢迎回来</CardTitle>
                <CardDescription>
                  输入您的邮箱以访问控制台
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
                  <FieldGroup className="gap-4">
                    <Field data-invalid={!!loginForm.formState.errors.email}>
                      <FieldLabel htmlFor="email-login">
                        邮箱地址 <span className="text-destructive">*</span>
                      </FieldLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email-login"
                          placeholder="name@example.com"
                          type="email"
                          className="pl-9 bg-background/50 border-border/50 focus:bg-background transition-colors"
                          {...loginForm.register('email')}
                          aria-invalid={!!loginForm.formState.errors.email}
                        />
                      </div>
                      {loginForm.formState.errors.email && (
                        <FieldError errors={[loginForm.formState.errors.email]} />
                      )}
                    </Field>

                    <Field data-invalid={!!loginForm.formState.errors.password}>
                      <div className="flex items-center justify-between">
                        <FieldLabel htmlFor="password-login">
                          密码 <span className="text-destructive">*</span>
                        </FieldLabel>
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
                          {...loginForm.register('password')}
                          aria-invalid={!!loginForm.formState.errors.password}
                        />
                      </div>
                      {loginForm.formState.errors.password && (
                        <FieldError errors={[loginForm.formState.errors.password]} />
                      )}
                    </Field>

                    <Button
                      className="w-full bg-primary font-semibold shadow-lg shadow-primary/20"
                      type="submit"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        '立即登录'
                      )}
                    </Button>
                  </FieldGroup>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card className="border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight">创建账户</CardTitle>
                <CardDescription>
                  极致性价比，比传统云服务器便宜 50%，低价高质
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
                  <FieldGroup className="gap-4">
                    <Field data-invalid={!!registerForm.formState.errors.email}>
                      <FieldLabel htmlFor="email-register">
                        邮箱地址 <span className="text-destructive">*</span>
                      </FieldLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email-register"
                          placeholder="name@example.com"
                          type="email"
                          className="pl-9 bg-background/50 border-border/50 focus:bg-background transition-colors"
                          {...registerForm.register('email')}
                          aria-invalid={!!registerForm.formState.errors.email}
                        />
                      </div>
                      {registerForm.formState.errors.email && (
                        <FieldError errors={[registerForm.formState.errors.email]} />
                      )}
                    </Field>

                    <Field data-invalid={!!registerForm.formState.errors.password}>
                      <FieldLabel htmlFor="password-register">
                        设置密码 <span className="text-destructive">*</span>
                      </FieldLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password-register"
                          type="password"
                          placeholder="至少 8 位字符"
                          className="pl-9 bg-background/50 border-border/50 focus:bg-background transition-colors"
                          {...registerForm.register('password')}
                          aria-invalid={!!registerForm.formState.errors.password}
                        />
                      </div>
                      {registerForm.formState.errors.password && (
                        <FieldError errors={[registerForm.formState.errors.password]} />
                      )}
                    </Field>

                    <Field
                      orientation="horizontal"
                      data-invalid={!!registerForm.formState.errors.terms}
                    >
                      <Checkbox
                        id="terms"
                        checked={registerForm.watch('terms')}
                        onCheckedChange={(checked) =>
                          registerForm.setValue('terms', checked as boolean)
                        }
                      />
                      <FieldLabel
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
                      </FieldLabel>
                    </Field>
                    {registerForm.formState.errors.terms && (
                      <FieldError errors={[registerForm.formState.errors.terms]} />
                    )}

                    <Button
                      className="w-full bg-primary font-semibold shadow-lg shadow-primary/20"
                      type="submit"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        '创建账户'
                      )}
                    </Button>
                  </FieldGroup>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
