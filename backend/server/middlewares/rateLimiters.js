const rateLimit = require('express-rate-limit');

/**
 * Login attempts are far more sensitive than general API traffic,
 * so they get a tighter, separate limiter on top of the global one
 * in app.js. 10 attempts per 15 minutes per IP.
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again in 15 minutes.',
  },
});

module.exports = { loginLimiter };
