
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Code, Copy, Loader2, Play, Sparkles, Terminal, Trash } from "lucide-react";

interface CodeResponse {
  code: string;
  explanation: string;
}

const AGENT_MODELS = [
  { id: "codellama", name: "CodeLlama 7B", description: "Fast code generation" },
  { id: "deepseek", name: "DeepSeek Coder", description: "Detailed code solutions" },
  { id: "wizardcoder", name: "WizardCoder", description: "Best for complex tasks" },
];

const PROGRAMMING_LANGUAGES = [
  { id: "javascript", name: "JavaScript" },
  { id: "typescript", name: "TypeScript" },
  { id: "python", name: "Python" },
  { id: "java", name: "Java" },
  { id: "csharp", name: "C#" },
  { id: "cpp", name: "C++" },
  { id: "ruby", name: "Ruby" },
  { id: "go", name: "Go" },
  { id: "rust", name: "Rust" },
  { id: "php", name: "PHP" },
];

const CodeAgent = () => {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("codellama");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [temperature, setTemperature] = useState([0.7]);
  const [generatedCode, setGeneratedCode] = useState<CodeResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a coding task");
      return;
    }

    setIsGenerating(true);
    try {
      // In a real implementation, this would call an API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate a response based on the language selected
      const codeExamples = {
        javascript: `// Function to calculate fibonacci sequence
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n-1) + fibonacci(n-2);
}

// Generate first 10 fibonacci numbers
const fibSequence = Array.from({length: 10}, (_, i) => fibonacci(i));
console.log(fibSequence);`,
        typescript: `// Function to calculate fibonacci sequence
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n-1) + fibonacci(n-2);
}

// Generate first 10 fibonacci numbers
const fibSequence: number[] = Array.from({length: 10}, (_, i) => fibonacci(i));
console.log(fibSequence);`,
        python: `# Function to calculate fibonacci sequence
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Generate first 10 fibonacci numbers
fib_sequence = [fibonacci(i) for i in range(10)]
print(fib_sequence)`,
      };

      const defaultCode = `// Generated code example
function processData(data) {
  // Process the data
  return data.map(item => item * 2);
}`;

      setGeneratedCode({
        code: codeExamples[selectedLanguage as keyof typeof codeExamples] || defaultCode,
        explanation: "This code implements a solution for the given problem using an efficient approach. It handles edge cases and follows best practices for the selected programming language."
      });
      
      toast.success("Code generated successfully!");
    } catch (error) {
      toast.error("Failed to generate code");
      console.error("Generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCode = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode.code);
      toast.success("Code copied to clipboard");
    }
  };

  const handleClear = () => {
    setPrompt("");
    setGeneratedCode(null);
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Terminal className="h-6 w-6" />
          Code Agent
        </CardTitle>
        <CardDescription>
          Generate code snippets with AI assistance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Model</label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger>
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {AGENT_MODELS.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name} - {model.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Language</label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {PROGRAMMING_LANGUAGES.map((lang) => (
                  <SelectItem key={lang.id} value={lang.id}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">Temperature: {temperature[0]}</label>
          <Slider
            value={temperature}
            min={0.1}
            max={1.0}
            step={0.1}
            onValueChange={setTemperature}
            className="mb-6"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">Describe what you need</label>
          <Textarea
            placeholder="E.g., Create a function that calculates the fibonacci sequence"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[120px]"
          />
        </div>
        
        {generatedCode && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Generated Code</h3>
              <Button variant="ghost" size="sm" onClick={handleCopyCode}>
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
            </div>
            <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md overflow-x-auto text-sm">
              {generatedCode.code}
            </pre>
            <div>
              <h3 className="text-sm font-medium mb-1">Explanation</h3>
              <p className="text-sm text-muted-foreground">{generatedCode.explanation}</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleClear} disabled={isGenerating}>
          <Trash className="h-4 w-4 mr-2" />
          Clear
        </Button>
        <Button onClick={handleGenerate} disabled={isGenerating || !prompt.trim()}>
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Code
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CodeAgent;
