'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Search,
  Plus,
  MessageSquare,
  Clock,
  Paperclip,
  Send,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Hash,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

// --- 类型定义 & 模拟数据 ---

type TicketStatus = 'open' | 'replied' | 'closed';
type TicketPriority = 'low' | 'medium' | 'high';

interface Message {
  id: string;
  sender: 'user' | 'support';
  name: string;
  content: string;
  time: string;
  attachments?: string[];
}

interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: TicketStatus;
  priority: TicketPriority;
  lastUpdate: string;
  messages: Message[];
}

const mockTickets: Ticket[] = [
  {
    id: 'TK-2024-8832',
    subject: '服务器无法连接 SSH (Connection Refused)',
    category: '技术支持',
    status: 'replied',
    priority: 'high',
    lastUpdate: '10 分钟前',
    messages: [
      {
        id: 'm1',
        sender: 'user',
        name: 'John Doe',
        content: '我刚刚购买的香港节点实例 (192.168.1.10) 无法通过 SSH 连接，显示连接被拒绝。我已经检查了防火墙设置。',
        time: '11:30',
      },
      {
        id: 'm2',
        sender: 'support',
        name: 'Nano Support',
        content: '您好，我们正在检查该宿主机的网络状态。检测到您的实例安全组规则似乎屏蔽了 22 端口，请您在控制台“安全组”页面放行该端口再试一次。',
        time: '11:45',
      },
    ],
  },
  {
    id: 'TK-2024-8820',
    subject: '关于本月账单金额的疑问',
    category: '财务咨询',
    status: 'open',
    priority: 'medium',
    lastUpdate: '2 小时前',
    messages: [
      {
        id: 'm1',
        sender: 'user',
        name: 'John Doe',
        content: '你好，我发现本月账单多出了 $2.50 的快照费用，但我记得我上周已经删除了快照。',
        time: '09:12',
      },
    ],
  },
  {
    id: 'TK-2024-8755',
    subject: '申请更换 IP 地址',
    category: '产品服务',
    status: 'closed',
    priority: 'low',
    lastUpdate: '3 天前',
    messages: [
      {
        id: 'm1',
        sender: 'user',
        name: 'John Doe',
        content: '现在的 IP 似乎被部分网站拦截了，我想申请更换一个新的 IP。',
        time: '2024-05-18',
      },
      {
        id: 'm2',
        sender: 'support',
        name: 'Nano Support',
        content: '已为您更换 IP。新 IP 为 103.20.xx.xx，请重启实例后生效。',
        time: '2024-05-19',
      },
    ],
  },
];

// --- 辅助组件 ---

const StatusBadge = ({ status }: { status: TicketStatus }) => {
  const styles = {
    open: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    replied: "bg-green-500/10 text-green-600 border-green-500/20",
    closed: "bg-muted text-muted-foreground border-border/50",
  };
  
  const labels = {
    open: "待处理",
    replied: "已回复",
    closed: "已关闭",
  };

  return (
    <Badge variant="outline" className={cn("text-[10px] h-5 px-1.5 border-0", styles[status])}>
      {labels[status]}
    </Badge>
  );
};

const PriorityIcon = ({ priority }: { priority: TicketPriority }) => {
  if (priority === 'high') return <AlertCircle className="w-3.5 h-3.5 text-red-500" />;
  if (priority === 'medium') return <HelpCircle className="w-3.5 h-3.5 text-orange-500" />;
  return <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />;
};

export default function TicketsPage() {
  const [selectedTicketId, setSelectedTicketId] = useState<string>(mockTickets[0].id);
  const [replyText, setReplyText] = useState('');
  
  const selectedTicket = mockTickets.find(t => t.id === selectedTicketId) || mockTickets[0];

  return (
    <div className="h-[calc(100vh-6rem)] p-1 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            工单中心
          </h1>
          <p className="text-muted-foreground mt-2 text-base">
            遇到问题？我们的技术专家 7x24 小时为您提供支持。
          </p>
        </div>
        
        {/* New Ticket Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2 shadow-lg shadow-primary/25">
              <Plus className="w-5 h-5" /> 新建工单
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px] bg-card/95 backdrop-blur-xl border-border/50">
            <DialogHeader>
              <DialogTitle>提交新工单</DialogTitle>
              <DialogDescription>
                请详细描述您遇到的问题，这有助于我们更快地为您解决。
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-sm font-medium">工单分类</span>
                  <Select defaultValue="tech">
                    <SelectTrigger>
                      <SelectValue placeholder="选择分类" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tech">技术支持</SelectItem>
                      <SelectItem value="billing">财务咨询</SelectItem>
                      <SelectItem value="sales">售前咨询</SelectItem>
                      <SelectItem value="abuse">投诉与建议</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium">优先级</span>
                  <Select defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue placeholder="选择优先级" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">一般</SelectItem>
                      <SelectItem value="medium">中等</SelectItem>
                      <SelectItem value="high">紧急 (生产环境宕机)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-sm font-medium">工单标题</span>
                <Input placeholder="简要概括问题，例如：VPS 无法启动" />
              </div>
              <div className="space-y-2">
                <span className="text-sm font-medium">关联实例 (可选)</span>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择相关资源" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">不关联</SelectItem>
                    <SelectItem value="srv-01">Production-Web-01</SelectItem>
                    <SelectItem value="srv-02">Dev-Database</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <span className="text-sm font-medium">问题描述</span>
                <Textarea 
                  className="min-h-[150px] resize-none" 
                  placeholder="请提供详细的错误信息、复现步骤或截图..." 
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">提交工单</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Content: Split View */}
      <div className="flex-1 flex gap-6 min-h-0">
        
        {/* Left: Ticket List */}
        <Card className="w-full md:w-[380px] flex flex-col border-border/50 bg-card/60 backdrop-blur-md shadow-sm">
          <div className="p-4 border-b border-border/50 space-y-3">
             <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="搜索工单 ID 或标题..." className="pl-9 bg-background/50" />
             </div>
             <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="h-7 text-xs px-3 bg-primary/10 text-primary hover:bg-primary/20">全部</Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs px-3 text-muted-foreground">待处理</Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs px-3 text-muted-foreground">已关闭</Button>
             </div>
          </div>
          
          <ScrollArea className="flex-1">
             <div className="flex flex-col p-2 gap-2">
               {mockTickets.map((ticket) => (
                 <div
                   key={ticket.id}
                   onClick={() => setSelectedTicketId(ticket.id)}
                   className={cn(
                     "flex flex-col gap-2 p-3 rounded-lg cursor-pointer border transition-all hover:bg-muted/50",
                     selectedTicketId === ticket.id 
                       ? "bg-card border-primary/30 shadow-sm" 
                       : "border-transparent"
                   )}
                 >
                    <div className="flex justify-between items-start">
                       <div className="flex items-center gap-2">
                          <PriorityIcon priority={ticket.priority} />
                          <span className="font-mono text-[10px] text-muted-foreground">{ticket.id}</span>
                       </div>
                       <StatusBadge status={ticket.status} />
                    </div>
                    <h3 className={cn(
                      "text-sm font-medium leading-tight line-clamp-2",
                      selectedTicketId === ticket.id ? "text-primary" : "text-foreground"
                    )}>
                      {ticket.subject}
                    </h3>
                    <div className="flex justify-between items-center text-[10px] text-muted-foreground mt-1">
                       <span>{ticket.category}</span>
                       <span className="flex items-center gap-1">
                         <Clock className="w-3 h-3" /> {ticket.lastUpdate}
                       </span>
                    </div>
                 </div>
               ))}
             </div>
          </ScrollArea>
        </Card>

        {/* Right: Conversation Detail */}
        <Card className="flex-1 hidden md:flex flex-col border-border/50 bg-card/60 backdrop-blur-md shadow-sm overflow-hidden">
           
           {/* Ticket Detail Header */}
           <div className="h-16 px-6 border-b border-border/50 flex items-center justify-between bg-card/50">
              <div className="flex items-center gap-4">
                 <div>
                    <h2 className="text-base font-bold flex items-center gap-2">
                      {selectedTicket.subject}
                      <StatusBadge status={selectedTicket.status} />
                    </h2>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                       <span className="font-mono">{selectedTicket.id}</span>
                       <span>•</span>
                       <span>{selectedTicket.category}</span>
                       <span>•</span>
                       <span className="flex items-center gap-1">
                          <PriorityIcon priority={selectedTicket.priority} /> 
                          {selectedTicket.priority === 'high' ? '紧急' : selectedTicket.priority === 'medium' ? '中等' : '一般'}
                       </span>
                    </div>
                 </div>
              </div>
              <div className="flex items-center gap-2">
                 <Button variant="outline" size="sm" className="h-8 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> 结单
                 </Button>
                 <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="w-4 h-4" />
                 </Button>
              </div>
           </div>

           {/* Chat Area */}
           <ScrollArea className="flex-1 p-6 bg-muted/10">
              <div className="space-y-6">
                 {/* 模拟一条系统消息 */}
                 <div className="flex justify-center">
                    <span className="text-[10px] text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                       工单创建于 {selectedTicket.lastUpdate}
                    </span>
                 </div>

                 {selectedTicket.messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={cn(
                        "flex gap-4 max-w-[85%]",
                        msg.sender === 'user' ? "ml-auto flex-row-reverse" : ""
                      )}
                    >
                       <Avatar className="w-8 h-8 border border-border/50">
                          {msg.sender === 'user' ? (
                             <AvatarImage src="https://github.com/shadcn.png" />
                          ) : (
                             <AvatarFallback className="bg-primary text-primary-foreground text-xs">SP</AvatarFallback>
                          )}
                          <AvatarFallback>U</AvatarFallback>
                       </Avatar>
                       
                       <div className={cn(
                          "flex flex-col gap-1",
                          msg.sender === 'user' ? "items-end" : "items-start"
                       )}>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
                             <span className="font-medium text-foreground">{msg.name}</span>
                             <span>{msg.time}</span>
                          </div>
                          <div className={cn(
                             "p-3.5 text-sm rounded-2xl shadow-sm leading-relaxed",
                             msg.sender === 'user' 
                               ? "bg-primary text-primary-foreground rounded-tr-sm" 
                               : "bg-card border border-border/50 rounded-tl-sm"
                          )}>
                             {msg.content}
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </ScrollArea>

           {/* Input Area */}
           <div className="p-4 bg-card border-t border-border/50">
              <div className="relative">
                 <Textarea 
                   placeholder="输入回复内容..." 
                   className="min-h-[80px] resize-none pr-12 bg-muted/20 border-border/50 focus-visible:ring-1"
                   value={replyText}
                   onChange={(e) => setReplyText(e.target.value)}
                 />
                 <div className="absolute bottom-2 right-2 flex gap-1">
                     <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <Paperclip className="w-4 h-4" />
                     </Button>
                 </div>
              </div>
              <div className="flex justify-between items-center mt-3">
                 <div className="text-xs text-muted-foreground flex gap-4">
                    <span className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
                       <FileText className="w-3.5 h-3.5" /> 插入代码块
                    </span>
                    <span className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
                       <Hash className="w-3.5 h-3.5" /> 引用工单ID
                    </span>
                 </div>
                 <Button size="sm" className="shadow-md shadow-primary/20" disabled={!replyText.trim()}>
                    <Send className="w-4 h-4 mr-2" /> 发送回复
                 </Button>
              </div>
           </div>
        </Card>
      </div>
    </div>
  );
}