const express = require('express');
const router = express.Router();
const { checkServerStatus } = require('../services/mcpService');

/**
 * @route GET /api/mcp-servers
 * @desc Get all MCP servers
 * @access Private
 */
router.get('/', async (req, res) => {
  try {
    const { data, error } = await req.supabase
      .from('mcp_servers')
      .select('*')
      .order('name');
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching MCP servers:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route GET /api/mcp-servers/:id
 * @desc Get a specific MCP server by ID
 * @access Private
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await req.supabase
      .from('mcp_servers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      return res.status(404).json({ error: 'Server not found' });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching MCP server:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route POST /api/mcp-servers
 * @desc Create a new MCP server
 * @access Private
 */
router.post('/', async (req, res) => {
  try {
    const { name, host, port, tags = [] } = req.body;
    
    if (!name || !host) {
      return res.status(400).json({ error: 'Name and host are required' });
    }
    
    const newServer = {
      name,
      host,
      port: port || 22,
      active: true,
      status: 'Pending',
      resources: { cpu: 0, memory: 0, disk: 0 },
      tags,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await req.supabase
      .from('mcp_servers')
      .insert(newServer)
      .select();
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    // Trigger a status check in the background
    checkServerStatus(req.supabase, data[0].id).catch(err => {
      console.error(`Background status check failed for server ${data[0].id}:`, err);
    });
    
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error creating MCP server:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route PUT /api/mcp-servers/:id
 * @desc Update an MCP server
 * @access Private
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, host, port, active, tags } = req.body;
    
    const updates = {
      ...(name && { name }),
      ...(host && { host }),
      ...(port && { port }),
      ...(active !== undefined && { active }),
      ...(tags && { tags }),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await req.supabase
      .from('mcp_servers')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.json(data[0]);
  } catch (error) {
    console.error('Error updating MCP server:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route DELETE /api/mcp-servers/:id
 * @desc Delete an MCP server
 * @access Private
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await req.supabase
      .from('mcp_servers')
      .delete()
      .eq('id', id);
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.json({ message: 'Server deleted successfully' });
  } catch (error) {
    console.error('Error deleting MCP server:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route POST /api/mcp-servers/:id/check
 * @desc Check the status of an MCP server
 * @access Private
 */
router.post('/:id/check', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get the server
    const { data: server, error: fetchError } = await req.supabase
      .from('mcp_servers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      return res.status(404).json({ error: 'Server not found' });
    }
    
    // Check the server status
    const status = await checkServerStatus(req.supabase, id);
    
    res.json({ status });
  } catch (error) {
    console.error('Error checking MCP server status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
