
// config/db.js
const mongoose = require('mongoose');
const logger = require('./logger');
 const config = require("./env");
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      maxPoolSize: 20,           // Connection pool
      serverSelectionTimeoutMS: 5000,
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB connection failed: ${(error)}` );
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed due to app termination');
  process.exit(0);
});

module.exports = connectDB;