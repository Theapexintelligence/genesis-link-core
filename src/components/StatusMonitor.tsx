
import { useState, useEffect } from "react";
import { useAdapters } from "@/contexts/AdaptersContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ArrowDownUp, RefreshCw } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const StatusMonitor = () => {
  const { adapters, toggleAdapter } = useAdapters();
  const [healthScores, setHealthScores] = useState<Record<string, number>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'health'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Simulate checking all connection statuses
  const refreshAllStatuses = () => {
    setIsRefreshing(true);
    
    // In a real application, this would make actual API calls to check services
    setTimeout(() => {
      const newHealthScores: Record<string, number> = {};
      
      adapters.forEach(adapter => {
        // Simulate health check with random scores
        // In a real app, this would be based on actual metrics
        const randomScore = adapter.active 
          ? Math.floor(Math.random() * 30) + 70 // 70-100 for active
          : Math.floor(Math.random() * 70) // 0-70 for inactive
        
        newHealthScores[adapter.id] = randomScore;
      });
      
      setHealthScores(newHealthScores);
      setIsRefreshing(false);
    }, 1500);
  };
  
  // Initial health check
  useEffect(() => {
    refreshAllStatuses();
    
    // Set up recurring health checks every 2 minutes
    const interval = setInterval(refreshAllStatuses, 120000);
    return () => clearInterval(interval);
  }, [adapters.length]); // Re-initialize when adapters change
  
  const toggleSort = (column: 'name' | 'status' | 'health') => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };
  
  const sortedAdapters = [...adapters].sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === 'status') {
      comparison = (a.active === b.active) ? 0 : a.active ? -1 : 1;
    } else if (sortBy === 'health') {
      const healthA = healthScores[a.id] || 0;
      const healthB = healthScores[b.id] || 0;
      comparison = healthA - healthB;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  
  const getHealthColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Status Monitor</h2>
        <Button 
          onClick={refreshAllStatuses} 
          disabled={isRefreshing}
          variant="outline"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh All'}
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Connection Health</CardTitle>
          <CardDescription>
            Monitor and manage the status of all your service connections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 font-medium border-b bg-muted/50">
              <div className="col-span-3 flex items-center cursor-pointer" onClick={() => toggleSort('name')}>
                Name <ArrowDownUp className="h-3 w-3 ml-1" />
              </div>
              <div className="col-span-2 flex items-center cursor-pointer" onClick={() => toggleSort('status')}>
                Status <ArrowDownUp className="h-3 w-3 ml-1" />
              </div>
              <div className="col-span-3">Service</div>
              <div className="col-span-3 flex items-center cursor-pointer" onClick={() => toggleSort('health')}>
                Health <ArrowDownUp className="h-3 w-3 ml-1" />
              </div>
              <div className="col-span-1">Toggle</div>
            </div>
            
            <div className="divide-y">
              {sortedAdapters.map(adapter => {
                const healthScore = healthScores[adapter.id] || 0;
                
                return (
                  <div key={adapter.id} className="grid grid-cols-12 gap-4 p-4 items-center">
                    <div className="col-span-3 font-medium">{adapter.name}</div>
                    <div className="col-span-2">
                      <Badge variant={adapter.active ? "default" : "secondary"}>
                        {adapter.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="col-span-3 text-muted-foreground">{adapter.service}</div>
                    <div className="col-span-3">
                      <div className="flex items-center space-x-2">
                        <Progress 
                          value={healthScore} 
                          className={getHealthColor(healthScore)}
                        />
                        <span className="text-sm">{healthScore}%</span>
                      </div>
                    </div>
                    <div className="col-span-1">
                      <Switch 
                        checked={adapter.active}
                        onCheckedChange={() => toggleAdapter(adapter.id)}
                      />
                    </div>
                  </div>
                );
              })}
              
              {adapters.length === 0 && (
                <div className="p-4 text-center text-muted-foreground">
                  No connections available. Add connections from the Connections tab.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatusMonitor;
