# Genesis Link Core - The Universal Connector

Genesis Link Core (Apex Genesis 2.0) is a comprehensive integration platform that allows you to connect various services and systems together. It provides a modular, plug-and-play core for infinite integrations.

## Project Overview

Genesis Link Core consists of:

1. **Frontend**: A React-based web application for managing connections, workflows, and monitoring
2. **Backend**: A Node.js Express server providing API endpoints and service integrations

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/3cf97427-2c44-4c0d-bf4b-9da50a52066c) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Install backend dependencies.
cd server && npm install && cd ..

# Step 5: Start both frontend and backend development servers.
npm run dev:all
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

### Frontend
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- React Query
- React Router

### Backend
- Node.js
- Express
- Supabase
- JWT Authentication
- RESTful API

## Key Features

- **Connections Management**: Add, configure, and manage connections to various services
- **Workflow Designer**: Create data flows between different services
- **System Monitoring**: Dashboard with metrics and analytics
- **MCP Servers**: Manage and monitor infrastructure servers
- **AI Framework**: Unified AI framework for reasoning and code execution
- **API Testing**: Test API connections and endpoints
- **Template Library**: Pre-built integration templates for common scenarios

## Running the Project

### Development Mode

To run both frontend and backend in development mode:

```bash
npm run dev:all
```

To run only the frontend:

```bash
npm run dev
```

To run only the backend:

```bash
npm run dev:server
```

### Production Mode

To build and run in production mode:

```bash
npm run build:all
npm run start:all
```

## API Documentation

The backend API is available at `http://localhost:5000` when running locally. See the [server README](./server/README.md) for detailed API documentation.

## License

This project is licensed under the MIT License.
