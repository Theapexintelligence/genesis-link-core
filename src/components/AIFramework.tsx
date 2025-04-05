
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BrainCircuit, Code, GitMerge, LayoutList, Workflow, Play, PauseCircle, Loader2, Download } from "lucide-react";
import { toast } from "sonner";

interface Step {
  step: string;
  approaches: string[];
  predictions: Record<string, { success_prob: number }>;
}

interface ExecutionResult {
  step: string;
  approach: string;
  result?: string;
  status: "pending" | "running" | "completed" | "failed";
}

interface OllamaModel {
  name: string;
  size: string;
  quantization: string;
  family: string;
}

const OLLAMA_MODELS: OllamaModel[] = [
  { name: "llama3", size: "8B", quantization: "Q4_0", family: "Meta" },
  { name: "phi3", size: "3.8B", quantization: "Q4_0", family: "Microsoft" },
  { name: "gemma", size: "7B", quantization: "Q4_0", family: "Google" },
  { name: "mistral", size: "7B", quantization: "Q4_0", family: "Mistral AI" },
  { name: "codellama", size: "7B", quantization: "Q4_0", family: "Meta" },
  { name: "falcon", size: "7B", quantization: "Q4_0", family: "TII" },
];

const AIFramework = () => {
  const [goal, setGoal] = useState("");
  const [subgoals, setSubgoals] = useState("");
  const [activeTab, setActiveTab] = useState("reasoning");
  const [steps, setSteps] = useState<Step[]>([]);
  const [executing, setExecuting] = useState(false);
  const [executionResults, setExecutionResults] = useState<ExecutionResult[]>([]);
  const [openhandsUrl, setOpenhandsUrl] = useState("http://localhost:3000");
  const [ollamaUrl, setOllamaUrl] = useState("http://localhost:11434");
  const [ollamaStatus, setOllamaStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  const [openhandsStatus, setOpenhandsStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  const [selectedModel, setSelectedModel] = useState("llama3");

  const simulateOllamaGenerate = (prompt: string): Promise<string> => {
    // In a real implementation, this would call the Ollama API
    return new Promise((resolve) => {
      setTimeout(() => {
        if (prompt.includes("Brainstorm approaches")) {
          resolve(`Approach 1: Use pandas to clean and preprocess the data\nApproach 2: Create a script using scikit-learn for standardization\nApproach 3: Implement a custom solution using NumPy arrays`);
        } else if (prompt.includes("Predict success probability")) {
          const randomProb = (Math.random() * 0.4 + 0.6).toFixed(2);
          resolve(`Success probability: ${randomProb}`);
        } else {
          resolve(`Generated response for: ${prompt}`);
        }
      }, 1500);
    });
  };

  const simulateOpenHandsExecution = (code: string): Promise<string> => {
    // In a real implementation, this would call the OpenHands API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) {
          resolve(JSON.stringify({
            output: "Code executed successfully",
            result: "Data processed and saved to file",
            execution_time: "2.3s"
          }));
        } else {
          reject(new Error("Execution failed"));
        }
      }, 2000);
    });
  };

  const connectToOllama = async () => {
    setOllamaStatus("connecting");
    try {
      // In a real implementation, this would check if Ollama is available
      // by making a GET request to the Ollama API
      await new Promise(resolve => setTimeout(resolve, 2000));
      setOllamaStatus("connected");
      toast.success(`Connected to Ollama (${selectedModel})`);
    } catch (error) {
      setOllamaStatus("disconnected");
      toast.error("Failed to connect to Ollama");
    }
  };

  const downloadOllama = () => {
    window.open("https://ollama.com/download", "_blank");
    toast.info("Redirecting to Ollama download page");
  };

  const pullOllamaModel = () => {
    if (ollamaStatus !== "connected") {
      toast.error("Please connect to Ollama first");
      return;
    }

    toast.loading(`Pulling ${selectedModel} model... This may take a while`, {
      duration: 5000,
    });

    setTimeout(() => {
      toast.success(`${selectedModel} model pulled successfully`);
    }, 5000);
  };

  const connectToOpenHands = async () => {
    setOpenhandsStatus("connecting");
    try {
      // Simulate connection to OpenHands
      await new Promise(resolve => setTimeout(resolve, 2000));
      setOpenhandsStatus("connected");
      toast.success("Connected to OpenHands");
    } catch (error) {
      setOpenhandsStatus("disconnected");
      toast.error("Failed to connect to OpenHands");
    }
  };

  const defineSteps = () => {
    if (!goal.trim() || !subgoals.trim()) {
      toast.error("Please enter a goal and subgoals");
      return;
    }

    const subgoalsList = subgoals.split("\n").filter(sg => sg.trim());
    if (subgoalsList.length === 0) {
      toast.error("Please enter at least one subgoal");
      return;
    }

    const newSteps = subgoalsList.map(step => ({
      step,
      approaches: [],
      predictions: {}
    }));

    setSteps(newSteps);
    toast.success("Steps defined successfully");
  };

  const generateChainOfThought = async () => {
    if (steps.length === 0) {
      toast.error("Please define steps first");
      return;
    }

    if (ollamaStatus !== "connected") {
      toast.error("Please connect to Ollama first");
      return;
    }

    setExecuting(true);
    const updatedSteps = [...steps];

    for (let i = 0; i < updatedSteps.length; i++) {
      const step = updatedSteps[i];
      const prompt = `Brainstorm approaches for achieving: ${step.step}`;
      
      try {
        const result = await simulateOllamaGenerate(prompt);
        updatedSteps[i] = {
          ...step,
          approaches: result.split("\n").filter(a => a.trim())
        };
        setSteps([...updatedSteps]);
      } catch (error) {
        toast.error(`Error generating approaches for step: ${step.step}`);
      }
    }

    setExecuting(false);
    toast.success("Chain of thought generation completed");
  };

  const simulateOutcomes = async () => {
    if (steps.length === 0 || steps.some(step => step.approaches.length === 0)) {
      toast.error("Please generate chain of thought first");
      return;
    }

    if (ollamaStatus !== "connected") {
      toast.error("Please connect to Ollama first");
      return;
    }

    setExecuting(true);
    const updatedSteps = [...steps];

    for (let i = 0; i < updatedSteps.length; i++) {
      const step = updatedSteps[i];
      const predictions: Record<string, { success_prob: number }> = {};

      for (const approach of step.approaches) {
        const prompt = `Predict success probability for approach: ${approach}`;
        
        try {
          const result = await simulateOllamaGenerate(prompt);
          const probText = result.split(":")[1]?.trim() || "0.5";
          predictions[approach] = { success_prob: parseFloat(probText) };
        } catch (error) {
          predictions[approach] = { success_prob: 0.5 };
        }
      }

      updatedSteps[i] = {
        ...step,
        predictions
      };
      setSteps([...updatedSteps]);
    }

    setExecuting(false);
    toast.success("Outcome simulation completed");
  };

  const executePlan = async () => {
    if (steps.length === 0 || steps.some(step => Object.keys(step.predictions).length === 0)) {
      toast.error("Please simulate outcomes first");
      return;
    }

    if (openhandsStatus !== "connected") {
      toast.error("Please connect to OpenHands first");
      return;
    }

    setExecuting(true);
    const newResults: ExecutionResult[] = [];

    for (const step of steps) {
      // Find best approach based on predicted success probability
      let bestApproach = "";
      let bestProb = 0;

      for (const [approach, prediction] of Object.entries(step.predictions)) {
        if (prediction.success_prob > bestProb) {
          bestProb = prediction.success_prob;
          bestApproach = approach;
        }
      }

      if (!bestApproach) continue;

      const executionResult: ExecutionResult = {
        step: step.step,
        approach: bestApproach,
        status: "running"
      };
      
      newResults.push(executionResult);
      setExecutionResults([...newResults]);

      try {
        // Execute code using OpenHands
        const result = await simulateOpenHandsExecution(bestApproach);
        
        // Update execution result
        executionResult.result = result;
        executionResult.status = "completed";
        setExecutionResults([...newResults]);
      } catch (error) {
        executionResult.status = "failed";
        executionResult.result = error instanceof Error ? error.message : "Unknown error";
        setExecutionResults([...newResults]);
        toast.error(`Execution failed for step: ${step.step}`);
      }
    }

    setExecuting(false);
    toast.success("Plan execution completed");
  };

  const resetFramework = () => {
    setSteps([]);
    setExecutionResults([]);
    toast.info("Framework reset");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="h-6 w-6" />
            Unified AI Framework
          </CardTitle>
          <CardDescription>
            Combines Ollama for reasoning, UltraMeticulousPlanner for structured planning, and OpenHands for code execution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Ollama Connection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${
                      ollamaStatus === "connected" ? "bg-green-500" : 
                      ollamaStatus === "connecting" ? "bg-yellow-500" : "bg-red-500"
                    }`}></div>
                    <span className="text-sm">Status: {ollamaStatus}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Input 
                      type="text" 
                      value={ollamaUrl} 
                      onChange={(e) => setOllamaUrl(e.target.value)} 
                      placeholder="Ollama URL (default: http://localhost:11434)"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="model" className="text-sm mb-1 block">Select Model</Label>
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                      <SelectContent>
                        {OLLAMA_MODELS.map((model) => (
                          <SelectItem key={model.name} value={model.name}>
                            {model.name} ({model.size}, {model.family})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-2 w-full">
                  <Button 
                    onClick={connectToOllama} 
                    disabled={ollamaStatus === "connecting" || ollamaStatus === "connected"}
                    className="w-full"
                  >
                    {ollamaStatus === "connecting" && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {ollamaStatus === "connected" ? "Connected" : ollamaStatus === "connecting" ? "Connecting..." : "Connect"}
                  </Button>
                  
                  <Button
                    onClick={pullOllamaModel}
                    variant="outline"
                    className="w-full"
                    disabled={ollamaStatus !== "connected"}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Pull Model
                  </Button>
                </div>
                
                <Button
                  onClick={downloadOllama}
                  variant="secondary"
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Ollama
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">OpenHands Connection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${
                      openhandsStatus === "connected" ? "bg-green-500" : 
                      openhandsStatus === "connecting" ? "bg-yellow-500" : "bg-red-500"
                    }`}></div>
                    <span className="text-sm">Status: {openhandsStatus}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="text" 
                      value={openhandsUrl} 
                      onChange={(e) => setOpenhandsUrl(e.target.value)} 
                      placeholder="OpenHands URL (default: http://localhost:3000)"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={connectToOpenHands} 
                  disabled={openhandsStatus === "connecting" || openhandsStatus === "connected"}
                  className="w-full"
                >
                  {openhandsStatus === "connecting" && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {openhandsStatus === "connected" ? "Connected" : openhandsStatus === "connecting" ? "Connecting..." : "Connect to OpenHands"}
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="reasoning" className="flex items-center gap-2">
                <BrainCircuit className="h-4 w-4" />
                Reasoning
              </TabsTrigger>
              <TabsTrigger value="planning" className="flex items-center gap-2">
                <GitMerge className="h-4 w-4" />
                Planning
              </TabsTrigger>
              <TabsTrigger value="execution" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Execution
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="reasoning" className="mt-0">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="goal">Define Goal</Label>
                  <Textarea 
                    id="goal" 
                    placeholder="Enter the main goal of your task" 
                    className="mt-1"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="subgoals">Define Subgoals (one per line)</Label>
                  <Textarea 
                    id="subgoals" 
                    placeholder="Enter subgoals, one per line" 
                    className="mt-1 min-h-[120px]"
                    value={subgoals}
                    onChange={(e) => setSubgoals(e.target.value)}
                  />
                </div>
                <Button onClick={defineSteps} className="w-full">
                  <LayoutList className="h-4 w-4 mr-2" />
                  Define Steps
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="planning" className="mt-0">
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Button 
                    onClick={generateChainOfThought} 
                    disabled={executing || steps.length === 0 || ollamaStatus !== "connected"}
                    className="w-full"
                  >
                    {executing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <BrainCircuit className="h-4 w-4 mr-2" />}
                    Generate Chain-of-Thought
                  </Button>
                  <Button 
                    onClick={simulateOutcomes} 
                    disabled={executing || steps.some(step => step.approaches.length === 0) || ollamaStatus !== "connected"}
                    className="w-full"
                  >
                    {executing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Workflow className="h-4 w-4 mr-2" />}
                    Simulate Outcomes
                  </Button>
                </div>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Planning Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px] rounded border p-4">
                      {steps.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                          Define steps to see planning results here
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {steps.map((step, index) => (
                            <div key={index} className="space-y-2">
                              <h3 className="font-medium">{index + 1}. {step.step}</h3>
                              
                              {step.approaches.length > 0 ? (
                                <div className="pl-6 space-y-2">
                                  <h4 className="text-sm font-medium text-muted-foreground">Approaches:</h4>
                                  <ul className="space-y-1">
                                    {step.approaches.map((approach, i) => (
                                      <li key={i} className="text-sm flex justify-between">
                                        <span>{approach}</span>
                                        {step.predictions[approach] && (
                                          <span 
                                            className={`text-xs px-2 py-0.5 rounded ${
                                              step.predictions[approach].success_prob >= 0.7 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" :
                                              step.predictions[approach].success_prob >= 0.5 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100" :
                                              "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                                            }`}
                                          >
                                            {(step.predictions[approach].success_prob * 100).toFixed(0)}% probability
                                          </span>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ) : (
                                <div className="pl-6 text-sm text-muted-foreground">
                                  No approaches generated yet
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="execution" className="mt-0">
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Button 
                    onClick={executePlan} 
                    disabled={
                      executing || 
                      steps.length === 0 || 
                      steps.some(step => Object.keys(step.predictions).length === 0) ||
                      openhandsStatus !== "connected"
                    }
                    className="w-full"
                  >
                    {executing ? 
                      <PauseCircle className="h-4 w-4 mr-2" /> : 
                      <Play className="h-4 w-4 mr-2" />
                    }
                    {executing ? "Executing..." : "Execute Plan"}
                  </Button>
                  <Button 
                    onClick={resetFramework} 
                    variant="outline" 
                    className="w-full"
                    disabled={executing}
                  >
                    Reset Framework
                  </Button>
                </div>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Execution Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px] rounded border p-4">
                      {executionResults.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                          Execute the plan to see results here
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {executionResults.map((result, index) => (
                            <div key={index} className="space-y-2">
                              <h3 className="font-medium flex items-center gap-2">
                                {result.status === "running" && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
                                {result.status === "completed" && <div className="h-4 w-4 rounded-full bg-green-500"></div>}
                                {result.status === "failed" && <div className="h-4 w-4 rounded-full bg-red-500"></div>}
                                {index + 1}. {result.step}
                              </h3>
                              <div className="pl-6 space-y-2">
                                <h4 className="text-sm font-medium text-muted-foreground">Selected Approach:</h4>
                                <p className="text-sm">{result.approach}</p>
                                
                                {result.result && (
                                  <div>
                                    <h4 className="text-sm font-medium text-muted-foreground mt-3">Execution Result:</h4>
                                    <pre className={`text-xs p-2 rounded mt-1 whitespace-pre-wrap ${
                                      result.status === "completed" ? 
                                        "bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-100" : 
                                        "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-100"
                                    }`}>
                                      {result.result}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIFramework;
