const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { generateToken, setTokenCookie, clearTokenCookie } = require('../utils/token');

/**
 * @route   POST /api/auth/login
 * @access  Public
 * @desc    Authenticates the boutique admin and issues a JWT cookie.
 *          Deliberately returns the same generic error for "no such
 *          email" and "wrong password" so login attempts can't be used
 *          to enumerate valid admin emails.
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'This account has been deactivated.');
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  const token = generateToken(user._id);
  setTokenCookie(res, token);

  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    data: {
      user: user.toJSON(),
      token, // also returned in body for non-browser/API clients
    },
  });
});

/**
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  clearTokenCookie(res);

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

/**
 * @route   GET /api/auth/me
 * @access  Private
 * @desc    Returns the currently authenticated admin. Useful for the
 *          React admin app to check session state on load/refresh.
 */
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: { user: req.user },
  });
});

const updateMe = asyncHandler(async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;
  const user = req.user;

  if (!email && !newPassword) {
    throw new ApiError(400, 'No update fields provided.');
  }

  if ((email && email.toLowerCase() !== user.email) || newPassword) {
    if (!currentPassword || !(await user.comparePassword(currentPassword))) {
      throw new ApiError(401, 'Current password is required and must be valid.');
    }
  }

  if (email && email.toLowerCase() !== user.email) {
    user.email = email.toLowerCase();
  }

  if (newPassword) {
    user.password = newPassword;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Account updated successfully',
    data: { user: user.toJSON() },
  });
});

module.exports = { login, logout, getMe, updateMe };
