const express = require('express');
const productController = require('../controllers/product.controller');
const {
  createProductValidator,
  updateProductValidator,
} = require('../validators/product.validator');
const validate = require('../middlewares/validate');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', protect, createProductValidator, validate, productController.createProduct);
router.put('/:id', protect, updateProductValidator, validate, productController.updateProduct);
router.delete('/:id', protect, productController.deleteProduct);

module.exports = router;
