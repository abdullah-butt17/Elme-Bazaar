const fs = require('fs');
const path = require('path');

/**
 * Minimal file + console logger.
 * Morgan handles HTTP request logging separately (see app.js).
 * This logger is for application-level events: server start, DB connection,
 * caught errors, etc.
 */

const logsDir = path.join(__dirname, '..', 'logs');

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFilePath = path.join(logsDir, 'app.log');

const write = (level, message) => {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

  // eslint-disable-next-line no-console
  console[level === 'error' ? 'error' : 'log'](line);

  fs.appendFile(logFilePath, line + '\n', (err) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to write to log file:', err.message);
    }
  });
};

const logger = {
  info: (message) => write('info', message),
  warn: (message) => write('warn', message),
  error: (message) => write('error', message),
};

module.exports = logger;
