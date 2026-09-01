const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Runs after an array of express-validator checks.
 * Collects any validation failures into a single, consistent 400 error
 * instead of every route re-implementing this check.
 *
 * Usage:
 *   router.post('/', loginValidator, validate, authController.login);
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    return next(new ApiError(400, 'Validation failed', messages));
  }

  next();
};

module.exports = validate;
