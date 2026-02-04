'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  Server,
  ShoppingCart,
  CreditCard,
  TrendingUp,
  TrendingDown,
  AlertCircle,
} from 'lucide-react';

// 统计数据
const stats = [
  {
    title: '总用户数',
    value: '1,234',
    change: '+12%',
    trend: 'up',
    icon: Users,
  },
  {
    title: '运行实例',
    value: '892',
    change: '+5%',
    trend: 'up',
    icon: Server,
  },
  {
    title: '今日订单',
    value: '56',
    change: '-3%',
    trend: 'down',
    icon: ShoppingCart,
  },
  {
    title: '今日收入',
    value: '¥23,456',
    change: '+18%',
    trend: 'up',
    icon: CreditCard,
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {stat.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-destructive" />
                )}
                <span className={`text-xs ${stat.trend === 'up' ? 'text-green-500' : 'text-destructive'}`}>
                  {stat.change}
                </span>
                <span className="text-xs text-muted-foreground">较上月</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 快捷操作和系统状态 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">快捷操作</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button className="p-3 text-left rounded-md border border-border hover:bg-muted transition-colors">
                <div className="text-sm font-medium text-foreground">创建用户</div>
                <div className="text-xs text-muted-foreground">手动添加新用户</div>
              </button>
              <button className="p-3 text-left rounded-md border border-border hover:bg-muted transition-colors">
                <div className="text-sm font-medium text-foreground">发放优惠码</div>
                <div className="text-xs text-muted-foreground">生成促销代码</div>
              </button>
              <button className="p-3 text-left rounded-md border border-border hover:bg-muted transition-colors">
                <div className="text-sm font-medium text-foreground">系统公告</div>
                <div className="text-xs text-muted-foreground">发布通知消息</div>
              </button>
              <button className="p-3 text-left rounded-md border border-border hover:bg-muted transition-colors">
                <div className="text-sm font-medium text-foreground">数据导出</div>
                <div className="text-xs text-muted-foreground">导出报表数据</div>
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">系统状态</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm text-foreground">主服务器</span>
              </div>
              <span className="text-xs text-green-500 font-medium">正常运行</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm text-foreground">数据库</span>
              </div>
              <span className="text-xs text-green-500 font-medium">正常运行</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm text-foreground">节点集群</span>
              </div>
              <span className="text-xs text-green-500 font-medium">12/12 在线</span>
            </div>
            <div className="pt-2 border-t border-border">
              <div className="flex items-center gap-2 text-amber-500">
                <AlertCircle className="h-4 w-4" />
                <span className="text-xs">3 个待处理工单需要关注</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 最近活动 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">最近活动</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 font-medium text-muted-foreground">操作</th>
                <th className="text-left py-2 font-medium text-muted-foreground">用户</th>
                <th className="text-left py-2 font-medium text-muted-foreground">时间</th>
                <th className="text-left py-2 font-medium text-muted-foreground">状态</th>
              </tr>
            </thead>
            <tbody className="text-foreground">
              <tr className="border-b border-border/50">
                <td className="py-3">创建新实例</td>
                <td className="py-3">user@example.com</td>
                <td className="py-3">2分钟前</td>
                <td className="py-3"><span className="text-green-500">成功</span></td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3">充值 ¥500</td>
                <td className="py-3">test@example.com</td>
                <td className="py-3">15分钟前</td>
                <td className="py-3"><span className="text-green-500">成功</span></td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3">提交工单</td>
                <td className="py-3">demo@example.com</td>
                <td className="py-3">1小时前</td>
                <td className="py-3"><span className="text-amber-500">待处理</span></td>
              </tr>
              <tr>
                <td className="py-3">修改配置</td>
                <td className="py-3">admin@test.com</td>
                <td className="py-3">2小时前</td>
                <td className="py-3"><span className="text-green-500">成功</span></td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
