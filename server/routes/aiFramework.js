const express = require('express');
const router = express.Router();
const { 
  generateWithOllama, 
  executeWithOpenHands,
  checkOllamaStatus,
  checkOpenHandsStatus
} = require('../services/aiService');

/**
 * @route GET /api/ai-framework/status
 * @desc Check the status of AI services
 * @access Private
 */
router.get('/status', async (req, res) => {
  try {
    const ollamaStatus = await checkOllamaStatus();
    const openHandsStatus = await checkOpenHandsStatus();
    
    res.json({
      ollama: ollamaStatus,
      openHands: openHandsStatus
    });
  } catch (error) {
    console.error('Error checking AI services status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route POST /api/ai-framework/generate
 * @desc Generate text with Ollama
 * @access Private
 */
router.post('/generate', async (req, res) => {
  try {
    const { prompt, model = 'llama3', temperature = 0.7, maxTokens = 1000 } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    const result = await generateWithOllama(prompt, model, temperature, maxTokens);
    
    res.json({ result });
  } catch (error) {
    console.error('Error generating with Ollama:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

/**
 * @route POST /api/ai-framework/execute
 * @desc Execute code with OpenHands
 * @access Private
 */
router.post('/execute', async (req, res) => {
  try {
    const { code, language = 'python' } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }
    
    const result = await executeWithOpenHands(code, language);
    
    res.json(result);
  } catch (error) {
    console.error('Error executing with OpenHands:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

/**
 * @route POST /api/ai-framework/plan
 * @desc Generate a structured plan
 * @access Private
 */
router.post('/plan', async (req, res) => {
  try {
    const { goal, context } = req.body;
    
    if (!goal) {
      return res.status(400).json({ error: 'Goal is required' });
    }
    
    // Create a prompt for the planner
    const plannerPrompt = `
      Goal: ${goal}
      ${context ? `Context: ${context}` : ''}
      
      Create a detailed plan with the following structure:
      1. Main objective
      2. Sub-goals (numbered list)
      3. For each sub-goal, list specific steps (lettered list)
      4. Potential approaches for each step
      5. Success criteria
    `;
    
    const result = await generateWithOllama(plannerPrompt, 'llama3', 0.5, 2000);
    
    // Parse the result into a structured plan
    // In a real implementation, this would be more sophisticated
    const plan = {
      goal,
      subgoals: [],
      approaches: [],
      success_criteria: []
    };
    
    // Extract subgoals (simple parsing)
    const subgoalMatches = result.match(/\d+\.\s+(.+?)(?=\d+\.|$)/gs);
    if (subgoalMatches) {
      plan.subgoals = subgoalMatches.map(match => match.trim());
    }
    
    // Extract approaches (simple parsing)
    const approachMatches = result.match(/Approach \d+:\s+(.+?)(?=Approach \d+:|$)/gs);
    if (approachMatches) {
      plan.approaches = approachMatches.map(match => match.trim());
    }
    
    // Extract success criteria (simple parsing)
    const criteriaMatches = result.match(/Success criteria:(.+?)(?=$)/s);
    if (criteriaMatches && criteriaMatches[1]) {
      plan.success_criteria = criteriaMatches[1].split('\n').map(line => line.trim()).filter(Boolean);
    }
    
    res.json({
      raw_plan: result,
      structured_plan: plan
    });
  } catch (error) {
    console.error('Error generating plan:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

/**
 * @route POST /api/ai-framework/simulate
 * @desc Simulate outcomes for different approaches
 * @access Private
 */
router.post('/simulate', async (req, res) => {
  try {
    const { approaches } = req.body;
    
    if (!approaches || !Array.isArray(approaches) || approaches.length === 0) {
      return res.status(400).json({ error: 'Approaches array is required' });
    }
    
    const predictions = {};
    
    for (const approach of approaches) {
      const prompt = `Predict success probability for approach: ${approach}
      
      Consider the following factors:
      1. Technical feasibility
      2. Resource requirements
      3. Potential risks
      4. Time constraints
      
      Provide a success probability between 0.0 and 1.0, where 1.0 is certain success.
      Format your response as: "Success probability: X.XX"`;
      
      const result = await generateWithOllama(prompt, 'llama3', 0.3, 500);
      
      // Extract the probability
      const match = result.match(/Success probability:\s*(0\.\d+|1\.0|1)/i);
      const probability = match ? parseFloat(match[1]) : 0.5;
      
      predictions[approach] = {
        success_prob: probability,
        reasoning: result
      };
    }
    
    res.json({ predictions });
  } catch (error) {
    console.error('Error simulating outcomes:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

module.exports = router;
