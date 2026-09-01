const env = require('../config/env');
const logger = require('../utils/logger');

/**
 * Converts known error types (Mongoose, JWT, etc.) into a normalized
 * { statusCode, message, errors } shape before the final handler responds.
 */
const normalizeError = (err) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || [];

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => e.message);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid value for field '${err.path}'`;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = field ? `Duplicate value for field '${field}'` : 'Duplicate field value';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token expired';
  }

  return { statusCode, message, errors };
};

/**
 * 404 handler — must be registered after all routes.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

/**
 * Final error handler — must be registered last, after notFound.
 * Express recognizes this as an error handler because it takes 4 args.
 */
const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  
console.log("========== ERROR ==========");
console.error(err);
console.error(err.stack);
console.log("===========================");

  const { statusCode, message, errors } = normalizeError(err);

  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} - ${err.stack || err.message}`);
  } else {
    logger.warn(`${req.method} ${req.originalUrl} - ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    stack: env.isDev ? err.stack : undefined,
  });
};

module.exports = { notFound, errorHandler };
