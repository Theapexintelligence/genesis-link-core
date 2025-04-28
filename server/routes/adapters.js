const express = require('express');
const router = express.Router();
const { initializeAdapter } = require('../services/adapterService');

/**
 * @route GET /api/adapters
 * @desc Get all adapters for the current user
 * @access Private
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.user?.id;
    
    const { data, error } = await req.supabase
      .from('adapters')
      .select('*')
      .order('name');
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching adapters:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route GET /api/adapters/:id
 * @desc Get a specific adapter by ID
 * @access Private
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await req.supabase
      .from('adapters')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      return res.status(404).json({ error: 'Adapter not found' });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching adapter:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route POST /api/adapters
 * @desc Create a new adapter
 * @access Private
 */
router.post('/', async (req, res) => {
  try {
    const { name, service, params } = req.body;
    const userId = req.user?.id;
    
    if (!name || !service) {
      return res.status(400).json({ error: 'Name and service are required' });
    }
    
    // Initialize the adapter to verify connection
    try {
      await initializeAdapter(service, params);
    } catch (error) {
      return res.status(400).json({ error: `Connection failed: ${error.message}` });
    }
    
    const newAdapter = {
      name,
      service,
      params,
      active: true,
      status: 'Connected',
      last_used: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await req.supabase
      .from('adapters')
      .insert(newAdapter)
      .select();
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error creating adapter:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route PUT /api/adapters/:id
 * @desc Update an adapter
 * @access Private
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, params, active } = req.body;
    
    // Get the current adapter to check service
    const { data: existingAdapter, error: fetchError } = await req.supabase
      .from('adapters')
      .select('service')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      return res.status(404).json({ error: 'Adapter not found' });
    }
    
    // If params changed, verify connection
    if (params) {
      try {
        await initializeAdapter(existingAdapter.service, params);
      } catch (error) {
        return res.status(400).json({ error: `Connection failed: ${error.message}` });
      }
    }
    
    const updates = {
      ...(name && { name }),
      ...(params && { params }),
      ...(active !== undefined && { 
        active,
        status: active ? 'Connected' : 'Disconnected'
      }),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await req.supabase
      .from('adapters')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.json(data[0]);
  } catch (error) {
    console.error('Error updating adapter:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route DELETE /api/adapters/:id
 * @desc Delete an adapter
 * @access Private
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await req.supabase
      .from('adapters')
      .delete()
      .eq('id', id);
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.json({ message: 'Adapter deleted successfully' });
  } catch (error) {
    console.error('Error deleting adapter:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route POST /api/adapters/:id/test
 * @desc Test an adapter connection
 * @access Private
 */
router.post('/:id/test', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get the adapter
    const { data: adapter, error: fetchError } = await req.supabase
      .from('adapters')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      return res.status(404).json({ error: 'Adapter not found' });
    }
    
    // Test the connection
    try {
      await initializeAdapter(adapter.service, adapter.params);
      
      // Update last used timestamp
      await req.supabase
        .from('adapters')
        .update({ 
          last_used: new Date().toISOString(),
          status: 'Connected'
        })
        .eq('id', id);
      
      res.json({ success: true, message: 'Connection successful' });
    } catch (error) {
      // Update status to error
      await req.supabase
        .from('adapters')
        .update({ status: 'Error' })
        .eq('id', id);
      
      res.status(400).json({ success: false, error: error.message });
    }
  } catch (error) {
    console.error('Error testing adapter:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
