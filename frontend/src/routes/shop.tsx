import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiX } from "react-icons/fi";
import { z } from "zod";

import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import { useAdminState } from "@/store/adminStore";

import {
  CLOTHING_SUBCATEGORIES,
  BEDSHEET_SUBCATEGORIES,
  collectionsFor,
  FABRICS,
} from "@/data/categories";

/* =========================================================
   SEARCH PARAMS
========================================================= */

const searchSchema = z.object({
  q: z.string().optional(),

  main: z
    .enum([
      "All",
      "ELME Bazaar",
      "BR Collection",
    ])
    .optional(),

  sub: z.string().optional(),

  collection: z.string().optional(),

  fabric: z.string().optional(),

  sort: z
    .enum([
      "featured",
      "price-asc",
      "price-desc",
      "rating",
    ])
    .optional(),
});

export const Route = createFileRoute("/shop")({
  component: Shop,

  validateSearch: searchSchema,

  head: () => ({
    meta: [
      {
        title: "Shop — ELME Bazaar",
      },
      {
        name: "description",
        content:
          "Shop ELME Bazaar men's clothing and BR Collection women's stitched and unstitched fashion.",
      },
    ],
  }),
});

const TABS = [
  "All Products",
  "ELME Bazaar",
  "BR Collection",
] as const;

/* =========================================================
   SHOP
========================================================= */

function Shop() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const { products } = useAdminState();

  const initialTab: (typeof TABS)[number] =
    search.main === "ELME Bazaar"
      ? "ELME Bazaar"
      : search.main === "BR Collection"
        ? "BR Collection"
        : "All Products";

  const [tab, setTab] =
    useState<(typeof TABS)[number]>(initialTab);

  const [sub, setSub] =
    useState(search.sub ?? "All");

  const [collection, setCollection] =
    useState(search.collection ?? "All");

  const [fabric, setFabric] =
    useState(search.fabric ?? "All");

  const [q, setQ] =
    useState(search.q ?? "");

  const [sort, setSort] =
    useState(search.sort ?? "featured");

  /* =====================================================
     SUBCATEGORY OPTIONS
  ===================================================== */

  const subOptions =
    tab === "ELME Bazaar"
      ? ["All", ...CLOTHING_SUBCATEGORIES]
      : tab === "BR Collection"
        ? ["All", ...BEDSHEET_SUBCATEGORIES]
        : [];

  /* =====================================================
     COLLECTION OPTIONS
  ===================================================== */

  const collectionOptions = useMemo(() => {
    if (sub === "All") {
      return [];
    }

    if (
      tab !== "ELME Bazaar" &&
      tab !== "BR Collection"
    ) {
      return [];
    }

    return collectionsFor(
      tab,
      sub
    );
  }, [tab, sub]);

  /* =====================================================
     FILTER PRODUCTS
  ===================================================== */

  const filtered = useMemo(() => {
    let list = products.slice();

    /* BRAND */

    if (tab === "ELME Bazaar") {
      list = list.filter(
        (product) =>
          product.mainCategory === "ELME Bazaar"
      );
    } else if (tab === "BR Collection") {
      list = list.filter(
        (product) =>
          product.mainCategory === "BR Collection"
      );
    }

    /* SUBCATEGORY */

    if (sub !== "All") {
      list = list.filter(
        (product) =>
          product.subCategory === sub
      );
    }

    /* COLLECTION */

    if (collection !== "All") {
      list = list.filter(
        (product) =>
          product.collection === collection
      );
    }

    /* FABRIC */

    if (fabric !== "All") {
      list = list.filter(
        (product) =>
          product.fabric === fabric
      );
    }

    /* SEARCH */

    if (q.trim()) {
      const searchValue =
        q.trim().toLowerCase();

      list = list.filter(
        (product) =>
          [
            product.name,
            product.subCategory,
            product.collection ?? "",
            product.fabric ?? "",
            product.material,
          ].some((field) =>
            field
              .toLowerCase()
              .includes(searchValue)
          )
      );
    }

    /* SORT */

    switch (sort) {
      case "price-asc":
        list.sort(
          (a, b) =>
            a.price - b.price
        );
        break;

      case "price-desc":
        list.sort(
          (a, b) =>
            b.price - a.price
        );
        break;

      case "rating":
        list.sort(
          (a, b) =>
            b.rating - a.rating
        );
        break;

      default:
        list.sort(
          (a, b) =>
            Number(!!b.featured) -
            Number(!!a.featured)
        );
    }

    return list;
  }, [
    products,
    tab,
    sub,
    collection,
    fabric,
    q,
    sort,
  ]);

  /* =====================================================
     UPDATE URL
  ===================================================== */

  const updateUrl = (
    patch: Partial<
      z.infer<typeof searchSchema>
    >
  ) => {
    navigate({
      search: (
        previous: Record<string, unknown>
      ) =>
        ({
          ...previous,
          ...patch,
        }) as never,

      replace: true,
    });
  };

  /* =====================================================
     CHANGE TAB
  ===================================================== */

  const handleTab = (
    nextTab: (typeof TABS)[number]
  ) => {
    setTab(nextTab);

    setSub("All");
    setCollection("All");
    setFabric("All");

    updateUrl({
      main:
        nextTab === "ELME Bazaar"
          ? "ELME Bazaar"
          : nextTab === "BR Collection"
            ? "BR Collection"
            : undefined,

      sub: undefined,
      collection: undefined,
      fabric: undefined,
    });
  };

  /* =====================================================
     CHANGE SUBCATEGORY
  ===================================================== */

  const handleSub = (
    nextSub: string
  ) => {
    setSub(nextSub);

    setCollection("All");

    updateUrl({
      sub:
        nextSub === "All"
          ? undefined
          : nextSub,

      collection: undefined,
    });
  };

  /* =====================================================
     CHANGE COLLECTION
  ===================================================== */

  const handleCollection = (
    nextCollection: string
  ) => {
    setCollection(nextCollection);

    updateUrl({
      collection:
        nextCollection === "All"
          ? undefined
          : nextCollection,
    });
  };

  /* =====================================================
     CHANGE FABRIC
  ===================================================== */

  const handleFabric = (
    nextFabric: string
  ) => {
    setFabric(nextFabric);

    updateUrl({
      fabric:
        nextFabric === "All"
          ? undefined
          : nextFabric,
    });
  };

  return (
    <div>
      {/* =================================================
          HERO
      ================================================= */}

      <section className="bg-[color:var(--cream)] py-20">
        <div className="container-luxe text-center">
          <SectionHeading
            eyebrow="The Collection"
            title="Shop ELME Bazaar"
            subtitle="Explore considered pieces for every day, with delivery across Pakistan."
          />

          {/* BRAND TABS */}

          <div className="mt-10 inline-flex bg-white rounded-full p-1.5 shadow-[var(--shadow-card)] border border-border">
            {TABS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() =>
                  handleTab(item)
                }
                className={`px-5 md:px-7 py-2.5 rounded-full text-xs md:text-sm tracking-wide transition-all ${
                  tab === item
                    ? "bg-[color:var(--emerald-deep)] text-[color:var(--cream)]"
                    : "text-[color:var(--ink-soft)] hover:text-[color:var(--ink)]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* CATEGORY */}

          {subOptions.length > 0 && (
            <div className="mt-7">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--ink-soft)] mb-3">
                Category
              </p>

              <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
                {subOptions.map(
                  (item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        handleSub(item)
                      }
                      className={`px-4 py-1.5 text-xs rounded-full border transition-all ${
                        sub === item
                          ? "bg-[color:var(--gold)] border-[color:var(--gold)] text-[color:var(--emerald-deep)] font-medium"
                          : "border-border bg-white hover:border-[color:var(--gold)]"
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {/* COLLECTION */}

          {collectionOptions.length > 0 && (
            <div className="mt-6">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--ink-soft)] mb-3">
                Collection
              </p>

              <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
                <button
                  type="button"
                  onClick={() =>
                    handleCollection("All")
                  }
                  className={`px-4 py-1.5 text-xs rounded-full border transition-all ${
                    collection === "All"
                      ? "bg-[color:var(--emerald-deep)] border-[color:var(--emerald-deep)] text-white"
                      : "border-border bg-white hover:border-[color:var(--emerald-brand)]"
                  }`}
                >
                  All
                </button>

                {collectionOptions.map(
                  (item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        handleCollection(item)
                      }
                      className={`px-4 py-1.5 text-xs rounded-full border transition-all ${
                        collection === item
                          ? "bg-[color:var(--emerald-deep)] border-[color:var(--emerald-deep)] text-white"
                          : "border-border bg-white hover:border-[color:var(--emerald-brand)]"
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {/* FABRIC */}

          {tab === "BR Collection" && (
            <div className="mt-6">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--ink-soft)] mb-3">
                Fabric
              </p>

              <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
                <button
                  type="button"
                  onClick={() =>
                    handleFabric("All")
                  }
                  className={`px-4 py-1.5 text-xs rounded-full border transition-all ${
                    fabric === "All"
                      ? "bg-[color:var(--gold)] border-[color:var(--gold)] text-[color:var(--emerald-deep)] font-medium"
                      : "border-border bg-white hover:border-[color:var(--gold)]"
                  }`}
                >
                  All
                </button>

                {FABRICS.map(
                  (item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        handleFabric(item)
                      }
                      className={`px-4 py-1.5 text-xs rounded-full border transition-all ${
                        fabric === item
                          ? "bg-[color:var(--gold)] border-[color:var(--gold)] text-[color:var(--emerald-deep)] font-medium"
                          : "border-border bg-white hover:border-[color:var(--gold)]"
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =================================================
          SHOP BODY
      ================================================= */}

      <section className="container-luxe py-16 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-12">

        {/* SIDEBAR */}

        <aside className="space-y-8 lg:sticky lg:top-28 h-fit">

          {/* SEARCH */}

          <div>
            <label className="text-xs uppercase tracking-[0.24em] text-[color:var(--gold)]">
              Search
            </label>

            <div className="relative mt-3">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--ink-soft)]" />

              <input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);

                  updateUrl({
                    q:
                      e.target.value ||
                      undefined,
                  });
                }}
                placeholder="Search products…"
                className="w-full pl-10 pr-9 py-3 rounded-full border border-border bg-white text-sm outline-none focus:border-[color:var(--emerald-brand)]"
              />

              {q && (
                <button
                  type="button"
                  onClick={() => {
                    setQ("");

                    updateUrl({
                      q: undefined,
                    });
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--ink-soft)]"
                  aria-label="Clear search"
                >
                  <FiX />
                </button>
              )}
            </div>
          </div>

          {/* SORT */}

          <div>
            <label className="text-xs uppercase tracking-[0.24em] text-[color:var(--gold)]">
              Sort
            </label>

            <select
              value={sort}
              onChange={(e) => {
                const value =
                  e.target.value as typeof sort;

                setSort(value);

                updateUrl({
                  sort: value,
                });
              }}
              className="mt-3 w-full py-3 px-4 rounded-full border border-border bg-white text-sm outline-none"
            >
              <option value="featured">
                Featured
              </option>

              <option value="price-asc">
                Price: Low to High
              </option>

              <option value="price-desc">
                Price: High to Low
              </option>

              <option value="rating">
                Top Rated
              </option>
            </select>
          </div>
        </aside>

        {/* PRODUCTS */}

        <div>
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm text-[color:var(--ink-soft)]">
              {filtered.length}{" "}
              {filtered.length === 1
                ? "piece"
                : "pieces"}

              {tab !== "All Products" && (
                <>
                  {" "}
                  ·{" "}
                  <span className="text-[color:var(--emerald-brand)]">
                    {tab}
                  </span>
                </>
              )}

              {sub !== "All" && (
                <>
                  {" "}
                  /{" "}
                  <span>
                    {sub}
                  </span>
                </>
              )}

              {collection !== "All" && (
                <>
                  {" "}
                  /{" "}
                  <span>
                    {collection}
                  </span>
                </>
              )}

              {fabric !== "All" && (
                <>
                  {" "}
                  /{" "}
                  <span>
                    {fabric}
                  </span>
                </>
              )}
            </p>
          </div>

          {filtered.length === 0 ? (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              className="text-center py-24 border border-dashed border-border rounded-2xl"
            >
              <p className="font-display text-2xl text-[color:var(--emerald-deep)]">
                Nothing matches
              </p>

              <p className="text-sm text-[color:var(--ink-soft)] mt-2">
                Try a different category,
                collection, fabric or
                search.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {filtered.map(
                (
                  product,
                  index
                ) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                  />
                )
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}