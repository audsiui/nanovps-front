'use client';

import { use, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  Copy,
  Eye,
  EyeOff,
  Play,
  Square,
  RotateCw,
  Wrench,
  Key,
  Monitor,
  ExternalLink,
  Plus,
  Trash2,
  Cpu,
  HardDrive,
  Network,
  Activity,
  Calendar,
  DollarSign,
  Pencil,
  Check,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// Mock server data
const mockServerData = {
  id: 'srv-001',
  name: 'Production-Web-01',
  status: 'running',
  createdAt: '2026-01-28 14:05',
  basicInfo: {
    ip: '10.91.0.22',
    ipv6: 'fd91:cafe:cafe:10::16',
    natIp: '192.166.82.233',
    username: 'root',
    password: 'Abc123456',
  },
  config: {
    cpu: '1核',
    memory: '128MB',
    storage: '1GB',
    bandwidth: '1000Mbps',
    traffic: '888GB',
  },
  billing: {
    price: 0.1,
    nextRenewal: '2026-02-28 14:05',
    autoRenew: true,
  },
  notes: 'Production web server',
  natPorts: [
    { id: 1, protocol: 'tcp', externalPort: 16385, internalPort: 16385, remark: '' },
    { id: 2, protocol: 'tcp', externalPort: 37439, internalPort: 22, remark: '' },
  ],
  monitoring: {
    cpuUsage: 0,
    memoryUsage: 13,
    trafficUsage: 0,
  },
};

export default function ServerDetailPageClient() {
  const [showPassword, setShowPassword] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(mockServerData.notes);
  const [isAutoRenew, setIsAutoRenew] = useState(mockServerData.billing.autoRenew);
  const [natPorts, setNatPorts] = useState(mockServerData.natPorts);
  const [showAddPortDialog, setShowAddPortDialog] = useState(false);
  const [newPort, setNewPort] = useState({ protocol: 'tcp', externalPort: '', internalPort: '', remark: '' });

  const params = useSearchParams()

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleAddPort = () => {
    if (newPort.externalPort && newPort.internalPort) {
      setNatPorts([
        ...natPorts,
        {
          id: Date.now(),
          protocol: newPort.protocol as 'tcp' | 'udp',
          externalPort: parseInt(newPort.externalPort),
          internalPort: parseInt(newPort.internalPort),
          remark: newPort.remark,
        },
      ]);
      setNewPort({ protocol: 'tcp', externalPort: '', internalPort: '', remark: '' });
      setShowAddPortDialog(false);
    }
  };

  const handleDeletePort = (id: number) => {
    setNatPorts(natPorts.filter(port => port.id !== id));
  };

  return (
    <div className="space-y-6 p-1">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {mockServerData.name}
            </h1>
            <Badge
              variant={mockServerData.status === 'running' ? 'default' : 'destructive'}
              className={mockServerData.status === 'running' ? 'bg-green-500 hover:bg-green-600' : ''}
            >
              {mockServerData.status === 'running' ? '运行中' : '已停止'}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm mt-1">ID: {params.get('id')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card className="border-border/50 bg-card/60 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">IP地址</Label>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono bg-muted px-2.5 py-1 rounded">{mockServerData.basicInfo.ip}</code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => copyToClipboard(mockServerData.basicInfo.ip)}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">IPv6地址</Label>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono bg-muted px-2.5 py-1 rounded truncate max-w-[200px]">{mockServerData.basicInfo.ipv6}</code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => copyToClipboard(mockServerData.basicInfo.ipv6)}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">NAT IP</Label>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono bg-muted px-2.5 py-1 rounded">{mockServerData.basicInfo.natIp}</code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => copyToClipboard(mockServerData.basicInfo.natIp)}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">用户名</Label>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono bg-muted px-2.5 py-1 rounded">{mockServerData.basicInfo.username}</code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => copyToClipboard(mockServerData.basicInfo.username)}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm text-muted-foreground">密码</Label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1 max-w-[200px]">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={mockServerData.basicInfo.password}
                      readOnly
                      className="pr-16 font-mono text-sm"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => copyToClipboard(mockServerData.basicInfo.password)}
                  >
                    <Copy className="h-3.5 w-3.5" />
                    复制
                  </Button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm text-muted-foreground">创建时间</Label>
                <p className="text-sm">{mockServerData.createdAt}</p>
              </div>
            </CardContent>
          </Card>

          {/* Config Info */}
          <Card className="border-border/50 bg-card/60 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">配置信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Cpu className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">CPU</p>
                    <p className="font-semibold">{mockServerData.config.cpu}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">内存</p>
                    <p className="font-semibold">{mockServerData.config.memory}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <HardDrive className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">存储</p>
                    <p className="font-semibold">{mockServerData.config.storage}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Network className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">带宽</p>
                    <p className="font-semibold">{mockServerData.config.bandwidth}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <ExternalLink className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">流量</p>
                    <p className="font-semibold">{mockServerData.config.traffic}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Monitoring */}
          <Card className="border-border/50 bg-card/60 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">系统监控</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-muted-foreground">CPU使用率</Label>
                  <span className="text-sm font-medium">{mockServerData.monitoring.cpuUsage}%</span>
                </div>
                <Progress value={mockServerData.monitoring.cpuUsage} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-muted-foreground">内存使用率</Label>
                  <span className="text-sm font-medium">{mockServerData.monitoring.memoryUsage}%</span>
                </div>
                <Progress value={mockServerData.monitoring.memoryUsage} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-muted-foreground">流量使用情况</Label>
                  <span className="text-sm font-medium">{mockServerData.monitoring.trafficUsage}%</span>
                </div>
                <Progress value={mockServerData.monitoring.trafficUsage} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* NAT Port Management */}
          <Card className="border-border/50 bg-card/60 backdrop-blur-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">NAT端口管理</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">NAT IP: {mockServerData.basicInfo.natIp}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => setShowAddPortDialog(true)}
                >
                  <Plus className="h-4 w-4" />
                  添加端口
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">协议</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">外部端口</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">内部端口</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">备注</th>
                      <th className="text-right py-3 px-2 font-medium text-muted-foreground">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {natPorts.map((port) => (
                      <tr key={port.id} className="border-b border-border/30 last:border-0">
                        <td className="py-3 px-2">{port.protocol.toUpperCase()}</td>
                        <td className="py-3 px-2">{port.externalPort}</td>
                        <td className="py-3 px-2">{port.internalPort}</td>
                        <td className="py-3 px-2">{port.remark || '-'}</td>
                        <td className="py-3 px-2 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-red-500 hover:text-red-600"
                            onClick={() => handleDeletePort(port.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {natPorts.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-muted-foreground">
                          暂无端口映射
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex gap-3 mt-4 pt-4 border-t border-border/50">
                <Dialog open={showAddPortDialog} onOpenChange={setShowAddPortDialog}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>添加NAT端口映射</DialogTitle>
                      <DialogDescription>
                        添加新的端口映射规则
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>协议</Label>
                        <Select
                          value={newPort.protocol}
                          onValueChange={(value) => setNewPort({ ...newPort, protocol: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tcp">TCP</SelectItem>
                            <SelectItem value="udp">UDP</SelectItem>
                            <SelectItem value="all">TCP+UDP</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>外部端口 (1024-65535)</Label>
                        <Input
                          type="number"
                          min={1024}
                          max={65535}
                          value={newPort.externalPort}
                          onChange={(e) => setNewPort({ ...newPort, externalPort: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>内部端口 (1-65535)</Label>
                        <Input
                          type="number"
                          min={1}
                          max={65535}
                          value={newPort.internalPort}
                          onChange={(e) => setNewPort({ ...newPort, internalPort: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>备注</Label>
                        <Input
                          placeholder="请输入备注..."
                          value={newPort.remark}
                          onChange={(e) => setNewPort({ ...newPort, remark: e.target.value })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAddPortDialog(false)}>
                        取消
                      </Button>
                      <Button onClick={handleAddPort}>添加</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" size="sm" className="gap-2">
                  <RotateCw className="h-4 w-4" />
                  重新映射全部端口
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Server Operations */}
          <Card className="border-border/50 bg-card/60 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">服务器操作</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Button
                  variant={mockServerData.status === 'running' ? 'outline' : 'default'}
                  className="gap-2 justify-start"
                >
                  <Play className="h-4 w-4" />
                  开机
                </Button>
                <Button
                  variant={mockServerData.status === 'running' ? 'default' : 'outline'}
                  className="gap-2 justify-start"
                >
                  <Square className="h-4 w-4" />
                  关机
                </Button>
                <Button variant="outline" className="gap-2 justify-start">
                  <RotateCw className="h-4 w-4" />
                  重启
                </Button>
                <Button variant="outline" className="gap-2 justify-start">
                  <Wrench className="h-4 w-4" />
                  重装
                </Button>
                <Button variant="outline" className="gap-2 justify-start">
                  <Key className="h-4 w-4" />
                  修改密码
                </Button>
                <Button variant="outline" className="gap-2 justify-start">
                  <Monitor className="h-4 w-4" />
                  控制台
                </Button>
                <Button variant="outline" className="gap-2 justify-start">
                  <ExternalLink className="h-4 w-4" />
                  Push服务器
                </Button>
                <Button variant="outline" className="gap-2 justify-start text-red-500 hover:text-red-600">
                  <XCircle className="h-4 w-4" />
                  取消服务器
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Billing Info */}
          <Card className="border-border/50 bg-card/60 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">计费信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">价格</span>
                <span className="text-lg font-bold">${mockServerData.billing.price}/月</span>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">下次续费</span>
                <div className="flex items-center gap-1.5 text-sm">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  {mockServerData.billing.nextRenewal}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">自动续费</span>
                <Switch
                  checked={isAutoRenew}
                  onCheckedChange={setIsAutoRenew}
                />
              </div>

              <Separator />

              <Button className="w-full gap-2">
                <DollarSign className="h-4 w-4" />
                立即续费
              </Button>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="border-border/50 bg-card/60 backdrop-blur-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">备注</CardTitle>
                {!isEditingNotes && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setIsEditingNotes(true)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isEditingNotes ? (
                <div className="space-y-3">
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="添加备注..."
                    rows={4}
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setIsEditingNotes(false);
                        setNotes(mockServerData.notes);
                      }}
                    >
                      取消
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => setIsEditingNotes(false)}
                    >
                      <Check className="h-3.5 w-3.5" />
                      保存
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{notes || '暂无备注'}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
