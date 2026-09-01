const Settings = require('../models/Settings');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @route   GET /api/settings
 * @access  Public
 * @desc    Powers the storefront footer/contact page and the "Order
 *          on WhatsApp" links throughout the Shop.
 */
const getSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.getSingleton();

  res.status(200).json({
    success: true,
    data: settings,
  });
});

/**
 * @route   PUT /api/settings
 * @access  Private (Admin)
 */
const updateSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.getSingleton();

  Object.assign(settings, req.body);
  await settings.save();

  res.status(200).json({
    success: true,
    message: 'Settings updated successfully',
    data: settings,
  });
});

module.exports = { getSettings, updateSettings };
