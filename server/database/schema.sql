-- Genesis Link Core Database Schema

-- Enable RLS (Row Level Security)
alter database postgres set "app.jwt_secret" to 'your-jwt-secret';

-- Create adapters table
create table if not exists public.adapters (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  service text not null,
  active boolean default true,
  status text default 'Disconnected',
  params jsonb default '{}'::jsonb,
  last_used timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create workflows table
create table if not exists public.workflows (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  status text default 'active',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create workflow connections table
create table if not exists public.workflow_connections (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid references public.workflows(id) on delete cascade,
  source_id uuid references public.adapters(id) on delete cascade,
  target_id uuid references public.adapters(id) on delete cascade,
  label text,
  created_at timestamp with time zone default now()
);

-- Create workflow executions table
create table if not exists public.workflow_executions (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid references public.workflows(id) on delete cascade,
  status text not null,
  input jsonb default '{}'::jsonb,
  output jsonb default '{}'::jsonb,
  started_at timestamp with time zone default now(),
  completed_at timestamp with time zone
);

-- Create MCP servers table
create table if not exists public.mcp_servers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  host text not null,
  port integer default 22,
  active boolean default true,
  status text default 'Pending',
  os text,
  version text,
  uptime text,
  resources jsonb default '{}'::jsonb,
  services jsonb default '[]'::jsonb,
  alerts jsonb default '[]'::jsonb,
  tags text[] default '{}'::text[],
  last_check timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create server alerts table
create table if not exists public.server_alerts (
  id uuid primary key default gen_random_uuid(),
  server_id uuid references public.mcp_servers(id) on delete cascade,
  level text not null,
  message text not null,
  resolved boolean default false,
  timestamp timestamp with time zone default now(),
  resolved_at timestamp with time zone
);

-- Create RLS policies

-- Adapters policies
alter table public.adapters enable row level security;

create policy "Adapters are viewable by everyone"
  on public.adapters for select
  using (true);

create policy "Adapters are insertable by authenticated users"
  on public.adapters for insert
  with check (auth.role() = 'authenticated');

create policy "Adapters are updatable by authenticated users"
  on public.adapters for update
  using (auth.role() = 'authenticated');

create policy "Adapters are deletable by authenticated users"
  on public.adapters for delete
  using (auth.role() = 'authenticated');

-- Workflows policies
alter table public.workflows enable row level security;

create policy "Workflows are viewable by everyone"
  on public.workflows for select
  using (true);

create policy "Workflows are insertable by authenticated users"
  on public.workflows for insert
  with check (auth.role() = 'authenticated');

create policy "Workflows are updatable by authenticated users"
  on public.workflows for update
  using (auth.role() = 'authenticated');

create policy "Workflows are deletable by authenticated users"
  on public.workflows for delete
  using (auth.role() = 'authenticated');

-- Workflow connections policies
alter table public.workflow_connections enable row level security;

create policy "Workflow connections are viewable by everyone"
  on public.workflow_connections for select
  using (true);

create policy "Workflow connections are insertable by authenticated users"
  on public.workflow_connections for insert
  with check (auth.role() = 'authenticated');

create policy "Workflow connections are updatable by authenticated users"
  on public.workflow_connections for update
  using (auth.role() = 'authenticated');

create policy "Workflow connections are deletable by authenticated users"
  on public.workflow_connections for delete
  using (auth.role() = 'authenticated');

-- Workflow executions policies
alter table public.workflow_executions enable row level security;

create policy "Workflow executions are viewable by everyone"
  on public.workflow_executions for select
  using (true);

create policy "Workflow executions are insertable by authenticated users"
  on public.workflow_executions for insert
  with check (auth.role() = 'authenticated');

-- MCP servers policies
alter table public.mcp_servers enable row level security;

create policy "MCP servers are viewable by everyone"
  on public.mcp_servers for select
  using (true);

create policy "MCP servers are insertable by authenticated users"
  on public.mcp_servers for insert
  with check (auth.role() = 'authenticated');

create policy "MCP servers are updatable by authenticated users"
  on public.mcp_servers for update
  using (auth.role() = 'authenticated');

create policy "MCP servers are deletable by authenticated users"
  on public.mcp_servers for delete
  using (auth.role() = 'authenticated');

-- Server alerts policies
alter table public.server_alerts enable row level security;

create policy "Server alerts are viewable by everyone"
  on public.server_alerts for select
  using (true);

create policy "Server alerts are insertable by authenticated users"
  on public.server_alerts for insert
  with check (auth.role() = 'authenticated');

create policy "Server alerts are updatable by authenticated users"
  on public.server_alerts for update
  using (auth.role() = 'authenticated');

-- Create sample data

-- Sample adapters
insert into public.adapters (name, service, active, status, params)
values
  ('OpenAI GPT-4', 'openai', true, 'Connected', '{"apiKey": "sk-..."}'),
  ('Discord Bot', 'discord', true, 'Connected', '{"intents": "default"}'),
  ('Data Warehouse', 'postgres', false, 'Disconnected', '{"connectionString": "postgres://..."}');

-- Sample workflows
insert into public.workflows (name, description)
values
  ('AI Chatbot', 'Connect Discord with OpenAI for an AI-powered chatbot'),
  ('Data Pipeline', 'Extract data from a source database into a warehouse');

-- Sample workflow connections
insert into public.workflow_connections (workflow_id, source_id, target_id, label)
values
  ((select id from public.workflows where name = 'AI Chatbot'), 
   (select id from public.adapters where name = 'Discord Bot'), 
   (select id from public.adapters where name = 'OpenAI GPT-4'), 
   'Message Processing');

-- Sample MCP servers
insert into public.mcp_servers (name, host, port, active, status, resources, tags)
values
  ('Production API', 'api.example.com', 22, true, 'Online', 
   '{"cpu": 45, "memory": 60, "disk": 30}', 
   '{production,api}'),
  ('Database Server', 'db.example.com', 22, true, 'Online', 
   '{"cpu": 70, "memory": 80, "disk": 65}', 
   '{production,database}'),
  ('Development Server', 'dev.example.com', 22, true, 'Online', 
   '{"cpu": 20, "memory": 40, "disk": 25}', 
   '{development}');

-- Sample server alerts
insert into public.server_alerts (server_id, level, message, resolved)
values
  ((select id from public.mcp_servers where name = 'Database Server'), 
   'warning', 'High CPU usage detected', false);
