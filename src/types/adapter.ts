
export interface AdapterType {
  id: string;
  name: string;
  service: string;
  active: boolean;
  status: string;
  lastUsed: string;
  params: Record<string, any>;
}
