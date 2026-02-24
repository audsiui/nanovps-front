import { Node } from '../components/types';

// 服务器实时状态
export interface ServerRealtimeStats {
  cpuPercent: number;
  memoryUsedMb: number;
  memoryTotalMb: number;
  diskUsedGb: number;
  diskTotalGb: number;
  networkUpMbps: number;
  networkDownMbps: number;
  trafficInGb: number;
  trafficOutGb: number;
}

// 容器实例
export interface ContainerInstance {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'error';
  cpuPercent: number;
  memoryUsedMb: number;
  memoryLimitMb: number;
  networkUpMbps: number;
  networkDownMbps: number;
  trafficInGb: number;
  trafficOutGb: number;
  historyData: MetricPoint[];
}

// 历史监控数据点
export interface MetricPoint {
  timestamp: number;
  cpu: number;
  memory: number;
  disk: number;
  networkUp: number;
  networkDown: number;
}

// 服务器详情页面Props
export interface ServerDetailPageProps {
  server: Node | null;
}
