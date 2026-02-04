export interface Node {
  id: number;
  name: string;
  agentToken: string;
  ipv4: string | null;
  ipv6: string | null;
  totalCpu: number | null;
  totalRamMb: number | null;
  lastHeartbeat: string | null;
  status: number;
  regionId: number | null;
  createdAt: string;
  updatedAt: string;
}

// 兼容旧代码的别名
export type Server = Node;
