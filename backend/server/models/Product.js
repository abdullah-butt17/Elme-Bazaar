const mongoose = require('mongoose');
const slugify = require('../utils/slugify');

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    brand: {
      type: String,
      required: [true, 'Brand is required'],

      enum: {
        values: [
          'ELME Bazaar',
          'BR Collection',
        ],

        message:
          'Brand must be either ELME Bazaar or BR Collection',
      },
    },

    // =====================================================
    // CATEGORY HIERARCHY
    // =====================================================

    mainCategory: {
      type: String,
      required: [true, 'Main category is required'],
      trim: true,
    },

    subCategory: {
      type: String,
      required: [true, 'Sub category is required'],
      trim: true,
    },

    collection: {
      type: String,
      trim: true,
      default: '',
    },

    // =====================================================
    // PRODUCT DETAILS
    // =====================================================

    description: {
      type: String,
      required: [true, 'Description is required'],
    },

    /**
     * General material information.
     *
     * Can still be used for ELME Bazaar products or
     * additional product information.
     *
     * Example:
     * "100% Cotton"
     * "Cotton Blend"
     */
    material: {
      type: String,
      trim: true,
    },

    /**
     * Dedicated fabric field.
     *
     * This is separate from Category.
     *
     * Examples:
     * Lawn
     * Cotton
     * Khaddar
     * Linen
     * Chiffon
     * Organza
     * Silk
     * Jacquard
     * Cambric
     */
    fabric: {
      type: String,
      trim: true,
      default: '',
    },

    // =====================================================
    // VARIANTS
    // =====================================================

    availableSizes: {
      type: [String],
      default: [],
    },

    availableColors: {
      type: [String],
      default: [],
    },

    // =====================================================
    // PRICING
    // =====================================================

    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },

    salePrice: {
      type: Number,

      min: [
        0,
        'Sale price cannot be negative',
      ],

      validate: {
        validator: function validateSalePrice(value) {
          return (
            value == null ||
            value < this.price
          );
        },

        message:
          'Sale price must be less than the regular price',
      },
    },

    // =====================================================
    // STOCK
    // =====================================================

    stockStatus: {
      type: String,

      enum: [
        'in_stock',
        'out_of_stock',
        'limited',
      ],

      default: 'in_stock',
    },

    featured: {
      type: Boolean,
      default: false,
    },

    // =====================================================
    // IMAGES
    // =====================================================

    images: {
      type: [imageSchema],

      default: [],

      validate: {
        validator: (arr) => arr.length > 0,

        message:
          'At least one product image is required',
      },
    },
  },

  {
    timestamps: true,

    // collection is also a Mongoose reserved name.
    suppressReservedKeysWarning: true,
  }
);

// =========================================================
// SLUG
// =========================================================

productSchema.pre(
  'validate',
  async function generateSlug(next) {
    if (
      !this.isModified('name') &&
      this.slug
    ) {
      return next();
    }

    const base = slugify(this.name);

    let candidate = base;
    let suffix = 1;

    const Product = this.constructor;

    while (
      await Product.exists({
        slug: candidate,

        _id: {
          $ne: this._id,
        },
      })
    ) {
      suffix += 1;

      candidate = `${base}-${suffix}`;
    }

    this.slug = candidate;

    next();
  }
);

// =========================================================
// SEARCH INDEX
// =========================================================

productSchema.index({
  name: 'text',
  description: 'text',
  material: 'text',
  fabric: 'text',
});

// =========================================================
// FILTER / SORT INDEXES
// =========================================================

productSchema.index({
  brand: 1,
});

productSchema.index({
  mainCategory: 1,
  subCategory: 1,
  collection: 1,
});

productSchema.index({
  fabric: 1,
});

productSchema.index({
  featured: 1,
});

productSchema.index({
  price: 1,
});

productSchema.index({
  createdAt: -1,
});

module.exports = mongoose.model(
  'Product',
  productSchema
);