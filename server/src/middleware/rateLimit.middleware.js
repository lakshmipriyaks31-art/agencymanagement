const rateLimit = require('express-rate-limit');

const rateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,                 // limit each IP
  message: {
    success: false,
    message: 'Too many requests, please try later.',
  },
});

module.exports = rateLimitMiddleware;