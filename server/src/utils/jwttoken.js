const jwt = require('jsonwebtoken')
const config= require('./../config/env');
const { encryptCrypto, decryptCrypto } = require('./crypto');
 
exports.generateAccessToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: '15m',
  });
};

exports.generateRefreshToken = (payload) => {
  return encryptCrypto(jwt.sign(payload, config.jwtrefreshSecret, {
    expiresIn: '7d',
  }));
};

exports.verifyAccessToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};

exports.verifyRefreshToken = (token) => {
   token =decryptCrypto(token)
  return jwt.verify(token, config.jwtrefreshSecret)
   
};

