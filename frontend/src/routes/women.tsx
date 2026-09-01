import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import { useAdminState } from "@/store/adminStore";

import {
  BR_SUBCATEGORIES,
  FABRICS,
  collectionsFor,
} from "@/data/categories";

export const Route = createFileRoute("/women")({
  component: Women,

  head: () => ({
    meta: [
      {
        title: "Women — BR Collection",
      },
      {
        name: "description",
        content:
          "Shop BR Collection women's stitched and unstitched clothing by collection and fabric.",
      },
    ],
  }),
});

function Women() {
  const { products } = useAdminState();

  const [sub, setSub] = useState("All");

  const [collection, setCollection] =
    useState("All");

  const [fabric, setFabric] =
    useState("All");

  /* =====================================================
     COLLECTION OPTIONS
  ===================================================== */

  const collectionOptions = useMemo(() => {
    if (sub === "All") {
      return [];
    }

    return collectionsFor(
      "BR Collection",
      sub
    );
  }, [sub]);

  /* =====================================================
     FILTER PRODUCTS
  ===================================================== */

  const filtered = useMemo(() => {
    let list = products.filter(
      (product) =>
        product.mainCategory ===
        "BR Collection"
    );

    if (sub !== "All") {
      list = list.filter(
        (product) =>
          product.subCategory === sub
      );
    }

    if (collection !== "All") {
      list = list.filter(
        (product) =>
          product.collection === collection
      );
    }

    if (fabric !== "All") {
      list = list.filter(
        (product) =>
          product.fabric === fabric
      );
    }

    return list;
  }, [
    products,
    sub,
    collection,
    fabric,
  ]);

  /* =====================================================
     CHANGE CATEGORY
  ===================================================== */

  const changeSubCategory = (
    nextSub: string
  ) => {
    setSub(nextSub);

    // Collection belongs to the selected
    // Stitched / Unstitched category.
    setCollection("All");
  };

  /* =====================================================
     CLEAR FILTERS
  ===================================================== */

  const clearFilters = () => {
    setSub("All");
    setCollection("All");
    setFabric("All");
  };

  return (
    <div>
      {/* =================================================
          HERO / FILTERS
      ================================================= */}

      <section className="bg-[color:var(--cream)] py-20">
        <div className="container-luxe text-center">
          <SectionHeading
            eyebrow="BR Collection"
            title="Women's Collection"
            subtitle="Explore stitched and unstitched styles by collection and fabric."
          />

          {/* =============================================
              STITCHED / UNSTITCHED
          ============================================= */}

          <div className="mt-8">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--ink-soft)] mb-3">
              Category
            </p>

            <div className="flex flex-wrap justify-center gap-2">
              {[
                "All",
                ...BR_SUBCATEGORIES,
              ].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    changeSubCategory(item)
                  }
                  className={`px-5 py-2 text-xs rounded-full border transition-all ${
                    sub === item
                      ? "bg-[color:var(--emerald-deep)] border-[color:var(--emerald-deep)] text-white"
                      : "border-border bg-white hover:border-[color:var(--emerald-brand)]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* =============================================
              COLLECTION
          ============================================= */}

          {sub !== "All" &&
            collectionOptions.length > 0 && (
              <div className="mt-6">
                <p className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--ink-soft)] mb-3">
                  Collection
                </p>

                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCollection("All")
                    }
                    className={`px-4 py-1.5 text-xs rounded-full border transition-all ${
                      collection === "All"
                        ? "bg-[color:var(--gold)] border-[color:var(--gold)] text-[color:var(--emerald-deep)] font-medium"
                        : "border-border bg-white hover:border-[color:var(--gold)]"
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
                          setCollection(item)
                        }
                        className={`px-4 py-1.5 text-xs rounded-full border transition-all ${
                          collection === item
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

          {/* =============================================
              FABRIC
          ============================================= */}

          <div className="mt-6">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[color:var(--ink-soft)] mb-3">
              Fabric
            </p>

            <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
              <button
                type="button"
                onClick={() =>
                  setFabric("All")
                }
                className={`px-4 py-1.5 text-xs rounded-full border transition-all ${
                  fabric === "All"
                    ? "bg-[color:var(--gold)] border-[color:var(--gold)] text-[color:var(--emerald-deep)] font-medium"
                    : "border-border bg-white hover:border-[color:var(--gold)]"
                }`}
              >
                All
              </button>

              {FABRICS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    setFabric(item)
                  }
                  className={`px-4 py-1.5 text-xs rounded-full border transition-all ${
                    fabric === item
                      ? "bg-[color:var(--gold)] border-[color:var(--gold)] text-[color:var(--emerald-deep)] font-medium"
                      : "border-border bg-white hover:border-[color:var(--gold)]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* CLEAR */}

          {(sub !== "All" ||
            collection !== "All" ||
            fabric !== "All") && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 text-xs underline underline-offset-4 text-[color:var(--ink-soft)] hover:text-[color:var(--emerald-brand)]"
            >
              Clear all filters
            </button>
          )}
        </div>
      </section>

      {/* =================================================
          PRODUCTS
      ================================================= */}

      <section className="container-luxe py-16">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <p className="text-sm text-[color:var(--ink-soft)]">
            {filtered.length}{" "}
            {filtered.length === 1
              ? "piece"
              : "pieces"}

            {sub !== "All" && (
              <>
                {" "}
                ·{" "}
                <span className="text-[color:var(--emerald-brand)]">
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
          <div className="text-center py-24 border border-dashed border-border rounded-2xl">
            <p className="font-display text-2xl text-[color:var(--emerald-deep)]">
              Nothing here yet
            </p>

            <p className="text-sm text-[color:var(--ink-soft)] mt-2">
              Try another category,
              collection, or fabric.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="btn-primary text-sm mt-6"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {filtered.map(
              (product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                />
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}