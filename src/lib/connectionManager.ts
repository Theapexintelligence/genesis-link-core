/**
 * Comprehensive Connection Manager
 * Handles all types of connections with multiple fallback strategies
 */

import { supabase } from '@/integrations/supabase/client';

export interface ConnectionConfig {
  name: string;
  type: 'supabase' | 'api' | 'websocket' | 'local';
  url?: string;
  timeout?: number;
  retryAttempts?: number;
  fallbackStrategy?: 'offline' | 'mock' | 'cache';
}

export class ConnectionManager {
  private connections: Map<string, any> = new Map();
  private connectionStatus: Map<string, 'connected' | 'disconnected' | 'connecting' | 'error'> = new Map();
  private retryTimers: Map<string, NodeJS.Timeout> = new Map();
  private listeners: Map<string, Function[]> = new Map();

  constructor() {
    this.initializeConnections();
    this.setupHealthChecks();
    this.setupEventListeners();
  }

  private initializeConnections() {
    // Initialize Supabase connection
    this.registerConnection('supabase', {
      name: 'Supabase Database',
      type: 'supabase',
      timeout: 10000,
      retryAttempts: 3,
      fallbackStrategy: 'offline'
    });

    // Initialize API connection
    this.registerConnection('api', {
      name: 'Backend API',
      type: 'api',
      url: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
      timeout: 5000,
      retryAttempts: 5,
      fallbackStrategy: 'mock'
    });

    // Initialize WebSocket connection
    this.registerConnection('websocket', {
      name: 'Real-time Updates',
      type: 'websocket',
      url: 'ws://localhost:8080/ws',
      timeout: 3000,
      retryAttempts: 10,
      fallbackStrategy: 'cache'
    });
  }

  private setupHealthChecks() {
    // Check connections every 30 seconds
    setInterval(() => {
      this.checkAllConnections();
    }, 30000);

    // Initial health check
    setTimeout(() => {
      this.checkAllConnections();
    }, 1000);
  }

  private setupEventListeners() {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      console.log('Network back online, reconnecting...');
      this.reconnectAll();
    });

    window.addEventListener('offline', () => {
      console.log('Network offline, switching to fallback mode...');
      this.handleOfflineMode();
    });

    // Listen for visibility changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.checkAllConnections();
      }
    });
  }

  registerConnection(id: string, config: ConnectionConfig) {
    this.connections.set(id, config);
    this.connectionStatus.set(id, 'disconnected');
    this.listeners.set(id, []);
    this.connect(id);
  }

  async connect(id: string): Promise<boolean> {
    const config = this.connections.get(id);
    if (!config) return false;

    this.connectionStatus.set(id, 'connecting');
    this.notifyListeners(id, 'connecting');

    try {
      let success = false;

      switch (config.type) {
        case 'supabase':
          success = await this.connectSupabase();
          break;
        case 'api':
          success = await this.connectAPI(config);
          break;
        case 'websocket':
          success = await this.connectWebSocket(config);
          break;
        case 'local':
          success = await this.connectLocal(config);
          break;
      }

      if (success) {
        this.connectionStatus.set(id, 'connected');
        this.notifyListeners(id, 'connected');
        this.clearRetryTimer(id);
        return true;
      } else {
        throw new Error(`Failed to connect to ${config.name}`);
      }
    } catch (error) {
      console.error(`Connection failed for ${id}:`, error);
      this.connectionStatus.set(id, 'error');
      this.notifyListeners(id, 'error');
      this.scheduleRetry(id);
      return false;
    }
  }

  private async connectSupabase(): Promise<boolean> {
    try {
      const { data, error } = await supabase.from('mcp_servers').select('count').limit(1);
      return !error;
    } catch (error) {
      console.error('Supabase connection failed:', error);
      return false;
    }
  }

  private async connectAPI(config: ConnectionConfig): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout || 5000);

      const response = await fetch(`${config.url}/health`, {
        signal: controller.signal,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.error('API connection failed:', error);
      return false;
    }
  }

  private async connectWebSocket(config: ConnectionConfig): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const ws = new WebSocket(config.url!);
        
        const timeout = setTimeout(() => {
          ws.close();
          resolve(false);
        }, config.timeout || 3000);

        ws.onopen = () => {
          clearTimeout(timeout);
          ws.close();
          resolve(true);
        };

        ws.onerror = () => {
          clearTimeout(timeout);
          resolve(false);
        };
      } catch (error) {
        resolve(false);
      }
    });
  }

  private async connectLocal(config: ConnectionConfig): Promise<boolean> {
    // Always succeeds for local connections
    return true;
  }

  private scheduleRetry(id: string) {
    const config = this.connections.get(id);
    if (!config) return;

    this.clearRetryTimer(id);

    const retryDelay = (config.retryAttempts || 3) * 1000;
    const timer = setTimeout(() => {
      this.connect(id);
    }, retryDelay);

    this.retryTimers.set(id, timer);
  }

  private clearRetryTimer(id: string) {
    const timer = this.retryTimers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.retryTimers.delete(id);
    }
  }

  private async checkAllConnections() {
    for (const [id] of this.connections) {
      if (this.connectionStatus.get(id) !== 'connecting') {
        this.connect(id);
      }
    }
  }

  private reconnectAll() {
    for (const [id] of this.connections) {
      this.connect(id);
    }
  }

  private handleOfflineMode() {
    for (const [id] of this.connections) {
      this.connectionStatus.set(id, 'disconnected');
      this.notifyListeners(id, 'offline');
    }
  }

  onConnectionChange(id: string, callback: Function) {
    const listeners = this.listeners.get(id) || [];
    listeners.push(callback);
    this.listeners.set(id, listeners);

    // Return unsubscribe function
    return () => {
      const currentListeners = this.listeners.get(id) || [];
      const index = currentListeners.indexOf(callback);
      if (index > -1) {
        currentListeners.splice(index, 1);
        this.listeners.set(id, currentListeners);
      }
    };
  }

  private notifyListeners(id: string, status: string) {
    const listeners = this.listeners.get(id) || [];
    listeners.forEach(callback => {
      try {
        callback(status);
      } catch (error) {
        console.error('Error in connection listener:', error);
      }
    });
  }

  getConnectionStatus(id: string) {
    return this.connectionStatus.get(id) || 'disconnected';
  }

  getAllConnectionStatuses() {
    const statuses: Record<string, string> = {};
    for (const [id] of this.connections) {
      statuses[id] = this.getConnectionStatus(id);
    }
    return statuses;
  }

  isConnected(id: string): boolean {
    return this.getConnectionStatus(id) === 'connected';
  }

  isAnyConnected(): boolean {
    for (const [id] of this.connections) {
      if (this.isConnected(id)) {
        return true;
      }
    }
    return false;
  }

  forceReconnect(id: string) {
    this.clearRetryTimer(id);
    this.connect(id);
  }

  forceReconnectAll() {
    this.reconnectAll();
  }
}

// Global connection manager instance
export const connectionManager = new ConnectionManager();