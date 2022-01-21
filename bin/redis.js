const Redis = require("ioredis");
const session = require('express-session');
const RedisStore = require('connect-redis')(session)

const client = new Redis(6379, 'minichat-redis');

module.exports = {
  client: client,
  store: new RedisStore({client: client})
};