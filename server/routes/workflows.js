const express = require('express');
const router = express.Router();

/**
 * @route GET /api/workflows
 * @desc Get all workflows for the current user
 * @access Private
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.user?.id;
    
    const { data, error } = await req.supabase
      .from('workflows')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching workflows:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route GET /api/workflows/:id
 * @desc Get a specific workflow by ID
 * @access Private
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await req.supabase
      .from('workflows')
      .select(`
        *,
        connections:workflow_connections(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching workflow:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route POST /api/workflows
 * @desc Create a new workflow
 * @access Private
 */
router.post('/', async (req, res) => {
  try {
    const { name, description, connections } = req.body;
    const userId = req.user?.id;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    // Start a transaction
    const { data: workflow, error: workflowError } = await req.supabase
      .from('workflows')
      .insert({
        name,
        description,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();
    
    if (workflowError) {
      return res.status(400).json({ error: workflowError.message });
    }
    
    // If connections are provided, add them
    if (connections && connections.length > 0) {
      const workflowConnections = connections.map(conn => ({
        workflow_id: workflow[0].id,
        source_id: conn.sourceId,
        target_id: conn.targetId,
        label: conn.label,
        created_at: new Date().toISOString()
      }));
      
      const { error: connectionsError } = await req.supabase
        .from('workflow_connections')
        .insert(workflowConnections);
      
      if (connectionsError) {
        // If there's an error with connections, delete the workflow
        await req.supabase
          .from('workflows')
          .delete()
          .eq('id', workflow[0].id);
        
        return res.status(400).json({ error: connectionsError.message });
      }
    }
    
    res.status(201).json(workflow[0]);
  } catch (error) {
    console.error('Error creating workflow:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route PUT /api/workflows/:id
 * @desc Update a workflow
 * @access Private
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status, connections } = req.body;
    
    // Update workflow
    const updates = {
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(status && { status }),
      updated_at: new Date().toISOString()
    };
    
    const { data: workflow, error: workflowError } = await req.supabase
      .from('workflows')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (workflowError) {
      return res.status(400).json({ error: workflowError.message });
    }
    
    // If connections are provided, update them
    if (connections) {
      // First, delete existing connections
      await req.supabase
        .from('workflow_connections')
        .delete()
        .eq('workflow_id', id);
      
      // Then, add new connections
      if (connections.length > 0) {
        const workflowConnections = connections.map(conn => ({
          workflow_id: id,
          source_id: conn.sourceId,
          target_id: conn.targetId,
          label: conn.label,
          created_at: new Date().toISOString()
        }));
        
        const { error: connectionsError } = await req.supabase
          .from('workflow_connections')
          .insert(workflowConnections);
        
        if (connectionsError) {
          return res.status(400).json({ error: connectionsError.message });
        }
      }
    }
    
    res.json(workflow[0]);
  } catch (error) {
    console.error('Error updating workflow:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route DELETE /api/workflows/:id
 * @desc Delete a workflow
 * @access Private
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete connections first (foreign key constraint)
    await req.supabase
      .from('workflow_connections')
      .delete()
      .eq('workflow_id', id);
    
    // Then delete the workflow
    const { error } = await req.supabase
      .from('workflows')
      .delete()
      .eq('id', id);
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.json({ message: 'Workflow deleted successfully' });
  } catch (error) {
    console.error('Error deleting workflow:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route POST /api/workflows/:id/execute
 * @desc Execute a workflow
 * @access Private
 */
router.post('/:id/execute', async (req, res) => {
  try {
    const { id } = req.params;
    const { input } = req.body;
    
    // Get the workflow with its connections
    const { data: workflow, error: workflowError } = await req.supabase
      .from('workflows')
      .select(`
        *,
        connections:workflow_connections(*)
      `)
      .eq('id', id)
      .single();
    
    if (workflowError) {
      return res.status(404).json({ error: 'Workflow not found' });
    }
    
    // In a real implementation, this would execute the workflow
    // For now, we'll just simulate execution
    
    // Log the execution
    const { data: execution, error: executionError } = await req.supabase
      .from('workflow_executions')
      .insert({
        workflow_id: id,
        status: 'completed',
        input: input || {},
        output: { result: 'Workflow executed successfully' },
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString()
      })
      .select();
    
    if (executionError) {
      return res.status(400).json({ error: executionError.message });
    }
    
    res.json({
      execution_id: execution[0].id,
      status: 'completed',
      result: 'Workflow executed successfully'
    });
  } catch (error) {
    console.error('Error executing workflow:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
