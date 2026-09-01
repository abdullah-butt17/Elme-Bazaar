const mongoose = require("mongoose");
const Category = require("../models/Category");
const env = require("../config/env");

const categories = [
  // =====================================================
  // ELME BAZAAR
  // =====================================================

  {
    mainCategory: "ELME Bazaar",
    subCategory: "Shirts",
    collection: "",
  },

  {
    mainCategory: "ELME Bazaar",
    subCategory: "T-Shirts",
    collection: "",
  },

  {
    mainCategory: "ELME Bazaar",
    subCategory: "Polos",
    collection: "",
  },

  {
    mainCategory: "ELME Bazaar",
    subCategory: "Casual Wear",
    collection: "",
  },

  {
    mainCategory: "ELME Bazaar",
    subCategory: "Formal Wear",
    collection: "",
  },

  {
    mainCategory: "ELME Bazaar",
    subCategory: "New Arrivals",
    collection: "",
  },

  // =====================================================
  // BR COLLECTION — STITCHED
  // =====================================================

  {
    mainCategory: "BR Collection",
    subCategory: "Stitched",
    collection: "2 Piece",
  },

  {
    mainCategory: "BR Collection",
    subCategory: "Stitched",
    collection: "3 Piece",
  },

  {
    mainCategory: "BR Collection",
    subCategory: "Stitched",
    collection: "Kurta",
  },

  {
    mainCategory: "BR Collection",
    subCategory: "Stitched",
    collection: "Shirt",
  },

  {
    mainCategory: "BR Collection",
    subCategory: "Stitched",
    collection: "Co-ord Set",
  },

  {
    mainCategory: "BR Collection",
    subCategory: "Stitched",
    collection: "Trouser",
  },

  {
    mainCategory: "BR Collection",
    subCategory: "Stitched",
    collection: "Maxi / Dress",
  },

  // =====================================================
  // BR COLLECTION — UNSTITCHED
  // =====================================================

  {
    mainCategory: "BR Collection",
    subCategory: "Unstitched",
    collection: "1 Piece",
  },

  {
    mainCategory: "BR Collection",
    subCategory: "Unstitched",
    collection: "2 Piece",
  },

  {
    mainCategory: "BR Collection",
    subCategory: "Unstitched",
    collection: "3 Piece",
  },
];

async function seedCategories() {
  try {
    await mongoose.connect(env.MONGO_URI);

    console.log("MongoDB connected");

    /*
     * IMPORTANT
     *
     * Removes old indexes that no longer exist
     * in Category.js and creates the new indexes.
     *
     * Old:
     * mainCategory + subCategory
     *
     * New:
     * mainCategory + subCategory + collection
     */
    await Category.syncIndexes();

    console.log("Category indexes synchronized");

    await Category.deleteMany({});

    console.log("Old categories deleted");

    const inserted =
      await Category.insertMany(categories);

    console.log(
      `${inserted.length} categories seeded successfully`
    );

    await mongoose.connection.close();

    console.log("MongoDB connection closed");

    process.exit(0);
  } catch (error) {
    console.error(
      "Category seed failed:",
      error
    );

    await mongoose.connection.close();

    process.exit(1);
  }
}

seedCategories();