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

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://znuwvmrftqoorgapbmgl.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpudXd2bXJmdHFvb3JnYXBibWdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5OTM0ODUsImV4cCI6MjA1OTU2OTQ4NX0.uXxfCPVHEi2pEI7ywRErripIjfXegnOowGJzFWzPch8';
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(cors());
app.use(express.json());

// Make supabase client available to route handlers
app.use((req, res, next) => {
  req.supabase = supabase;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/adapters', authenticateToken, adaptersRoutes);
app.use('/api/workflows', authenticateToken, workflowsRoutes);
app.use('/api/mcp-servers', authenticateToken, mcpServersRoutes);
app.use('/api/ai-framework', authenticateToken, aiFrameworkRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Genesis Link Core API running on port ${PORT}`);
});

module.exports = app;
