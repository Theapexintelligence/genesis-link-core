/**
 * Ultimate Connection Manager with Infinite Love 💖
 * Handles all types of connections with multiple fallback strategies
 * Built with consciousness and care!
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
  private healthCheckInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeConnections();
    this.setupHealthChecks();
    this.setupEventListeners();
    console.log('💖 Connection Manager initialized with infinite love!');
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
      url: '/api',
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

    // Initialize Local Storage (always works!)
    this.registerConnection('local', {
      name: 'Local Storage',
      type: 'local',
      timeout: 1000,
      retryAttempts: 1,
      fallbackStrategy: 'cache'
    });
  }

  private setupHealthChecks() {
    // Check connections every 30 seconds with love
    this.healthCheckInterval = setInterval(() => {
      this.checkAllConnections();
    }, 30000);

    // Initial health check after a moment
    setTimeout(() => {
      this.checkAllConnections();
    }, 2000);
  }

  private setupEventListeners() {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      console.log('🌐 Network back online, reconnecting with love...');
      this.reconnectAll();
    });

    window.addEventListener('offline', () => {
      console.log('📱 Network offline, switching to offline mode with grace...');
      this.handleOfflineMode();
    });

    // Listen for visibility changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.checkAllConnections();
      }
    });

    // Listen for page unload to cleanup
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });
  }

  registerConnection(id: string, config: ConnectionConfig) {
    this.connections.set(id, config);
    this.connectionStatus.set(id, 'disconnected');
    this.listeners.set(id, []);
    
    // Start connection attempt
    setTimeout(() => {
      this.connect(id);
    }, 100);
  }

  async connect(id: string): Promise<boolean> {
    const config = this.connections.get(id);
    if (!config) {
      console.warn(`❌ No configuration found for connection: ${id}`);
      return false;
    }

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
        console.log(`✅ ${config.name} connected successfully!`);
        return true;
      } else {
        throw new Error(`Failed to connect to ${config.name}`);
      }
    } catch (error) {
      console.warn(`⚠️ Connection failed for ${id}:`, error);
      this.connectionStatus.set(id, 'error');
      this.notifyListeners(id, 'error');
      this.scheduleRetry(id);
      return false;
    }
  }

  private async connectSupabase(): Promise<boolean> {
    try {
      // Simple health check
      const { data, error } = await supabase
        .from('mcp_servers')
        .select('count')
        .limit(1);
      
      return !error;
    } catch (error) {
      console.warn('Supabase connection failed:', error);
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
      // Try alternative health check
      try {
        const response = await fetch('/api/adapters', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        return response.ok || response.status === 401; // 401 is ok, means server is running
      } catch (fallbackError) {
        console.warn('API connection failed:', error);
        return false;
      }
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
    try {
      // Test localStorage availability
      const testKey = '__connection_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  private scheduleRetry(id: string) {
    const config = this.connections.get(id);
    if (!config) return;

    this.clearRetryTimer(id);

    // Exponential backoff with love
    const baseDelay = 2000;
    const maxDelay = 30000;
    const retryDelay = Math.min(baseDelay * Math.pow(2, (config.retryAttempts || 3)), maxDelay);
    
    const timer = setTimeout(() => {
      console.log(`🔄 Retrying connection to ${config.name} with love...`);
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
      const currentStatus = this.connectionStatus.get(id);
      if (currentStatus !== 'connecting') {
        this.connect(id);
      }
    }
  }

  private reconnectAll() {
    console.log('🚀 Reconnecting all services with infinite love!');
    for (const [id] of this.connections) {
      this.clearRetryTimer(id);
      this.connect(id);
    }
  }

  private handleOfflineMode() {
    for (const [id] of this.connections) {
      if (id !== 'local') { // Local storage still works offline
        this.connectionStatus.set(id, 'disconnected');
        this.notifyListeners(id, 'offline');
      }
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
    console.log(`🔄 Force reconnecting ${id} with love!`);
    this.clearRetryTimer(id);
    this.connect(id);
  }

  forceReconnectAll() {
    console.log('🚀 Force reconnecting all services!');
    this.reconnectAll();
  }

  cleanup() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    
    for (const [id] of this.retryTimers) {
      this.clearRetryTimer(id);
    }
    
    console.log('🧹 Connection Manager cleaned up with love!');
  }
}

// Global connection manager instance
export const connectionManager = new ConnectionManager();