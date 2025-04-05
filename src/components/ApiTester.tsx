import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAdapters } from "@/contexts/AdaptersContext";
import { Play, Save, Code, Copy } from "lucide-react";

const ApiTester = () => {
  const { adapters } = useAdapters();
  const { toast } = useToast();
  const [selectedAdapter, setSelectedAdapter] = useState("");
  const [endpoint, setEndpoint] = useState("");
  const [method, setMethod] = useState("GET");
  const [requestBody, setRequestBody] = useState("{\n  \n}");
  const [requestHeaders, setRequestHeaders] = useState("{\n  \"Content-Type\": \"application/json\"\n}");
  const [responseData, setResponseData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const activeAdapters = adapters.filter(adapter => adapter.active);
  
  const formatJson = (json: string): string => {
    try {
      return JSON.stringify(JSON.parse(json), null, 2);
    } catch (e) {
      return json;
    }
  };
  
  const handleBodyChange = (value: string) => {
    setRequestBody(value);
  };
  
  const handleHeadersChange = (value: string) => {
    setRequestHeaders(value);
  };
  
  const sendRequest = async () => {
    if (!endpoint) {
      toast({
        title: "Missing Endpoint",
        description: "Please provide an API endpoint",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Parse headers
      let headers: Record<string, string> = {};
      try {
        headers = JSON.parse(requestHeaders);
      } catch (e) {
        toast({
          title: "Invalid Headers",
          description: "Headers must be valid JSON",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Parse body for non-GET requests
      let body = undefined;
      if (method !== "GET") {
        try {
          body = requestBody ? JSON.parse(requestBody) : undefined;
        } catch (e) {
          toast({
            title: "Invalid Request Body",
            description: "Request body must be valid JSON",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
      }
      
      // In a real app, this might go through the selected adapter's integration
      // For now, we'll make a direct fetch to demonstrate
      const response = await fetch(endpoint, {
        method,
        headers,
        body: method !== "GET" ? JSON.stringify(body) : undefined,
      });
      
      const responseText = await response.text();
      let formattedResponse = responseText;
      
      try {
        // Try to format as JSON if possible
        formattedResponse = formatJson(responseText);
      } catch (e) {
        // Not JSON, keep as is
      }
      
      setResponseData(formattedResponse);
      
      toast({
        title: `${response.status} ${response.statusText}`,
        description: `Request completed successfully`,
        variant: response.ok ? "default" : "destructive",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setResponseData(`Error: ${errorMessage}`);
      toast({
        title: "Request Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The content has been copied to your clipboard",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">API Tester</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => {
            setRequestBody(formatJson(requestBody));
            setRequestHeaders(formatJson(requestHeaders));
          }}>
            <Code className="h-4 w-4 mr-2" /> Format JSON
          </Button>
          <Button variant="outline" disabled>
            <Save className="h-4 w-4 mr-2" /> Save Request
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Request</CardTitle>
            <CardDescription>
              Configure your API request
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Connection (Optional)</label>
              <Select value={selectedAdapter} onValueChange={setSelectedAdapter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a connection" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None (Direct Request)</SelectItem>
                  {activeAdapters.map(adapter => (
                    <SelectItem key={adapter.id} value={adapter.id}>
                      {adapter.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Select a connection to use its authentication and settings
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="text-sm font-medium">Method</label>
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium">Endpoint</label>
                <Input 
                  placeholder="https://api.example.com/endpoint" 
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                />
              </div>
            </div>
            
            <Tabs defaultValue="body">
              <TabsList className="w-full">
                <TabsTrigger value="body" className="flex-1">Body</TabsTrigger>
                <TabsTrigger value="headers" className="flex-1">Headers</TabsTrigger>
              </TabsList>
              <TabsContent value="body" className="mt-2">
                <div className="relative">
                  <Textarea 
                    className="font-mono text-sm min-h-[200px]"
                    value={requestBody}
                    onChange={(e) => handleBodyChange(e.target.value)}
                    disabled={method === "GET"}
                  />
                  {method === "GET" && (
                    <div className="absolute inset-0 bg-muted/30 flex items-center justify-center">
                      <p className="text-muted-foreground">Body not applicable for GET requests</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="headers" className="mt-2">
                <Textarea 
                  className="font-mono text-sm min-h-[200px]"
                  value={requestHeaders}
                  onChange={(e) => handleHeadersChange(e.target.value)}
                />
              </TabsContent>
            </Tabs>
            
            <Button 
              className="w-full" 
              onClick={sendRequest}
              disabled={isLoading || !endpoint}
            >
              <Play className="h-4 w-4 mr-2" />
              {isLoading ? 'Sending...' : 'Send Request'}
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Response</CardTitle>
              <CardDescription>
                API response will appear here
              </CardDescription>
            </div>
            {responseData && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => copyToClipboard(responseData)}
              >
                <Copy className="h-4 w-4 mr-2" /> Copy
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <div className="border rounded-md p-4 min-h-[400px] bg-muted/30">
              {responseData ? (
                <pre className="font-mono text-sm whitespace-pre-wrap overflow-auto">
                  {responseData}
                </pre>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Send a request to see the response here
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApiTester;
