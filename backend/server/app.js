const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

const env = require('./config/env');
const logger = require('./utils/logger');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();

// ------------------------------------------------------------------
// Security middleware
// ------------------------------------------------------------------
app.use(helmet());



const allowedOrigins = [
  ...(env.CLIENT_URL ? env.CLIENT_URL.split(',').map((value) => value.trim()).filter(Boolean) : []),
  'http://localhost:5173',
  'http://localhost:8080',
  'http://localhost:8081',
  'http://localhost:8082',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:8080',
  'http://127.0.0.1:8081',
  'http://127.0.0.1:8082',
].filter((value, index, values) => value && values.indexOf(value) === index);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Rate limiting — applied globally; can be tightened per-route later
// (e.g. a stricter limiter on /api/auth/login in Phase 2).
const globalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
});
app.use(env.API_PREFIX, globalLimiter);

// ------------------------------------------------------------------
// Body parsing & sanitization
// ------------------------------------------------------------------
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(mongoSanitize()); // strips $ and . operators from user input (NoSQL injection protection)

// ------------------------------------------------------------------
// Logging
// ------------------------------------------------------------------
const morganFormat = env.isDev ? 'dev' : 'combined';
app.use(
  morgan(morganFormat, {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

// ------------------------------------------------------------------
// Health check (useful for uptime monitors / deployment platforms)
// ------------------------------------------------------------------
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ELME Bazaar API is running',
    timestamp: new Date().toISOString(),
  });
});

// ------------------------------------------------------------------
// API routes
// ------------------------------------------------------------------
app.use(`${env.API_PREFIX}/auth`, require('./routes/auth.routes'));
app.use(`${env.API_PREFIX}/categories`, require('./routes/category.routes'));
app.use(`${env.API_PREFIX}/products`, require('./routes/product.routes'));
app.use(`${env.API_PREFIX}/settings`, require('./routes/settings.routes'));
app.use(`${env.API_PREFIX}/upload`, require('./routes/upload.routes'));
app.use(`${env.API_PREFIX}/orders`, require('./routes/order.routes'));


app.get(env.API_PREFIX, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to ELME Bazaar API',
  });
});

// ------------------------------------------------------------------
// 404 + centralized error handling (must be last)
// ------------------------------------------------------------------
app.use(notFound);
app.use(errorHandler);

module.exports = app;
