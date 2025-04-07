
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, RefreshCw, Server, Trash2, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface McpServer {
  id: string;
  name: string;
  host: string;
  port: number;
  active: boolean;
  status: string;
  last_check: string;
  resources: {
    cpu: number;
    memory: number;
    disk: number;
  };
  tags: string[];
}

const McpServers = () => {
  const [servers, setServers] = useState<McpServer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [newServer, setNewServer] = useState({ name: "", host: "", port: 22 });
  const { toast } = useToast();

  // Fetch servers from database
  const fetchServers = async () => {
    try {
      const { data, error } = await supabase
        .from('mcp_servers')
        .select('*')
        .order('name');
      
      if (error) throw error;
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

  // Initial data fetch
  useEffect(() => {
    fetchServers();
  }, []);

  // Toggle server active state
  const toggleServerActive = async (id: string) => {
    const server = servers.find(s => s.id === id);
    if (!server) return;

    try {
      const { error } = await supabase
        .from('mcp_servers')
        .update({ active: !server.active })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
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

  // Delete server
  const deleteServer = async (id: string) => {
    const server = servers.find(s => s.id === id);
    if (!server) return;

    try {
      const { error } = await supabase
        .from('mcp_servers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
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

  // Add new server
  const addServer = async () => {
    if (!newServer.name || !newServer.host) {
      toast({
        title: "Validation failed",
        description: "Server name and host are required",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('mcp_servers')
        .insert({
          name: newServer.name,
          host: newServer.host,
          port: newServer.port,
          active: true,
          status: 'Pending',
          resources: { cpu: 0, memory: 0, disk: 0 },
          tags: []
        })
        .select();
      
      if (error) throw error;
      
      // Update local state
      if (data) {
        setServers([...servers, data[0]]);
        // Reset form
        setNewServer({ name: "", host: "", port: 22 });
        
        toast({
          title: "Server added",
          description: `${newServer.name} has been added for monitoring`,
        });
      }
    } catch (error) {
      console.error("Error adding server:", error);
      toast({
        title: "Action failed",
        description: "Could not add new server",
        variant: "destructive"
      });
    }
  };

  // Refresh server statuses
  const refreshServerStatuses = () => {
    setIsRefreshing(true);
    fetchServers();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">MCP Server Management</h2>
        <Button 
          onClick={refreshServerStatuses} 
          disabled={isRefreshing}
          variant="outline"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh All'}
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Add New Server</CardTitle>
          <CardDescription>
            Add a new server to the MCP monitoring system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-4 md:col-span-1">
              <Input
                placeholder="Server Name"
                value={newServer.name}
                onChange={(e) => setNewServer({...newServer, name: e.target.value})}
              />
            </div>
            <div className="col-span-4 md:col-span-2">
              <Input
                placeholder="Host (IP or domain)"
                value={newServer.host}
                onChange={(e) => setNewServer({...newServer, host: e.target.value})}
              />
            </div>
            <div className="col-span-4 md:col-span-1">
              <Input
                type="number"
                placeholder="Port"
                value={newServer.port}
                onChange={(e) => setNewServer({...newServer, port: parseInt(e.target.value) || 22})}
              />
            </div>
            <div className="col-span-4">
              <Button className="w-full" onClick={addServer}>
                <Plus className="h-4 w-4 mr-2" /> Add Server
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>MCP Servers</CardTitle>
          <CardDescription>
            Manage and monitor all servers in your infrastructure
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="p-8 text-center">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto" />
              <p className="mt-2 text-muted-foreground">Loading servers...</p>
            </div>
          ) : servers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Host</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Resources</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {servers.map((server) => (
                  <TableRow key={server.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Server className="h-4 w-4 mr-2 text-primary" />
                        {server.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      {server.host}:{server.port}
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        server.status === 'Online' ? 'default' : 
                        server.status === 'Offline' ? 'destructive' : 
                        'secondary'
                      }>
                        {server.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span>CPU:</span>
                          <span>{server.resources.cpu}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Memory:</span>
                          <span>{server.resources.memory}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Disk:</span>
                          <span>{server.resources.disk}%</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch 
                        checked={server.active} 
                        onCheckedChange={() => toggleServerActive(server.id)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-destructive"
                          onClick={() => deleteServer(server.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-8 text-center border rounded-md">
              <Server className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <h3 className="text-lg font-medium">No servers found</h3>
              <p className="text-muted-foreground">
                Add your first server to start monitoring your infrastructure
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default McpServers;
