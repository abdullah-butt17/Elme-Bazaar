import { useSyncExternalStore } from "react";

import {
  PRODUCTS as SEED_PRODUCTS,
  type Product,
} from "@/data/products";

import {
  CLOTHING_SUBCATEGORIES,
  BEDSHEET_SUBCATEGORIES,
} from "@/data/categories";

import {
  createProduct as createProductApi,
  deleteProduct as deleteProductApi,
  getCategories,
  getProducts,
  getMe,
  getSettings,
  login as loginApi,
  logout as logoutApi,
  mapProductFromApi,
  updateProduct as updateProductApi,
  updateSettings as updateSettingsApi,
  type ApiCategory,
  type ApiSettings,
} from "@/api/api";

/* =========================================================
   BUSINESS SETTINGS
========================================================= */

export type BusinessSettings = {
  businessName: string;
  whatsapp: string;
  address: string;
  email: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  deliveryCharges: number;
  logo?: string;
};

/* =========================================================
   CATEGORY ENTRY
========================================================= */

export type CategoryEntry = {
  id: string;

  /**
   * This represents backend subCategory.
   *
   * Examples:
   * Shirts
   * Stitched
   * Unstitched
   */
  name: string;

  /**
   * Backend collection.
   *
   * Examples:
   * 2 Piece
   * 3 Piece
   * Kurta
   */
  collection: string;

  main:
    | "ELME Bazaar"
    | "BR Collection";
};

/* =========================================================
   STATE
========================================================= */

type State = {
  products: Product[];
  categories: CategoryEntry[];
  settings: BusinessSettings;
  authed: boolean;
};

/* =========================================================
   SEED CATEGORIES
========================================================= */

/**
 * Fallback categories only.
 *
 * Actual categories are loaded from MongoDB
 * when bootstrapFromApi() runs.
 */
const seedCategories: CategoryEntry[] = [
  ...CLOTHING_SUBCATEGORIES.map(
    (name) => ({
      id: `e-${name}`,
      name,
      collection: "",
      main:
        "ELME Bazaar" as const,
    })
  ),

  ...BEDSHEET_SUBCATEGORIES.map(
    (name) => ({
      id: `b-${name}`,
      name,
      collection: "",
      main:
        "BR Collection" as const,
    })
  ),
];

/* =========================================================
   DEFAULT SETTINGS
========================================================= */

const seedSettings: BusinessSettings = {
  businessName: "ELME Bazaar",

  whatsapp:
    "+92 300 0000000",

  address:
    "Lahore, Pakistan",

  email:
    "hello@elmebazaar.com",

  facebook:
    "https://facebook.com/elmebazaar",

  instagram:
    "https://instagram.com/elmebazaar",

  tiktok:
    "https://tiktok.com/@elmebazaar",

  deliveryCharges: 0,
};

/* =========================================================
   INITIAL STATE
========================================================= */

let state: State = {
  products: [
    ...SEED_PRODUCTS,
  ],

  categories:
    seedCategories,

  settings:
    seedSettings,

  authed: false,
};

/* =========================================================
   INTERNAL STATE
========================================================= */

const listeners =
  new Set<() => void>();

const KEY =
  "mz_admin_state_v2";

let hydrated = false;

let bootstrapDone = false;

let bootstrapPromise:
  Promise<void> | null =
  null;

let authCheckPromise:
  Promise<boolean> | null =
  null;

/* =========================================================
   PERSIST
========================================================= */

function persist() {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  try {
    localStorage.setItem(
      KEY,
      JSON.stringify(state)
    );
  } catch {
    // ignore
  }
}

/* =========================================================
   EMIT
========================================================= */

function emit() {
  persist();

  listeners.forEach(
    (listener) =>
      listener()
  );
}

/* =========================================================
   CATEGORY API MAPPER
========================================================= */

function mapCategoryFromApi(
  category: ApiCategory
): CategoryEntry {
  return {
    id: category._id,

    name:
      category.subCategory,

    collection:
      category.collection ??
      "",

    main:
      category.mainCategory ===
      "BR Collection"
        ? "BR Collection"
        : "ELME Bazaar",
  };
}

/* =========================================================
   SETTINGS API MAPPER
========================================================= */

function mapSettingsFromApi(
  settings: ApiSettings
): BusinessSettings {
  return {
    businessName:
      settings.businessName ??
      state.settings
        .businessName,

    whatsapp:
      settings.whatsappNumber ??
      state.settings
        .whatsapp,

    address:
      settings.address ??
      state.settings
        .address,

    email:
      settings.email ??
      state.settings.email,

    facebook:
      settings.facebook ??
      state.settings
        .facebook,

    instagram:
      settings.instagram ??
      state.settings
        .instagram,

    tiktok:
      settings.tiktok ??
      state.settings
        .tiktok,

    deliveryCharges:
      settings.deliveryCharges ??
      state.settings
        .deliveryCharges,

    logo:
      settings.logo ??
      state.settings.logo,
  };
}

/* =========================================================
   BOOTSTRAP DATA FROM BACKEND
========================================================= */

async function bootstrapFromApi() {
  if (
    bootstrapDone ||
    typeof window ===
      "undefined"
  ) {
    return;
  }

  if (bootstrapPromise) {
    return bootstrapPromise;
  }

  bootstrapPromise =
    (async () => {
      try {
        const [
          productsResponse,
          categoriesResponse,
          settingsResponse,
        ] =
          await Promise.all([
            getProducts({
              limit: 100,
            }),

            getCategories(),

            getSettings(),
          ]);

        const nextProducts =
          (
            productsResponse.data ??
            []
          ).map(
            mapProductFromApi
          );

        const nextCategories =
          (
            categoriesResponse.data ??
            []
          ).map(
            mapCategoryFromApi
          );

        const nextSettings =
          mapSettingsFromApi(
            settingsResponse.data
          );

        state = {
          ...state,

          products:
            nextProducts,

          categories:
            nextCategories.length >
            0
              ? nextCategories
              : state.categories,

          settings:
            nextSettings,
        };

        emit();
      } catch (error) {
        console.error(
          "Failed to load storefront data from the API",
          error
        );
      } finally {
        bootstrapDone =
          true;
      }
    })();

  return bootstrapPromise;
}

/* =========================================================
   VERIFY SESSION
========================================================= */

async function verifySession() {
  if (
    typeof window ===
    "undefined"
  ) {
    return false;
  }

  if (authCheckPromise) {
    return authCheckPromise;
  }

  authCheckPromise =
    (async () => {
      try {
        const response =
          await getMe();

        const nextAuthed =
          Boolean(
            response?.data
              ?.user
          );

        state = {
          ...state,
          authed:
            nextAuthed,
        };

        emit();

        return nextAuthed;
      } catch {
        state = {
          ...state,
          authed: false,
        };

        emit();

        return false;
      }
    })();

  return authCheckPromise;
}

/* =========================================================
   HYDRATE
========================================================= */

function hydrate() {
  if (
    hydrated ||
    typeof window ===
      "undefined"
  ) {
    return;
  }

  hydrated = true;

  window.setTimeout(() => {
    try {
      const raw =
        localStorage.getItem(
          KEY
        );

      if (raw) {
        const parsed =
          JSON.parse(
            raw
          ) as Partial<State>;

        state = {
          ...state,
          ...parsed,
        };

        emit();
      }
    } catch {
      // ignore
    }

    void verifySession().finally(
      () => {
        void bootstrapFromApi();
      }
    );
  }, 0);
}

/* =========================================================
   ADMIN STORE
========================================================= */

export const adminStore = {
  subscribe(
    listener: () => void
  ) {
    hydrate();

    listeners.add(
      listener
    );

    return () => {
      listeners.delete(
        listener
      );
    };
  },

  get() {
    return state;
  },

  getServer() {
    return state;
  },

  /* =======================================================
     LOGIN
  ======================================================= */

  async login(
    email: string,
    password: string
  ) {
    try {
      const response =
        await loginApi({
          email,
          password,
        });

      if (
        response.success
      ) {
        state = {
          ...state,
          authed: true,
        };

        emit();

        await verifySession();
      }

      return response;
    } catch (error) {
      console.error(
        "Admin login failed",
        error
      );

      throw error;
    }
  },

  /* =======================================================
     LOGOUT
  ======================================================= */

  async logout() {
    try {
      await logoutApi();
    } catch (error) {
      console.error(
        "Admin logout failed",
        error
      );
    }

    state = {
      ...state,
      authed: false,
    };

    emit();
  },

  /* =======================================================
     ADD PRODUCT
  ======================================================= */

  async addProduct(
    product: Product
  ) {
    const imageUrls = [
      ...new Set(
        [
          product.image,
          ...(
            product.gallery ??
            []
          ),
        ].filter(
          (url) =>
            url &&
            !url.startsWith(
              "blob:"
            )
        )
      ),
    ];

    if (
      imageUrls.length ===
      0
    ) {
      throw new Error(
        "At least one product image is required."
      );
    }

    const payload = {
      name:
        product.name,

      brand:
        product.brand,

      mainCategory:
        product.mainCategory,

      subCategory:
        product.subCategory,

      collection:
        product.collection ||
        undefined,

      /**
       * NEW
       */
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
        imageUrls.map(
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
              }-${Date.now()}-${index}`,
          })
        ),
    };

    const response =
      await createProductApi(
        payload
      );

    const created =
      mapProductFromApi(
        response.data
      );

    state = {
      ...state,

      products: [
        created,
        ...state.products,
      ],
    };

    emit();

    return created;
  },

  /* =======================================================
     UPDATE PRODUCT
  ======================================================= */

  async updateProduct(
    id: string,
    patch: Product
  ) {
    const imageUrls = [
      ...new Set(
        [
          patch.image,
          ...(
            patch.gallery ??
            []
          ),
        ].filter(
          (url) =>
            url &&
            !url.startsWith(
              "blob:"
            )
        )
      ),
    ];

    if (
      imageUrls.length ===
      0
    ) {
      throw new Error(
        "At least one product image is required."
      );
    }

    const payload = {
      name:
        patch.name,

      brand:
        patch.brand,

      mainCategory:
        patch.mainCategory,

      subCategory:
        patch.subCategory,

      collection:
        patch.collection ||
        undefined,

      /**
       * NEW
       */
      fabric:
        patch.fabric ||
        undefined,

      description:
        patch.description,

      material:
        patch.material ||
        undefined,

      availableSizes:
        patch.sizes,

      availableColors:
        patch.colors,

      price:
        patch.price,

      salePrice:
        patch.salePrice,

      stockStatus:
        patch.inStock
          ? "in_stock"
          : "out_of_stock",

      featured:
        Boolean(
          patch.featured
        ),

      images:
        imageUrls.map(
          (
            url,
            index
          ) => ({
            url,

            publicId:
              patch
                .imagePublicIds?.[
                index
              ] ||
              `${
                patch.name
                  .toLowerCase()
                  .replace(
                    /[^a-z0-9]+/g,
                    "-"
                  ) ||
                "product"
              }-${Date.now()}-${index}`,
          })
        ),
    };

    const response =
      await updateProductApi(
        id,
        payload
      );

    const updated =
      mapProductFromApi(
        response.data
      );

    state = {
      ...state,

      products:
        state.products.map(
          (product) =>
            product.id === id
              ? updated
              : product
        ),
    };

    emit();

    return updated;
  },

  /* =======================================================
     DELETE PRODUCT
  ======================================================= */

  async deleteProduct(
    id: string
  ) {
    await deleteProductApi(
      id
    );

    state = {
      ...state,

      products:
        state.products.filter(
          (product) =>
            product.id !== id
        ),
    };

    emit();
  },

  /* =======================================================
     CATEGORY — LOCAL STATE
  ======================================================= */

  addCategory(
    category: CategoryEntry
  ) {
    state = {
      ...state,

      categories: [
        category,
        ...state.categories,
      ],
    };

    emit();
  },

  updateCategory(
    id: string,
    patch: Partial<CategoryEntry>
  ) {
    state = {
      ...state,

      categories:
        state.categories.map(
          (category) =>
            category.id === id
              ? {
                  ...category,
                  ...patch,
                }
              : category
        ),
    };

    emit();
  },

  deleteCategory(
    id: string
  ) {
    state = {
      ...state,

      categories:
        state.categories.filter(
          (category) =>
            category.id !== id
        ),
    };

    emit();
  },

  /* =======================================================
     SETTINGS
  ======================================================= */

  async updateSettings(
    patch: Partial<BusinessSettings>
  ) {
    const payload = {
      businessName:
        patch.businessName,

      whatsappNumber:
        patch.whatsapp,

      address:
        patch.address,

      email:
        patch.email,

      facebook:
        patch.facebook,

      instagram:
        patch.instagram,

      tiktok:
        patch.tiktok,

      logo:
        patch.logo,
    };

    const response =
      await updateSettingsApi(
        payload
      );

    state = {
      ...state,

      settings:
        mapSettingsFromApi(
          response.data
        ),
    };

    emit();
  },
};

/* =========================================================
   REACT HOOK
========================================================= */

export function useAdminState(): State {
  return useSyncExternalStore(
    adminStore.subscribe,
    adminStore.get,
    adminStore.getServer
  );
}