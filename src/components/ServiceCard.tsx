
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Settings, Trash2 } from "lucide-react";
import { AdapterType } from "@/types/adapter";

interface ServiceCardProps {
  adapter: AdapterType;
  onToggle: () => void;
  onRemove: () => void;
}

const ServiceCard = ({ adapter, onToggle, onRemove }: ServiceCardProps) => {
  const serviceIcons: Record<string, string> = {
    openai: "🤖",
    discord: "💬",
    twitter: "🐦",
    postgres: "📊",
    slack: "💼",
    github: "📝",
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="relative pb-2">
        <div className="flex justify-between items-start">
          <Badge variant={adapter.active ? "default" : "secondary"} className="mb-2">
            {adapter.active ? "Active" : "Inactive"}
          </Badge>
          <div className="flex items-center space-x-1">
            <Switch 
              checked={adapter.active}
              onCheckedChange={onToggle}
            />
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{serviceIcons[adapter.service] || "🔌"}</div>
          <div>
            <CardTitle>{adapter.name}</CardTitle>
            <CardDescription>{adapter.service}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-muted-foreground">Status:</div>
            <div className={adapter.status === "Connected" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
              {adapter.status}
            </div>
            
            <div className="text-muted-foreground">Last used:</div>
            <div>{adapter.lastUsed}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-3 bg-muted/50">
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-1" /> Configure
        </Button>
        <Button variant="outline" size="sm" onClick={onRemove} className="text-destructive">
          <Trash2 className="h-4 w-4 mr-1" /> Remove
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
