export interface Node {
  id: number;
  name: string;
  agentToken: string;
  ipv4: string;
  ipv6?: string;
  totalCpu: number;
  totalRamMb: number;
  allocatableDiskGb: number;
  /** 已使用硬盘容量 (GB)，用于展示实例占用的空间 */
  usedDiskGb?: number;
  lastHeartbeat: string | null;
  status: number;
  regionId: number;
  createdAt: string;
  updatedAt: string;
  /** WebSocket 连接状态（Agent 在线） */
  isOnline?: boolean;
}
