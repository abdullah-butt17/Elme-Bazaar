/**
 * Standardized application error.
 * Controllers/services throw this so the global error handler
 * can respond with a consistent shape and correct status code.
 *
 * Usage:
 *   throw new ApiError(404, 'Product not found');
 */
class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true; // distinguishes expected errors from bugs

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
