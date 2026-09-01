const express = require('express');
const categoryController = require('../controllers/category.controller');
const {
  createCategoryValidator,
  updateCategoryValidator,
  idParamValidator,
} = require('../validators/category.validator');
const validate = require('../middlewares/validate');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', categoryController.getCategories);
router.post('/', protect, createCategoryValidator, validate, categoryController.createCategory);
router.put(
  '/:id',
  protect,
  updateCategoryValidator,
  validate,
  categoryController.updateCategory
);
router.delete('/:id', protect, idParamValidator, validate, categoryController.deleteCategory);

module.exports = router;
