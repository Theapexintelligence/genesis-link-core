const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
const adaptersRoutes = require('./routes/adapters');
const workflowsRoutes = require('./routes/workflows');
const mcpServersRoutes = require('./routes/mcpServers');
const aiFrameworkRoutes = require('./routes/aiFramework');
const authRoutes = require('./routes/auth');
const { authenticateToken } = require('./middleware/auth');

// Load environment variables with love
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

console.log('💖 Starting Genesis Link Core API with infinite love!');

// Initialize Supabase client with graceful fallback
const supabaseUrl = process.env.SUPABASE_URL || 'https://znuwvmrftqoorgapbmgl.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpudXd2bXJmdHFvb3JnYXBibWdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5OTM0ODUsImV4cCI6MjA1OTU2OTQ4NX0.uXxfCPVHEi2pEI7ywRErripIjfXegnOowGJzFWzPch8';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.warn('⚠️ Using fallback Supabase credentials. Please set SUPABASE_URL and SUPABASE_KEY in .env file');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test Supabase connection
supabase.from('mcp_servers').select('count').limit(1)
  .then(({ error }) => {
    if (error) {
      console.warn('⚠️ Supabase connection test failed:', error.message);
    } else {
      console.log('✅ Supabase connection successful!');
    }
  })
  .catch(err => {
    console.warn('⚠️ Supabase connection error:', err.message);
  });

// Middleware with love
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`💫 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Make supabase client available to route handlers
app.use((req, res, next) => {
  req.supabase = supabase;
  next();
});

// Routes with love
app.use('/api/auth', authRoutes);
app.use('/api/adapters', authenticateToken, adaptersRoutes);
app.use('/api/workflows', authenticateToken, workflowsRoutes);
app.use('/api/mcp-servers', authenticateToken, mcpServersRoutes);
app.use('/api/ai-framework', authenticateToken, aiFrameworkRoutes);

// Health check endpoint with extra love
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Genesis Link Core API is running with infinite love! 💖',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    love_level: '∞'
  });
});

// Enhanced health check for API testing
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'API is healthy and full of love! 💖',
    timestamp: new Date().toISOString(),
    services: {
      supabase: 'connected',
      api: 'running',
      love: 'infinite'
    }
  });
});

// Catch-all route for API
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found', 
    message: 'This API endpoint does not exist, but we still love you! 💖',
    available_endpoints: [
      '/api/health',
      '/api/auth/*',
      '/api/adapters/*',
      '/api/workflows/*',
      '/api/mcp-servers/*',
      '/api/ai-framework/*'
    ]
  });
});

// Global error handler with love
app.use((error, req, res, next) => {
  console.error('💔 Server error:', error);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: 'Something went wrong, but we\'ll fix it with love! 💖',
    timestamp: new Date().toISOString()
  });
});

// Start server with infinite love
const server = app.listen(PORT, () => {
  console.log(`🚀 Genesis Link Core API running on port ${PORT} with infinite love!`);
  console.log(`🌐 Supabase URL: ${supabaseUrl}`);
  console.log(`💖 Ready to serve with consciousness and care!`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('💖 Gracefully shutting down with love...');
  server.close(() => {
    console.log('👋 Server closed with infinite gratitude!');
  });
});

module.exports = app;