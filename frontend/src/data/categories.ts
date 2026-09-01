export type Brand =
  | "ELME Bazaar"
  | "BR Collection";

export const BRANDS: Brand[] = [
  "ELME Bazaar",
  "BR Collection",
];

/**
 * Legacy alias kept so existing imports
 * using MainCategory continue working.
 */
export type MainCategory = Brand;

export const MAIN_CATEGORIES: MainCategory[] =
  BRANDS;

/* =========================================================
   ELME BAZAAR — MEN'S
========================================================= */

/**
 * ELME Bazaar categories.
 *
 * Existing structure is preserved.
 */
export const ELME_TAXONOMY: Record<
  string,
  string[]
> = {
  Shirts: [],
  "T-Shirts": [],
  Polos: [],
  "Casual Wear": [],
  "Formal Wear": [],
  "New Arrivals": [],
};

/* =========================================================
   BR COLLECTION — WOMEN'S
========================================================= */

/**
 * BR Collection category hierarchy:
 *
 * BR Collection
 *
 * ├── Stitched
 * │   ├── 2 Piece
 * │   ├── 3 Piece
 * │   ├── Kurta
 * │   ├── Shirt
 * │   ├── Co-ord Set
 * │   ├── Trouser
 * │   └── Maxi / Dress
 * │
 * └── Unstitched
 *     ├── 1 Piece
 *     ├── 2 Piece
 *     └── 3 Piece
 *
 * Fabric is NOT part of this taxonomy.
 * Fabric is a separate product attribute/filter.
 */

export const BR_TAXONOMY: Record<
  string,
  string[]
> = {
  Stitched: [
    "2 Piece",
    "3 Piece",
    "Kurta",
    "Shirt",
    "Co-ord Set",
    "Trouser",
    "Maxi / Dress",
  ],

  Unstitched: [
    "1 Piece",
    "2 Piece",
    "3 Piece",
  ],
};

/* =========================================================
   FABRICS
========================================================= */

/**
 * Fabric is completely separate from categories.
 *
 * Used by:
 * - Admin Product Form
 * - Shop Filters
 */
export const FABRICS = [
  "Lawn",
  "Cotton",
  "Khaddar",
  "Linen",
  "Chiffon",
  "Organza",
  "Silk",
  "Jacquard",
  "Cambric",
] as const;

export type Fabric =
  (typeof FABRICS)[number];

/* =========================================================
   SUBCATEGORY LISTS
========================================================= */

export const ELME_SUBCATEGORIES =
  Object.keys(ELME_TAXONOMY);

export const BR_SUBCATEGORIES =
  Object.keys(BR_TAXONOMY);

/**
 * Legacy aliases used by existing
 * shop/admin filtering code.
 */
export const CLOTHING_SUBCATEGORIES =
  ELME_SUBCATEGORIES;

export const BEDSHEET_SUBCATEGORIES =
  BR_SUBCATEGORIES;

/* =========================================================
   HELPERS
========================================================= */

/**
 * Returns subcategories for selected brand.
 *
 * Example:
 *
 * subcategoriesFor("BR Collection")
 *
 * returns:
 *
 * ["Stitched", "Unstitched"]
 */
export function subcategoriesFor(
  brand: Brand
): string[] {
  return brand === "ELME Bazaar"
    ? ELME_SUBCATEGORIES
    : BR_SUBCATEGORIES;
}

/**
 * Returns collections for selected
 * brand + subcategory.
 *
 * Example:
 *
 * collectionsFor(
 *   "BR Collection",
 *   "Unstitched"
 * )
 *
 * returns:
 *
 * [
 *   "1 Piece",
 *   "2 Piece",
 *   "3 Piece"
 * ]
 */
export function collectionsFor(
  brand: Brand,
  sub: string
): string[] {
  const taxonomy =
    brand === "ELME Bazaar"
      ? ELME_TAXONOMY
      : BR_TAXONOMY;

  return taxonomy[sub] ?? [];
}