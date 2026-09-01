const { body, param } = require('express-validator');

const STOCK_STATUSES = [
  'in_stock',
  'out_of_stock',
  'limited',
];

const BRANDS = [
  'ELME Bazaar',
  'BR Collection',
];

/**
 * Product structure:
 *
 * Brand
 *
 * Main Category
 *      ↓
 * Sub Category
 *      ↓
 * Collection
 *
 * Fabric is completely separate from categories.
 *
 * Example:
 *
 * Brand: BR Collection
 * Main Category: BR Collection
 * Sub Category: Unstitched
 * Collection: 3 Piece
 * Fabric: Lawn
 */

const createProductValidator = [
  // =====================================================
  // BASIC DETAILS
  // =====================================================

  body('name')
    .trim()
    .notEmpty()
    .withMessage(
      'Product name is required'
    ),

  body('brand')
    .trim()
    .notEmpty()
    .isIn(BRANDS)
    .withMessage(
      `Brand must be one of: ${BRANDS.join(', ')}`
    ),

  // =====================================================
  // CATEGORY
  // =====================================================

  body('mainCategory')
    .trim()
    .notEmpty()
    .withMessage(
      'Main category is required'
    ),

  body('subCategory')
    .trim()
    .notEmpty()
    .withMessage(
      'Sub category is required'
    ),

  body('collection')
    .optional({ nullable: true })
    .trim(),

  // =====================================================
  // PRODUCT INFORMATION
  // =====================================================

  body('description')
    .trim()
    .notEmpty()
    .withMessage(
      'Description is required'
    ),

  body('material')
    .optional({ nullable: true })
    .trim(),

  // =====================================================
  // FABRIC
  // =====================================================

  body('fabric')
    .optional({ nullable: true })
    .trim(),

  // =====================================================
  // SIZES
  // =====================================================

  body('availableSizes')
    .optional()
    .isArray()
    .withMessage(
      'Available sizes must be an array'
    ),

  // =====================================================
  // COLORS
  // =====================================================

  body('availableColors')
    .optional()
    .isArray()
    .withMessage(
      'Available colors must be an array'
    ),

  // =====================================================
  // PRICE
  // =====================================================

  body('price')
    .isFloat({ min: 0 })
    .withMessage(
      'Price must be a positive number'
    ),

  body('salePrice')
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage(
      'Sale price must be a positive number'
    ),

  // =====================================================
  // STOCK
  // =====================================================

  body('stockStatus')
    .optional()
    .isIn(STOCK_STATUSES)
    .withMessage(
      `Stock status must be one of: ${STOCK_STATUSES.join(', ')}`
    ),

  // =====================================================
  // FEATURED
  // =====================================================

  body('featured')
    .optional()
    .isBoolean()
    .withMessage(
      'Featured must be true or false'
    ),

  // =====================================================
  // IMAGES
  // =====================================================

  body('images')
    .optional()
    .isArray({ min: 1 })
    .withMessage(
      'At least one image is required'
    ),
];

/**
 * UPDATE PRODUCT VALIDATOR
 */

const updateProductValidator = [
  param('id')
    .notEmpty()
    .withMessage(
      'Product id is required'
    ),

  // =====================================================
  // BASIC DETAILS
  // =====================================================

  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage(
      'Product name cannot be empty'
    ),

  body('brand')
    .optional()
    .trim()
    .isIn(BRANDS)
    .withMessage(
      `Brand must be one of: ${BRANDS.join(', ')}`
    ),

  // =====================================================
  // CATEGORY
  // =====================================================

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

  // =====================================================
  // DESCRIPTION
  // =====================================================

  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage(
      'Description cannot be empty'
    ),

  // =====================================================
  // MATERIAL
  // =====================================================

  body('material')
    .optional({ nullable: true })
    .trim(),

  // =====================================================
  // FABRIC
  // =====================================================

  body('fabric')
    .optional({ nullable: true })
    .trim(),

  // =====================================================
  // SIZES
  // =====================================================

  body('availableSizes')
    .optional()
    .isArray()
    .withMessage(
      'Available sizes must be an array'
    ),

  // =====================================================
  // COLORS
  // =====================================================

  body('availableColors')
    .optional()
    .isArray()
    .withMessage(
      'Available colors must be an array'
    ),

  // =====================================================
  // PRICE
  // =====================================================

  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage(
      'Price must be a positive number'
    ),

  body('salePrice')
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage(
      'Sale price must be a positive number'
    ),

  // =====================================================
  // STOCK
  // =====================================================

  body('stockStatus')
    .optional()
    .isIn(STOCK_STATUSES)
    .withMessage(
      `Stock status must be one of: ${STOCK_STATUSES.join(', ')}`
    ),

  // =====================================================
  // FEATURED
  // =====================================================

  body('featured')
    .optional()
    .isBoolean()
    .withMessage(
      'Featured must be true or false'
    ),
];

module.exports = {
  createProductValidator,
  updateProductValidator,
};