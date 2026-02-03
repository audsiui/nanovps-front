'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ModeToggle } from '@/components/theme-toggle';
import {
  Cpu,
  Shield,
  Zap,
  Terminal,
  ChevronDown,
  Server,
  Globe,
  Activity,
  Menu,
  X,
} from 'lucide-react';

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 监听页面滚动以改变导航栏样式
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#features', label: '产品特性' },
    { href: '#architecture', label: '架构设计' },
    { href: '#intro', label: '产品简介' },
  ];

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20 selection:text-primary overflow-x-hidden">
      {/* Navigation */}
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-xs'
            : 'bg-transparent border-transparent'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex cursor-pointer items-center gap-2 group z-50">
              <div className="relative h-8 w-8 transition-transform duration-300 group-hover:scale-110">
                <Image
                  src="/logo.png"
                  alt="NanoVPS"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                Nano<span className="text-primary">VPS</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="relative text-sm font-medium text-muted-foreground transition-colors hover:text-primary group py-2"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
              <Button
                asChild
                size="sm"
                className="bg-primary shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Link href="/auth">立即开始</Link>
              </Button>
              <ModeToggle />
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center gap-4 md:hidden">
              <ModeToggle />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-foreground p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-background/95 backdrop-blur-xl border-b border-border/50 p-4 flex flex-col gap-4 animate-in slide-in-from-top-5 shadow-xl">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-lg font-medium text-foreground hover:text-primary p-2 rounded-md hover:bg-muted transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Button className="w-full bg-primary text-primary-foreground shadow-lg shadow-primary/25">
              立即开始
            </Button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-24 pb-12 bg-background">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute -bottom-[40%] -right-[20%] w-[70%] h-[70%] rounded-full bg-blue-500/10 blur-[120px]" />
          <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-muted/50 blur-[100px]" />
        </div>

        {/* FIXED: Grid Pattern Syntax Corrected */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.15]" />

        {/* Floating Elements */}
        <div className="absolute top-32 left-10 w-20 h-20 border border-primary/20 rounded-2xl rotate-12 opacity-20 animate-pulse hidden lg:block" />
        <div className="absolute bottom-32 right-10 w-16 h-16 border border-primary/20 rounded-full opacity-20 animate-pulse delay-700 hidden lg:block" />

        <div className="relative z-10 px-4 text-center sm:px-6 lg:px-8 max-w-6xl mx-auto flex flex-col items-center">
          {/* Badge */}
          <div className="mb-8 inline-flex">
            <Badge
              variant="secondary"
              className="px-4 py-2 text-sm font-medium bg-secondary/50 backdrop-blur-sm border border-primary/20 shadow-xs hover:scale-105 transition-transform duration-300 cursor-default rounded-full"
            >
              <span className="mr-2 relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Next-Gen Cloud Infrastructure
            </Badge>
          </div>

          {/* Main Headline */}
          <h1 className="mb-6 text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] text-foreground">
            新一代轻量云服务器
            <br />
            {/* FIXED: Gradient Syntax */}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-blue-500/60">
              秒级启动，极致性能
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mb-4 text-xl sm:text-2xl font-light tracking-tight text-foreground/80 font-mono">
            Less Overhead, More Performance.
          </p>
          <p className="mx-auto mb-12 max-w-2xl text-base sm:text-lg leading-relaxed text-muted-foreground">
            告别传统虚拟化的臃肿与等待。NanoVPS 提供毫秒级交付的完整 Linux
            环境，
            <br className="hidden md:block" />
            让开发者专注于创造，而非等待。
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row w-full sm:w-auto">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto relative overflow-hidden rounded-full px-8 text-lg font-semibold shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-1 bg-primary text-primary-foreground"
            >
              <Link href="/auth">免费试用</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto rounded-full px-8 text-lg font-semibold border-2 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 bg-background/50 backdrop-blur-sm"
            >
              查看演示
            </Button>
          </div>

          {/* Dashboard Preview */}
          <div className="relative mx-auto mt-20 max-w-5xl w-full group perspective-1000">
            {/* FIXED: Gradient Syntax */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-primary/50 to-blue-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500"></div>
            <Card className="relative overflow-hidden shadow-2xl border border-border/50 bg-card/80 backdrop-blur-md">
              {/* Window Controls */}
              <div className="flex items-center gap-2 border-b border-border/50 px-6 py-4 bg-muted/50">
                <div className="h-3 w-3 rounded-full bg-red-500/80 shadow-sm" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80 shadow-sm" />
                <div className="h-3 w-3 rounded-full bg-green-500/80 shadow-sm" />
                <div className="ml-4 flex-1 text-center pr-12">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-background/50 text-xs text-muted-foreground font-mono border border-border/50 shadow-xs">
                    <Globe className="w-3 h-3" />
                    console.nanovps.io
                  </div>
                </div>
              </div>

              {/* FIXED: Gradient Syntax */}
              <CardContent className="grid gap-8 p-8 md:grid-cols-3 bg-gradient-to-b from-card/50 to-muted/20">
                <div className="space-y-6 md:col-span-2">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="h-4 w-1/3 rounded-full bg-muted/80 animate-pulse" />
                      <div className="h-4 w-16 rounded-full bg-primary/20" />
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted/50" />
                    <div className="h-2 w-2/3 rounded-full bg-muted/50" />
                  </div>

                  {/* Stats Grid */}
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <Card className="relative overflow-hidden bg-primary/5 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                          <Zap className="w-5 h-5 text-primary" />
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            启动时间
                          </span>
                        </div>
                        <div className="font-mono text-3xl font-bold text-primary">
                          0.3s
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          比传统快 150 倍
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden bg-secondary/30 border-border hover:border-primary/30 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                          <Activity className="w-5 h-5 text-primary" />
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            可用性
                          </span>
                        </div>
                        <div className="font-mono text-3xl font-bold text-foreground">
                          99.9%
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          SLA 保证
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Side Panel */}
                <Card className="p-4 shadow-none bg-muted/30 border-dashed border-border/60">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border/50 shadow-xs">
                      <Server className="w-4 h-4 text-muted-foreground" />
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-primary/80 rounded-full" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border/50 shadow-xs">
                      <Cpu className="w-4 h-4 text-muted-foreground" />
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full w-1/2 bg-primary/80 rounded-full" />
                      </div>
                    </div>
                    <div className="h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center gap-2 text-xs font-medium text-green-600 dark:text-green-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      运行正常
                    </div>
                  </div>
                </Card>
              </CardContent>
            </Card>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
            <ChevronDown className="w-6 h-6 text-muted-foreground/50" />
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section
        id="intro"
        className="relative bg-background py-32 overflow-hidden"
      >
        {/* FIXED: Gradient Syntax */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div className="space-y-8">
              <div>
                <Badge
                  variant="outline"
                  className="mb-4 border-primary/30 text-primary"
                >
                  产品介绍
                </Badge>
                <h2 className="mb-6 text-3xl font-bold leading-tight text-foreground md:text-5xl">
                  轻盈却不失强大
                  <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                    云服务器的新标准
                  </span>
                </h2>
                <Separator className="mt-6 w-32 bg-gradient-to-r from-primary to-transparent" />
              </div>

              <p className="text-lg leading-relaxed text-muted-foreground">
                NanoVPS
                专为开发者和云服务商设计，摒弃传统虚拟化的沉重包袱。我们利用先进的容器技术，在极简架构上构建企业级服务，让您用更少的资源，获得更高的性能。
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                {[
                  {
                    title: '资源独享',
                    desc: '硬性资源隔离，告别邻居干扰',
                    icon: <Shield className="w-4 h-4" />,
                  },
                  {
                    title: '弹性扩展',
                    desc: '热插拔配置，无需停机',
                    icon: <Activity className="w-4 h-4" />,
                  },
                  {
                    title: '完整系统',
                    desc: '支持 SSH 的完整 Linux 体验',
                    icon: <Terminal className="w-4 h-4" />,
                  },
                  {
                    title: '极简管理',
                    desc: '直观控制面板，一键部署',
                    icon: <Zap className="w-4 h-4" />,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-4 group p-4 rounded-xl hover:bg-muted/50 transition-all duration-300 hover:shadow-xs border border-transparent hover:border-border/50"
                  >
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-xs group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </h4>
                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Card */}
            <div className="relative group">
              {/* FIXED: Gradient Syntax */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary/20 via-primary/10 to-blue-500/20 blur-2xl opacity-60 group-hover:opacity-80 transition duration-500" />
              <Card className="relative overflow-hidden shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />
                <CardHeader className="relative px-8 pt-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">性能对比</CardTitle>
                      <CardDescription className="mt-2">
                        同等配置下的表现差异
                      </CardDescription>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-secondary text-secondary-foreground"
                    >
                      基准测试
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="relative space-y-8 px-8 pb-8">
                  {/* Traditional VPS Bar */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground font-medium">
                        传统虚拟化
                      </span>
                      <span className="text-muted-foreground font-mono">
                        45s
                      </span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full w-full bg-muted-foreground/20 rounded-full" />
                    </div>
                  </div>

                  {/* NanoVPS Bar */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="font-bold text-foreground flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary fill-primary" />
                        NanoVPS
                      </span>
                      <span className="font-bold text-primary font-mono text-lg">
                        0.3s
                      </span>
                    </div>
                    <div className="h-4 w-full rounded-full bg-muted overflow-hidden shadow-inner">
                      <div className="h-full w-[8%] bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      基于容器化技术的极速启动
                    </p>
                  </div>

                  <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-6 text-center divide-x divide-border/50">
                    {[
                      { value: '10x', label: '更快启动' },
                      { value: '50%', label: '更低延迟' },
                      { value: '0%', label: '性能损耗' },
                    ].map((stat, i) => (
                      <div key={i} className="group/stat px-2">
                        <div className="text-2xl sm:text-3xl font-bold text-primary font-mono group-hover/stat:scale-110 transition-transform duration-300">
                          {stat.value}
                        </div>
                        <div className="mt-1 text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wider">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="relative py-32 overflow-hidden bg-muted/30"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-20 text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              核心优势
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-5xl tracking-tight">
              为什么选择 <span className="text-primary">NanoVPS</span>
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
              精心打造的四大核心能力，为您的业务提供稳固基石
            </p>
            <Separator className="mx-auto mt-8 max-w-xs bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {[
              {
                icon: Zap,
                title: '极速启动',
                desc: '毫秒级实例交付，即开即用。无论是临时测试环境还是突发业务扩容，都能在最短时间内就绪，让等待成为历史。',
              },
              {
                icon: Shield,
                title: '安全可靠',
                desc: '企业级资源隔离技术，确保您的数据与应用完全独立。银行级的安全标准，守护每一份重要数据。',
              },
              {
                icon: Activity,
                title: '灵活配置',
                desc: '支持不重启调整网络与资源，业务零中断。动态适应您的业务需求，无论是 Web 服务还是游戏服务器都能轻松驾驭。',
              },
              {
                icon: Terminal,
                title: '原生体验',
                desc: '提供完整的操作系统体验，包括独立进程管理与 SSH 访问。这不仅仅是一个容器，而是一台真正的云服务器。',
              },
            ].map((feature, i) => (
              <Card
                key={i}
                className="group relative overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-primary/30"
              >
                <div className="relative p-8 h-full flex flex-col">
                  {/* Icon */}
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                    <feature.icon className="h-7 w-7" />
                  </div>

                  <CardTitle className="mb-3 text-2xl group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed text-muted-foreground flex-1">
                    {feature.desc}
                  </CardDescription>

                  {/* Hover Arrow */}
                  <div className="mt-6 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transform -translate-x-2.5 group-hover:translate-x-0 transition-all duration-300">
                    了解更多
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section
        id="architecture"
        className="relative bg-background py-32 overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-20 text-center">
            <Badge
              variant="outline"
              className="mb-4 border-primary/30 text-primary"
            >
              技术架构
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-5xl">
              简洁架构，强大功能
            </h2>
            <p className="text-muted-foreground text-lg">
              三层极简设计，高效协同工作
            </p>
          </div>

          <div className="relative">
            {/* Connection Lines */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-border to-transparent z-0" />

            <div className="grid gap-8 lg:grid-cols-3 relative z-10">
              {[
                {
                  icon: Globe,
                  title: '控制中心',
                  subtitle: 'Nano Hub',
                  desc: '统一的云端管理界面，集资源调度、计费和监控于一体。通过 RESTful API 轻松集成到您的业务系统。',
                  step: '01',
                },
                {
                  icon: Server,
                  title: '边缘节点',
                  subtitle: 'Nano Agent',
                  desc: '轻量级本地代理，极低资源占用。负责容器生命周期管理和实时数据收集，确保宿主机性能最大化。',
                  step: '02',
                },
                {
                  icon: Cpu,
                  title: '运行引擎',
                  subtitle: 'Core Engine',
                  desc: '基于现代容器技术构建，提供坚固的资源隔离边界。支持无守护进程模式和 Rootless 运行，安全且高效。',
                  step: '03',
                },
              ].map((item, i) => (
                <Card
                  key={i}
                  className="group relative border border-border/50 bg-gradient-to-br from-muted/50 to-card/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-visible"
                >
                  {/* Step Number */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-background border-2 border-primary/20 flex items-center justify-center font-bold text-primary shadow-lg group-hover:scale-110 transition-transform duration-300 z-10">
                    {item.step}
                  </div>

                  <div className="pt-8 p-8 text-center flex flex-col h-full">
                    {/* Icon */}
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <item.icon className="h-8 w-8" />
                    </div>

                    <CardTitle className="mb-2 text-2xl">
                      {item.title}
                    </CardTitle>
                    <Badge
                      variant="secondary"
                      className="mb-4 w-fit mx-auto bg-secondary text-secondary-foreground"
                    >
                      {item.subtitle}
                    </Badge>

                    <CardDescription className="text-base leading-relaxed text-muted-foreground flex-1">
                      {item.desc}
                    </CardDescription>
                  </div>

                  {/* Decorative corner */}
                  <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-primary/5 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-32 bg-muted/30">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-blue-500/10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[100px]" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.1]" />

        <div className="relative z-10 px-4 text-center max-w-4xl mx-auto">
          <h2 className="mb-6 text-3xl font-bold text-foreground md:text-6xl tracking-tight">
            准备好提升您的
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              云上体验？
            </span>
          </h2>
          <p className="mb-10 text-xl text-muted-foreground">
            加入数千名开发者的行列，享受真正轻快的云计算
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto rounded-full px-10 py-6 text-lg font-bold shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-500 hover:-translate-y-1 bg-primary text-primary-foreground"
            >
              <Link href="/auth">
                <span className="flex items-center gap-2">
                  免费开始使用
                  <Zap className="w-5 h-5" />
                </span>
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto rounded-full px-10 py-6 text-lg font-semibold border-2 hover:bg-background hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
            >
              联系销售团队
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-border/50 bg-muted/30 pt-16 pb-8 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            <Link href="/" className="flex items-center gap-3 group cursor-pointer">
              <div className="relative h-10 w-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Image
                  src="/logo.png"
                  alt="NanoVPS"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <span className="text-2xl font-bold text-foreground">
                  Nano<span className="text-primary">VPS</span>
                </span>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Less Overhead, More Performance.
                </p>
              </div>
            </Link>

            <div className="flex flex-wrap justify-center gap-8 text-sm font-medium">
              {[
                { label: '产品文档', href: '#' },
                { label: 'API 参考', href: '#' },
                { label: '服务状态', href: '#' },
                { label: '关于我们', href: '#' },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}