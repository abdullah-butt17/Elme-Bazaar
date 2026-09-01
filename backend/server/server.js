const env = require('./config/env');
const connectDB = require('./config/db');
const logger = require('./utils/logger');
const app = require('./app');

let server;

const startServer = async () => {
  await connectDB();

  server = app.listen(env.PORT, () => {
    logger.info(
      `ELME Bazaar API running in ${env.NODE_ENV} mode on port ${env.PORT}`
    );
  });
};

startServer();

// ------------------------------------------------------------------
// Process-level safety nets.
// These catch bugs that would otherwise crash the process silently
// or leave it in a corrupted state.
// ------------------------------------------------------------------
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  if (server) {
    server.close(() => {
      logger.info('Process terminated.');
    });
  }
});
