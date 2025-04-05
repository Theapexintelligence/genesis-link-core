
import { useState } from "react";
import { useAdapters } from "@/contexts/AdaptersContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

// Template definitions
const templates = [
  {
    id: "ai-chatbot",
    name: "AI Chatbot",
    description: "Connect Discord with OpenAI for an AI-powered chatbot",
    services: ["discord", "openai"],
    complexity: "Medium",
    category: "AI"
  },
  {
    id: "data-pipeline",
    name: "Data Pipeline",
    description: "Extract data from a source database into a warehouse",
    services: ["postgres", "postgres"],
    complexity: "Advanced",
    category: "Data"
  },
  {
    id: "social-monitor",
    name: "Social Media Monitor",
    description: "Track mentions and engagement across platforms",
    services: ["twitter", "slack"],
    complexity: "Simple",
    category: "Social"
  },
  {
    id: "notification-system",
    name: "Notification System",
    description: "Send alerts across multiple channels",
    services: ["slack", "discord", "openai"],
    complexity: "Medium",
    category: "Comms"
  },
];

const TemplateLibrary = () => {
  const { addAdapter } = useAdapters();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const applyTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;
    
    // This would create all the necessary adapters and connections
    template.services.forEach((service, index) => {
      const adapterName = `${template.name} - ${service} ${index + 1}`;
      
      addAdapter({
        id: `${templateId}-${service}-${Date.now()}-${index}`,
        name: adapterName,
        service: service,
        active: true,
        status: "Connected",
        lastUsed: "Just now",
        params: {
          template: templateId
        }
      });
    });
    
    toast({
      title: "Template Applied",
      description: `Successfully applied the ${template.name} template`,
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Template Library</h2>
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map(template => (
          <Card key={template.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <div>
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-medium">{template.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Complexity:</span>
                  <span className="font-medium">{template.complexity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Services:</span>
                  <span className="font-medium">{template.services.length}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 border-t">
              <Button className="w-full" onClick={() => applyTemplate(template.id)}>
                <Download className="h-4 w-4 mr-2" /> Apply Template
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {filteredTemplates.length === 0 && (
        <div className="text-center p-12 border rounded-lg bg-muted/40">
          <p className="text-lg text-muted-foreground">No templates match your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default TemplateLibrary;
