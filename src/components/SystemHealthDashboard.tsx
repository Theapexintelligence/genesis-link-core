
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useError } from "@/contexts/ErrorContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gauge } from "lucide-react";
import { useNotification } from "@/hooks/useNotification";

interface ServiceHealth {
  name: string;
  status: "healthy" | "degraded" | "critical" | "unknown";
  responseTime: number;
  uptime: number;
  lastIssue?: {
    timestamp: Date;
    message: string;
  };
}

const SystemHealthDashboard = () => {
  const [services, setServices] = useState<ServiceHealth[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>("overview");
  const [refreshInterval, setRefreshInterval] = useState<number>(30); // seconds
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const { errors, getErrorStats } = useError();
  const { notifyInfo } = useNotification();
  
  const errorStats = getErrorStats();

  // Mock data - in a real application, this would be fetched from an API
  useEffect(() => {
    // Simulate fetching service health data
    const mockServices: ServiceHealth[] = [
      {
        name: "API Connector",
        status: "healthy",
        responseTime: 120,
        uptime: 99.98,
      },
      {
        name: "Database",
        status: "healthy",
        responseTime: 45,
        uptime: 99.99,
      },
      {
        name: "Authentication Service",
        status: "degraded",
        responseTime: 350,
        uptime: 99.5,
        lastIssue: {
          timestamp: new Date(Date.now() - 3600000), // 1 hour ago
          message: "Increased latency detected",
        },
      },
      {
        name: "File Storage",
        status: "healthy",
        responseTime: 85,
        uptime: 99.95,
      },
      {
        name: "Notification Service",
        status: "critical",
        responseTime: 750,
        uptime: 95.5,
        lastIssue: {
          timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
          message: "Service unavailable in Europe region",
        },
      },
      {
        name: "Search Engine",
        status: "degraded",
        responseTime: 420,
        uptime: 98.7,
        lastIssue: {
          timestamp: new Date(Date.now() - 7200000), // 2 hours ago
          message: "Elevated error rate on complex queries",
        },
      },
    ];

    setServices(mockServices);
    setLastUpdated(new Date());
  }, []);
  
  // Demo refresh function - would normally fetch new data
  const handleRefresh = () => {
    // In a real app, this would fetch fresh data
    notifyInfo("Refreshing Data", {
      description: "Updating system health information..."
    });
    
    // Simulate data update with slightly changed values
    setServices(prevServices => prevServices.map(service => {
      // Randomly adjust response time slightly up or down (±20ms)
      const responseTimeDelta = Math.floor(Math.random() * 40) - 20;
      
      // 10% chance to change status
      const statusChange = Math.random() > 0.9;
      let newStatus = service.status;
      
      if (statusChange) {
        const statuses: Array<"healthy" | "degraded" | "critical" | "unknown"> = 
          ["healthy", "degraded", "critical", "unknown"];
        
        // Pick a different status
        do {
          newStatus = statuses[Math.floor(Math.random() * statuses.length)];
        } while (newStatus === service.status);
        
        // If status changed to something worse, add a last issue
        if (newStatus === "degraded" || newStatus === "critical") {
          const issues = [
            "Increased latency detected",
            "Higher than normal error rate",
            "Reduced throughput observed",
            "Unexpected response codes",
            "Memory utilization above threshold"
          ];
          
          service.lastIssue = {
            timestamp: new Date(),
            message: issues[Math.floor(Math.random() * issues.length)]
          };
        }
      }
      
      return {
        ...service,
        status: newStatus,
        responseTime: Math.max(10, service.responseTime + responseTimeDelta)
      };
    }));
    
    setLastUpdated(new Date());
  };
  
  // Format relative time
  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };
  
  // Calculate overall system health percentage
  const calculateOverallHealth = (): number => {
    if (services.length === 0) return 0;
    
    const weights = {
      healthy: 1,
      degraded: 0.7,
      critical: 0.3,
      unknown: 0.5
    };
    
    const healthSum = services.reduce((sum, service) => 
      sum + weights[service.status], 0);
    
    return (healthSum / services.length) * 100;
  };
  
  // Get status badge
  const getStatusBadge = (status: ServiceHealth["status"]) => {
    switch (status) {
      case "healthy":
        return <Badge className="bg-green-500">Healthy</Badge>;
      case "degraded":
        return <Badge className="bg-yellow-500">Degraded</Badge>;
      case "critical":
        return <Badge className="bg-red-500">Critical</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };
  
  // Get response time indicator
  const getResponseIndicator = (responseTime: number) => {
    if (responseTime < 100) {
      return <span className="text-green-500">{responseTime}ms</span>;
    } else if (responseTime < 300) {
      return <span className="text-yellow-500">{responseTime}ms</span>;
    } else {
      return <span className="text-red-500">{responseTime}ms</span>;
    }
  };
  
  // Overall health percentage
  const overallHealth = calculateOverallHealth();
  
  // Health status color
  const getHealthColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-500";
    if (percentage >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gauge className="h-6 w-6" />
            <div>
              <CardTitle>System Health</CardTitle>
              <CardDescription>
                Monitoring and diagnostics for all system components
              </CardDescription>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Last updated: {getRelativeTime(lastUpdated)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="errors">Error Correlation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="shadow-sm">
                <CardHeader className="py-3">
                  <CardTitle className="text-base">Overall Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <div className={`text-4xl font-bold ${getHealthColor(overallHealth)}`}>
                      {Math.round(overallHealth)}%
                    </div>
                    <Progress value={overallHealth} className="h-2 mt-2" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm">
                <CardHeader className="py-3">
                  <CardTitle className="text-base">Service Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Healthy:</span>
                      <Badge className="bg-green-500">{services.filter(s => s.status === "healthy").length}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Degraded:</span>
                      <Badge className="bg-yellow-500">{services.filter(s => s.status === "degraded").length}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Critical:</span>
                      <Badge className="bg-red-500">{services.filter(s => s.status === "critical").length}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Unknown:</span>
                      <Badge className="bg-gray-500">{services.filter(s => s.status === "unknown").length}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm">
                <CardHeader className="py-3">
                  <CardTitle className="text-base">Error Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Active:</span>
                      <Badge className="bg-red-500">{errorStats.active}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Resolved:</span>
                      <Badge className="bg-green-500">{errorStats.resolved}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total:</span>
                      <Badge>{errorStats.total}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Coverage:</span>
                      <Badge className="bg-blue-500">100%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* System Metrics */}
            <Card className="shadow-sm">
              <CardHeader className="py-3">
                <CardTitle className="text-base">Key Performance Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Average Response Time</span>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(services.reduce((sum, s) => sum + s.responseTime, 0) / services.length)}ms
                      </span>
                    </div>
                    <Progress value={70} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">System Uptime</span>
                      <span className="text-sm text-muted-foreground">
                        {(services.reduce((sum, s) => sum + s.uptime, 0) / services.length).toFixed(2)}%
                      </span>
                    </div>
                    <Progress value={99} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Error Rate</span>
                      <span className="text-sm text-muted-foreground">0.02%</span>
                    </div>
                    <Progress value={2} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Resource Utilization</span>
                      <span className="text-sm text-muted-foreground">68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Most Recent Issues */}
            <Card className="shadow-sm">
              <CardHeader className="py-3">
                <CardTitle className="text-base">Recent Issues</CardTitle>
              </CardHeader>
              <CardContent>
                {services
                  .filter(service => service.lastIssue)
                  .sort((a, b) => 
                    (b.lastIssue?.timestamp.getTime() || 0) - 
                    (a.lastIssue?.timestamp.getTime() || 0)
                  )
                  .slice(0, 3)
                  .map((service, index) => (
                    <div key={index} className="flex items-start gap-2 py-2 border-b last:border-0">
                      {getStatusBadge(service.status)}
                      <div>
                        <div className="font-medium">{service.name}</div>
                        <div className="text-sm text-muted-foreground">{service.lastIssue?.message}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {getRelativeTime(service.lastIssue?.timestamp || new Date())}
                        </div>
                      </div>
                    </div>
                  ))}
                
                {services.filter(service => service.lastIssue).length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    No recent issues detected
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="services">
            <div className="space-y-4">
              {services.map((service, index) => (
                <Card key={index} className="shadow-sm overflow-hidden">
                  <div className={`h-1 w-full ${
                    service.status === "healthy" ? "bg-green-500" :
                    service.status === "degraded" ? "bg-yellow-500" :
                    service.status === "critical" ? "bg-red-500" : "bg-gray-500"
                  }`} />
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{service.name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-muted-foreground">Status:</span>
                            {getStatusBadge(service.status)}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-muted-foreground">Response:</span>
                            {getResponseIndicator(service.responseTime)}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-muted-foreground">Uptime:</span>
                            <span className="text-green-500">{service.uptime}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {service.lastIssue && (
                      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border text-sm">
                        <div className="font-medium mb-1">Last Issue</div>
                        <div className="text-muted-foreground">{service.lastIssue.message}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {getRelativeTime(service.lastIssue.timestamp)}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="errors">
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-4">Error to Service Correlation</h3>
                
                {errors.length > 0 ? (
                  <div className="space-y-4">
                    {errors.map((error, index) => {
                      // Find a relevant service (in a real app this would be a real correlation)
                      const relatedService = services.find(
                        s => s.name.toLowerCase().includes(error.componentName.toLowerCase())
                      ) || services[index % services.length];
                      
                      return (
                        <div key={index} className="p-3 border rounded-md">
                          <div className="flex justify-between">
                            <div>
                              <div className="font-medium">{error.componentName}</div>
                              <div className="text-sm text-muted-foreground">{error.message}</div>
                            </div>
                            <div>
                              {getStatusBadge(relatedService.status)}
                            </div>
                          </div>
                          
                          <div className="mt-2 pt-2 border-t text-sm">
                            <div className="text-muted-foreground">
                              <span className="font-medium">Related Service:</span> {relatedService.name}
                            </div>
                            <div className="text-muted-foreground">
                              <span className="font-medium">Correlation:</span> Error occurred during period of {
                                relatedService.status === "healthy" ? "normal operation" :
                                relatedService.status === "degraded" ? "degraded performance" :
                                "service disruption"
                              }
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No errors to correlate with services
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            Monitoring {services.length} services
          </div>
          <button
            onClick={handleRefresh}
            className="text-sm text-blue-500 hover:text-blue-700 transition-colors"
          >
            Refresh Now
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemHealthDashboard;
