import api from "./axios";

import type { Product } from "@/data/products";

/* =========================================================
   GENERIC API TYPES
========================================================= */

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
  count?: number;

  pagination?: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
};

export type ApiListResponse<T> =
  ApiResponse<T[]>;

/* =========================================================
   PRODUCT TYPES
========================================================= */

export type ApiProduct = {
  _id: string;
  slug?: string;

  name: string;

  brand:
    | "ELME Bazaar"
    | "BR Collection";

  mainCategory: string;

  subCategory: string;

  collection?: string;

  /* NEW */
  fabric?: string;

  description: string;

  material?: string;

  availableSizes?: string[];

  availableColors?: string[];

  price: number;

  salePrice?: number;

  stockStatus?:
    | "in_stock"
    | "out_of_stock"
    | "limited";

  featured?: boolean;

  images?: {
    url: string;
    publicId: string;
  }[];
};

/* =========================================================
   CATEGORY TYPES
========================================================= */

export type ApiCategory = {
  _id: string;

  mainCategory: string;

  subCategory: string;

  /* NEW */
  collection?: string;

  displayOrder?: number;

  isActive?: boolean;
};

/* =========================================================
   SETTINGS TYPES
========================================================= */

export type ApiSettings = {
  businessName?: string;

  whatsappNumber?: string;

  address?: string;

  email?: string;

  facebook?: string;

  instagram?: string;

  tiktok?: string;

  logo?: string;

  deliveryCharges?: number;

  returnPolicy?: string;
};

/* =========================================================
   AUTH TYPES
========================================================= */

export type AuthUser = {
  _id: string;

  name: string;

  email: string;

  role: string;
};

/* =========================================================
   PRODUCTS
========================================================= */

export const getProducts = async (
  params?: Record<
    string,
    unknown
  >
) => {
  const res =
    await api.get<
      ApiListResponse<ApiProduct>
    >(
      "/products",
      {
        params,
      }
    );

  return res.data;
};

export const getProductById =
  async (id: string) => {
    const res =
      await api.get<
        ApiResponse<ApiProduct>
      >(
        `/products/${id}`
      );

    return res.data;
  };

export const createProduct =
  async (
    payload: Record<
      string,
      unknown
    >
  ) => {
    const res =
      await api.post<
        ApiResponse<ApiProduct>
      >(
        "/products",
        payload
      );

    return res.data;
  };

export const updateProduct =
  async (
    id: string,
    payload: Record<
      string,
      unknown
    >
  ) => {
    const res =
      await api.put<
        ApiResponse<ApiProduct>
      >(
        `/products/${id}`,
        payload
      );

    return res.data;
  };

export const deleteProduct =
  async (id: string) => {
    const res =
      await api.delete(
        `/products/${id}`
      );

    return res.data;
  };

/* =========================================================
   ORDER TYPES
========================================================= */

export type ApiOrderItem = {
  productId: string;

  productName: string;

  image: string;

  price: number;

  quantity: number;

  selectedSize?: string;

  selectedColor?: string;

  subtotal: number;
};

export type ApiOrder = {
  _id: string;

  orderReference?: string;

  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };

  items: ApiOrderItem[];

  subtotal: number;

  deliveryCharges: number;

  total: number;

  trackingCode?: string;

  courierName?: string;

  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";

  createdAt: string;
};

/* =========================================================
   ORDERS
========================================================= */

export const createOrder =
  async (
    payload: Record<
      string,
      unknown
    >
  ) => {
    const res =
      await api.post<
        ApiResponse<ApiOrder>
      >(
        "/orders",
        payload
      );

    return res.data;
  };

export const trackOrder =
  async (
    orderId: string,
    email: string
  ) => {
    const res =
      await api.post<
        ApiResponse<ApiOrder>
      >(
        "/orders/track",
        {
          orderId,
          email,
        }
      );

    return res.data;
  };

export const getOrders =
  async () => {
    const res =
      await api.get<
        ApiListResponse<ApiOrder>
      >(
        "/orders"
      );

    return res.data;
  };

export const updateOrder =
  async (
    id: string,
    status:
      ApiOrder["status"],
    trackingCode?: string,
    courierName?: string
  ) => {
    const res =
      await api.put<
        ApiResponse<ApiOrder>
      >(
        `/orders/${id}`,
        {
          status,
          trackingCode,
          courierName,
        }
      );

    return res.data;
  };

export const deleteOrder =
  async (id: string) => {
    const res =
      await api.delete<
        ApiResponse<
          Record<
            string,
            never
          >
        >
      >(
        `/orders/${id}`
      );

    return res.data;
  };

/* =========================================================
   CATEGORIES
========================================================= */

export const getCategories =
  async () => {
    const res =
      await api.get<
        ApiListResponse<ApiCategory>
      >(
        "/categories"
      );

    return res.data;
  };

export const createCategory =
  async (
    payload: Record<
      string,
      unknown
    >
  ) => {
    const res =
      await api.post<
        ApiResponse<ApiCategory>
      >(
        "/categories",
        payload
      );

    return res.data;
  };

export const updateCategory =
  async (
    id: string,
    payload: Record<
      string,
      unknown
    >
  ) => {
    const res =
      await api.put<
        ApiResponse<ApiCategory>
      >(
        `/categories/${id}`,
        payload
      );

    return res.data;
  };

export const deleteCategory =
  async (id: string) => {
    const res =
      await api.delete<
        ApiResponse<unknown>
      >(
        `/categories/${id}`
      );

    return res.data;
  };

/* =========================================================
   AUTH
========================================================= */

export const login =
  async (payload: {
    email: string;
    password: string;
  }) => {
    const res =
      await api.post<
        ApiResponse<{
          user: AuthUser;
        }>
      >(
        "/auth/login",
        payload
      );

    return res.data;
  };

export const logout =
  async () => {
    const res =
      await api.post(
        "/auth/logout"
      );

    return res.data;
  };

export const getMe =
  async () => {
    const res =
      await api.get<
        ApiResponse<{
          user: AuthUser;
        }>
      >(
        "/auth/me"
      );

    return res.data;
  };

/* =========================================================
   SETTINGS
========================================================= */

export const getSettings =
  async () => {
    const res =
      await api.get<
        ApiResponse<ApiSettings>
      >(
        "/settings"
      );

    return res.data;
  };

export const updateSettings =
  async (
    payload: Record<
      string,
      unknown
    >
  ) => {
    console.log(
      "SETTINGS PAYLOAD:",
      payload
    );

    const res =
      await api.put<
        ApiResponse<ApiSettings>
      >(
        "/settings",
        payload
      );

    return res.data;
  };

/* =========================================================
   IMAGE UPLOAD
========================================================= */

export const uploadImages =
  async (
    files: File[]
  ) => {
    const form =
      new FormData();

    files.forEach(
      (file) =>
        form.append(
          "images",
          file
        )
    );

    const res =
      await api.post<
        ApiResponse<
          {
            url: string;
            publicId: string;
          }[]
        >
      >(
        "/upload",
        form,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return res.data;
  };

/* =========================================================
   PRODUCT API -> FRONTEND
========================================================= */

export function mapProductFromApi(
  product: ApiProduct
): Product {
  return {
    id:
      product._id,

    slug:
      product.slug,

    name:
      product.name,

    category:
      product.collection ||
      product.subCategory,

    brand:
      product.brand,

    mainCategory:
      product.mainCategory as Product["mainCategory"],

    subCategory:
      product.subCategory,

    collection:
      product.collection ??
      "",

    /* IMPORTANT */
    fabric:
      product.fabric ??
      "",

    description:
      product.description,

    material:
      product.material ||
      "",

    sizes:
      product.availableSizes ||
      [],

    colors:
      product.availableColors ||
      [],

    price:
      product.price,

    salePrice:
      product.salePrice,

    rating: 5,

    image:
      product.images?.[0]
        ?.url ||
      "",

    gallery:
      product.images?.map(
        (image) =>
          image.url
      ) ||
      [],

    imagePublicIds:
      product.images?.map(
        (image) =>
          image.publicId
      ) ||
      [],

    inStock:
      product.stockStatus !==
      "out_of_stock",

    featured:
      product.featured ??
      false,

    isNew: false,
  };
}

/* =========================================================
   PRODUCT FRONTEND -> API
========================================================= */

export function mapProductToApi(
  product: Product
) {
  const images = [
    ...new Set(
      [
        product.image,

        ...(
          product.gallery ??
          []
        ),
      ].filter(
        (url) =>
          Boolean(url) &&
          !url.startsWith(
            "blob:"
          )
      )
    ),
  ];

  return {
    name:
      product.name,

    brand:
      product.mainCategory,

    mainCategory:
      product.mainCategory,

    subCategory:
      product.subCategory,

    collection:
      product.collection ||
      undefined,

    /* IMPORTANT */
    fabric:
      product.fabric ||
      undefined,

    description:
      product.description,

    material:
      product.material ||
      undefined,

    availableSizes:
      product.sizes,

    availableColors:
      product.colors,

    price:
      product.price,

    salePrice:
      product.salePrice,

    stockStatus:
      product.inStock
        ? "in_stock"
        : "out_of_stock",

    featured:
      Boolean(
        product.featured
      ),

    images:
      images.map(
        (
          url,
          index
        ) => ({
          url,

          publicId:
            product
              .imagePublicIds?.[
              index
            ] ||
            `${
              product.name
                .toLowerCase()
                .replace(
                  /[^a-z0-9]+/g,
                  "-"
                ) ||
              "product"
            }-${index}`,
        })
      ),
  };
}