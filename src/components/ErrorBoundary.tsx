
import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw, ThumbsUp } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
  onError?: (error: Error, componentName: string) => string;
  onErrorResolved?: (errorId: string) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId?: string;
  recoveryAttempts: number;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      recoveryAttempts: 0
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true, 
      error,
      recoveryAttempts: 0
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    
    const { componentName = "Unknown Component", onError } = this.props;
    
    // Track error if a tracking function is provided
    if (onError) {
      const errorId = onError(error, componentName);
      this.setState({ errorId });
    }
  }

  resetError = (): void => {
    const { onErrorResolved } = this.props;
    const { errorId } = this.state;
    
    this.setState(prevState => ({ 
      hasError: false, 
      error: null,
      recoveryAttempts: prevState.recoveryAttempts + 1
    }));
    
    // Mark error as resolved if it was successfully recovered
    if (errorId && onErrorResolved) {
      onErrorResolved(errorId);
    }
  };

  render(): ReactNode {
    const { hasError, error, recoveryAttempts } = this.state;
    const { componentName = "Unknown Component" } = this.props;
    
    if (hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="border-red-200 shadow-md">
          <CardHeader className="bg-red-50 dark:bg-red-900/20">
            <div className="flex justify-between items-center">
              <CardTitle className="text-red-700 dark:text-red-300 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Error in {componentName}
              </CardTitle>
              {recoveryAttempts > 0 && (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
                  Recovery attempts: {recoveryAttempts}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-2">
              {error?.message || "An unexpected error occurred"}
            </p>
            {recoveryAttempts >= 3 && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm">
                Multiple recovery attempts have failed. This may indicate a persistent issue that requires attention.
              </div>
            )}
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button onClick={this.resetError} variant="outline" className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try again
            </Button>
            {recoveryAttempts > 0 && (
              <Button 
                variant="ghost" 
                className="flex-1 text-green-600 hover:text-green-700 hover:bg-green-50 border border-green-200"
                onClick={() => {
                  if (this.state.errorId && this.props.onErrorResolved) {
                    this.props.onErrorResolved(this.state.errorId);
                  }
                  this.setState({ hasError: false, error: null, recoveryAttempts: 0 });
                }}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                Mark as resolved
              </Button>
            )}
          </CardFooter>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
