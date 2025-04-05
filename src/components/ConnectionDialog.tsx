import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdapters } from "@/contexts/AdaptersContext";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

const serviceConfigs = {
  openai: [
    { name: "apiKey", label: "API Key", type: "password", required: true },
    { name: "model", label: "Model", type: "text", default: "gpt-4o" },
    { name: "temperature", label: "Temperature", type: "number", default: "0.7" }
  ],
  discord: [
    { name: "token", label: "Bot Token", type: "password", required: true },
    { name: "intents", label: "Intents", type: "text", default: "default" }
  ],
  twitter: [
    { name: "apiKey", label: "API Key", type: "password", required: true },
    { name: "apiSecret", label: "API Secret", type: "password", required: true },
    { name: "accessToken", label: "Access Token", type: "password", required: true },
    { name: "accessSecret", label: "Access Secret", type: "password", required: true }
  ],
  postgres: [
    { name: "connectionString", label: "Connection String", type: "password", required: true },
    { name: "schema", label: "Schema", type: "text", default: "public" }
  ],
  slack: [
    { name: "botToken", label: "Bot Token", type: "password", required: true },
    { name: "signingSecret", label: "Signing Secret", type: "password", required: true }
  ],
  github: [
    { name: "accessToken", label: "Personal Access Token", type: "password", required: true },
    { name: "owner", label: "Repository Owner", type: "text", required: true },
    { name: "repo", label: "Repository Name", type: "text", required: true }
  ],
  stripe: [
    { name: "secretKey", label: "Secret Key", type: "password", required: true },
    { name: "webhookSecret", label: "Webhook Secret", type: "password", required: false }
  ],
  smtp: [
    { name: "host", label: "SMTP Host", type: "text", required: true },
    { name: "port", label: "SMTP Port", type: "number", default: "587" },
    { name: "username", label: "Username", type: "text", required: true },
    { name: "password", label: "Password", type: "password", required: true },
    { name: "secure", label: "Use SSL/TLS", type: "checkbox", default: true }
  ],
  airtable: [
    { name: "apiKey", label: "API Key", type: "password", required: true },
    { name: "baseId", label: "Base ID", type: "text", required: true }
  ],
  webhook: [
    { name: "url", label: "Webhook URL", type: "text", required: true },
    { name: "method", label: "HTTP Method", type: "text", default: "POST" },
    { name: "headers", label: "Headers (JSON)", type: "textarea", default: "{}" }
  ]
};

interface ConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ConnectionDialog = ({ open, onOpenChange }: ConnectionDialogProps) => {
  const { addAdapter } = useAdapters();
  const [name, setName] = useState("");
  const [service, setService] = useState("");
  const [formParams, setFormParams] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState<"basic" | "advanced">("basic");
  
  const resetForm = () => {
    setName("");
    setService("");
    setFormParams({});
    setActiveTab("basic");
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name && service) {
      addAdapter({
        id: Date.now().toString(),
        name,
        service,
        active: true,
        status: "Connected",
        lastUsed: "Just now",
        params: formParams
      });
      
      // Reset form and close dialog
      resetForm();
      onOpenChange(false);
    }
  };
  
  const handleServiceChange = (value: string) => {
    setService(value);
    
    // Initialize default values for the selected service
    const defaultParams: Record<string, any> = {};
    if (serviceConfigs[value as keyof typeof serviceConfigs]) {
      serviceConfigs[value as keyof typeof serviceConfigs].forEach(field => {
        if (field.default !== undefined) {
          defaultParams[field.name] = field.default;
        }
      });
    }
    
    setFormParams(defaultParams);
  };
  
  const handleParamChange = (name: string, value: any) => {
    setFormParams(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) resetForm();
      onOpenChange(newOpen);
    }}>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Connection</DialogTitle>
            <DialogDescription>
              Create a new integration to an external service.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "basic" | "advanced")}>
            <TabsList className="w-full">
              <TabsTrigger value="basic" className="flex-1">Basic</TabsTrigger>
              <TabsTrigger value="advanced" className="flex-1">Advanced</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                  placeholder="My OpenAI Connection"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="service" className="text-right">
                  Service
                </Label>
                <Select value={service} onValueChange={handleServiceChange} required>
                  <SelectTrigger className="col-span-3" id="service">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="discord">Discord</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="postgres">PostgreSQL</SelectItem>
                    <SelectItem value="slack">Slack</SelectItem>
                    <SelectItem value="github">GitHub</SelectItem>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="smtp">Email (SMTP)</SelectItem>
                    <SelectItem value="airtable">Airtable</SelectItem>
                    <SelectItem value="webhook">Generic Webhook</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {service && serviceConfigs[service as keyof typeof serviceConfigs] && (
                <div className="border rounded-md p-4 mt-4">
                  <h3 className="font-medium mb-3">Service Configuration</h3>
                  <div className="space-y-4">
                    {serviceConfigs[service as keyof typeof serviceConfigs].map((field) => (
                      <div key={field.name} className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor={field.name} className="text-right">
                          {field.label}
                        </Label>
                        {field.type === 'textarea' ? (
                          <Textarea
                            id={field.name}
                            value={formParams[field.name] || ''}
                            onChange={(e) => handleParamChange(field.name, e.target.value)}
                            className="col-span-3"
                            required={field.required}
                          />
                        ) : (
                          <Input
                            id={field.name}
                            type={field.type}
                            value={formParams[field.name] || ''}
                            onChange={(e) => handleParamChange(field.name, e.target.value)}
                            className="col-span-3"
                            required={field.required}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="raw-config" className="text-right">
                  Raw Configuration
                </Label>
                <Textarea
                  id="raw-config"
                  value={JSON.stringify(formParams, null, 2)}
                  onChange={(e) => {
                    try {
                      setFormParams(JSON.parse(e.target.value));
                    } catch (err) {
                      // Invalid JSON, keep the text as is
                    }
                  }}
                  className="col-span-3 font-mono text-sm min-h-[200px]"
                  placeholder="{}"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-span-3 col-start-2">
                  <p className="text-sm text-muted-foreground">
                    Advanced configuration allows you to directly edit the JSON parameters.
                    Be careful, as invalid JSON will not be saved.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="mt-4">
            <Button type="submit" disabled={!name || !service}>Connect Service</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectionDialog;
