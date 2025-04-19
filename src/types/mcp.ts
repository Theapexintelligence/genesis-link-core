
export interface McpServer {
  id: string;
  name: string;
  host: string;
  port: number;
  active: boolean;
  status: string;
  last_check: string;
  os?: string;
  version?: string;
  uptime?: string;
  resources: {
    cpu: number;
    memory: number;
    disk: number;
    network_in: number;
    network_out: number;
  };
  services: Array<{
    name: string;
    status: string;
    port: number;
  }>;
  alerts: Array<{
    id: string;
    timestamp: string;
    level: string;
    message: string;
    resolved: boolean;
  }>;
  tags: string[];
  created_at?: string;
  updated_at?: string;
}
