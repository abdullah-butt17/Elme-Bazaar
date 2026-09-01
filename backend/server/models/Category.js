const mongoose = require('mongoose');

/**
 * Category hierarchy:
 *
 * Main Category -> Sub Category -> Collection
 *
 * Example:
 *
 * BR Collection
 *   -> Stitched
 *      -> 2 Piece
 *      -> 3 Piece
 *      -> Kurta
 *
 * BR Collection
 *   -> Unstitched
 *      -> 1 Piece
 *      -> 2 Piece
 *      -> 3 Piece
 *
 * collection is optional because some categories, such as the
 * existing ELME Bazaar categories, may not need a third level.
 */

const categorySchema = new mongoose.Schema(
  {
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

    displayOrder: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * A Main -> Sub -> Collection combination
 * should only exist once.
 *
 * Example:
 *
 * BR Collection / Stitched / 2 Piece
 * BR Collection / Unstitched / 2 Piece
 *
 * These are allowed because their sub categories are different.
 */

categorySchema.index(
  {
    mainCategory: 1,
    subCategory: 1,
    collection: 1,
  },
  {
    unique: true,
  }
);

categorySchema.index({ displayOrder: 1 });

module.exports = mongoose.model(
  'Category',
  categorySchema
);