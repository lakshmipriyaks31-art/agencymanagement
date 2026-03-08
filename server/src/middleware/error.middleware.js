const logger = require('../config/logger');

const errorMiddleware = (err, req, res,next) => {
  console.log("ERROR MIDDLEWARE HIT",res.errors,res.message);

//  logger.error({
//     message: err.message,
//     stack: err.stack,
//     path: req.originalUrl,
//    errors: err.errors || null
//   });
  
  const statusCode = err.statusCode || 500;

 res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    errors: err.errors || null
  });
};

module.exports = errorMiddleware;