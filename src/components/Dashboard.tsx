
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAdapters } from "@/contexts/AdaptersContext";
import { Activity, Database, MessageSquare, Code } from "lucide-react";

const Dashboard = () => {
  const { adapters } = useAdapters();
  
  // Count active connections
  const activeConnections = adapters.filter(adapter => adapter.active).length;
  const totalConnections = adapters.length;
  
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3 mb-4">
              <Activity className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{activeConnections}/{totalConnections}</div>
              <p className="text-sm text-muted-foreground">Active Connections</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="rounded-full bg-green-100 dark:bg-green-900 p-3 mb-4">
              <Database className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">3</div>
              <p className="text-sm text-muted-foreground">Database Services</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-3 mb-4">
              <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">5</div>
              <p className="text-sm text-muted-foreground">Communication APIs</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center">
            <div className="rounded-full bg-amber-100 dark:bg-amber-900 p-3 mb-4">
              <Code className="h-6 w-6 text-amber-600 dark:text-amber-300" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">10+</div>
              <p className="text-sm text-muted-foreground">Integration Plugins</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-xl font-semibold mt-8 mb-4">Recent Activity</h2>
      <Card>
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {[
              { service: "OpenAI", status: "Connected", time: "5 mins ago", success: true },
              { service: "Discord", status: "Connected", time: "10 mins ago", success: true },
              { service: "Twitter", status: "Failed", time: "30 mins ago", success: false },
              { service: "PostgreSQL", status: "Connected", time: "1 hour ago", success: true },
            ].map((item, i) => (
              <li key={i} className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${item.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="font-medium">{item.service}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant={item.success ? "outline" : "destructive"}>
                    {item.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{item.time}</span>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      <h2 className="text-xl font-semibold mt-8 mb-4">Quick Actions</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <h3 className="font-semibold">Add New Connection</h3>
            <p className="text-sm text-muted-foreground mt-1">Integrate a new API or service</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <h3 className="font-semibold">Create Workflow</h3>
            <p className="text-sm text-muted-foreground mt-1">Build automated processes</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <h3 className="font-semibold">View Documentation</h3>
            <p className="text-sm text-muted-foreground mt-1">Learn how to extend the system</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
