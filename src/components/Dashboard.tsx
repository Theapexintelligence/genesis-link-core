
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAdapters } from "@/contexts/AdaptersContext";
import { Activity, Database, MessageSquare, Code, ChevronRight, BarChart3, Zap, Layers } from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";

const Dashboard = () => {
  const { adapters } = useAdapters();
  
  // Count active connections
  const activeConnections = adapters.filter(adapter => adapter.active).length;
  const totalConnections = adapters.length;
  
  // Generate mock data for the charts
  const usageData = [
    { name: "Mon", Requests: 400 },
    { name: "Tue", Requests: 600 },
    { name: "Wed", Requests: 500 },
    { name: "Thu", Requests: 700 },
    { name: "Fri", Requests: 900 },
    { name: "Sat", Requests: 300 },
    { name: "Sun", Requests: 200 },
  ];
  
  // Count services by type
  const serviceTypes = adapters.reduce((acc, adapter) => {
    acc[adapter.service] = (acc[adapter.service] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const serviceData = Object.entries(serviceTypes).map(([name, value]) => ({ name, value }));
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
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
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>API Request Volume</CardTitle>
            <CardDescription>
              7-day request volume across all connections
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={usageData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="Requests" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Service Distribution</CardTitle>
            <CardDescription>
              Breakdown of connection types
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex justify-center items-center">
            {serviceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {serviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-muted-foreground">
                No connection data available
              </div>
            )}
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
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <h3 className="font-semibold mb-1">Add Connection</h3>
              <p className="text-sm text-muted-foreground">Integrate a new service</p>
            </div>
            <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2">
              <Zap className="h-5 w-5 text-blue-600 dark:text-blue-300" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <h3 className="font-semibold mb-1">Create Workflow</h3>
              <p className="text-sm text-muted-foreground">Link services together</p>
            </div>
            <div className="rounded-full bg-green-100 dark:bg-green-900 p-2">
              <Layers className="h-5 w-5 text-green-600 dark:text-green-300" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <h3 className="font-semibold mb-1">View Analytics</h3>
              <p className="text-sm text-muted-foreground">Monitor system performance</p>
            </div>
            <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-2">
              <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-300" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
