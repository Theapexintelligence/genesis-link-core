
import React, { createContext, useContext, ReactNode } from "react";
import { useErrorTracker } from "@/hooks/useErrorTracker";

type ErrorContextType = ReturnType<typeof useErrorTracker>;

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export function ErrorProvider({ children }: { children: ReactNode }) {
  const errorTracker = useErrorTracker();
  
  return (
    <ErrorContext.Provider value={errorTracker}>
      {children}
    </ErrorContext.Provider>
  );
}

export function useError() {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
}
