const mongoose = require('mongoose');
const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const cloudinaryService = require('../services/cloudinary.service');

/**
 * @route   GET /api/products
 * @access  Public
 *
 * Supports:
 *
 * Pagination:
 * ?page=1
 * ?limit=12
 *
 * Search:
 * ?search=black kurta
 *
 * Category filters:
 * ?brand=BR Collection
 * ?mainCategory=BR Collection
 * ?subCategory=Stitched
 * ?collection=2 Piece
 *
 * Fabric filter:
 * ?fabric=Lawn
 *
 * Stock:
 * ?stockStatus=in_stock
 *
 * Featured:
 * ?featured=true
 *
 * Price:
 * ?minPrice=1000
 * ?maxPrice=10000
 *
 * Sorting:
 * ?sort=newest
 * ?sort=price_asc
 * ?sort=price_desc
 * ?sort=name_asc
 * ?sort=name_desc
 */

const getProducts = asyncHandler(async (req, res) => {
  const page = Math.max(
    parseInt(req.query.page, 10) || 1,
    1
  );

  const limit = Math.min(
    Math.max(
      parseInt(req.query.limit, 10) || 12,
      1
    ),
    100
  );

  const skip = (page - 1) * limit;

  const filter = {};

  // =====================================================
  // BRAND
  // =====================================================

  if (req.query.brand) {
    filter.brand = req.query.brand;
  }

  // =====================================================
  // CATEGORY
  // =====================================================

  if (req.query.mainCategory) {
    filter.mainCategory = req.query.mainCategory;
  }

  if (req.query.subCategory) {
    filter.subCategory = req.query.subCategory;
  }

  if (req.query.collection) {
    filter.collection = req.query.collection;
  }

  // =====================================================
  // FABRIC
  // =====================================================

  if (req.query.fabric) {
    filter.fabric = req.query.fabric;
  }

  // =====================================================
  // STOCK
  // =====================================================

  if (req.query.stockStatus) {
    filter.stockStatus = req.query.stockStatus;
  }

  // =====================================================
  // FEATURED
  // =====================================================

  if (req.query.featured !== undefined) {
    filter.featured =
      req.query.featured === 'true';
  }

  // =====================================================
  // PRICE
  // =====================================================

  if (
    req.query.minPrice ||
    req.query.maxPrice
  ) {
    filter.price = {};

    if (req.query.minPrice) {
      filter.price.$gte =
        Number(req.query.minPrice);
    }

    if (req.query.maxPrice) {
      filter.price.$lte =
        Number(req.query.maxPrice);
    }
  }

  // =====================================================
  // SEARCH
  // =====================================================

  if (req.query.search) {
    filter.$text = {
      $search: req.query.search,
    };
  }

  // =====================================================
  // SORT
  // =====================================================

  const sortMap = {
    newest: {
      createdAt: -1,
    },

    price_asc: {
      price: 1,
    },

    price_desc: {
      price: -1,
    },

    name_asc: {
      name: 1,
    },

    name_desc: {
      name: -1,
    },
  };

  const sort =
    sortMap[req.query.sort] ||
    sortMap.newest;

  // =====================================================
  // DATABASE QUERY
  // =====================================================

  const [products, total] =
    await Promise.all([
      Product.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit),

      Product.countDocuments(filter),
    ]);

  res.status(200).json({
    success: true,

    count: products.length,

    pagination: {
      page,
      limit,
      totalItems: total,

      totalPages: Math.max(
        Math.ceil(total / limit),
        1
      ),
    },

    data: products,
  });
});

/**
 * @route   GET /api/products/:id
 * @access  Public
 */

const getProductById = asyncHandler(
  async (req, res) => {
    const { id } = req.params;

    const query =
      mongoose.Types.ObjectId.isValid(id)
        ? {
            _id: id,
          }
        : {
            slug: id,
          };

    const product =
      await Product.findOne(query);

    if (!product) {
      throw new ApiError(
        404,
        'Product not found'
      );
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  }
);

/**
 * @route   POST /api/products
 * @access  Private (Admin)
 */

const createProduct = asyncHandler(
  async (req, res) => {
    const product =
      await Product.create(req.body);

    res.status(201).json({
      success: true,
      message:
        'Product created successfully',
      data: product,
    });
  }
);

/**
 * @route   PUT /api/products/:id
 * @access  Private (Admin)
 */

const updateProduct = asyncHandler(
  async (req, res) => {
    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      throw new ApiError(
        404,
        'Product not found'
      );
    }

    Object.assign(
      product,
      req.body
    );

    // save() triggers slug regeneration
    // and all Product validators.
    await product.save();

    res.status(200).json({
      success: true,
      message:
        'Product updated successfully',
      data: product,
    });
  }
);

/**
 * @route   DELETE /api/products/:id
 * @access  Private (Admin)
 */

const deleteProduct = asyncHandler(
  async (req, res) => {
    const product =
      await Product.findByIdAndDelete(
        req.params.id
      );

    if (!product) {
      throw new ApiError(
        404,
        'Product not found'
      );
    }

    // Remove product images from Cloudinary.
    if (
      product.images &&
      product.images.length > 0
    ) {
      await Promise.allSettled(
        product.images.map((img) =>
          cloudinaryService.deleteImage(
            img.publicId
          )
        )
      );
    }

    res.status(200).json({
      success: true,
      message:
        'Product deleted successfully',
      data: {},
    });
  }
);

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};