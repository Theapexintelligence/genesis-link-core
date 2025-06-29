import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useConnection } from '@/hooks/useConnection';
import { 
  Wifi, WifiOff, Database, Server, Globe, Zap, 
  Heart, Star, Shield, Rocket, Crown, Magic
} from 'lucide-react';
import { toast } from 'sonner';

const UltimateConnectionManager = () => {
  const { statuses, reconnect, isOnline, isAnyConnected } = useConnection();
  const [connectionHealth, setConnectionHealth] = useState(100);
  const [autoHealEnabled, setAutoHealEnabled] = useState(true);
  const [superMode, setSuperMode] = useState(false);

  useEffect(() => {
    // Calculate connection health
    const connectedCount = Object.values(statuses).filter(s => s === 'connected').length;
    const totalCount = Object.keys(statuses).length;
    const health = totalCount > 0 ? (connectedCount / totalCount) * 100 : 0;
    setConnectionHealth(health);

    // Auto-heal connections
    if (autoHealEnabled && health < 100) {
      const healTimer = setTimeout(() => {
        reconnect();
        toast.info("🔧 Auto-healing connections...", {
          description: "Your system is taking care of itself! 💖"
        });
      }, 5000);

      return () => clearTimeout(healTimer);
    }
  }, [statuses, autoHealEnabled, reconnect]);

  const activateSuperMode = () => {
    setSuperMode(true);
    reconnect();
    toast.success("🚀 SUPER MODE ACTIVATED!", {
      description: "Maximum connection power engaged! 💪✨",
      duration: 5000
    });

    setTimeout(() => setSuperMode(false), 30000);
  };

  const getConnectionIcon = (id: string) => {
    const icons = {
      supabase: Database,
      api: Server,
      websocket: Zap,
      local: Globe
    };
    return icons[id as keyof typeof icons] || Server;
  };

  const getConnectionName = (id: string) => {
    const names = {
      supabase: 'Database',
      api: 'Backend API',
      websocket: 'Real-time',
      local: 'Local Storage'
    };
    return names[id as keyof typeof names] || id;
  };

  const getHealthColor = (health: number) => {
    if (health >= 90) return 'from-green-400 to-emerald-500';
    if (health >= 70) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-500';
  };

  return (
    <Card className="w-full overflow-hidden relative">
      {superMode && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 pointer-events-none"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
      
      <CardHeader className="relative">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div
              animate={superMode ? { 
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              } : {}}
              transition={{ duration: 2, repeat: superMode ? Infinity : 0 }}
            >
              {isOnline ? (
                <Wifi className={`h-6 w-6 ${connectionHealth >= 90 ? 'text-green-500' : 'text-yellow-500'}`} />
              ) : (
                <WifiOff className="h-6 w-6 text-red-500" />
              )}
            </motion.div>
            Ultimate Connection Manager
            {superMode && (
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Crown className="h-5 w-5 text-yellow-500" />
              </motion.div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Badge 
              className={`bg-gradient-to-r ${getHealthColor(connectionHealth)} text-white`}
            >
              Health: {Math.round(connectionHealth)}%
            </Badge>
            {autoHealEnabled && (
              <Badge variant="outline" className="border-green-300 text-green-700">
                <Shield className="h-3 w-3 mr-1" />
                Auto-Heal
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Health Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>System Health</span>
            <span>{Math.round(connectionHealth)}%</span>
          </div>
          <div className="relative">
            <Progress value={connectionHealth} className="h-3" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: [-100, 300] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </div>

        {/* Connection Status Grid */}
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(statuses).map(([id, status]) => {
            const Icon = getConnectionIcon(id);
            const isConnected = status === 'connected';
            
            return (
              <motion.div
                key={id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isConnected 
                    ? 'border-green-300 bg-green-50 dark:bg-green-950/20' 
                    : 'border-red-300 bg-red-50 dark:bg-red-950/20'
                }`}
                animate={isConnected && superMode ? {
                  scale: [1, 1.05, 1],
                  borderColor: ['#10b981', '#06d6a0', '#10b981']
                } : {}}
                transition={{ duration: 1, repeat: isConnected && superMode ? Infinity : 0 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-5 w-5 ${isConnected ? 'text-green-600' : 'text-red-600'}`} />
                    <span className="font-medium">{getConnectionName(id)}</span>
                  </div>
                  <motion.div
                    className={`w-3 h-3 rounded-full ${
                      isConnected ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    animate={isConnected ? {
                      scale: [1, 1.3, 1],
                      opacity: [1, 0.7, 1]
                    } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </div>
                <div className="mt-2 text-sm text-muted-foreground capitalize">
                  {status}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button 
            onClick={() => reconnect()}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Zap className="h-4 w-4 mr-2" />
            Reconnect All
          </Button>
          
          <Button 
            onClick={activateSuperMode}
            disabled={superMode}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Rocket className="h-4 w-4 mr-2" />
            {superMode ? 'Super Mode Active!' : 'Super Mode'}
          </Button>
          
          <Button 
            onClick={() => setAutoHealEnabled(!autoHealEnabled)}
            variant={autoHealEnabled ? "default" : "outline"}
          >
            <Shield className="h-4 w-4 mr-2" />
            Auto-Heal
          </Button>
        </div>

        {/* Status Messages */}
        <AnimatePresence>
          {connectionHealth === 100 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-300"
            >
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800 dark:text-green-300">
                  Perfect Health! All systems operational! 🎉
                </span>
              </div>
            </motion.div>
          )}
          
          {connectionHealth < 50 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-950/20 dark:to-pink-950/20 rounded-lg border border-red-300"
            >
              <div className="flex items-center gap-2">
                <Magic className="h-5 w-5 text-red-600" />
                <span className="font-medium text-red-800 dark:text-red-300">
                  Don't worry! Auto-healing is working to restore connections! 💪
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-center text-sm text-muted-foreground">
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            💖 Your connections are protected by love and advanced technology! ✨
          </motion.p>
        </div>
      </CardContent>
    </Card>
  );
};

export default UltimateConnectionManager;