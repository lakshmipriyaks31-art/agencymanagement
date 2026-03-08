
const app = require('./app');
const connectDB = require('./config/db');
const config = require('./config/env');
// const { connectRedis } = require('./config/redis');

const PORT = config.port || 5000;
 if (process.env.NODE_ENV !== "test") {
     startServer()
}
const startServer = async () => {
  try {

    // await connectRedis();

    // Start HTTP server
   
          // Connect databases
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    })

   

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down...');
      server.close(() => {
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Server startup failed:', error);
    process.exit(1);
  }
};

