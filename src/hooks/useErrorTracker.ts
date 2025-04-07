
import { useState, useEffect } from "react";
import { useNotification } from "@/hooks/useNotification";

interface ErrorRecord {
  id: string;
  message: string;
  componentName: string;
  timestamp: Date;
  count: number;
  isResolved: boolean;
  suggestedFix?: string;
}

export function useErrorTracker() {
  const [errors, setErrors] = useState<ErrorRecord[]>([]);
  const { notifyWarning, notifySuccess } = useNotification();
  
  // Add a new error to the tracking system
  const trackError = (error: Error, componentName: string) => {
    const errorId = `${componentName}-${error.message}`;
    
    setErrors(prevErrors => {
      // Check if this error has occurred before
      const existingErrorIndex = prevErrors.findIndex(err => err.id === errorId);
      
      if (existingErrorIndex >= 0) {
        // Update existing error
        const updatedErrors = [...prevErrors];
        updatedErrors[existingErrorIndex] = {
          ...updatedErrors[existingErrorIndex],
          count: updatedErrors[existingErrorIndex].count + 1,
          timestamp: new Date()
        };
        
        // If error occurs frequently, notify the user
        if (updatedErrors[existingErrorIndex].count === 3) {
          notifyWarning("Recurring Error Detected", {
            description: `The error "${error.message}" has occurred multiple times in ${componentName}.`,
            action: {
              label: "View Details",
              onClick: () => console.log("Would show error details dialog")
            }
          });
        }
        
        return updatedErrors;
      } else {
        // Add new error
        return [
          ...prevErrors,
          {
            id: errorId,
            message: error.message,
            componentName,
            timestamp: new Date(),
            count: 1,
            isResolved: false
          }
        ];
      }
    });
    
    // Log error for debugging
    console.error(`[ErrorTracker] ${componentName}:`, error);
    
    return errorId;
  };
  
  // Mark an error as resolved
  const resolveError = (errorId: string) => {
    setErrors(prevErrors => 
      prevErrors.map(err => 
        err.id === errorId 
          ? { ...err, isResolved: true } 
          : err
      )
    );
    
    const error = errors.find(err => err.id === errorId);
    if (error) {
      notifySuccess("Error Resolved", {
        description: `The issue in ${error.componentName} has been marked as resolved.`
      });
    }
  };
  
  // Get error statistics
  const getErrorStats = () => {
    return {
      total: errors.length,
      active: errors.filter(err => !err.isResolved).length,
      resolved: errors.filter(err => err.isResolved).length,
      mostFrequent: errors.length > 0 
        ? errors.reduce((prev, current) => 
            prev.count > current.count ? prev : current
          ) 
        : null
    };
  };
  
  return {
    errors,
    trackError,
    resolveError,
    getErrorStats,
    hasActiveErrors: errors.some(err => !err.isResolved)
  };
}
