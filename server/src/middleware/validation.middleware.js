const { validationResult } = require('express-validator');
const AppError = require('../utils/appError');

module.exports = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.param,
      message: err.msg,
    }));
    return next(new AppError(JSON.stringify(formattedErrors), 400));
  }

  next();
};