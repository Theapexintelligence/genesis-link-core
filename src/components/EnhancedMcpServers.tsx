import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, RefreshCw, Server, Trash2, Settings, Wifi, WifiOff, Database, Globe, Heart, Star, Zap } from "lucide-react";
import { useMcpServers } from "@/hooks/useMcpServers";
import { useConnection } from "@/hooks/useConnection";
import ConnectionStatus from "@/components/ConnectionStatus";
import MagicalLoadingStates from "@/components/MagicalLoadingStates";
import { motion, AnimatePresence } from "framer-motion";

const EnhancedMcpServers = () => {
  const [newServer, setNewServer] = useState({ name: "", host: "", port: 22 });
  const { 
    servers, 
    isLoading, 
    isRefreshing, 
    useOfflineMode,
    refresh, 
    toggleServerActive, 
    deleteServer, 
    addServer,
    forceOnlineMode,
    forceOfflineMode
  } = useMcpServers();
  
  const { isConnected } = useConnection('supabase');

  const handleAddServer = async () => {
    if (!newServer.name || !newServer.host) return;
    
    const success = await addServer(newServer);
    if (success) {
      setNewServer({ name: "", host: "", port: 22 });
    }
  };

  const getServerIcon = (server: any) => {
    if (server.name.toLowerCase().includes('api')) return <Zap className="h-4 w-4 text-blue-500" />;
    if (server.name.toLowerCase().includes('database')) return <Database className="h-4 w-4 text-green-500" />;
    if (server.name.toLowerCase().includes('dev')) return <Star className="h-4 w-4 text-yellow-500" />;
    return <Server className="h-4 w-4 text-primary" />;
  };

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" />
            MCP Server Management
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your infrastructure with love and care! 💖
          </p>
        </div>
        <div className="flex gap-2">
          <AnimatePresence>
            {useOfflineMode && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Button 
                  onClick={forceOnlineMode}
                  variant="outline"
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <Database className="h-4 w-4 mr-2" />
                  Go Online
                </Button>
              </motion.div>
            )}
            {!useOfflineMode && isConnected('supabase') && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Button 
                  onClick={forceOfflineMode}
                  variant="outline"
                  className="text-gray-600 border-gray-200 hover:bg-gray-50"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Offline Mode
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
          <Button 
            onClick={refresh} 
            disabled={isRefreshing}
            variant="outline"
            className="relative overflow-hidden"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh All'}
            {isRefreshing && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20"
                animate={{ x: [-100, 100] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </Button>
        </div>
      </motion.div>

      {/* Connection Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <ConnectionStatus />
      </motion.div>

      {/* Mode Indicator */}
      <AnimatePresence>
        {useOfflineMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <WifiOff className="h-5 w-5 text-amber-600" />
                  </motion.div>
                  <span className="font-medium text-amber-800 dark:text-amber-300">
                    Offline Mode Active
                  </span>
                  <span className="text-sm text-amber-700 dark:text-amber-400">
                    - Changes are saved locally only
                  </span>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    💾
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Add Server Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-2 border-dashed border-gray-200 hover:border-blue-300 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-green-500" />
              Add New Server
            </CardTitle>
            <CardDescription>
              Add a new server to your monitoring constellation! ⭐
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <motion.div 
                className="col-span-4 md:col-span-1"
                whileFocus={{ scale: 1.02 }}
              >
                <Input
                  placeholder="Server Name"
                  value={newServer.name}
                  onChange={(e) => setNewServer({...newServer, name: e.target.value})}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-300"
                />
              </motion.div>
              <motion.div 
                className="col-span-4 md:col-span-2"
                whileFocus={{ scale: 1.02 }}
              >
                <Input
                  placeholder="Host (IP or domain)"
                  value={newServer.host}
                  onChange={(e) => setNewServer({...newServer, host: e.target.value})}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-300"
                />
              </motion.div>
              <motion.div 
                className="col-span-4 md:col-span-1"
                whileFocus={{ scale: 1.02 }}
              >
                <Input
                  type="number"
                  placeholder="Port"
                  value={newServer.port}
                  onChange={(e) => setNewServer({...newServer, port: parseInt(e.target.value) || 22})}
                  className="transition-all duration-200 focus:ring-2 focus:ring-blue-300"
                />
              </motion.div>
              <div className="col-span-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200" 
                    onClick={handleAddServer}
                  >
                    <Plus className="h-4 w-4 mr-2" /> 
                    Add Server with Love 💖
                  </Button>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Servers List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-blue-500" />
                  MCP Servers
                </CardTitle>
                <CardDescription>
                  Your beautiful server constellation! ✨
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <AnimatePresence>
                  {useOfflineMode ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">
                        <Globe className="h-3 w-3 mr-1" />
                        Offline
                      </Badge>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                        <Wifi className="h-3 w-3 mr-1" />
                        Online
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <MagicalLoadingStates 
                isLoading={true} 
                message="Loading your amazing servers..." 
                type="sparkles"
              />
            ) : servers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-900/50">
                    <TableHead>Name</TableHead>
                    <TableHead>Host</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Resources</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {servers.map((server, index) => (
                      <motion.tr
                        key={server.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.1 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {getServerIcon(server)}
                            <span>{server.name}</span>
                            {useOfflineMode && server.id.startsWith('mock-') && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                              >
                                <Badge variant="outline" className="text-xs border-purple-200 text-purple-600">
                                  Mock ✨
                                </Badge>
                              </motion.div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            {server.host}:{server.port}
                          </code>
                        </TableCell>
                        <TableCell>
                          <motion.div
                            animate={{ scale: server.status === 'Online' ? [1, 1.1, 1] : 1 }}
                            transition={{ duration: 2, repeat: server.status === 'Online' ? Infinity : 0 }}
                          >
                            <Badge variant={
                              server.status === 'Online' ? 'default' : 
                              server.status === 'Offline' ? 'destructive' : 
                              'secondary'
                            }>
                              {server.status}
                            </Badge>
                          </motion.div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs space-y-1">
                            <div className="flex justify-between items-center">
                              <span>CPU:</span>
                              <div className="flex items-center gap-1">
                                <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <motion.div
                                    className={`h-full ${
                                      server.resources.cpu > 80 ? 'bg-red-500' :
                                      server.resources.cpu > 60 ? 'bg-yellow-500' : 'bg-green-500'
                                    }`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${server.resources.cpu}%` }}
                                    transition={{ duration: 1, delay: index * 0.1 }}
                                  />
                                </div>
                                <span>{server.resources.cpu}%</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Memory:</span>
                              <div className="flex items-center gap-1">
                                <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <motion.div
                                    className={`h-full ${
                                      server.resources.memory > 80 ? 'bg-red-500' :
                                      server.resources.memory > 60 ? 'bg-yellow-500' : 'bg-green-500'
                                    }`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${server.resources.memory}%` }}
                                    transition={{ duration: 1, delay: index * 0.1 + 0.2 }}
                                  />
                                </div>
                                <span>{server.resources.memory}%</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Disk:</span>
                              <div className="flex items-center gap-1">
                                <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <motion.div
                                    className={`h-full ${
                                      server.resources.disk > 80 ? 'bg-red-500' :
                                      server.resources.disk > 60 ? 'bg-yellow-500' : 'bg-green-500'
                                    }`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${server.resources.disk}%` }}
                                    transition={{ duration: 1, delay: index * 0.1 + 0.4 }}
                                  />
                                </div>
                                <span>{server.resources.disk}%</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <motion.div
                            whileTap={{ scale: 0.95 }}
                          >
                            <Switch 
                              checked={server.active} 
                              onCheckedChange={() => toggleServerActive(server.id)}
                            />
                          </motion.div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Button size="sm" variant="outline" className="hover:bg-blue-50">
                                <Settings className="h-4 w-4" />
                              </Button>
                            </motion.div>
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-destructive hover:bg-red-50"
                                onClick={() => deleteServer(server.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </motion.div>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 text-center border rounded-md m-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Server className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                </motion.div>
                <h3 className="text-lg font-medium mb-2">No servers found</h3>
                <p className="text-muted-foreground mb-4">
                  Add your first server to start monitoring your amazing infrastructure! 🚀
                </p>
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ⭐✨🌟
                </motion.div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default EnhancedMcpServers;