const express = require('express');
const uploadController = require('../controllers/upload.controller');
const upload = require('../middlewares/upload.middleware');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

// Field name "images" — supports multiple files in a single request.
router.post('/', protect, upload.array('images', 10), uploadController.uploadImages);

module.exports = router;
