// const express = require('express')
// const connectDB = require('./config/db')
// const app = express();
// const config = require('./config/env')

// const adminRoute = require("./modules/admin/admin.routes")
// // connect db
//  connectDB()

// //initialize middleware
// app.use(express.json({extended:false}))

// //initialize routes 
// app.use("/admin" , adminRoute)

// //Check the server is working fine
// app.get("/",(req,res)=>{
//     res.send("Hi there!!")
// })

// // listening the server
// app.listen(config.port,()=>{
//  console.log(`Serever Started listening on port ${config.port}`)
// })

require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');
const config = require('./config/env');
// const { connectRedis } = require('./config/redis');

const PORT = config.port || 5000;

const startServer = async () => {
  try {
    // Connect databases
    await connectDB();
    // await connectRedis();

    // Start HTTP server
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

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

startServer();