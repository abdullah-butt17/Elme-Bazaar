const multer = require('multer');
const ApiError = require('../utils/ApiError');

/**
 * Files are held in memory (not written to local disk) and streamed
 * straight to Cloudinary in the service layer. This keeps the /uploads
 * folder free of leftover temp files and works cleanly on hosting
 * platforms with ephemeral/read-only filesystems.
 */
const storage = multer.memoryStorage();

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_FILE_SIZE_MB = 5;

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(new ApiError(400, `Unsupported file type: ${file.mimetype}. Allowed: JPEG, PNG, WEBP, AVIF.`), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE_MB * 1024 * 1024,
    files: 10, // a product can have multiple images, but cap per-request
  },
});

module.exports = upload;
