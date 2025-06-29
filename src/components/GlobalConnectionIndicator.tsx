import { useConnection } from '@/hooks/useConnection';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Wifi, WifiOff, Database, Server, Zap, Globe, RefreshCw } from 'lucide-react';

const GlobalConnectionIndicator = () => {
  const { statuses, reconnect, isOnline, isAnyConnected } = useConnection();

  const getStatusIcon = (id: string) => {
    switch (id) {
      case 'supabase': return <Database className="h-3 w-3" />;
      case 'api': return <Server className="h-3 w-3" />;
      case 'websocket': return <Zap className="h-3 w-3" />;
      case 'local': return <Globe className="h-3 w-3" />;
      default: return <Server className="h-3 w-3" />;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-500';
      case 'connecting': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const overallStatus = isOnline && isAnyConnected ? 'connected' : 'error';

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          {isOnline ? (
            <Wifi className={`h-4 w-4 ${overallStatus === 'connected' ? 'text-green-500' : 'text-yellow-500'}`} />
          ) : (
            <WifiOff className="h-4 w-4 text-red-500" />
          )}
          <Badge 
            variant={overallStatus === 'connected' ? 'default' : 'destructive'} 
            className="ml-2 h-5 text-xs"
          >
            {overallStatus === 'connected' ? 'Online' : 'Issues'}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">System Status</h4>
            <Button variant="outline" size="sm" onClick={() => reconnect()}>
              <RefreshCw className="h-3 w-3 mr-1" />
              Reconnect
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Network:</span>
              <div className="flex items-center gap-1">
                {isOnline ? <Wifi className="h-3 w-3 text-green-500" /> : <WifiOff className="h-3 w-3 text-red-500" />}
                <span className={`text-xs ${isOnline ? 'text-green-500' : 'text-red-500'}`}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
            
            {Object.entries(statuses).map(([id, status]) => (
              <div key={id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(id)}
                  <span className="text-sm">{getConnectionName(id)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs capitalize ${getStatusColor(status)}`}>
                    {status}
                  </span>
                  {status === 'error' && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => reconnect(id)}
                      className="h-5 px-1 text-xs"
                    >
                      Retry
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              {isAnyConnected 
                ? "System operational with available connections" 
                : "System degraded - check connections"
              }
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default GlobalConnectionIndicator;