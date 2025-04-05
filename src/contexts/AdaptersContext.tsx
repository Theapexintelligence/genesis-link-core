
import { createContext, useContext, useState, ReactNode } from "react";
import { AdapterType } from "@/types/adapter";

// Sample initial adapters
const initialAdapters: AdapterType[] = [
  {
    id: "1",
    name: "OpenAI GPT-4",
    service: "openai",
    active: true,
    status: "Connected",
    lastUsed: "5 mins ago",
    params: {
      apiKey: "sk-..."
    }
  },
  {
    id: "2",
    name: "Discord Bot",
    service: "discord",
    active: true,
    status: "Connected",
    lastUsed: "10 mins ago",
    params: {
      intents: "default"
    }
  },
  {
    id: "3",
    name: "Data Warehouse",
    service: "postgres",
    active: false,
    status: "Disconnected",
    lastUsed: "1 day ago",
    params: {
      connectionString: "postgres://..."
    }
  }
];

interface AdaptersContextType {
  adapters: AdapterType[];
  addAdapter: (adapter: AdapterType) => void;
  removeAdapter: (id: string) => void;
  toggleAdapter: (id: string) => void;
  updateAdapter: (id: string, updates: Partial<AdapterType>) => void;
}

const AdaptersContext = createContext<AdaptersContextType>({
  adapters: [],
  addAdapter: () => {},
  removeAdapter: () => {},
  toggleAdapter: () => {},
  updateAdapter: () => {}
});

export const useAdapters = () => useContext(AdaptersContext);

export const AdaptersProvider = ({ children }: { children: ReactNode }) => {
  const [adapters, setAdapters] = useState<AdapterType[]>(initialAdapters);

  const addAdapter = (adapter: AdapterType) => {
    setAdapters(prev => [...prev, adapter]);
  };

  const removeAdapter = (id: string) => {
    setAdapters(prev => prev.filter(adapter => adapter.id !== id));
  };

  const toggleAdapter = (id: string) => {
    setAdapters(prev => 
      prev.map(adapter => 
        adapter.id === id 
          ? { 
              ...adapter, 
              active: !adapter.active,
              status: !adapter.active ? "Connected" : "Disconnected" 
            } 
          : adapter
      )
    );
  };

  const updateAdapter = (id: string, updates: Partial<AdapterType>) => {
    setAdapters(prev => 
      prev.map(adapter => 
        adapter.id === id ? { ...adapter, ...updates } : adapter
      )
    );
  };

  return (
    <AdaptersContext.Provider value={{ 
      adapters, 
      addAdapter, 
      removeAdapter, 
      toggleAdapter,
      updateAdapter
    }}>
      {children}
    </AdaptersContext.Provider>
  );
};
