
import { useState } from "react";
import { useAdapters } from "@/contexts/AdaptersContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WorkflowConnection {
  sourceId: string;
  targetId: string;
  label: string;
}

const WorkflowDesigner = () => {
  const { adapters } = useAdapters();
  const { toast } = useToast();
  const [connections, setConnections] = useState<WorkflowConnection[]>([]);
  const [sourceId, setSourceId] = useState<string | null>(null);
  const [targetId, setTargetId] = useState<string | null>(null);
  const [connectionLabel, setConnectionLabel] = useState("Data Flow");
  
  const activeAdapters = adapters.filter(adapter => adapter.active);
  
  const handleSelectSource = (id: string) => {
    setSourceId(id);
    setTargetId(null);
  };
  
  const handleSelectTarget = (id: string) => {
    if (id === sourceId) {
      toast({
        title: "Invalid Connection",
        description: "Cannot connect an adapter to itself",
        variant: "destructive",
      });
      return;
    }
    
    setTargetId(id);
  };
  
  const createConnection = () => {
    if (!sourceId || !targetId) return;
    
    const newConnection: WorkflowConnection = {
      sourceId,
      targetId,
      label: connectionLabel,
    };
    
    setConnections([...connections, newConnection]);
    toast({
      title: "Workflow Updated",
      description: "New connection has been created",
    });
    
    // Reset selection
    setSourceId(null);
    setTargetId(null);
  };
  
  const removeConnection = (index: number) => {
    const updatedConnections = [...connections];
    updatedConnections.splice(index, 1);
    setConnections(updatedConnections);
  };
  
  const getAdapterNameById = (id: string) => {
    const adapter = adapters.find(a => a.id === id);
    return adapter ? adapter.name : "Unknown";
  };
  
  const saveWorkflow = () => {
    // In a real application, this would save to a database
    toast({
      title: "Workflow Saved",
      description: `Saved workflow with ${connections.length} connections`,
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Workflow Designer</h2>
        <Button onClick={saveWorkflow} disabled={connections.length === 0}>
          <Save className="h-4 w-4 mr-2" /> Save Workflow
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Create Connections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Source</h3>
              <div className="grid grid-cols-1 gap-2">
                {activeAdapters.map(adapter => (
                  <Button
                    key={`source-${adapter.id}`}
                    variant={sourceId === adapter.id ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => handleSelectSource(adapter.id)}
                  >
                    {adapter.name}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Target</h3>
              <div className="grid grid-cols-1 gap-2">
                {activeAdapters.map(adapter => (
                  <Button
                    key={`target-${adapter.id}`}
                    variant={targetId === adapter.id ? "default" : "outline"}
                    className="justify-start"
                    disabled={!sourceId || sourceId === adapter.id}
                    onClick={() => handleSelectTarget(adapter.id)}
                  >
                    {adapter.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          <Button 
            className="w-full mt-2" 
            disabled={!sourceId || !targetId}
            onClick={createConnection}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Connection
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Current Workflow</CardTitle>
        </CardHeader>
        <CardContent>
          {connections.length === 0 ? (
            <div className="text-center p-6 text-muted-foreground">
              No connections created yet. Use the panel above to create a workflow.
            </div>
          ) : (
            <div className="space-y-2">
              {connections.map((connection, index) => (
                <div 
                  key={`conn-${index}`} 
                  className="flex items-center justify-between p-3 border rounded-md"
                >
                  <div className="flex items-center">
                    <span className="font-medium">{getAdapterNameById(connection.sourceId)}</span>
                    <ArrowRight className="h-4 w-4 mx-2" />
                    <span className="font-medium">{getAdapterNameById(connection.targetId)}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeConnection(index)}
                    className="text-destructive"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowDesigner;
