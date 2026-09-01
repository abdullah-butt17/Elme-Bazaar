/**
 * Centralized environment configuration.
 * All process.env access across the app should go through this file.
 * This makes it easy to validate required vars once, at boot time,
 * instead of discovering a missing var deep inside a controller.
 */

require('dotenv').config();

const required = ['MONGO_URI', 'JWT_SECRET'];

const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  // Fail fast: a misconfigured server should never start silently.
  // eslint-disable-next-line no-console
  console.error(
    `[CONFIG ERROR] Missing required environment variables: ${missing.join(', ')}`
  );
  process.exit(1);
}

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,
  API_PREFIX: process.env.API_PREFIX || '/api',

  MONGO_URI: process.env.MONGO_URI,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_COOKIE_NAME: process.env.JWT_COOKIE_NAME || 'mz_token',

  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',

  BREVO_API_KEY: process.env.BREVO_API_KEY,
  BREVO_SENDER_EMAIL: process.env.BREVO_SENDER_EMAIL,
  BREVO_SENDER_NAME: process.env.BREVO_SENDER_NAME || 'ELME Bazaar',

  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_PORT: parseInt(process.env.MAIL_PORT, 10) || 587,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASS: process.env.MAIL_PASS,
  MAIL_FROM: process.env.MAIL_FROM || process.env.MAIL_USER,
  MAIL_REPLY_TO: process.env.MAIL_REPLY_TO || process.env.MAIL_USER,
  MAIL_SECURE: process.env.MAIL_SECURE === 'true',
  BUSINESS_NAME: process.env.BUSINESS_NAME || 'ELME Bazaar',

  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX, 10) || 200,

  isProd: process.env.NODE_ENV === 'production',
  isDev: process.env.NODE_ENV !== 'production',
};

module.exports = env;
