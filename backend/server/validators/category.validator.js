const { body, param } = require('express-validator');

/**
 * CATEGORY STRUCTURE
 *
 * Main Category
 *      ↓
 * Sub Category
 *      ↓
 * Collection
 *
 * Example:
 *
 * BR Collection
 *      ↓
 * Stitched
 *      ↓
 * 2 Piece
 */

const createCategoryValidator = [
  body('mainCategory')
    .trim()
    .notEmpty()
    .withMessage('Main category is required'),

  body('subCategory')
    .trim()
    .notEmpty()
    .withMessage('Sub category is required'),

  body('collection')
    .optional({ nullable: true })
    .trim(),

  body('displayOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage(
      'Display order must be a non-negative integer'
    ),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage(
      'isActive must be true or false'
    ),
];

const updateCategoryValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid category id'),

  body('mainCategory')
    .optional()
    .trim()
    .notEmpty()
    .withMessage(
      'Main category cannot be empty'
    ),

  body('subCategory')
    .optional()
    .trim()
    .notEmpty()
    .withMessage(
      'Sub category cannot be empty'
    ),

  body('collection')
    .optional({ nullable: true })
    .trim(),

  body('displayOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage(
      'Display order must be a non-negative integer'
    ),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage(
      'isActive must be true or false'
    ),
];

const idParamValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid category id'),
];

module.exports = {
  createCategoryValidator,
  updateCategoryValidator,
  idParamValidator,
};