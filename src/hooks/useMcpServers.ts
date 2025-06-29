import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { mcpServersApi } from '@/api/index';
import type { McpServer } from '@/types/mcp';

export const useMcpServers = () => {
  const [servers, setServers] = useState<McpServer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const fetchServers = async () => {
    try {
      const data = await mcpServersApi.getAll();
      setServers(data || []);
    } catch (error) {
      console.error("Error fetching servers:", error);
      toast({
        title: "Failed to load servers",
        description: "Could not retrieve server list from the database",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const toggleServerActive = async (id: string) => {
    const server = servers.find(s => s.id === id);
    if (!server) return;

    try {
      await mcpServersApi.update(id, { active: !server.active });
      
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
      await mcpServersApi.delete(id);
      
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
        resources: { cpu: 0, memory: 0, disk: 0 },
        tags: []
      };
      
      const data = await mcpServersApi.create(serverData);
      
      if (data) {
        setServers([...servers, data]);
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

  useEffect(() => {
    fetchServers();
  }, []);

  return {
    servers,
    isLoading,
    isRefreshing,
    fetchServers,
    toggleServerActive,
    deleteServer,
    addServer,
    refresh: () => {
      setIsRefreshing(true);
      fetchServers();
    }
  };
};