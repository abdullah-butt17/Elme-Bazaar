export type Brand = "ELME Bazaar" | "BR Collection";

export const BRANDS: Brand[] = ["ELME Bazaar", "BR Collection"];

/** Legacy alias kept so existing imports (`MainCategory`) keep working. */
export type MainCategory = Brand;
export const MAIN_CATEGORIES: MainCategory[] = BRANDS;

/** ELME Bazaar (men's) categories, each with optional finer collections. */
export const ELME_TAXONOMY: Record<string, string[]> = {
  Shirts: [],
  "T-Shirts": [],
  Polos: [],
  "Casual Wear": [],
  "Formal Wear": [],
  "New Arrivals": [],
};

/** BR Collection (women's unstitched suits) categories. */
export const BR_TAXONOMY: Record<string, string[]> = {
  "Unstitched Suits": [],
  "2 Piece": [],
  "3 Piece": [],
  Lawn: [],
  Cotton: [],
  "New Arrivals": [],
};

export const ELME_SUBCATEGORIES = Object.keys(ELME_TAXONOMY);
export const BR_SUBCATEGORIES = Object.keys(BR_TAXONOMY);

/** Legacy aliases used by existing shop/admin filtering code. */
export const CLOTHING_SUBCATEGORIES = ELME_SUBCATEGORIES;
export const BEDSHEET_SUBCATEGORIES = BR_SUBCATEGORIES;

export function subcategoriesFor(brand: Brand) {
  return brand === "ELME Bazaar" ? ELME_SUBCATEGORIES : BR_SUBCATEGORIES;
}

export function collectionsFor(brand: Brand, sub: string): string[] {
  const taxonomy = brand === "ELME Bazaar" ? ELME_TAXONOMY : BR_TAXONOMY;
  return taxonomy[sub] ?? [];
}
