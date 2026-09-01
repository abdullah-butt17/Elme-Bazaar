/**
 * One-time (or repeatable) script to create/reset the boutique owner's
 * admin account, since there is no public registration endpoint.
 *
 * Usage:
 *   node scripts/seedAdmin.js
 *
 * Reads ADMIN_EMAIL / ADMIN_PASSWORD from .env. If a user with that
 * email already exists, its password is updated instead of creating
 * a duplicate — safe to re-run any time you need to reset the password.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const env = require('../config/env');
const logger = require('../utils/logger');
const User = require('../models/User');

const run = async () => {
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
    logger.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env to seed an admin.');
    process.exit(1);
  }

  await mongoose.connect(env.MONGO_URI);
  logger.info('Connected to MongoDB for admin seeding.');

  let user = await User.findOne({ email: env.ADMIN_EMAIL.toLowerCase() }).select('+password');

  if (user) {
    user.password = env.ADMIN_PASSWORD; // pre-save hook will re-hash
    user.isActive = true;
    await user.save();
    logger.info(`Existing admin '${env.ADMIN_EMAIL}' password reset.`);
  } else {
    user = await User.create({
      name: 'Boutique Owner',
      email: env.ADMIN_EMAIL.toLowerCase(),
      password: env.ADMIN_PASSWORD,
      role: 'admin',
    });
    logger.info(`Admin user created: ${user.email}`);
  }

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  logger.error(`Admin seeding failed: ${err.message}`);
  process.exit(1);
});
