import type { Brand } from "./categories";

export type Product = {
  id: string;
  name: string;
  /** Legacy display label — kept for backward compat with existing UI. */
  category: string;
  brand: Brand;
  mainCategory: Brand;
  subCategory: string;
  collection?: string;
  price: number;
  salePrice?: number;
  rating: number;
  image: string;
  gallery: string[];
  imagePublicIds?: string[];
  description: string;
  material: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
  featured?: boolean;
  isNew?: boolean;
};

/** Legacy display categories used by homepage cards. */
export const CATEGORIES = [
  "Shirts",
  "Formal Wear",
  "Unstitched Suits",
  "Lawn",
] as const;

export const PRODUCTS: Product[] = [
  {
    id: "oxford-classic-shirt",
    name: "Oxford Classic Shirt",
    category: "Formal Wear",
    brand: "ELME Bazaar",
    mainCategory: "ELME Bazaar",
    subCategory: "Shirts",
    collection: "Formal Wear",
    price: 2999,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&w=1400&q=80",
    ],
    description: "A crisp Oxford shirt tailored for a clean, everyday formal look.",
    material: "100% cotton Oxford weave",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Sky Blue", "Charcoal"],
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
    price: 1799,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=1200&q=80",
    gallery: ["https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=1400&q=80"],
    description: "A breathable pique polo built for everyday comfort with a clean fit.",
    material: "Cotton pique",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Navy", "Black", "Olive"],
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
    price: 1499,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
    gallery: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1400&q=80"],
    description: "Soft, durable cotton tee for relaxed daily wear.",
    material: "100% combed cotton",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White", "Grey"],
    inStock: true,
    isNew: true,
  },
  {
    id: "signature-lawn-suit",
    name: "Signature Embroidered Lawn Suit",
    category: "Lawn",
    brand: "BR Collection",
    mainCategory: "BR Collection",
    subCategory: "Unstitched Suits",
    collection: "Lawn",
    price: 4999,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1610030181087-540f6cf122bd?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1610030181087-540f6cf122bd?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1400&q=80",
    ],
    description: "A 3-piece unstitched lawn suit with fine embroidery, ready to be tailored to your fit.",
    material: "Pure lawn cotton",
    sizes: ["Unstitched"],
    colors: ["Emerald", "Blush", "Ivory"],
    inStock: true,
    featured: true,
    isNew: true,
  },
  {
    id: "classic-2piece-cotton",
    name: "Classic 2-Piece Cotton Suit",
    category: "Cotton",
    brand: "BR Collection",
    mainCategory: "BR Collection",
    subCategory: "2 Piece",
    collection: "Cotton",
    price: 3499,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1610030181087-540f6cf122bd?auto=format&fit=crop&w=1200&q=80",
    gallery: ["https://images.unsplash.com/photo-1610030181087-540f6cf122bd?auto=format&fit=crop&w=1400&q=80"],
    description: "A comfortable 2-piece unstitched cotton suit for everyday elegance.",
    material: "100% cotton",
    sizes: ["Unstitched"],
    colors: ["Sage", "Sand"],
    inStock: true,
    featured: true,
  },
  {
    id: "festive-3piece-suit",
    name: "Festive Embroidered 3-Piece Suit",
    category: "Lawn",
    brand: "BR Collection",
    mainCategory: "BR Collection",
    subCategory: "3 Piece",
    collection: "Lawn",
    price: 6499,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1200&q=80",
    gallery: ["https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1400&q=80"],
    description: "An intricately embroidered 3-piece suit with dupatta, perfect for festive occasions.",
    material: "Lawn with chiffon dupatta",
    sizes: ["Unstitched"],
    colors: ["Maroon", "Navy"],
    inStock: true,
    isNew: true,
  },
];

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);
