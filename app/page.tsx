'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ModeToggle } from '@/components/theme-toggle';
import {
  Cpu, Shield, Zap, Terminal, Server, Globe, Activity,
  ChevronRight, ArrowRight, ChevronDown
} from 'lucide-react';

// ============================================
// ANIMATION CONFIG
// ============================================
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// ============================================
// COMPONENTS
// ============================================

// Live Terminal
function LiveTerminal() {
  const [lines, setLines] = useState([
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
    ];
    let index = 0;
    const interval = setInterval(() => {
      if (index < messages.length) {
        setLines(prev => [...prev.slice(-5), messages[index]]);
        index++;
      } else {
        index = 0;
      }
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div className="rounded-lg overflow-hidden border border-white/10 bg-black/80">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 bg-white/5">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-4 text-xs text-zinc-500 font-mono">nano-console</span>
      </div>
      <div ref={terminalRef} className="p-4 h-32 overflow-hidden font-mono text-xs space-y-1">
        {lines.map((line, i) => (
          <div key={i} className="text-green-400/90">
            {line}
            {i === lines.length - 1 && <span className="inline-block w-2 h-4 bg-green-400/90 ml-1 animate-pulse" />}
          </div>
        ))}
      </div>
    </div>
  );
}

// Glass Card Component
function GlassCard({ children, className = '', hover = true }: { children: React.ReactNode; className?: string; hover?: boolean }) {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, boxShadow: '0 0 30px rgba(255, 77, 0, 0.2)' } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
}

// Background Grid
function BackgroundGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
    </div>
  );
}

// ============================================
// MAIN PAGE
// ============================================
export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans selection:bg-primary/30">
      {/* Background */}
      <BackgroundGrid />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
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
                { label: '价格方案', id: 'pricing' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <ModeToggle />
              <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
                <Link href="/auth">立即开始</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="space-y-8"
            >
              <motion.div variants={fadeInUp}>
                <Badge className="bg-primary/10 text-primary border-primary/30 px-4 py-1.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse" />
                  下一代基础设施
                </Badge>
              </motion.div>

              <motion.h1 
                variants={fadeInUp}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight"
              >
                <span className="block text-foreground">光速云核心</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
                  LIGHTSPEED CORE
                </span>
              </motion.h1>

              <motion.p 
                variants={fadeInUp}
                className="text-xl sm:text-2xl font-light text-muted-foreground font-mono"
              >
                更少开销，更强性能
              </motion.p>

              <motion.p 
                variants={fadeInUp}
                className="text-base text-muted-foreground max-w-md leading-relaxed"
              >
                毫秒级交付的企业级云服务器。基于下一代容器技术，
                为开发者打造极致的云计算体验。
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-primary text-primary-foreground font-semibold hover:bg-primary/90 rounded-full px-8 group">
                  <Link href="/auth">
                    启动实例
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-border hover:bg-muted rounded-full px-8">
                  查看演示
                </Button>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex gap-8 pt-4">
                {[
                  { value: '0.3s', label: '启动时间' },
                  { value: '99.9%', label: '可用性' },
                  { value: '50+', label: '覆盖区域' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl font-bold text-primary font-mono">{stat.value}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Visual */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl blur-2xl opacity-50" />
              <GlassCard className="relative">
                <CardHeader className="border-b border-white/10 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Server className="w-5 h-5 text-primary" />
                      <span className="font-mono text-sm text-zinc-400">nano-dashboard</span>
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
                      <div key={item.label} className="rounded-lg p-3 text-center border border-white/10 bg-white/5 group hover:border-primary/30 transition-colors">
                        <item.icon className="w-4 h-4 text-zinc-400 mx-auto mb-2 group-hover:text-primary transition-colors" />
                        <div className="text-lg font-bold font-mono">{item.value}</div>
                        <div className="text-[10px] text-zinc-500 uppercase">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </GlassCard>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-muted-foreground uppercase tracking-widest">滚动</span>
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-5 h-5 text-primary" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="relative py-20 border-y border-border/50 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { value: '10x', label: '更快启动', desc: '对比传统 VPS' },
              { value: '99.99%', label: '可用性 SLA', desc: '企业级保障' },
              { value: '150+', label: '全球节点', desc: '边缘位置' },
              { value: '24/7', label: '技术支持', desc: '全天候服务' },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center group"
              >
                <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-foreground to-muted-foreground font-mono mb-2 group-hover:text-primary transition-colors">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold mb-1">{stat.label}</div>
                <div className="text-xs text-muted-foreground">{stat.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section - Bento Grid */}
      <section id="features" className="relative py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="bg-muted text-muted-foreground border-border mb-4">核心能力</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              为<span className="text-primary">速度</span>而生
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              每一项功能都经过精心打磨，只为给你最纯粹的性能体验
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Zap, title: '极速启动', desc: '毫秒级实例交付，0.3秒就绪', color: '#00f3ff', span: 'col-span-2' },
              { icon: Shield, title: '硬核隔离', desc: '企业级安全隔离技术', color: '#a855f7' },
              { icon: Activity, title: '在线扩缩容', desc: '零停机资源调整', color: '#22c55e' },
              { icon: Terminal, title: '原生 Linux', desc: '完整SSH与进程管理', color: '#f59e0b', span: 'col-span-2' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={feature.span || ''}
              >
                <GlassCard className="h-full p-6 group cursor-pointer">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${feature.color}15` }}
                  >
                    <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.desc}</p>
                  <div className="mt-4 flex items-center text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <span style={{ color: feature.color }}>了解更多</span>
                    <ChevronRight className="w-4 h-4 ml-1" style={{ color: feature.color }} />
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section id="architecture" className="relative py-32 border-y border-border/50 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="bg-muted text-muted-foreground border-border mb-4">系统架构</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              三层<span className="text-primary">核心</span>架构
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              极简架构设计，高效协同工作
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {[
              { step: '01', icon: Globe, title: 'Nano Hub', subtitle: '控制中心', desc: '统一的云端管理界面，集资源调度、计费和监控于一体。' },
              { step: '02', icon: Server, title: 'Nano Agent', subtitle: '边缘节点', desc: '轻量级本地代理，极低资源占用，确保宿主机性能最大化。' },
              { step: '03', icon: Cpu, title: 'Core Engine', subtitle: '运行引擎', desc: '基于现代容器技术构建，提供坚固的资源隔离边界。' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i === 0 ? -20 : i === 2 ? 20 : 0, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <GlassCard className="h-full p-8 pt-10 relative group">
                  <div className="absolute -top-3 left-8 px-3 py-1 bg-primary/10 border border-primary/30 rounded text-primary text-xs font-mono font-bold">
                    层级 {item.step}
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
                    <item.icon className="w-7 h-7 text-zinc-400 group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{item.title}</h3>
                  <p className="text-sm text-primary font-mono mb-4">{item.subtitle}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="bg-muted text-muted-foreground border-border mb-4">价格方案</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              简单透明的<span className="text-primary">定价</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              按需付费，无隐藏费用，随时可升级或降级
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: '入门版', price: '¥29', period: '/月', desc: '适合个人开发者', features: ['1 vCPU', '2GB 内存', '20GB SSD', '1TB 流量'] },
              { name: '专业版', price: '¥99', period: '/月', desc: '适合小型团队', features: ['2 vCPU', '4GB 内存', '50GB SSD', '3TB 流量', '优先支持'], popular: true },
              { name: '企业版', price: '¥299', period: '/月', desc: '适合大规模应用', features: ['4 vCPU', '8GB 内存', '100GB SSD', '10TB 流量', '专属客服', 'SLA保障'] },
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <GlassCard className={`h-full p-8 relative ${plan.popular ? 'border-primary/50' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                      最受欢迎
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{plan.desc}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, fi) => (
                      <li key={fi} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full rounded-full ${plan.popular ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-white/10 hover:bg-white/20'}`}
                  >
                    选择方案
                  </Button>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            准备好<span className="text-primary">部署</span>了吗？
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            加入数千名开发者的行列，体验下一代云计算平台
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-primary text-primary-foreground font-bold hover:bg-primary/90 rounded-full px-10 py-6 text-lg group">
              <Link href="/auth">
                免费试用
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-border hover:bg-muted rounded-full px-10 py-6 text-lg">
              联系销售
            </Button>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-8 text-muted-foreground text-sm">
            {['SOC 2 认证', 'GDPR 合规', 'ISO 27001'].map((cert) => (
              <span key={cert} className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                {cert}
              </span>
            ))}
          </div>
        </motion.div>
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
                <a key={link} href="#" className="hover:text-foreground transition-colors">
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
