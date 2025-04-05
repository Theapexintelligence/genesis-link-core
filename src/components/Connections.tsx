
import { useState } from "react";
import { useAdapters } from "@/contexts/AdaptersContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Settings } from "lucide-react";
import ConnectionDialog from "./ConnectionDialog";
import ServiceCard from "./ServiceCard";

const Connections = () => {
  const { adapters, toggleAdapter, removeAdapter } = useAdapters();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Available Connections</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Connection
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {adapters.map((adapter) => (
          <ServiceCard
            key={adapter.id}
            adapter={adapter}
            onToggle={() => toggleAdapter(adapter.id)}
            onRemove={() => removeAdapter(adapter.id)}
          />
        ))}
      </div>
      
      <ConnectionDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />
    </div>
  );
};

export default Connections;
