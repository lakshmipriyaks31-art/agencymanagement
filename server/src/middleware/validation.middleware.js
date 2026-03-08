const { validationResult } = require('express-validator');
const AppError = require('../utils/appError');
const { unprocessable_Entity } = require('../config/env');

module.exports = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
    [`${err.path}`]: err.msg,
    }));
    return next(new AppError("Validation errror",unprocessable_Entity,formattedErrors ));
  }

  next();
};