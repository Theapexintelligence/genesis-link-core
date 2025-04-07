
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

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <AdaptersProvider>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <ErrorBoundary>
          <Navbar />
          <main className="container mx-auto px-4 py-6">
            <Card className="border-none shadow-lg mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl font-bold">Apex Genesis 2.0</CardTitle>
                <CardDescription>
                  The Universal Connector - A modular, plug-and-play core for infinite integrations
                </CardDescription>
              </CardHeader>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-9 mb-8">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="connections">Connections</TabsTrigger>
                <TabsTrigger value="status">Status</TabsTrigger>
                <TabsTrigger value="workflows">Workflows</TabsTrigger>
                <TabsTrigger value="api-tester">API Tester</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="ai-framework">AI Framework</TabsTrigger>
                <TabsTrigger value="code-agent">Code Agent</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dashboard" className="mt-0">
                <ErrorBoundary>
                  <Dashboard />
                </ErrorBoundary>
              </TabsContent>
              
              <TabsContent value="connections" className="mt-0">
                <ErrorBoundary>
                  <Connections />
                </ErrorBoundary>
              </TabsContent>
              
              <TabsContent value="status" className="mt-0">
                <ErrorBoundary>
                  <StatusMonitor />
                </ErrorBoundary>
              </TabsContent>
              
              <TabsContent value="workflows" className="mt-0">
                <ErrorBoundary>
                  <WorkflowDesigner />
                </ErrorBoundary>
              </TabsContent>
              
              <TabsContent value="api-tester" className="mt-0">
                <ErrorBoundary>
                  <ApiTester />
                </ErrorBoundary>
              </TabsContent>
              
              <TabsContent value="templates" className="mt-0">
                <ErrorBoundary>
                  <TemplateLibrary />
                </ErrorBoundary>
              </TabsContent>
              
              <TabsContent value="settings" className="mt-0">
                <ErrorBoundary>
                  <Settings />
                </ErrorBoundary>
              </TabsContent>
              
              <TabsContent value="ai-framework" className="mt-0">
                <ErrorBoundary>
                  <AIFramework />
                </ErrorBoundary>
              </TabsContent>
              
              <TabsContent value="code-agent" className="mt-0">
                <ErrorBoundary>
                  <CodeAgent />
                </ErrorBoundary>
              </TabsContent>
            </Tabs>
          </main>
          
          {/* Sliding SketchPad that appears on every page */}
          <SketchPad />
        </ErrorBoundary>
      </div>
    </AdaptersProvider>
  );
};

export default Index;
