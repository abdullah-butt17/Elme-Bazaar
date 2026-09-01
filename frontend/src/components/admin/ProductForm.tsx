import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import {
  FiSave,
  FiX,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";

import type { Product } from "@/data/products";
import type { MainCategory } from "@/data/categories";

import {
  subcategoriesFor,
  collectionsFor,
  MAIN_CATEGORIES,
  FABRICS,
} from "@/data/categories";

import { adminStore } from "@/store/adminStore";
import { uploadImages } from "@/api/api";

type FormProduct = Omit<Product, "rating">;

const empty: FormProduct = {
  id: "",
  name: "",
  category: "",

  brand: "ELME Bazaar",
  mainCategory: "ELME Bazaar",
  subCategory: "Shirts",
  collection: "",

  fabric: "",

  price: 0,
  salePrice: undefined,

  image: "",
  gallery: [],

  description: "",
  material: "",

  sizes: [],
  colors: [],

  inStock: true,

  featured: false,
  isNew: true,
};

export function ProductForm({
  initial,
  mode,
}: {
  initial?: Product;
  mode: "new" | "edit";
}) {
  const router = useRouter();

  const [p, setP] =
    useState<FormProduct>(() =>
      initial
        ? {
            ...initial,
          }
        : empty
    );

  const [sizesText, setSizesText] =
    useState(
      initial?.sizes.join(", ") ??
        "S, M, L"
    );

  const [colorsText, setColorsText] =
    useState(
      initial?.colors.join(", ") ??
        "Emerald, Ivory"
    );

  const [galleryText, setGalleryText] =
    useState(
      initial?.gallery.join("\n") ??
        ""
    );

  const [
    selectedFiles,
    setSelectedFiles,
  ] = useState<File[]>([]);

  const set = <
    K extends keyof FormProduct,
  >(
    key: K,
    value: FormProduct[K]
  ) => {
    setP((current) => ({
      ...current,
      [key]: value,
    }));
  };

  /* =====================================================
     SUBMIT
  ===================================================== */

  const submit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const uploaded =
        selectedFiles.length > 0
          ? (
              await uploadImages(
                selectedFiles
              )
            ).data
          : [];

      const typedGallery =
        galleryText
          .split("\n")
          .map((item) =>
            item.trim()
          )
          .filter(
            (item) =>
              item &&
              !item.startsWith(
                "blob:"
              )
          );

      const finalGallery = [
        ...uploaded.map(
          (image) => image.url
        ),
        ...typedGallery,
      ];

      const primaryImage =
        uploaded[0]?.url ||
        (
          p.image.startsWith(
            "blob:"
          )
            ? finalGallery[0]
            : p.image
        ) ||
        finalGallery[0];

      if (!primaryImage) {
        throw new Error(
          "Please upload an image or enter an image URL before saving."
        );
      }

      const record: Product = {
        ...(
          initial ?? {
            rating: 4.8,
          }
        ),

        ...p,

        id:
          p.id ||
          p.name
            .toLowerCase()
            .replace(
              /[^a-z0-9]+/g,
              "-"
            )
            .replace(
              /^-|-$/g,
              ""
            ),

        /**
         * Legacy category field.
         *
         * Collection is preferred.
         * If there is no collection,
         * use the subcategory.
         */
        category:
          p.collection ||
          p.subCategory,

        /**
         * Brand and mainCategory
         * represent the same
         * top-level shop brand.
         */
        brand:
          p.mainCategory,

        sizes: sizesText
          .split(",")
          .map((item) =>
            item.trim()
          )
          .filter(Boolean),

        colors: colorsText
          .split(",")
          .map((item) =>
            item.trim()
          )
          .filter(Boolean),

        gallery:
          finalGallery.length > 0
            ? finalGallery
            : [p.image].filter(
                (image) =>
                  image &&
                  !image.startsWith(
                    "blob:"
                  )
              ),

        imagePublicIds:
          uploaded.map(
            (image) =>
              image.publicId
          ),

        image:
          primaryImage,

        rating:
          initial?.rating ??
          4.8,
      };

      if (mode === "new") {
        await adminStore.addProduct(
          record
        );
      } else {
        await adminStore.updateProduct(
          record.id,
          record
        );
      }

      await router.navigate({
        to: "/admin/products",
      });
    } catch (error) {
      console.error(
        "Failed to save product",
        error
      );

      alert(
        "Could not save the product. Please check the form values and try again."
      );
    }
  };

  /* =====================================================
     CATEGORY OPTIONS
  ===================================================== */

  const subOpts =
    subcategoriesFor(
      p.mainCategory
    );

  const colOpts =
    collectionsFor(
      p.mainCategory,
      p.subCategory
    );

  /* =====================================================
     IMAGE UPLOAD
  ===================================================== */

  const onFiles = (
    files: FileList | null
  ) => {
    if (!files) return;

    const nextFiles =
      Array.from(files);

    const urls: string[] =
      [];

    nextFiles.forEach(
      (file) => {
        urls.push(
          URL.createObjectURL(
            file
          )
        );
      }
    );

    setSelectedFiles(
      (current) => [
        ...current,
        ...nextFiles,
      ]
    );

    const next = [
      ...(
        galleryText
          ? galleryText.split(
              "\n"
            )
          : []
      ),
      ...urls,
    ]
      .filter(Boolean)
      .join("\n");

    setGalleryText(next);

    if (
      !p.image &&
      urls[0]
    ) {
      set(
        "image",
        urls[0]
      );
    }
  };

  return (
    <form
      onSubmit={submit}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      {/* ===================================================
          LEFT SIDE
      =================================================== */}

      <div className="lg:col-span-2 space-y-6">
        {/* PRODUCT DETAILS */}

        <Card title="Product Details">
          <Field label="Product Name">
            <input
              required
              value={p.name}
              onChange={(e) =>
                set(
                  "name",
                  e.target.value
                )
              }
              className={
                inputCls
              }
            />
          </Field>

          <Field label="Description">
            <textarea
              rows={4}
              required
              value={
                p.description
              }
              onChange={(e) =>
                set(
                  "description",
                  e.target.value
                )
              }
              className={
                inputCls
              }
            />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* FABRIC */}

            <Field label="Fabric">
              <select
                value={
                  p.fabric ??
                  ""
                }
                onChange={(
                  e
                ) =>
                  set(
                    "fabric",
                    e.target
                      .value
                  )
                }
                className={
                  inputCls
                }
              >
                <option value="">
                  — Select
                  Fabric —
                </option>

                {FABRICS.map(
                  (
                    fabric
                  ) => (
                    <option
                      key={
                        fabric
                      }
                      value={
                        fabric
                      }
                    >
                      {
                        fabric
                      }
                    </option>
                  )
                )}
              </select>
            </Field>

            {/* MATERIAL */}

            <Field label="Material Details">
              <input
                value={
                  p.material
                }
                onChange={(
                  e
                ) =>
                  set(
                    "material",
                    e.target
                      .value
                  )
                }
                placeholder="e.g. Premium embroidered lawn"
                className={
                  inputCls
                }
              />
            </Field>

            {/* SIZES */}

            <Field label="Available Sizes (comma separated)">
              <input
                value={
                  sizesText
                }
                onChange={(
                  e
                ) =>
                  setSizesText(
                    e.target
                      .value
                  )
                }
                placeholder="S, M, L, XL"
                className={
                  inputCls
                }
              />
            </Field>

            {/* COLORS */}

            <Field label="Available Colors (comma separated)">
              <input
                value={
                  colorsText
                }
                onChange={(
                  e
                ) =>
                  setColorsText(
                    e.target
                      .value
                  )
                }
                placeholder="Black, White, Emerald"
                className={
                  inputCls
                }
              />
            </Field>

            {/* STOCK */}

            <Field label="Stock Status">
              <select
                value={
                  p.inStock
                    ? "in"
                    : "out"
                }
                onChange={(
                  e
                ) =>
                  set(
                    "inStock",
                    e.target
                      .value ===
                      "in"
                  )
                }
                className={
                  inputCls
                }
              >
                <option value="in">
                  In Stock
                </option>

                <option value="out">
                  Sold Out
                </option>
              </select>
            </Field>
          </div>
        </Card>

        {/* IMAGES */}

        <Card title="Images">
          <Field label="Primary Image URL">
            <input
              value={p.image}
              onChange={(e) =>
                set(
                  "image",
                  e.target.value
                )
              }
              placeholder="https://…"
              className={
                inputCls
              }
            />
          </Field>

          <Field label="Gallery URLs (one per line)">
            <textarea
              rows={3}
              value={
                galleryText
              }
              onChange={(e) =>
                setGalleryText(
                  e.target.value
                )
              }
              className={
                inputCls
              }
            />
          </Field>

          <label className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-dashed border-[color:var(--emerald-brand)]/40 text-sm cursor-pointer hover:bg-[color:var(--cream)]">
            <FiPlus />

            Upload images

            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(
                e
              ) =>
                onFiles(
                  e.target
                    .files
                )
              }
            />
          </label>

          {(p.image ||
            galleryText) && (
            <div className="mt-4 flex gap-2 flex-wrap">
              {[
                p.image,
                ...galleryText.split(
                  "\n"
                ),
              ]
                .filter(
                  Boolean
                )
                .slice(0, 6)
                .map(
                  (
                    src,
                    index
                  ) => (
                    <img
                      key={
                        index
                      }
                      src={
                        src
                      }
                      alt=""
                      className="w-16 h-16 object-cover rounded-lg border border-border"
                    />
                  )
                )}
            </div>
          )}
        </Card>
      </div>

      {/* ===================================================
          RIGHT SIDE
      =================================================== */}

      <div className="space-y-6">
        {/* CATEGORY */}

        <Card title="Category">
          {/* BRAND */}

          <Field label="Brand">
            <select
              value={
                p.mainCategory
              }
              onChange={(e) => {
                const main =
                  e.target
                    .value as MainCategory;

                const nextSubs =
                  subcategoriesFor(
                    main
                  );

                set(
                  "mainCategory",
                  main
                );

                set(
                  "brand",
                  main
                );

                set(
                  "subCategory",
                  nextSubs[0] ??
                    ""
                );

                set(
                  "collection",
                  ""
                );
              }}
              className={
                inputCls
              }
            >
              {MAIN_CATEGORIES.map(
                (
                  category
                ) => (
                  <option
                    key={
                      category
                    }
                    value={
                      category
                    }
                  >
                    {
                      category
                    }
                  </option>
                )
              )}
            </select>
          </Field>

          {/* SUB CATEGORY */}

          <Field label="Category">
            <select
              value={
                p.subCategory
              }
              onChange={(e) => {
                set(
                  "subCategory",
                  e.target
                    .value
                );

                set(
                  "collection",
                  ""
                );
              }}
              className={
                inputCls
              }
            >
              {subOpts.map(
                (
                  category
                ) => (
                  <option
                    key={
                      category
                    }
                    value={
                      category
                    }
                  >
                    {
                      category
                    }
                  </option>
                )
              )}
            </select>
          </Field>

          {/* COLLECTION */}

          {colOpts.length >
            0 && (
            <Field label="Collection">
              <select
                value={
                  p.collection ??
                  ""
                }
                onChange={(
                  e
                ) =>
                  set(
                    "collection",
                    e.target
                      .value
                  )
                }
                className={
                  inputCls
                }
              >
                <option value="">
                  — Select
                  Collection —
                </option>

                {colOpts.map(
                  (
                    collection
                  ) => (
                    <option
                      key={
                        collection
                      }
                      value={
                        collection
                      }
                    >
                      {
                        collection
                      }
                    </option>
                  )
                )}
              </select>
            </Field>
          )}
        </Card>

        {/* PRICING */}

        <Card title="Pricing">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Price (PKR)">
              <input
                type="number"
                required
                min={0}
                value={
                  p.price
                }
                onChange={(
                  e
                ) =>
                  set(
                    "price",
                    Number(
                      e.target
                        .value
                    )
                  )
                }
                className={
                  inputCls
                }
              />
            </Field>

            <Field label="Sale Price (PKR)">
              <input
                type="number"
                min={0}
                value={
                  p.salePrice ??
                  ""
                }
                onChange={(
                  e
                ) =>
                  set(
                    "salePrice",
                    e.target
                      .value
                      ? Number(
                          e
                            .target
                            .value
                        )
                      : undefined
                  )
                }
                className={
                  inputCls
                }
              />
            </Field>
          </div>
        </Card>

        {/* VISIBILITY */}

        <Card title="Visibility">
          <label className="flex items-center justify-between text-sm py-2">
            <span>
              Featured Product
            </span>

            <input
              type="checkbox"
              checked={
                !!p.featured
              }
              onChange={(
                e
              ) =>
                set(
                  "featured",
                  e.target
                    .checked
                )
              }
              className="accent-[color:var(--gold)] w-5 h-5"
            />
          </label>

          <label className="flex items-center justify-between text-sm py-2">
            <span>
              Mark as New
            </span>

            <input
              type="checkbox"
              checked={
                !!p.isNew
              }
              onChange={(
                e
              ) =>
                set(
                  "isNew",
                  e.target
                    .checked
                )
              }
              className="accent-[color:var(--emerald-brand)] w-5 h-5"
            />
          </label>
        </Card>

        {/* SAVE / CANCEL */}

        <div className="flex gap-3">
          <button
            type="submit"
            className="btn-primary flex-1 justify-center"
          >
            <FiSave />

            Save Product
          </button>

          <button
            type="button"
            onClick={() =>
              router.history.back()
            }
            className="px-5 py-3 rounded-full border border-border text-sm"
          >
            <FiX />
          </button>
        </div>

        {/* DELETE */}

        {mode === "edit" &&
          initial && (
            <button
              type="button"
              onClick={() => {
                if (
                  confirm(
                    `Delete ${initial.name}?`
                  )
                ) {
                  void adminStore.deleteProduct(
                    initial.id
                  );

                  router.navigate({
                    to: "/admin/products",
                  });
                }
              }}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 text-sm text-red-600 border border-red-200 rounded-full hover:bg-red-50"
            >
              <FiTrash2 />

              Delete this
              product
            </button>
          )}
      </div>
    </form>
  );
}

/* =========================================================
   STYLES
========================================================= */

const inputCls =
  "w-full px-3 py-2.5 rounded-lg border border-border bg-white text-sm outline-none focus:border-[color:var(--emerald-brand)]";

/* =========================================================
   CARD
========================================================= */

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-border p-6 shadow-[var(--shadow-card)]">
      <h3 className="font-display text-lg text-[color:var(--emerald-deep)] mb-4">
        {title}
      </h3>

      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}

/* =========================================================
   FIELD
========================================================= */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-soft)]">
        {label}
      </span>

      <div className="mt-1.5">
        {children}
      </div>
    </label>
  );
}