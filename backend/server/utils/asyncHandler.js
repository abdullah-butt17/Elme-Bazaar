/**
 * Wraps an async route/controller function so any rejected promise
 * is forwarded to Express's error-handling middleware via next(err).
 * This is what lets controllers use plain async/await with no
 * repeated try/catch blocks (per project code-quality requirements).
 *
 * Usage:
 *   router.get('/', asyncHandler(async (req, res) => { ... }));
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
