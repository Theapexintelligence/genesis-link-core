import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useConnection } from '@/hooks/useConnection';
import type { McpServer } from '@/types/mcp';

// Mock data for offline mode
const mockServers: McpServer[] = [
  {
    id: 'mock-1',
    name: 'Production API (Mock)',
    host: 'api.example.com',
    port: 22,
    active: true,
    status: 'Online',
    last_check: new Date().toISOString(),
    resources: { cpu: 45, memory: 60, disk: 30, network_in: 100, network_out: 50 },
    services: [
      { name: 'nginx', status: 'running', port: 80 },
      { name: 'api-server', status: 'running', port: 3000 }
    ],
    alerts: [],
    tags: ['production', 'api']
  },
  {
    id: 'mock-2',
    name: 'Database Server (Mock)',
    host: 'db.example.com',
    port: 22,
    active: true,
    status: 'Online',
    last_check: new Date().toISOString(),
    resources: { cpu: 70, memory: 80, disk: 65, network_in: 200, network_out: 150 },
    services: [
      { name: 'postgresql', status: 'running', port: 5432 },
      { name: 'redis', status: 'running', port: 6379 }
    ],
    alerts: [
      {
        id: 'alert-1',
        timestamp: new Date().toISOString(),
        level: 'warning',
        message: 'High CPU usage detected',
        resolved: false
      }
    ],
    tags: ['production', 'database']
  }
];

export const useMcpServers = () => {
  const [servers, setServers] = useState<McpServer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [useOfflineMode, setUseOfflineMode] = useState(false);
  const { toast } = useToast();
  const { isConnected, reconnect } = useConnection('supabase');

  const fetchServers = async (forceOnline = false) => {
    try {
      setIsRefreshing(true);

      // Try online first if connected or forced
      if ((isConnected('supabase') || forceOnline) && !useOfflineMode) {
        try {
          const { data, error } = await supabase
            .from('mcp_servers')
            .select('*')
            .order('name') as { data: McpServer[] | null; error: Error | null };
          
          if (error) throw error;
          
          setServers(data || []);
          setUseOfflineMode(false);
          
          if (data && data.length === 0) {
            // If no data, seed with sample data
            await seedSampleData();
          }
          
          return;
        } catch (error) {
          console.warn('Online fetch failed, trying offline mode:', error);
        }
      }

      // Fallback to offline mode
      console.log('Using offline mode with mock data');
      setServers(mockServers);
      setUseOfflineMode(true);
      
      if (!forceOnline) {
        toast({
          title: "Offline Mode",
          description: "Using cached data. Some features may be limited.",
          variant: "default"
        });
      }

    } catch (error) {
      console.error("Error fetching servers:", error);
      
      // Always fallback to mock data
      setServers(mockServers);
      setUseOfflineMode(true);
      
      toast({
        title: "Connection Error",
        description: "Using offline mode with sample data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const seedSampleData = async () => {
    try {
      const sampleServers = [
        {
          name: 'Production API',
          host: 'api.example.com',
          port: 22,
          active: true,
          status: 'Online',
          resources: { cpu: 45, memory: 60, disk: 30, network_in: 100, network_out: 50 },
          services: [
            { name: 'nginx', status: 'running', port: 80 },
            { name: 'api-server', status: 'running', port: 3000 }
          ],
          alerts: [],
          tags: ['production', 'api']
        },
        {
          name: 'Database Server',
          host: 'db.example.com',
          port: 22,
          active: true,
          status: 'Online',
          resources: { cpu: 70, memory: 80, disk: 65, network_in: 200, network_out: 150 },
          services: [
            { name: 'postgresql', status: 'running', port: 5432 },
            { name: 'redis', status: 'running', port: 6379 }
          ],
          alerts: [
            {
              id: 'alert-1',
              timestamp: new Date().toISOString(),
              level: 'warning',
              message: 'High CPU usage detected',
              resolved: false
            }
          ],
          tags: ['production', 'database']
        },
        {
          name: 'Development Server',
          host: 'dev.example.com',
          port: 22,
          active: true,
          status: 'Online',
          resources: { cpu: 20, memory: 40, disk: 25, network_in: 50, network_out: 30 },
          services: [
            { name: 'node', status: 'running', port: 3000 },
            { name: 'webpack', status: 'running', port: 8080 }
          ],
          alerts: [],
          tags: ['development']
        }
      ];

      const { error } = await supabase
        .from('mcp_servers')
        .insert(sampleServers);

      if (!error) {
        console.log('Sample data seeded successfully');
        fetchServers(true); // Refetch after seeding
      }
    } catch (error) {
      console.error('Error seeding sample data:', error);
    }
  };

  const toggleServerActive = async (id: string) => {
    const server = servers.find(s => s.id === id);
    if (!server) return;

    try {
      if (useOfflineMode) {
        // Update local state only
        setServers(servers.map(s => 
          s.id === id ? { ...s, active: !s.active } : s
        ));
        
        toast({
          title: "Offline Mode",
          description: `Server ${!server.active ? "activated" : "deactivated"} locally`,
        });
        return;
      }

      const { error } = await supabase
        .from('mcp_servers')
        .update({ active: !server.active })
        .eq('id', id);
      
      if (error) throw error;
      
      setServers(servers.map(s => 
        s.id === id ? { ...s, active: !s.active } : s
      ));
      
      toast({
        title: `Server ${!server.active ? "activated" : "deactivated"}`,
        description: `${server.name} has been ${!server.active ? "activated" : "deactivated"}`,
      });
    } catch (error) {
      console.error("Error toggling server:", error);
      toast({
        title: "Action failed",
        description: "Could not update server status",
        variant: "destructive"
      });
    }
  };

  const deleteServer = async (id: string) => {
    const server = servers.find(s => s.id === id);
    if (!server) return;

    try {
      if (useOfflineMode) {
        // Update local state only
        setServers(servers.filter(s => s.id !== id));
        
        toast({
          title: "Offline Mode",
          description: `${server.name} removed locally`,
        });
        return;
      }

      const { error } = await supabase
        .from('mcp_servers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setServers(servers.filter(s => s.id !== id));
      
      toast({
        title: "Server removed",
        description: `${server.name} has been removed from monitoring`,
      });
    } catch (error) {
      console.error("Error deleting server:", error);
      toast({
        title: "Action failed",
        description: "Could not delete server",
        variant: "destructive"
      });
    }
  };

  const addServer = async (newServer: { name: string; host: string; port: number }) => {
    try {
      const serverData = {
        name: newServer.name,
        host: newServer.host,
        port: newServer.port,
        active: true,
        status: 'Pending',
        last_check: new Date().toISOString(),
        resources: { cpu: 0, memory: 0, disk: 0, network_in: 0, network_out: 0 },
        services: [],
        alerts: [],
        tags: []
      };

      if (useOfflineMode) {
        // Add to local state only
        const mockServer: McpServer = {
          ...serverData,
          id: `mock-${Date.now()}`,
        };
        
        setServers([...servers, mockServer]);
        
        toast({
          title: "Offline Mode",
          description: `${newServer.name} added locally`,
        });
        return true;
      }

      const { data, error } = await supabase
        .from('mcp_servers')
        .insert(serverData)
        .select() as { data: McpServer[] | null; error: Error | null };
      
      if (error) throw error;
      
      if (data) {
        setServers([...servers, data[0]]);
        toast({
          title: "Server added",
          description: `${newServer.name} has been added for monitoring`,
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error adding server:", error);
      toast({
        title: "Action failed",
        description: "Could not add new server",
        variant: "destructive"
      });
      return false;
    }
  };

  const forceOnlineMode = () => {
    setUseOfflineMode(false);
    reconnect('supabase');
    fetchServers(true);
  };

  const forceOfflineMode = () => {
    setUseOfflineMode(true);
    setServers(mockServers);
    toast({
      title: "Offline Mode Enabled",
      description: "Using local mock data",
    });
  };

  useEffect(() => {
    fetchServers();
  }, []);

  // Auto-retry when connection is restored
  useEffect(() => {
    if (isConnected('supabase') && useOfflineMode) {
      console.log('Connection restored, switching back to online mode');
      forceOnlineMode();
    }
  }, [isConnected('supabase')]);

  return {
    servers,
    isLoading,
    isRefreshing,
    useOfflineMode,
    fetchServers,
    toggleServerActive,
    deleteServer,
    addServer,
    forceOnlineMode,
    forceOfflineMode,
    refresh: () => {
      setIsRefreshing(true);
      fetchServers();
    }
  };
};