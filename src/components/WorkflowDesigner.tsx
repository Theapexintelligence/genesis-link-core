
import { useState, useEffect } from "react";
import { useAdapters } from "@/contexts/AdaptersContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus, Save, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNotification } from "@/hooks/useNotification";

interface WorkflowConnection {
  sourceId: string;
  targetId: string;
  label: string;
}

const WorkflowDesigner = () => {
  const { adapters } = useAdapters();
  const { toast } = useToast();
  const { notifySuccess, notifyError, notifyWarning } = useNotification();
  const [connections, setConnections] = useState<WorkflowConnection[]>([]);
  const [sourceId, setSourceId] = useState<string | null>(null);
  const [targetId, setTargetId] = useState<string | null>(null);
  const [connectionLabel, setConnectionLabel] = useState("Data Flow");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  const activeAdapters = adapters.filter(adapter => adapter.active);
  
  // Validate the workflow whenever connections change
  useEffect(() => {
    validateWorkflow();
  }, [connections]);
  
  const validateWorkflow = () => {
    const errors: string[] = [];
    
    // Check for circular dependencies
    const graph: Record<string, string[]> = {};
    
    connections.forEach(conn => {
      if (!graph[conn.sourceId]) {
        graph[conn.sourceId] = [];
      }
      graph[conn.sourceId].push(conn.targetId);
    });
    
    // Function to detect cycles in directed graph
    const hasCycle = (node: string, visited: Set<string>, recursionStack: Set<string>): boolean => {
      if (!visited.has(node)) {
        visited.add(node);
        recursionStack.add(node);
        
        const neighbors = graph[node] || [];
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor) && hasCycle(neighbor, visited, recursionStack)) {
            return true;
          } else if (recursionStack.has(neighbor)) {
            return true;
          }
        }
      }
      
      recursionStack.delete(node);
      return false;
    };
    
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    
    for (const node in graph) {
      if (!visited.has(node) && hasCycle(node, visited, recursionStack)) {
        errors.push("Circular dependency detected in workflow");
        break;
      }
    }
    
    // Check for disconnected nodes if we have more than one connection
    if (connections.length > 1) {
      const allNodes = new Set<string>();
      const connectedNodes = new Set<string>();
      
      connections.forEach(conn => {
        allNodes.add(conn.sourceId);
        allNodes.add(conn.targetId);
        connectedNodes.add(conn.sourceId);
        connectedNodes.add(conn.targetId);
      });
      
      if (allNodes.size > connectedNodes.size) {
        errors.push("Workflow contains disconnected components");
      }
    }
    
    setValidationErrors(errors);
  };
  
  const handleSelectSource = (id: string) => {
    setSourceId(id);
    setTargetId(null);
  };
  
  const handleSelectTarget = (id: string) => {
    if (id === sourceId) {
      notifyError("Invalid Connection", {
        description: "Cannot connect an adapter to itself"
      });
      return;
    }
    
    // Check if this connection already exists
    const connectionExists = connections.some(
      conn => conn.sourceId === sourceId && conn.targetId === id
    );
    
    if (connectionExists) {
      notifyWarning("Duplicate Connection", {
        description: "This connection already exists"
      });
      return;
    }
    
    setTargetId(id);
  };
  
  const createConnection = () => {
    if (!sourceId || !targetId) return;
    
    try {
      const newConnection: WorkflowConnection = {
        sourceId,
        targetId,
        label: connectionLabel,
      };
      
      setConnections([...connections, newConnection]);
      notifySuccess("Workflow Updated", {
        description: "New connection has been created"
      });
      
      // Reset selection
      setSourceId(null);
      setTargetId(null);
    } catch (error) {
      console.error("Error creating connection:", error);
      notifyError("Connection Failed", {
        description: "Failed to create connection. Please try again."
      });
    }
  };
  
  const removeConnection = (index: number) => {
    try {
      const updatedConnections = [...connections];
      updatedConnections.splice(index, 1);
      setConnections(updatedConnections);
      notifySuccess("Connection Removed", {
        description: "Connection has been removed from workflow"
      });
    } catch (error) {
      console.error("Error removing connection:", error);
      notifyError("Removal Failed", {
        description: "Failed to remove connection. Please try again."
      });
    }
  };
  
  const getAdapterNameById = (id: string) => {
    const adapter = adapters.find(a => a.id === id);
    return adapter ? adapter.name : "Unknown";
  };
  
  const saveWorkflow = () => {
    if (validationErrors.length > 0) {
      notifyError("Validation Error", {
        description: "Please fix workflow errors before saving",
      });
      return;
    }
    
    // In a real application, this would save to a database
    try {
      // Mock API call
      setTimeout(() => {
        notifySuccess("Workflow Saved", {
          description: `Saved workflow with ${connections.length} connections`,
        });
      }, 500);
    } catch (error) {
      console.error("Error saving workflow:", error);
      notifyError("Save Failed", {
        description: "Failed to save workflow. Please try again."
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Workflow Designer</h2>
        <Button onClick={saveWorkflow} disabled={connections.length === 0 || validationErrors.length > 0}>
          <Save className="h-4 w-4 mr-2" /> Save Workflow
        </Button>
      </div>
      
      {validationErrors.length > 0 && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
          <CardContent className="p-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-800 dark:text-amber-300">Workflow Validation Errors</h3>
                <ul className="list-disc list-inside text-sm text-amber-700 dark:text-amber-400 mt-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Create Connections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Source</h3>
              <div className="grid grid-cols-1 gap-2">
                {activeAdapters.length > 0 ? (
                  activeAdapters.map(adapter => (
                    <Button
                      key={`source-${adapter.id}`}
                      variant={sourceId === adapter.id ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => handleSelectSource(adapter.id)}
                    >
                      {adapter.name}
                    </Button>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm p-4 border rounded-md">
                    No active adapters available. Please activate adapters in the Connections tab.
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Target</h3>
              <div className="grid grid-cols-1 gap-2">
                {activeAdapters.length > 0 ? (
                  activeAdapters.map(adapter => (
                    <Button
                      key={`target-${adapter.id}`}
                      variant={targetId === adapter.id ? "default" : "outline"}
                      className="justify-start"
                      disabled={!sourceId || sourceId === adapter.id}
                      onClick={() => handleSelectTarget(adapter.id)}
                    >
                      {adapter.name}
                    </Button>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm p-4 border rounded-md">
                    No active adapters available. Please activate adapters in the Connections tab.
                  </p>
                )}
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
