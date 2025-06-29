import { useConnection } from '@/hooks/useConnection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Wifi, WifiOff, Database, Server, Globe, Zap } from 'lucide-react';

const ConnectionStatus = () => {
  const { statuses, reconnect, isOnline, isAnyConnected } = useConnection();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500 animate-pulse';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (id: string) => {
    switch (id) {
      case 'supabase': return <Database className="h-4 w-4" />;
      case 'api': return <Server className="h-4 w-4" />;
      case 'websocket': return <Zap className="h-4 w-4" />;
      case 'local': return <Globe className="h-4 w-4" />;
      default: return <Server className="h-4 w-4" />;
    }
  };

  const getConnectionName = (id: string) => {
    switch (id) {
      case 'supabase': return 'Database';
      case 'api': return 'Backend API';
      case 'websocket': return 'Real-time';
      case 'local': return 'Local Storage';
      default: return id;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {isOnline ? <Wifi className="h-5 w-5 text-green-500" /> : <WifiOff className="h-5 w-5 text-red-500" />}
            Connection Status
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => reconnect()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reconnect All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Network Status:</span>
            <Badge variant={isOnline ? "default" : "destructive"}>
              {isOnline ? "Online" : "Offline"}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">System Status:</span>
            <Badge variant={isAnyConnected ? "default" : "destructive"}>
              {isAnyConnected ? "Operational" : "Degraded"}
            </Badge>
          </div>

          <div className="border-t pt-3">
            <h4 className="text-sm font-medium mb-2">Service Connections:</h4>
            <div className="space-y-2">
              {Object.entries(statuses).map(([id, status]) => (
                <div key={id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(id)}
                    <span className="text-sm">{getConnectionName(id)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`} />
                    <span className="text-xs capitalize">{status}</span>
                    {status === 'error' && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => reconnect(id)}
                        className="h-6 px-2"
                      >
                        Retry
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionStatus;