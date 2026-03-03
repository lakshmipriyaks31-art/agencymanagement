// src/config/env.js
require('dotenv').config({path:['./env/.env.local']});

module.exports = {
  port: process.env.PORT || 5000,
  mongoUri:  process.env.NODE_ENV === "test"
      ? process.env.TEST_MONGO_URI
      : process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtrefreshSecret: process.env.JWT_REFRESH_SECRET,
  redisUrl: process.env.REDIS_URL,
  nodeEnv: process.env.NODE_ENV,
  logLevel: process.env.LOG_LEVEL || 'info',
  clientUrl: process.env.CLIENT_URL,
  cryptoSecret: process.env.CRYPTO_SECRET,
  accessRole:"admin"
};