const rateLimit = require('express-rate-limit');

exports.rateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,                 // limit each IP
  message: {
    success: false,
    message: 'Too many requests, please try later.',
  },
});
