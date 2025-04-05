
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Dashboard from "@/components/Dashboard";
import Connections from "@/components/Connections";
import Settings from "@/components/Settings";
import Navbar from "@/components/Navbar";
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
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="connections">Connections</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="mt-0">
              <Dashboard />
            </TabsContent>
            
            <TabsContent value="connections" className="mt-0">
              <Connections />
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
