class AppError extends Error {
  constructor(message,statusCode, errors) {
   super(message);
    // super(errors);
      // this.message = message;
    this.errors = errors
    this.statusCode = statusCode;
      // Error.captureStackTrace(this, this.constructor);

  }
}

module.exports = AppError;