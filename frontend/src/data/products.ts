import type {
  Brand,
  Fabric,
} from "./categories";

export type Product = {
  id: string;
  slug?: string;
  name: string;

  /**
   * Legacy display label.
   * Kept for backward compatibility
   * with existing UI.
   */
  category: string;

  brand: Brand;

  mainCategory: Brand;

  subCategory: string;

  collection?: string;

  /**
   * Separate fabric attribute.
   *
   * Examples:
   * Lawn
   * Cotton
   * Khaddar
   * Chiffon
   */
  fabric?: Fabric | string;

  price: number;

  salePrice?: number;

  rating: number;

  image: string;

  gallery: string[];

  imagePublicIds?: string[];

  description: string;

  /**
   * More detailed material description.
   *
   * Example:
   * "Premium embroidered lawn"
   * "100% cotton Oxford weave"
   */
  material: string;

  sizes: string[];

  colors: string[];

  inStock: boolean;

  featured?: boolean;

  isNew?: boolean;
};

/* =========================================================
   LEGACY HOMEPAGE CATEGORIES
========================================================= */

/**
 * Kept because existing homepage components
 * may still import CATEGORIES.
 */
export const CATEGORIES = [
  "Shirts",
  "Formal Wear",
  "Stitched",
  "Unstitched",
] as const;

/* =========================================================
   SAMPLE PRODUCTS
========================================================= */

export const PRODUCTS: Product[] = [
  // =====================================================
  // ELME BAZAAR
  // =====================================================

  {
    id: "oxford-classic-shirt",

    name: "Oxford Classic Shirt",

    category: "Formal Wear",

    brand: "ELME Bazaar",

    mainCategory: "ELME Bazaar",

    subCategory: "Shirts",

    collection: "Formal Wear",

    fabric: "Cotton",

    price: 2999,

    rating: 4.8,

    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=80",

    gallery: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&w=1400&q=80",
    ],

    description:
      "A crisp Oxford shirt tailored for a clean, everyday formal look.",

    material:
      "100% cotton Oxford weave",

    sizes: [
      "S",
      "M",
      "L",
      "XL",
      "XXL",
    ],

    colors: [
      "White",
      "Sky Blue",
      "Charcoal",
    ],

    inStock: true,

    featured: true,

    isNew: true,
  },

  {
    id: "urban-polo-tee",

    name: "Urban Polo Tee",

    category: "Polos",

    brand: "ELME Bazaar",

    mainCategory: "ELME Bazaar",

    subCategory: "Polos",

    fabric: "Cotton",

    price: 1799,

    rating: 4.6,

    image:
      "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=1200&q=80",

    gallery: [
      "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=1400&q=80",
    ],

    description:
      "A breathable pique polo built for everyday comfort with a clean fit.",

    material:
      "Cotton pique",

    sizes: [
      "S",
      "M",
      "L",
      "XL",
    ],

    colors: [
      "Navy",
      "Black",
      "Olive",
    ],

    inStock: true,

    featured: true,
  },

  {
    id: "everyday-graphic-tshirt",

    name: "Everyday Graphic T-Shirt",

    category: "T-Shirts",

    brand: "ELME Bazaar",

    mainCategory: "ELME Bazaar",

    subCategory: "T-Shirts",

    fabric: "Cotton",

    price: 1499,

    rating: 4.5,

    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",

    gallery: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1400&q=80",
    ],

    description:
      "Soft, durable cotton tee for relaxed daily wear.",

    material:
      "100% combed cotton",

    sizes: [
      "S",
      "M",
      "L",
      "XL",
    ],

    colors: [
      "Black",
      "White",
      "Grey",
    ],

    inStock: true,

    isNew: true,
  },

  // =====================================================
  // BR COLLECTION
  // =====================================================

  {
    id: "signature-lawn-suit",

    name:
      "Signature Embroidered Lawn Suit",

    category: "3 Piece",

    brand: "BR Collection",

    mainCategory: "BR Collection",

    subCategory: "Unstitched",

    collection: "3 Piece",

    fabric: "Lawn",

    price: 4999,

    rating: 4.9,

    image:
      "https://images.unsplash.com/photo-1610030181087-540f6cf122bd?auto=format&fit=crop&w=1200&q=80",

    gallery: [
      "https://images.unsplash.com/photo-1610030181087-540f6cf122bd?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1400&q=80",
    ],

    description:
      "A 3-piece unstitched lawn suit with fine embroidery, ready to be tailored to your fit.",

    material:
      "Pure lawn cotton",

    sizes: [
      "Unstitched",
    ],

    colors: [
      "Emerald",
      "Blush",
      "Ivory",
    ],

    inStock: true,

    featured: true,

    isNew: true,
  },

  {
    id: "classic-2piece-cotton",

    name:
      "Classic 2-Piece Cotton Suit",

    category: "2 Piece",

    brand: "BR Collection",

    mainCategory: "BR Collection",

    subCategory: "Unstitched",

    collection: "2 Piece",

    fabric: "Cotton",

    price: 3499,

    rating: 4.7,

    image:
      "https://images.unsplash.com/photo-1610030181087-540f6cf122bd?auto=format&fit=crop&w=1200&q=80",

    gallery: [
      "https://images.unsplash.com/photo-1610030181087-540f6cf122bd?auto=format&fit=crop&w=1400&q=80",
    ],

    description:
      "A comfortable 2-piece unstitched cotton suit for everyday elegance.",

    material:
      "100% cotton",

    sizes: [
      "Unstitched",
    ],

    colors: [
      "Sage",
      "Sand",
    ],

    inStock: true,

    featured: true,
  },

  {
    id: "festive-3piece-suit",

    name:
      "Festive Embroidered 3-Piece Suit",

    category: "3 Piece",

    brand: "BR Collection",

    mainCategory: "BR Collection",

    subCategory: "Unstitched",

    collection: "3 Piece",

    fabric: "Lawn",

    price: 6499,

    rating: 5.0,

    image:
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1200&q=80",

    gallery: [
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1400&q=80",
    ],

    description:
      "An intricately embroidered 3-piece suit with dupatta, perfect for festive occasions.",

    material:
      "Lawn with chiffon dupatta",

    sizes: [
      "Unstitched",
    ],

    colors: [
      "Maroon",
      "Navy",
    ],

    inStock: true,

    isNew: true,
  },
];

/* =========================================================
   PRODUCT LOOKUP
========================================================= */

export const getProduct = (
  id: string
) =>
  PRODUCTS.find(
    (product) =>
      product.id === id
  );