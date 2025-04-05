
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

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <AdaptersProvider>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
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
            <TabsList className="grid w-full grid-cols-7 mb-8">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="connections">Connections</TabsTrigger>
              <TabsTrigger value="status">Status</TabsTrigger>
              <TabsTrigger value="workflows">Workflows</TabsTrigger>
              <TabsTrigger value="api-tester">API Tester</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="mt-0">
              <Dashboard />
            </TabsContent>
            
            <TabsContent value="connections" className="mt-0">
              <Connections />
            </TabsContent>
            
            <TabsContent value="status" className="mt-0">
              <StatusMonitor />
            </TabsContent>
            
            <TabsContent value="workflows" className="mt-0">
              <WorkflowDesigner />
            </TabsContent>
            
            <TabsContent value="api-tester" className="mt-0">
              <ApiTester />
            </TabsContent>
            
            <TabsContent value="templates" className="mt-0">
              <TemplateLibrary />
            </TabsContent>
            
            <TabsContent value="settings" className="mt-0">
              <Settings />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </AdaptersProvider>
  );
};

export default Index;
