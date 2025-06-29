/**
 * API client for Genesis Link Core backend
 */

import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  
  register: (email: string, password: string, name: string) => 
    api.post('/auth/register', { email, password, name }),
  
  logout: () => 
    api.post('/auth/logout'),
  
  getCurrentUser: () => 
    api.get('/auth/me'),
};

// Adapters API
export const adaptersApi = {
  getAll: () => 
    api.get('/adapters'),
  
  getById: (id: string) => 
    api.get(`/adapters/${id}`),
  
  create: (adapter: any) => 
    api.post('/adapters', adapter),
  
  update: (id: string, updates: any) => 
    api.put(`/adapters/${id}`, updates),
  
  delete: (id: string) => 
    api.delete(`/adapters/${id}`),
  
  test: (id: string) => 
    api.post(`/adapters/${id}/test`),
};

// Workflows API
export const workflowsApi = {
  getAll: () => 
    api.get('/workflows'),
  
  getById: (id: string) => 
    api.get(`/workflows/${id}`),
  
  create: (workflow: any) => 
    api.post('/workflows', workflow),
  
  update: (id: string, updates: any) => 
    api.put(`/workflows/${id}`, updates),
  
  delete: (id: string) => 
    api.delete(`/workflows/${id}`),
  
  execute: (id: string, input?: any) => 
    api.post(`/workflows/${id}/execute`, { input }),
};

// MCP Servers API
export const mcpServersApi = {
  getAll: () => 
    api.get('/mcp-servers'),
  
  getById: (id: string) => 
    api.get(`/mcp-servers/${id}`),
  
  create: (server: any) => 
    api.post('/mcp-servers', server),
  
  update: (id: string, updates: any) => 
    api.put(`/mcp-servers/${id}`, updates),
  
  delete: (id: string) => 
    api.delete(`/mcp-servers/${id}`),
  
  check: (id: string) => 
    api.post(`/mcp-servers/${id}/check`),
};

// AI Framework API
export const aiFrameworkApi = {
  getStatus: () => 
    api.get('/ai-framework/status'),
  
  generate: (prompt: string, model?: string, temperature?: number, maxTokens?: number) => 
    api.post('/ai-framework/generate', { prompt, model, temperature, maxTokens }),
  
  execute: (code: string, language?: string) => 
    api.post('/ai-framework/execute', { code, language }),
  
  plan: (goal: string, context?: string) => 
    api.post('/ai-framework/plan', { goal, context }),
  
  simulate: (approaches: string[]) => 
    api.post('/ai-framework/simulate', { approaches }),
};

export default {
  auth: authApi,
  adapters: adaptersApi,
  workflows: workflowsApi,
  mcpServers: mcpServersApi,
  aiFramework: aiFrameworkApi,
};