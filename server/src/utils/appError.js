class AppError extends Error {
  constructor(message, errors,statusCode) {
    super(message);
    this.statusCode = statusCode;
     if (errors) {
      this.errors = errors;  // store object separately
    }

  }
}

module.exports = AppError;