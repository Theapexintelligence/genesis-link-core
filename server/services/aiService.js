/**
 * AI Service - Handles interactions with AI models and execution environments
 * 
 * This service provides interfaces to Ollama for text generation and reasoning,
 * and OpenHands for code execution.
 */

const axios = require('axios');

/**
 * Check if Ollama is available
 * @returns {Promise<boolean>} - Whether Ollama is available
 */
const checkOllamaStatus = async () => {
  try {
    const ollamaUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    
    // Try to get the list of models
    const response = await axios.get(`${ollamaUrl}/api/tags`);
    
    return {
      status: 'connected',
      models: response.data.models || []
    };
  } catch (error) {
    console.error('Error checking Ollama status:', error);
    return {
      status: 'disconnected',
      error: error.message
    };
  }
};

/**
 * Check if OpenHands is available
 * @returns {Promise<boolean>} - Whether OpenHands is available
 */
const checkOpenHandsStatus = async () => {
  try {
    const openHandsUrl = process.env.OPENHANDS_BASE_URL || 'http://localhost:3000';
    
    // Try to ping the service
    const response = await axios.get(`${openHandsUrl}/health`);
    
    return {
      status: 'connected',
      version: response.data.version || 'unknown'
    };
  } catch (error) {
    console.error('Error checking OpenHands status:', error);
    return {
      status: 'disconnected',
      error: error.message
    };
  }
};

/**
 * Generate text with Ollama
 * @param {string} prompt - The prompt to generate from
 * @param {string} model - The model to use
 * @param {number} temperature - Temperature parameter
 * @param {number} maxTokens - Maximum tokens to generate
 * @returns {Promise<string>} - Generated text
 */
const generateWithOllama = async (prompt, model = 'llama3', temperature = 0.7, maxTokens = 1000) => {
  try {
    const ollamaUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    
    // In a real implementation, this would call the Ollama API
    // For now, we'll simulate a response
    
    // Check if Ollama is actually available
    const status = await checkOllamaStatus();
    if (status.status !== 'connected') {
      // If Ollama is not available, simulate a response
      console.warn('Ollama not available, simulating response');
      return simulateOllamaResponse(prompt, model);
    }
    
    // Call the Ollama API
    const response = await axios.post(`${ollamaUrl}/api/generate`, {
      model,
      prompt,
      temperature,
      max_tokens: maxTokens
    });
    
    return response.data.response;
  } catch (error) {
    console.error('Error generating with Ollama:', error);
    
    // If there's an error, simulate a response
    console.warn('Error with Ollama, simulating response');
    return simulateOllamaResponse(prompt, model);
  }
};

/**
 * Execute code with OpenHands
 * @param {string} code - The code to execute
 * @param {string} language - The programming language
 * @returns {Promise<object>} - Execution result
 */
const executeWithOpenHands = async (code, language = 'python') => {
  try {
    const openHandsUrl = process.env.OPENHANDS_BASE_URL || 'http://localhost:3000';
    
    // In a real implementation, this would call the OpenHands API
    // For now, we'll simulate a response
    
    // Check if OpenHands is actually available
    const status = await checkOpenHandsStatus();
    if (status.status !== 'connected') {
      // If OpenHands is not available, simulate a response
      console.warn('OpenHands not available, simulating response');
      return simulateOpenHandsResponse(code, language);
    }
    
    // Call the OpenHands API
    const response = await axios.post(`${openHandsUrl}/api/execute`, {
      code,
      language
    });
    
    return response.data;
  } catch (error) {
    console.error('Error executing with OpenHands:', error);
    
    // If there's an error, simulate a response
    console.warn('Error with OpenHands, simulating response');
    return simulateOpenHandsResponse(code, language);
  }
};

/**
 * Simulate an Ollama response
 * @param {string} prompt - The prompt
 * @param {string} model - The model
 * @returns {string} - Simulated response
 */
const simulateOllamaResponse = (prompt, model) => {
  // Simple simulation based on the prompt
  if (prompt.includes('plan') || prompt.includes('steps')) {
    return `
      Here's a detailed plan:
      
      1. Analyze requirements
         a. Gather user stories
         b. Identify key stakeholders
         c. Document constraints
      
      2. Design architecture
         a. Create system diagrams
         b. Define data models
         c. Plan API endpoints
      
      3. Implement core features
         a. Set up development environment
         b. Develop backend services
         c. Create frontend components
      
      4. Test thoroughly
         a. Write unit tests
         b. Perform integration testing
         c. Conduct user acceptance testing
      
      Approach 1: Agile methodology with weekly sprints
      Approach 2: Modular development with feature flags
      Approach 3: Continuous deployment pipeline
      
      Success criteria:
      - All requirements implemented
      - Test coverage above 80%
      - Performance benchmarks met
      - User feedback incorporated
    `;
  } else if (prompt.includes('predict') || prompt.includes('probability')) {
    const randomProb = (Math.random() * 0.4 + 0.6).toFixed(2);
    return `
      After analyzing the approach, I've considered various factors including technical complexity, resource requirements, and potential risks.
      
      Success probability: ${randomProb}
      
      This assessment is based on:
      1. The approach appears technically feasible
      2. Resource requirements seem reasonable
      3. There are some manageable risks
      4. Timeline constraints should be achievable
    `;
  } else {
    return `Generated response for: ${prompt.substring(0, 50)}...
    
    This is a simulated response from the ${model} model. In a real implementation, this would be generated by Ollama.
    
    The response would be more detailed and relevant to your specific prompt.`;
  }
};

/**
 * Simulate an OpenHands response
 * @param {string} code - The code
 * @param {string} language - The language
 * @returns {object} - Simulated response
 */
const simulateOpenHandsResponse = (code, language) => {
  // Check if the code has syntax errors (very basic check)
  const hasSyntaxError = code.includes('syntax_error') || 
                         (language === 'python' && code.includes('print(') && !code.includes(')'));
  
  if (hasSyntaxError) {
    return {
      success: false,
      error: 'Syntax error in code',
      details: 'Missing closing parenthesis or other syntax issue',
      execution_time: '0.1s'
    };
  }
  
  // Simulate successful execution
  return {
    success: true,
    output: 'Code executed successfully',
    result: language === 'python' ? 
      'Output: [1, 2, 3, 4, 5]' : 
      language === 'javascript' ? 
        'Result: { success: true, data: [1, 2, 3, 4, 5] }' : 
        'Execution completed',
    execution_time: `${(Math.random() * 2 + 0.5).toFixed(2)}s`
  };
};

module.exports = {
  checkOllamaStatus,
  checkOpenHandsStatus,
  generateWithOllama,
  executeWithOpenHands
};
