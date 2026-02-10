'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ModeToggle } from '@/components/theme-toggle';
import {
  Cpu,
  Shield,
  Zap,
  Terminal,
  Server,
  Globe,
  Activity,
  ChevronRight,
  Play,
  ArrowRight,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Text Scramble Effect Component
function TextScramble({ text, className }: { text: string; className?: string }) {
  const elRef = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!elRef.current || hasAnimated) return;

    const chars = '!<>-_\\/[]{}—=+*^?#________';
    const el = elRef.current;
    const originalText = text;
    let iteration = 0;

    const interval = setInterval(() => {
      el.innerText = originalText
        .split('')
        .map((char, index) => {
          if (index < iteration) {
            return originalText[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      if (iteration >= originalText.length) {
        clearInterval(interval);
      }

      iteration += 1 / 2;
    }, 30);

    setHasAnimated(true);
    return () => clearInterval(interval);
  }, [text, hasAnimated]);

  return <span ref={elRef} className={className}>{text}</span>;
}

// Particle Network Background
function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      const count = Math.min(80, Math.floor(window.innerWidth / 20));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
        });
      }
    };

    const isDark = resolvedTheme === 'dark';
    const particleColor = isDark ? '0, 243, 255' : '0, 123, 255';

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particleColor}, ${isDark ? 0.5 : 0.3})`;
        ctx.fill();

        particles.slice(i + 1).forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${particleColor}, ${0.2 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(draw);
    };

    resize();
    createParticles();
    draw();

    window.addEventListener('resize', () => {
      resize();
      createParticles();
    });

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [resolvedTheme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}

// Live Terminal Component
function LiveTerminal() {
  const [lines, setLines] = useState<string[]>([
    '> 初始化 NanoVPS 核心...',
    '> 加载内核模块...',
    '> 挂载容器文件系统...',
  ]);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const messages = [
      '> 启动实例 nanovps-001...',
      '> 分配资源: 2 vCPU, 4GB 内存',
      '> 网络桥接已建立',
      '> 容器在 0.3 秒内启动',
      '> 健康检查: 通过',
      '> 实例已就绪',
      '> 监控代理已连接',
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < messages.length) {
        setLines((prev) => [...prev.slice(-6), messages[index]]);
        index++;
      } else {
        index = 0;
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div className="rounded-lg overflow-hidden border border-border bg-background/80">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-4 text-xs text-muted-foreground font-mono">nano-console</span>
      </div>
      <div
        ref={terminalRef}
        className="p-4 h-40 overflow-hidden font-mono text-xs space-y-1 bg-black/90"
      >
        {lines.map((line, i) => (
          <div key={i} className="text-green-400/90">
            {line}
            {i === lines.length - 1 && (
              <span className="inline-block w-2 h-4 bg-green-400/90 ml-1 animate-pulse" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Animated Counter
function AnimatedCounter({ value, suffix = '' }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    gsap.fromTo(
      ref.current,
      { innerText: 0 },
      {
        innerText: numValue,
        duration: 2,
        ease: 'power2.out',
        snap: { innerText: value.includes('.') ? 0.1 : 1 },
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 80%',
        },
      }
    );
  }, [value]);

  return (
    <span className="font-mono">
      <span ref={ref}>0</span>
      {suffix}
    </span>
  );
}

export default function Home() {
  const { resolvedTheme } = useTheme();
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const architectureRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      heroTl
        .from('.hero-badge', { opacity: 0, y: 30, duration: 0.8 })
        .from('.hero-title', { opacity: 0, y: 50, duration: 1 }, '-=0.5')
        .from('.hero-subtitle', { opacity: 0, y: 30, duration: 0.8 }, '-=0.6')
        .from('.hero-desc', { opacity: 0, y: 30, duration: 0.8 }, '-=0.6')
        .from('.hero-cta', { opacity: 0, y: 30, duration: 0.8 }, '-=0.6')
        .from('.hero-visual', { opacity: 0, scale: 0.9, duration: 1.2 }, '-=0.8');

      gsap.utils.toArray<HTMLElement>('.feature-card').forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          },
          opacity: 0,
          y: 60,
          duration: 0.8,
          delay: i * 0.1,
          ease: 'power3.out',
        });
      });

      gsap.utils.toArray<HTMLElement>('.arch-card').forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          },
          opacity: 0,
          x: i % 2 === 0 ? -50 : 50,
          duration: 0.8,
          delay: i * 0.15,
          ease: 'power3.out',
        });
      });

      gsap.from('.stat-item', {
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
      });

      gsap.from('.cta-section', {
        scrollTrigger: {
          trigger: '.cta-section',
          start: 'top 80%',
        },
        opacity: 0,
        y: 60,
        duration: 1,
        ease: 'power3.out',
      });
    });

    return () => ctx.revert();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isDark = resolvedTheme === 'dark';
  const accentColor = isDark ? '#00f3ff' : '#007bff';

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans selection:bg-primary/30">
      {/* Global Effects - Dark mode only */}
      {isDark && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              background: `repeating-linear-gradient(
                0deg,
                rgba(0, 0, 0, 0.1) 0px,
                rgba(0, 0, 0, 0.1) 1px,
                transparent 1px,
                transparent 2px
              )`,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)`,
            }}
          />
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-full px-6 py-3 flex items-center justify-between bg-background/80 backdrop-blur-xl border border-border shadow-sm">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-8 h-8 transition-transform duration-300 group-hover:scale-110">
                <Image src="/logo.png" alt="NanoVPS" fill className="object-contain" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Nano<span className="text-primary">VPS</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {[
                { label: '功能特性', id: 'features' },
                { label: '架构设计', id: 'architecture' },
                { label: '数据指标', id: 'stats' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
                >
                  <TextScramble text={item.label} />
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <ModeToggle />
              <Button
                asChild
                size="sm"
                className="bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 hover:border-primary/50 rounded-full"
              >
                <Link href="/auth">立即开始</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
      >
        <div className="absolute inset-0">
          <ParticleNetwork />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `linear-gradient(${isDark ? 'rgba(0, 243, 255, 0.03)' : 'rgba(0, 123, 255, 0.03)'} 1px, transparent 1px),
                linear-gradient(90deg, ${isDark ? 'rgba(0, 243, 255, 0.03)' : 'rgba(0, 123, 255, 0.03)'} 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
          <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[150px] ${isDark ? 'bg-[#00f3ff]/20' : 'bg-blue-500/10'}`} />
          <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[150px] ${isDark ? 'bg-[#a855f7]/20' : 'bg-purple-500/10'}`} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="hero-badge inline-flex">
                <Badge className="bg-primary/10 text-primary border-primary/30 px-4 py-1.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse" />
                  <TextScramble text="下一代基础设施" />
                </Badge>
              </div>

              <h1 className="hero-title text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight">
                <span className="block text-foreground">光速云核心</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
                  LIGHTSPEED CORE
                </span>
              </h1>

              <p className="hero-subtitle text-xl sm:text-2xl font-light text-muted-foreground font-mono">
                <TextScramble text="更少开销，更强性能" />
              </p>

              <p className="hero-desc text-base text-muted-foreground max-w-md leading-relaxed">
                毫秒级交付的企业级云服务器。基于下一代容器技术，
                为开发者打造极致的云计算体验。
              </p>

              <div className="hero-cta flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary text-primary-foreground font-semibold hover:bg-primary/90 rounded-full px-8 group"
                >
                  <Link href="/auth">
                    启动实例
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-border hover:bg-muted rounded-full px-8 group"
                >
                  <Play className="mr-2 w-4 h-4" />
                  查看演示
                </Button>
              </div>

              <div className="flex gap-8 pt-4">
                {[
                  { value: '0.3s', label: '启动时间' },
                  { value: '99.9%', label: '可用性' },
                  { value: '50+', label: '覆盖区域' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl font-bold text-primary font-mono">
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-visual relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl blur-2xl opacity-50" />
              <Card className="relative bg-card/80 border-border backdrop-blur-xl overflow-hidden">
                <CardHeader className="border-b border-border pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Server className="w-5 h-5 text-primary" />
                      <span className="font-mono text-sm text-muted-foreground">
                        nano-dashboard
                      </span>
                    </div>
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs text-green-500">在线</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <LiveTerminal />

                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { icon: Cpu, label: 'CPU', value: '12%' },
                      { icon: Activity, label: '内存', value: '2.4GB' },
                      { icon: Globe, label: '网络', value: '1.2Gbps' },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-lg p-3 text-center border border-border bg-muted/30 group hover:border-primary/30 transition-colors"
                      >
                        <item.icon className="w-4 h-4 text-muted-foreground mx-auto mb-2 group-hover:text-primary transition-colors" />
                        <div className="text-lg font-bold font-mono text-foreground">
                          {item.value}
                        </div>
                        <div className="text-[10px] text-muted-foreground uppercase">
                          {item.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="absolute -top-4 -right-4 rounded-lg px-3 py-2 border border-primary/30 bg-primary/10">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-xs font-mono text-primary">10倍更快</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground uppercase tracking-widest">滚动</span>
          <div className="w-px h-12 bg-gradient-to-b from-primary/50 to-transparent" />
        </div>
      </section>

      {/* Stats Section */}
      <section
        ref={statsRef}
        id="stats"
        className="relative py-24 border-y border-border/50 bg-muted/30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '10', suffix: '倍', label: '更快启动', desc: '对比传统 VPS' },
              { value: '99.99', suffix: '%', label: '可用性 SLA', desc: '企业级保障' },
              { value: '150', suffix: '+', label: '全球节点', desc: '边缘位置' },
              { value: '24/7', suffix: '', label: '技术支持', desc: '全天候服务' },
            ].map((stat, i) => (
              <div key={i} className="stat-item text-center group">
                <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-foreground to-muted-foreground font-mono mb-2 group-hover:text-primary transition-colors">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm font-semibold text-foreground mb-1">{stat.label}</div>
                <div className="text-xs text-muted-foreground">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={featuresRef}
        id="features"
        className="relative py-32"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="bg-muted text-muted-foreground border-border mb-4">
              <TextScramble text="核心能力" />
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              为<span className="text-primary">速度</span>而生
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              每一项功能都经过精心打磨，只为给你最纯粹的性能体验
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Zap,
                title: '极速启动',
                desc: '毫秒级实例交付，告别漫长的等待时间。从点击到就绪，仅需 0.3 秒。',
                color: isDark ? '#00f3ff' : '#007bff',
              },
              {
                icon: Shield,
                title: '硬核隔离',
                desc: '企业级资源隔离技术，确保您的数据与应用完全独立，安全无忧。',
                color: '#a855f7',
              },
              {
                icon: Activity,
                title: '在线扩缩容',
                desc: '支持不重启调整网络与资源，业务零中断，动态适应您的需求。',
                color: '#22c55e',
              },
              {
                icon: Terminal,
                title: '原生 Linux',
                desc: '完整的操作系统体验，包括独立进程管理与 SSH 访问，真正的云服务器。',
                color: '#f59e0b',
              },
            ].map((feature, i) => (
              <Card
                key={i}
                className="feature-card group relative bg-card/50 border-border hover:border-primary/20 transition-all duration-500 overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${feature.color}10, transparent 40%)`,
                  }}
                />
                <CardContent className="relative p-8">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${feature.color}15` }}
                  >
                    <feature.icon
                      className="w-7 h-7"
                      style={{ color: feature.color }}
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-foreground transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>

                  <div className="mt-6 flex items-center text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span style={{ color: feature.color }}>了解更多</span>
                    <ChevronRight className="w-4 h-4 ml-1" style={{ color: feature.color }} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section
        ref={architectureRef}
        id="architecture"
        className="relative py-32 border-y border-border/50 bg-muted/30"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="bg-muted text-muted-foreground border-border mb-4">
              <TextScramble text="系统架构" />
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              三层<span className="text-primary">核心</span>架构
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              极简架构设计，高效协同工作
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: Globe,
                title: 'Nano Hub',
                subtitle: '控制中心',
                desc: '统一的云端管理界面，集资源调度、计费和监控于一体。通过 RESTful API 轻松集成到您的业务系统。',
              },
              {
                step: '02',
                icon: Server,
                title: 'Nano Agent',
                subtitle: '边缘节点',
                desc: '轻量级本地代理，极低资源占用。负责容器生命周期管理和实时数据收集，确保宿主机性能最大化。',
              },
              {
                step: '03',
                icon: Cpu,
                title: 'Core Engine',
                subtitle: '运行引擎',
                desc: '基于现代容器技术构建，提供坚固的资源隔离边界。支持无守护进程模式和 Rootless 运行，安全且高效。',
              },
            ].map((item, i) => (
              <Card
                key={i}
                className="arch-card relative bg-card/50 border-border hover:border-primary/30 transition-all duration-500 group"
              >
                <div className="absolute -top-4 left-8 px-3 py-1 bg-primary/10 border border-primary/30 rounded text-primary text-xs font-mono font-bold">
                  层级 {item.step}
                </div>
                <CardContent className="p-8 pt-10">
                  <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-6 group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
                    <item.icon className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{item.title}</h3>
                  <p className="text-sm text-primary font-mono mb-4">{item.subtitle}</p>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[200px]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            准备好<span className="text-primary">部署</span>了吗？
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            加入数千名开发者的行列，体验下一代云计算平台
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground font-bold hover:bg-primary/90 rounded-full px-10 py-6 text-lg group"
            >
              <Link href="/auth">
                免费试用
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border hover:bg-muted rounded-full px-10 py-6 text-lg"
            >
              联系销售
            </Button>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-8 text-muted-foreground text-sm">
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              SOC 2 认证
            </span>
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              GDPR 合规
            </span>
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              ISO 27001
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-8 h-8">
                <Image src="/logo.png" alt="NanoVPS" fill className="object-contain" />
              </div>
              <span className="text-xl font-bold">
                Nano<span className="text-primary">VPS</span>
              </span>
            </Link>

            <div className="flex gap-8 text-sm text-muted-foreground">
              {['产品文档', 'API 文档', '服务状态', '隐私政策'].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>

            <p className="text-sm text-muted-foreground">
              © 2025 NanoVPS. 保留所有权利。
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
