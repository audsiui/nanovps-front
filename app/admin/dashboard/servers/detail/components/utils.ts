import { MetricPoint, ContainerInstance } from '../types';

// 生成48小时历史数据（每5分钟一个点）
export const generateHistoryData = (): MetricPoint[] => {
  const data: MetricPoint[] = [];
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;
  const fortyEightHours = 48 * 60 * 60 * 1000;
  const points = fortyEightHours / fiveMinutes;

  for (let i = points; i >= 0; i--) {
    const timestamp = now - i * fiveMinutes;
    const hour = new Date(timestamp).getHours();
    // 模拟白天负载高，晚上负载低
    const baseLoad = hour >= 9 && hour <= 22 ? 60 : 30;
    const randomFactor = () => (Math.random() - 0.5) * 20;

    data.push({
      timestamp,
      cpu: Math.max(0, Math.min(100, baseLoad + randomFactor())),
      memory: Math.max(0, Math.min(100, baseLoad + 10 + randomFactor())),
      disk: Math.max(0, Math.min(100, 40 + randomFactor() * 0.5)),
      networkUp: Math.max(0, 50 + randomFactor()),
      networkDown: Math.max(0, 80 + randomFactor()),
    });
  }
  return data;
};

// 生成容器历史数据
export const generateContainerHistoryData = (baseLoad: number): MetricPoint[] => {
  const data: MetricPoint[] = [];
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;
  const fortyEightHours = 48 * 60 * 60 * 1000;
  const points = fortyEightHours / fiveMinutes;

  for (let i = points; i >= 0; i--) {
    const timestamp = now - i * fiveMinutes;
    const hour = new Date(timestamp).getHours();
    // 每个容器有不同的负载模式
    const timeFactor = hour >= 9 && hour <= 22 ? 1 : 0.5;
    const randomFactor = () => (Math.random() - 0.5) * 15;

    data.push({
      timestamp,
      cpu: Math.max(0, Math.min(100, baseLoad * timeFactor + randomFactor())),
      memory: Math.max(0, Math.min(100, baseLoad * 1.2 * timeFactor + randomFactor())),
      disk: Math.max(0, Math.min(100, 30 + randomFactor() * 0.3)),
      networkUp: Math.max(0, baseLoad * 0.5 * timeFactor + randomFactor()),
      networkDown: Math.max(0, baseLoad * 0.8 * timeFactor + randomFactor()),
    });
  }
  return data;
};

// 格式化流量
export const formatTraffic = (gb: number): string => {
  if (gb >= 1024) {
    return `${(gb / 1024).toFixed(2)} TB`;
  }
  return `${gb.toFixed(2)} GB`;
};

// 格式化时间
export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

// 生成容器数据
export const generateContainers = (): ContainerInstance[] => {
  const containers: ContainerInstance[] = [
    {
      id: 'c1',
      name: 'web-server-01',
      status: 'running',
      cpuPercent: 45.2,
      memoryUsedMb: 2048,
      memoryLimitMb: 4096,
      diskUsedGb: 15.5,
      diskLimitGb: 50,
      networkUpMbps: 12.5,
      networkDownMbps: 45.3,
      trafficInGb: 128.5,
      trafficOutGb: 256.2,
      historyData: generateContainerHistoryData(45),
    },
    {
      id: 'c2',
      name: 'database-01',
      status: 'running',
      cpuPercent: 32.8,
      memoryUsedMb: 6144,
      memoryLimitMb: 8192,
      diskUsedGb: 120.3,
      diskLimitGb: 200,
      networkUpMbps: 8.2,
      networkDownMbps: 15.7,
      trafficInGb: 89.4,
      trafficOutGb: 156.8,
      historyData: generateContainerHistoryData(35),
    },
    {
      id: 'c3',
      name: 'cache-server-01',
      status: 'running',
      cpuPercent: 18.5,
      memoryUsedMb: 3072,
      memoryLimitMb: 4096,
      diskUsedGb: 5.2,
      diskLimitGb: 20,
      networkUpMbps: 25.6,
      networkDownMbps: 30.2,
      trafficInGb: 245.8,
      trafficOutGb: 198.4,
      historyData: generateContainerHistoryData(20),
    },
    {
      id: 'c4',
      name: 'worker-01',
      status: 'stopped',
      cpuPercent: 0,
      memoryUsedMb: 0,
      memoryLimitMb: 2048,
      diskUsedGb: 8.5,
      diskLimitGb: 30,
      networkUpMbps: 0,
      networkDownMbps: 0,
      trafficInGb: 45.2,
      trafficOutGb: 32.1,
      historyData: generateContainerHistoryData(25),
    },
  ];
  return containers;
};
