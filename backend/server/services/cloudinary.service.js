const cloudinary = require('../config/cloudinary');

const FOLDER = 'elme-bazaar/products';

/**
 * Uploads a single in-memory file buffer (from Multer) to Cloudinary
 * via an upload stream, since we never write the file to local disk.
 * Resolves with { url, publicId } — the exact shape stored on Product.images.
 */
const uploadImage = (fileBuffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: FOLDER,
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );

    stream.end(fileBuffer);
  });

/**
 * Uploads multiple files in parallel.
 */
const uploadImages = (files) => Promise.all(files.map((file) => uploadImage(file.buffer)));

/**
 * Deletes an image from Cloudinary by its public_id.
 * Used when a product is deleted or an image is replaced, so storage
 * doesn't accumulate orphaned media over time.
 */
const deleteImage = (publicId) => cloudinary.uploader.destroy(publicId);

module.exports = { uploadImage, uploadImages, deleteImage };
