const { createClient } = require('redis');
require('dotenv').config();

const client = createClient({
  url: process.env.REDIS_URL,
});

client.on('error', (err) => console.error('Erro no Redis:', err));

client.connect();

module.exports = client;
