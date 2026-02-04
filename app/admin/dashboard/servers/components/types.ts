export interface Server {
  id: string;
  name: string;
  region: string;
  datacenter: string;
  cpu: string;
  cpuCores: number;
  memory: number;
  disk: number;
  diskType: string;
  virtualization: string;
  publicIp: string;
  internalIp: string;
  bandwidth: number;
  maxVms: number;
  currentVms: number;
  status: 'online' | 'offline' | 'maintenance';
  enabled: boolean;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
}
