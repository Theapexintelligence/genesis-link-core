
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HardDrive, Cpu, Memory, Clock, Network, RefreshCw, AlertTriangle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ServerDetailsProps {
  serverId: string;
}

interface ServerDetail {
  id: string;
  name: string;
  host: string;
  port: number;
  status: string;
  active: boolean;
  os: string;
  version: string;
  uptime: string;
  last_check: string;
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
}

const ServerDetails = ({ serverId }: ServerDetailsProps) => {
  const [server, setServer] = useState<ServerDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchServerDetails = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('mcp_servers')
        .select('*')
        .eq('id', serverId)
        .single();
      
      if (error) throw error;
      
      // In a real app, you would fetch more detailed information here
      // This is just mocking the data structure
      const serverWithDetails: ServerDetail = {
        ...data,
        os: data.os || "Linux Ubuntu 22.04",
        version: data.version || "5.15.0-76-generic",
        uptime: data.uptime || "3 days, 7 hours",
        services: data.services || [
          { name: "nginx", status: "running", port: 80 },
          { name: "postgresql", status: "running", port: 5432 },
          { name: "redis", status: "running", port: 6379 }
        ],
        alerts: data.alerts || [
          { id: "1", timestamp: "2025-04-05 14:32:17", level: "warning", message: "High CPU usage detected", resolved: false },
          { id: "2", timestamp: "2025-04-05 10:15:42", level: "critical", message: "Disk space below 10%", resolved: true }
        ],
        resources: {
          ...data.resources,
          network_in: data.resources?.network_in || 2.5,
          network_out: data.resources?.network_out || 1.8
        }
      };
      
      setServer(serverWithDetails);
    } catch (error) {
      console.error("Error fetching server details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServerDetails();
    
    // In a real application, you might set up a real-time subscription here
    const interval = setInterval(fetchServerDetails, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [serverId]);

  const getResourceColor = (value: number) => {
    if (value >= 90) return "bg-red-500";
    if (value >= 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'running': return 'text-green-500';
      case 'stopped': return 'text-red-500';
      case 'warning': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-8 flex justify-center items-center">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading server details...</span>
        </CardContent>
      </Card>
    );
  }

  if (!server) {
    return (
      <Card className="w-full">
        <CardContent className="p-8 text-center">
          <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
          <h3 className="text-lg font-medium">Server not found</h3>
          <p className="text-muted-foreground">
            The requested server could not be found or may have been deleted.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{server.name}</CardTitle>
              <CardDescription className="mt-1">
                {server.host}:{server.port} - {server.os}
              </CardDescription>
            </div>
            <Badge 
              variant={server.status === 'Online' ? 'default' : 'destructive'}
              className="px-3 py-1 text-base"
            >
              {server.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="col-span-4 md:col-span-1">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Uptime</p>
                  <p className="text-sm text-muted-foreground">{server.uptime}</p>
                </div>
              </div>
            </div>
            <div className="col-span-4 md:col-span-1">
              <div className="flex items-center">
                <Network className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Network</p>
                  <p className="text-sm text-muted-foreground">↓ {server.resources.network_in} MB/s ↑ {server.resources.network_out} MB/s</p>
                </div>
              </div>
            </div>
            <div className="col-span-4 md:col-span-2">
              <div className="flex items-center">
                <RefreshCw className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Last Check</p>
                  <p className="text-sm text-muted-foreground">{server.last_check || 'Just now'}</p>
                </div>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="pt-4">
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Cpu className="h-5 w-5 mr-2 text-primary" />
                      <span className="font-medium">CPU Usage</span>
                    </div>
                    <span className="font-mono">{server.resources.cpu}%</span>
                  </div>
                  <Progress value={server.resources.cpu} className={getResourceColor(server.resources.cpu)} />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Memory className="h-5 w-5 mr-2 text-primary" />
                      <span className="font-medium">Memory Usage</span>
                    </div>
                    <span className="font-mono">{server.resources.memory}%</span>
                  </div>
                  <Progress value={server.resources.memory} className={getResourceColor(server.resources.memory)} />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <HardDrive className="h-5 w-5 mr-2 text-primary" />
                      <span className="font-medium">Disk Usage</span>
                    </div>
                    <span className="font-mono">{server.resources.disk}%</span>
                  </div>
                  <Progress value={server.resources.disk} className={getResourceColor(server.resources.disk)} />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="services" className="pt-4">
              <div className="border rounded-md">
                <div className="grid grid-cols-12 gap-4 p-3 font-medium border-b bg-muted/50">
                  <div className="col-span-5">Service</div>
                  <div className="col-span-4">Status</div>
                  <div className="col-span-3">Port</div>
                </div>
                
                <div className="divide-y">
                  {server.services.map((service, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4 p-3 items-center">
                      <div className="col-span-5 font-medium">{service.name}</div>
                      <div className="col-span-4">
                        <span className={getStatusColor(service.status)}>● </span>
                        {service.status}
                      </div>
                      <div className="col-span-3 font-mono">{service.port}</div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="alerts" className="pt-4">
              <div className="border rounded-md">
                <div className="grid grid-cols-12 gap-4 p-3 font-medium border-b bg-muted/50">
                  <div className="col-span-3">Time</div>
                  <div className="col-span-2">Level</div>
                  <div className="col-span-5">Message</div>
                  <div className="col-span-2">Status</div>
                </div>
                
                <div className="divide-y">
                  {server.alerts.map((alert) => (
                    <div key={alert.id} className="grid grid-cols-12 gap-4 p-3 items-center">
                      <div className="col-span-3 text-sm">{alert.timestamp}</div>
                      <div className="col-span-2">
                        <Badge variant={alert.level === 'critical' ? 'destructive' : 'warning'}>
                          {alert.level}
                        </Badge>
                      </div>
                      <div className="col-span-5">{alert.message}</div>
                      <div className="col-span-2">
                        {alert.resolved ? (
                          <div className="flex items-center text-green-500">
                            <CheckCircle2 className="h-4 w-4 mr-1" /> Resolved
                          </div>
                        ) : (
                          <div className="flex items-center text-amber-500">
                            <AlertTriangle className="h-4 w-4 mr-1" /> Active
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="border-t bg-muted/50 flex justify-between">
          <div className="text-sm text-muted-foreground">
            Server ID: {server.id}
          </div>
          <Button onClick={fetchServerDetails}>
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh Data
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ServerDetails;
