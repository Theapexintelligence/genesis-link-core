import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, RefreshCw, Server, Trash2, Settings } from "lucide-react";
import { useMcpServers } from "@/hooks/useMcpServers";

const McpServers = () => {
  const [newServer, setNewServer] = useState({ name: "", host: "", port: 22 });
  const { 
    servers, 
    isLoading, 
    isRefreshing, 
    refresh, 
    toggleServerActive, 
    deleteServer, 
    addServer 
  } = useMcpServers();

  const handleAddServer = async () => {
    if (!newServer.name || !newServer.host) return;
    
    const success = await addServer(newServer);
    if (success) {
      setNewServer({ name: "", host: "", port: 22 });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">MCP Server Management</h2>
        <Button 
          onClick={refresh} 
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
              <Button className="w-full" onClick={handleAddServer}>
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
