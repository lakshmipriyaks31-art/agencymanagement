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
  accessRole:"admin",
  badRequest:400,
  Unauthorized:401,
  Conflict:409,
  unprocessable_Entity:422,
  Created:201,
  ok:200,
  notFound:404,
  ratelimitexeed:429,
  internalserver:500,
  serviceNotAvailble:503,
  deleted:204,
  mobileRequired:"Mobile Number is required",
  mobileConflict:"Mobile Number is already exist",
  unauthoizedUser : "Unauthorized User",
  unauthoizedToken : "Unauthorized Token",
  invalidToken:"Invalid or expired token",
  noUserFound:"No user found",
  failedToUpdate:"Failed to Update",
  slugConflict:"slug already exists",
  productConflict:"Product Code already exists",
  validationError:"Validation errror",
  //api
  clientApi :"/api/client/",
  companyApi :"/api/company/",
  productApi :"/api/product/",
  orderApi :"/api/order/",
  adminApi :"/api/admin/",
  commonId:process.env.COMMON_ID
};