const { OpenAI } = require('openai');
const { Client: DiscordClient, GatewayIntentBits } = require('discord.js');
const { Client: PgClient } = require('pg');
const { WebClient } = require('@slack/web-api');
const { Octokit } = require('@octokit/rest');
const nodemailer = require('nodemailer');
const Stripe = require('stripe');
const Airtable = require('airtable');
const { TwitterApi } = require('twitter-api-v2');

/**
 * Initialize and test connection for a specific adapter type
 * @param {string} service - The service type (openai, discord, etc.)
 * @param {object} params - Connection parameters
 * @returns {Promise<any>} - The initialized client or null
 */
const initializeAdapter = async (service, params) => {
  try {
    switch (service) {
      case 'openai':
        return initializeOpenAI(params);
      case 'discord':
        return initializeDiscord(params);
      case 'postgres':
        return initializePostgres(params);
      case 'slack':
        return initializeSlack(params);
      case 'github':
        return initializeGitHub(params);
      case 'smtp':
        return initializeSMTP(params);
      case 'stripe':
        return initializeStripe(params);
      case 'airtable':
        return initializeAirtable(params);
      case 'twitter':
        return initializeTwitter(params);
      default:
        throw new Error(`Unsupported service type: ${service}`);
    }
  } catch (error) {
    console.error(`Error initializing ${service} adapter:`, error);
    throw error;
  }
};

/**
 * Initialize OpenAI client
 */
const initializeOpenAI = async (params) => {
  const { apiKey, model = 'gpt-4o' } = params;
  
  if (!apiKey) {
    throw new Error('OpenAI API key is required');
  }
  
  const client = new OpenAI({ apiKey });
  
  // Test the connection
  await client.chat.completions.create({
    model,
    messages: [{ role: 'user', content: 'Hello' }],
    max_tokens: 5
  });
  
  return client;
};

/**
 * Initialize Discord client
 */
const initializeDiscord = async (params) => {
  const { token, intents = 'default' } = params;
  
  if (!token) {
    throw new Error('Discord bot token is required');
  }
  
  let intentsList = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ];
  
  if (intents !== 'default') {
    // Parse custom intents if provided
    try {
      intentsList = JSON.parse(intents);
    } catch (e) {
      console.warn('Could not parse custom intents, using defaults');
    }
  }
  
  const client = new DiscordClient({ intents: intentsList });
  
  // Test the connection
  await new Promise((resolve, reject) => {
    client.once('ready', () => {
      resolve(client);
    });
    
    client.once('error', (error) => {
      reject(error);
    });
    
    client.login(token).catch(reject);
    
    // Set a timeout in case the connection hangs
    setTimeout(() => {
      reject(new Error('Discord connection timeout'));
    }, 10000);
  });
  
  // Properly disconnect after testing
  await client.destroy();
  
  return true;
};

/**
 * Initialize Postgres client
 */
const initializePostgres = async (params) => {
  const { connectionString, schema = 'public' } = params;
  
  if (!connectionString) {
    throw new Error('Postgres connection string is required');
  }
  
  const client = new PgClient({
    connectionString,
  });
  
  await client.connect();
  
  // Test the connection
  await client.query(`SELECT NOW()`);
  
  // Close the connection
  await client.end();
  
  return true;
};

/**
 * Initialize Slack client
 */
const initializeSlack = async (params) => {
  const { botToken, signingSecret } = params;
  
  if (!botToken) {
    throw new Error('Slack bot token is required');
  }
  
  const client = new WebClient(botToken);
  
  // Test the connection
  await client.auth.test();
  
  return client;
};

/**
 * Initialize GitHub client
 */
const initializeGitHub = async (params) => {
  const { accessToken, owner, repo } = params;
  
  if (!accessToken) {
    throw new Error('GitHub access token is required');
  }
  
  const client = new Octokit({
    auth: accessToken
  });
  
  // Test the connection
  await client.rest.users.getAuthenticated();
  
  // If owner and repo are provided, test repo access
  if (owner && repo) {
    await client.rest.repos.get({
      owner,
      repo
    });
  }
  
  return client;
};

/**
 * Initialize SMTP client
 */
const initializeSMTP = async (params) => {
  const { host, port = 587, username, password, secure = false } = params;
  
  if (!host || !username || !password) {
    throw new Error('SMTP host, username, and password are required');
  }
  
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: username,
      pass: password
    }
  });
  
  // Test the connection
  await transporter.verify();
  
  return transporter;
};

/**
 * Initialize Stripe client
 */
const initializeStripe = async (params) => {
  const { secretKey, webhookSecret } = params;
  
  if (!secretKey) {
    throw new Error('Stripe secret key is required');
  }
  
  const stripe = new Stripe(secretKey);
  
  // Test the connection
  await stripe.customers.list({ limit: 1 });
  
  return stripe;
};

/**
 * Initialize Airtable client
 */
const initializeAirtable = async (params) => {
  const { apiKey, baseId } = params;
  
  if (!apiKey || !baseId) {
    throw new Error('Airtable API key and base ID are required');
  }
  
  Airtable.configure({ apiKey });
  const base = Airtable.base(baseId);
  
  // Test the connection by getting the first table
  const tables = await base.tables();
  
  if (!tables || tables.length === 0) {
    throw new Error('No tables found in the Airtable base');
  }
  
  return base;
};

/**
 * Initialize Twitter client
 */
const initializeTwitter = async (params) => {
  const { apiKey, apiSecret, accessToken, accessSecret } = params;
  
  if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
    throw new Error('Twitter API credentials are required');
  }
  
  const client = new TwitterApi({
    appKey: apiKey,
    appSecret: apiSecret,
    accessToken,
    accessSecret
  });
  
  // Test the connection
  await client.v2.me();
  
  return client;
};

module.exports = {
  initializeAdapter
};
