const jwt = require('jsonwebtoken');
const env = require('../config/env');

/**
 * Signs a JWT for a given user id.
 * Kept payload minimal (just the id) — role/name are re-fetched from
 * the DB on each request via the protect middleware, so a revoked or
 * edited user can't keep acting on stale token data.
 */
const generateToken = (userId) =>
  jwt.sign({ id: userId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });

/**
 * Sets the JWT as an httpOnly cookie on the response.
 * httpOnly prevents JS access (XSS mitigation); sameSite/secure are
 * tightened in production since the admin portal and API may be on
 * different subdomains behind HTTPS.
 */
const setTokenCookie = (res, token) => {
  const maxAge = 1 * 24 * 60 * 60 * 1000;

  res.cookie(env.JWT_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.isProd,
    sameSite: env.isProd ? "none" : "lax",
    maxAge,
    path: '/',
  });
};

const clearTokenCookie = (res) => {
  res.clearCookie(env.JWT_COOKIE_NAME, {
    httpOnly: true,
    secure: env.isProd,
    sameSite: env.isProd ? 'none' : 'lax',
    path: '/',
  });
};

module.exports = { generateToken, setTokenCookie, clearTokenCookie };
