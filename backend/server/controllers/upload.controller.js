const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const cloudinaryService = require('../services/cloudinary.service');

/**
 * @route   POST /api/upload
 * @access  Private (Admin)
 * @desc    Accepts one or more images (multipart/form-data, field name
 *          "images"), uploads them to Cloudinary, and returns the
 *          resulting { url, publicId } pairs. The Admin UI attaches
 *          these directly onto a product's `images` array — this
 *          endpoint does not itself touch the Product collection,
 *          keeping upload and product-save as separate, composable steps.
 */
const uploadImages = asyncHandler(async (req, res) => {
  const files = req.files && req.files.length > 0 ? req.files : req.file ? [req.file] : [];

  if (files.length === 0) {
    throw new ApiError(400, 'No image file(s) provided. Use field name "images".');
  }

  const uploaded = await cloudinaryService.uploadImages(files);

  res.status(201).json({
    success: true,
    message: `${uploaded.length} image(s) uploaded successfully`,
    data: uploaded,
  });
});

module.exports = { uploadImages };
