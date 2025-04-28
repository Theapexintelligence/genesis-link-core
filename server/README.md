# Genesis Link Core - Backend Server

This is the backend server for Genesis Link Core, a universal connector platform for integrating various services and systems.

## Features

- RESTful API for managing adapters, workflows, and MCP servers
- Authentication and authorization
- Integration with Supabase for data storage
- Service adapters for various external APIs (OpenAI, Discord, Postgres, etc.)
- AI Framework integration with Ollama and OpenHands

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Supabase account (for database)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

Copy the `.env.example` file to `.env` and update the values:

```bash
cp .env.example .env
```

Edit the `.env` file with your own values:

```
PORT=5000
NODE_ENV=development
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key
JWT_SECRET=your-jwt-secret
```

3. Start the server:

```bash
npm run dev
```

The server will be available at http://localhost:5000.

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user info

### Adapters

- `GET /api/adapters` - Get all adapters
- `GET /api/adapters/:id` - Get a specific adapter
- `POST /api/adapters` - Create a new adapter
- `PUT /api/adapters/:id` - Update an adapter
- `DELETE /api/adapters/:id` - Delete an adapter
- `POST /api/adapters/:id/test` - Test an adapter connection

### Workflows

- `GET /api/workflows` - Get all workflows
- `GET /api/workflows/:id` - Get a specific workflow
- `POST /api/workflows` - Create a new workflow
- `PUT /api/workflows/:id` - Update a workflow
- `DELETE /api/workflows/:id` - Delete a workflow
- `POST /api/workflows/:id/execute` - Execute a workflow

### MCP Servers

- `GET /api/mcp-servers` - Get all MCP servers
- `GET /api/mcp-servers/:id` - Get a specific MCP server
- `POST /api/mcp-servers` - Create a new MCP server
- `PUT /api/mcp-servers/:id` - Update an MCP server
- `DELETE /api/mcp-servers/:id` - Delete an MCP server
- `POST /api/mcp-servers/:id/check` - Check the status of an MCP server

### AI Framework

- `GET /api/ai-framework/status` - Check the status of AI services
- `POST /api/ai-framework/generate` - Generate text with Ollama
- `POST /api/ai-framework/execute` - Execute code with OpenHands
- `POST /api/ai-framework/plan` - Generate a structured plan
- `POST /api/ai-framework/simulate` - Simulate outcomes for different approaches

## Database Schema

The server uses Supabase as the database. The following tables are required:

- `adapters` - Stores adapter configurations
- `workflows` - Stores workflow definitions
- `workflow_connections` - Stores connections between adapters in workflows
- `workflow_executions` - Stores workflow execution history
- `mcp_servers` - Stores MCP server configurations
- `server_alerts` - Stores alerts for MCP servers

## Development

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

## Deployment

To deploy the server to production:

1. Build the server:

```bash
npm run build
```

2. Start the server in production mode:

```bash
npm start
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
