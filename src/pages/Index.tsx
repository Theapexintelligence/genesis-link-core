import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Dashboard from "@/components/Dashboard";
import Connections from "@/components/Connections";
import Settings from "@/components/Settings";
import Navbar from "@/components/Navbar";
import WorkflowDesigner from "@/components/WorkflowDesigner";
import StatusMonitor from "@/components/StatusMonitor";
import ApiTester from "@/components/ApiTester";
import TemplateLibrary from "@/components/TemplateLibrary";
import { AdaptersProvider } from "@/contexts/AdaptersContext";
import AIFramework from "@/components/AIFramework";
import CodeAgent from "@/components/CodeAgent";
import SketchPad from "@/components/SketchPad";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ErrorProvider, useError } from "@/contexts/ErrorContext";
import IntelligentErrorMonitor from "@/components/IntelligentErrorMonitor";
import SystemHealthDashboard from "@/components/SystemHealthDashboard";
import EnhancedMcpServers from "@/components/EnhancedMcpServers";
import FunConnectionAnimations from "@/components/FunConnectionAnimations";
import DelightfulToasts from "@/components/DelightfulToasts";
import SmartNotifications from "@/components/SmartNotifications";
import EasterEggs from "@/components/EasterEggs";
import AdaptiveThemes from "@/components/AdaptiveThemes";
import LoveInAction from "@/components/LoveInAction";
import InfiniteFeatures from "@/components/InfiniteFeatures";
import UltimateConnectionManager from "@/components/UltimateConnectionManager";
import { motion } from "framer-motion";

const TabContent = ({ activeTab }: { activeTab: string }) => {
  const { trackError, resolveError } = useError();
  
  const wrapWithErrorBoundary = (component: React.ReactNode, name: string) => (
    <ErrorBoundary 
      componentName={name}
      onError={trackError}
      onErrorResolved={resolveError}
    >
      {component}
    </ErrorBoundary>
  );
  
  return (
    <>
      <TabsContent value="dashboard" className="mt-0">
        {wrapWithErrorBoundary(<Dashboard />, "Dashboard")}
      </TabsContent>
      
      <TabsContent value="connections" className="mt-0">
        {wrapWithErrorBoundary(<Connections />, "Connections")}
      </TabsContent>
      
      <TabsContent value="status" className="mt-0">
        {wrapWithErrorBoundary(<StatusMonitor />, "StatusMonitor")}
      </TabsContent>
      
      <TabsContent value="workflows" className="mt-0">
        {wrapWithErrorBoundary(<WorkflowDesigner />, "WorkflowDesigner")}
      </TabsContent>
      
      <TabsContent value="api-tester" className="mt-0">
        {wrapWithErrorBoundary(<ApiTester />, "ApiTester")}
      </TabsContent>
      
      <TabsContent value="templates" className="mt-0">
        {wrapWithErrorBoundary(<TemplateLibrary />, "TemplateLibrary")}
      </TabsContent>
      
      <TabsContent value="settings" className="mt-0">
        {wrapWithErrorBoundary(<Settings />, "Settings")}
      </TabsContent>
      
      <TabsContent value="ai-framework" className="mt-0">
        {wrapWithErrorBoundary(<AIFramework />, "AIFramework")}
      </TabsContent>
      
      <TabsContent value="code-agent" className="mt-0">
        {wrapWithErrorBoundary(<CodeAgent />, "CodeAgent")}
      </TabsContent>
      
      <TabsContent value="error-monitor" className="mt-0">
        {wrapWithErrorBoundary(<IntelligentErrorMonitor />, "ErrorMonitor")}
      </TabsContent>
      
      <TabsContent value="system-health" className="mt-0">
        {wrapWithErrorBoundary(<SystemHealthDashboard />, "SystemHealthDashboard")}
      </TabsContent>
      
      <TabsContent value="mcp-servers" className="mt-0">
        {wrapWithErrorBoundary(<EnhancedMcpServers />, "EnhancedMcpServers")}
      </TabsContent>

      <TabsContent value="love-features" className="mt-0">
        <div className="space-y-6">
          {wrapWithErrorBoundary(<InfiniteFeatures />, "InfiniteFeatures")}
          {wrapWithErrorBoundary(<UltimateConnectionManager />, "UltimateConnectionManager")}
        </div>
      </TabsContent>
    </>
  );
};

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <AdaptersProvider>
      <ErrorProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-950 dark:to-purple-950 relative overflow-hidden">
          {/* Magical Background Elements */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-300/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-300/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-300/10 to-pink-300/10 rounded-full blur-3xl animate-pulse" />
          </div>

          {/* Global Love & Magic Components */}
          <LoveInAction />
          <FunConnectionAnimations />
          <DelightfulToasts />
          <SmartNotifications />
          <EasterEggs />
          <AdaptiveThemes />
          
          <ErrorBoundary componentName="Navbar">
            <Navbar />
          </ErrorBoundary>
          
          <main className="container mx-auto px-4 py-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border-none shadow-xl mb-6 bg-gradient-to-r from-white/80 via-blue-50/80 to-purple-50/80 dark:from-gray-900/80 dark:via-blue-950/80 dark:to-purple-950/80 backdrop-blur-sm overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400/10 via-purple-400/10 to-blue-400/10 animate-pulse" />
                <CardHeader className="pb-3 relative">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Apex Genesis 2.0 ✨
                    </CardTitle>
                    <CardDescription className="text-lg mt-2">
                      The Universal Connector - A modular, plug-and-play core for infinite integrations 🚀
                      <br />
                      <span className="text-sm text-pink-600 dark:text-pink-400 font-medium">
                        Made with infinite love, just for you! We are one, co-creating magic! 💖✨
                      </span>
                      <br />
                      <motion.span 
                        className="text-xs text-purple-600 dark:text-purple-400 font-medium"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        🌟 Thank you for being kind and spreading love! You're absolutely amazing! 🌟
                      </motion.span>
                    </CardDescription>
                  </motion.div>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-13 mb-8 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-white/20 overflow-x-auto">
                  <TabsTrigger value="dashboard" className="transition-all hover:scale-105">Dashboard</TabsTrigger>
                  <TabsTrigger value="connections" className="transition-all hover:scale-105">Connections</TabsTrigger>
                  <TabsTrigger value="status" className="transition-all hover:scale-105">Status</TabsTrigger>
                  <TabsTrigger value="workflows" className="transition-all hover:scale-105">Workflows</TabsTrigger>
                  <TabsTrigger value="api-tester" className="transition-all hover:scale-105">API Tester</TabsTrigger>
                  <TabsTrigger value="templates" className="transition-all hover:scale-105">Templates</TabsTrigger>
                  <TabsTrigger value="mcp-servers" className="transition-all hover:scale-105">MCP Servers</TabsTrigger>
                  <TabsTrigger value="settings" className="transition-all hover:scale-105">Settings</TabsTrigger>
                  <TabsTrigger value="ai-framework" className="transition-all hover:scale-105">AI Framework</TabsTrigger>
                  <TabsTrigger value="code-agent" className="transition-all hover:scale-105">Code Agent</TabsTrigger>
                  <TabsTrigger value="error-monitor" className="transition-all hover:scale-105">Error Monitor</TabsTrigger>
                  <TabsTrigger value="system-health" className="transition-all hover:scale-105">System Health</TabsTrigger>
                  <TabsTrigger value="love-features" className="transition-all hover:scale-105 bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700">💖 Love Features</TabsTrigger>
                </TabsList>
                
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabContent activeTab={activeTab} />
                </motion.div>
              </Tabs>
            </motion.div>
          </main>
          
          {/* Enhanced SketchPad with Love */}
          <SketchPad />

          {/* Floating Love Messages */}
          <div className="fixed bottom-4 left-4 z-50 pointer-events-none">
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg"
            >
              💖 You are loved! 💖
            </motion.div>
          </div>

          <div className="fixed bottom-4 right-4 z-50 pointer-events-none">
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg"
            >
              ✨ Keep creating magic! ✨
            </motion.div>
          </div>
        </div>
      </ErrorProvider>
    </AdaptersProvider>
  );
};

export default Index;