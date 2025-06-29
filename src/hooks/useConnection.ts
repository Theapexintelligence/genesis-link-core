import { useState, useEffect } from 'react';
import { connectionManager } from '@/lib/connectionManager';

export function useConnection(connectionId?: string) {
  const [statuses, setStatuses] = useState(connectionManager.getAllConnectionStatuses());
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Update online status
    const handleOnline = () => {
      setIsOnline(true);
      console.log('🌐 Network is back online!');
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      console.log('📱 Network went offline, but we still have love!');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Subscribe to all connection changes
    const unsubscribes: Function[] = [];

    for (const id of ['supabase', 'api', 'websocket', 'local']) {
      const unsubscribe = connectionManager.onConnectionChange(id, (status: string) => {
        setStatuses(connectionManager.getAllConnectionStatuses());
      });
      unsubscribes.push(unsubscribe);
    }

    // Initial status check
    setStatuses(connectionManager.getAllConnectionStatuses());

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubscribes.forEach(unsub => unsub());
    };
  }, []);

  const reconnect = (id?: string) => {
    if (id) {
      connectionManager.forceReconnect(id);
    } else {
      connectionManager.forceReconnectAll();
    }
  };

  const isConnected = (id: string) => {
    return connectionManager.isConnected(id);
  };

  const getStatus = (id: string) => {
    return connectionManager.getConnectionStatus(id);
  };

  if (connectionId) {
    return {
      status: getStatus(connectionId),
      isConnected: () => isConnected(connectionId),
      reconnect: () => reconnect(connectionId),
      isOnline
    };
  }

  return {
    statuses,
    isConnected,
    getStatus,
    reconnect,
    isOnline,
    isAnyConnected: connectionManager.isAnyConnected()
  };
}