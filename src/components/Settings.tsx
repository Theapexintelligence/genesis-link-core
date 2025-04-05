
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>
            Configure the general behavior of Apex Genesis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-refresh Connections</Label>
              <p className="text-sm text-muted-foreground">
                Automatically check the status of connections every 5 minutes
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Log Connection Attempts</Label>
              <p className="text-sm text-muted-foreground">
                Keep a log of all connection attempts for troubleshooting
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Advanced Mode</Label>
              <p className="text-sm text-muted-foreground">
                Enable advanced options and features
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Configuration Path</CardTitle>
          <CardDescription>
            Set the location where configuration files are stored
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="config-path">Config Directory</Label>
            <Input id="config-path" value="~/.apex_genesis/" readOnly />
            <p className="text-sm text-muted-foreground">
              This is where your connection details and settings are stored
            </p>
          </div>
          
          <div className="flex space-x-2 mt-4">
            <Button variant="outline">Change Location</Button>
            <Button variant="outline">Open in Explorer</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Plugin Development</CardTitle>
          <CardDescription>
            Tools for creating custom integrations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="plugin-template">Plugin Template</Label>
            <Textarea
              id="plugin-template"
              className="font-mono text-xs h-32"
              readOnly
              value={`# Example adapter for a custom service
elif service == "custom_service":
    # Import your required packages
    # import my_package
    
    # Initialize the connection
    client = my_package.Client(
        api_key=params["api_key"],
        # other parameters
    )
    
    self.console.print("[green]✓ Connected to Custom Service!")
    return True`}
            />
          </div>
          
          <div className="flex space-x-2 mt-4">
            <Button>Copy Template</Button>
            <Button variant="outline">View Documentation</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
