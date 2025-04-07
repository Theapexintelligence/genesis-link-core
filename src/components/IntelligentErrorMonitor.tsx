
import { useError } from "@/contexts/ErrorContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Clock, RefreshCw } from "lucide-react";
import { useState } from "react";

const IntelligentErrorMonitor = () => {
  const { errors, resolveError, getErrorStats } = useError();
  const [showResolved, setShowResolved] = useState(false);
  
  const stats = getErrorStats();
  const filteredErrors = showResolved 
    ? errors 
    : errors.filter(error => !error.isResolved);
  
  // Function to format relative time
  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Error Monitor</CardTitle>
            <CardDescription>
              Intelligent tracking of application errors
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant={stats.active > 0 ? "destructive" : "outline"}>
              {stats.active} Active
            </Badge>
            <Badge variant="outline">
              {stats.resolved} Resolved
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredErrors.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {stats.total === 0 ? (
              <p>No errors have been recorded</p>
            ) : (
              <p>No {showResolved ? "" : "active"} errors to display</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredErrors.map(error => (
              <div 
                key={error.id} 
                className={`p-4 border rounded-lg ${
                  error.isResolved 
                    ? "bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800" 
                    : "bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800"
                }`}
              >
                <div className="flex justify-between">
                  <div className="flex items-start gap-2">
                    {error.isResolved ? (
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                    )}
                    <div>
                      <h4 className={`font-medium ${error.isResolved ? "text-green-800 dark:text-green-300" : "text-red-800 dark:text-red-300"}`}>
                        {error.componentName}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {error.message}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge variant="outline" className="mb-2">
                      {error.count > 1 ? `${error.count} occurrences` : "1 occurrence"}
                    </Badge>
                    <span className="text-xs flex items-center text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {getRelativeTime(error.timestamp)}
                    </span>
                  </div>
                </div>
                {!error.isResolved && (
                  <div className="mt-3 flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                      onClick={() => resolveError(error.id)}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" /> Mark as resolved
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        <div className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowResolved(!showResolved)}
          >
            {showResolved ? "Hide Resolved" : "Show Resolved"}
          </Button>
          
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <RefreshCw className="h-3 w-3 mr-1" /> Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntelligentErrorMonitor;
