import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import { useAdminState } from "@/store/adminStore";
import { ELME_SUBCATEGORIES } from "@/data/categories";

export const Route = createFileRoute("/men")({
  component: Men,
  head: () => ({
    meta: [
      { title: "Men — ELME Bazaar" },
      { name: "description", content: "Shop ELME Bazaar men's shirts, t-shirts, polos, casual and formal wear." },
    ],
  }),
});

function Men() {
  const { products } = useAdminState();
  const [sub, setSub] = useState<string>("All");

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.mainCategory === "ELME Bazaar");
    if (sub !== "All") list = list.filter((p) => p.subCategory === sub);
    return list;
  }, [products, sub]);

  return (
    <div>
      <section className="bg-[color:var(--cream)] py-20">
        <div className="container-luxe text-center">
          <SectionHeading
            eyebrow="ELME Bazaar"
            title="Men's Collection"
            subtitle="Shirts, t-shirts, polos, and casual & formal wear for men."
          />
          <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
            {["All", ...ELME_SUBCATEGORIES].map((s) => (
              <button
                key={s}
                onClick={() => setSub(s)}
                className={`px-4 py-1.5 text-xs rounded-full border transition-all ${
                  sub === s
                    ? "bg-[color:var(--gold)] border-[color:var(--gold)] text-[color:var(--emerald-deep)] font-medium"
                    : "border-border bg-white hover:border-[color:var(--gold)]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="container-luxe py-16">
        <p className="text-sm text-[color:var(--ink-soft)] mb-8">
          {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
        </p>
        {filtered.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-border rounded-2xl">
            <p className="font-display text-2xl text-[color:var(--emerald-deep)]">Nothing here yet</p>
            <p className="text-sm text-[color:var(--ink-soft)] mt-2">Check back soon, or try a different category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
