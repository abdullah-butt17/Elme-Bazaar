const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');

/**
 * Protects routes that only the boutique owner (admin) may access.
 * Reads the JWT from the httpOnly cookie first, falling back to an
 * Authorization: Bearer header (useful for tools like Postman, or
 * an admin app that isn't cookie-based).
 *
 * Re-fetches the user on every request rather than trusting the token
 * payload, so a deactivated account is locked out immediately instead
 * of waiting for the token to expire.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies[env.JWT_COOKIE_NAME]) {
    token = req.cookies[env.JWT_COOKIE_NAME];
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Not authenticated. Please log in.');
  }

  // jwt.verify throws JsonWebTokenError/TokenExpiredError on failure,
  // which the global error handler already knows how to translate to 401.
  const decoded = jwt.verify(token, env.JWT_SECRET);

  const user = await User.findById(decoded.id);

  if (!user) {
    throw new ApiError(401, 'The user for this token no longer exists.');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'This account has been deactivated.');
  }

  req.user = user;
  next();
});

module.exports = { protect };
