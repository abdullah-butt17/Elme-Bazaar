import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaStar, FaCheckCircle } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import { getProductById, mapProductFromApi } from "@/api/api";
import type { Product } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import { formatPrice } from "@/lib/utils";
import { useAdminState } from "@/store/adminStore";
import { cartStore } from "@/store/cartStore";

export const Route = createFileRoute("/product/$id")({
  component: ProductDetails,
  loader: async ({ params }): Promise<Product> => {
    try {
      const response = await getProductById(params.id);
      return mapProductFromApi(response.data);
    } catch {
      throw notFound();
    }
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — ELME Bazaar` },
          { name: "description", content: loaderData.description.slice(0, 155) },
          { property: "og:title", content: `${loaderData.name} — ELME Bazaar` },
          { property: "og:image", content: loaderData.image },
        ]
      : [{ title: "Product — ELME Bazaar" }],
  }),
  notFoundComponent: () => (
    <div className="container-luxe py-32 text-center">
      <h1 className="text-4xl font-display text-[color:var(--emerald-deep)]">Product not found</h1>
      <Link to="/shop" className="btn-primary mt-6 inline-flex">Back to shop</Link>
    </div>
  ),
  errorComponent: ({ reset }) => (
    <div className="container-luxe py-32 text-center">
      <h1 className="text-2xl font-display">Something went wrong</h1>
      <button onClick={reset} className="btn-primary mt-6">Try again</button>
    </div>
  ),
});

function ProductDetails() {
  const product = Route.useLoaderData();
  const { products } = useAdminState();
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState(product.sizes[0] ?? "");
  const [color, setColor] = useState(product.colors[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState("");

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const addToCart = (buyNow = false) => {
    if (product.sizes.length && !size) { setFeedback("Please select a size."); return; }
    if (product.colors.length && !color) { setFeedback("Please select a color."); return; }
    cartStore.add(product, quantity, size || undefined, color || undefined);
    setFeedback("Added to cart");
    if (buyNow) window.location.href = "/checkout";
  };

  return (
    <div>
      <div className="container-luxe pt-8">
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-[color:var(--ink-soft)] hover:text-[color:var(--emerald-brand)]">
          <FiArrowLeft /> Back to shop
        </Link>
      </div>

      <section className="container-luxe py-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Gallery */}
        <div>
          <motion.div
            key={activeImg}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="aspect-[4/5] rounded-2xl overflow-hidden bg-[color:var(--cream)] group"
          >
            <img
              src={product.gallery[activeImg] ?? product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-110"
            />
          </motion.div>
          {product.gallery.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.gallery.map((g: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    activeImg === i ? "border-[color:var(--gold)]" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={g} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.24em] px-2.5 py-1 rounded-full bg-[color:var(--emerald-deep)] text-[color:var(--cream)]">
              {product.mainCategory}
            </span>
            <span className="text-[10px] uppercase tracking-[0.24em] px-2.5 py-1 rounded-full bg-[color:var(--gold-soft)] text-[color:var(--emerald-deep)]">
              {product.subCategory}
            </span>
            {product.collection && (
              <span className="text-[10px] uppercase tracking-[0.22em] px-2.5 py-1 rounded-full border border-[color:var(--gold)]/60 text-[color:var(--gold)]">
                {product.collection}
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-display mt-3 text-[color:var(--emerald-deep)]">{product.name}</h1>
          <div className="mt-4 flex items-center gap-4">
            <span className="text-2xl font-medium text-[color:var(--emerald-brand)]">{formatPrice(product.salePrice ?? product.price)} {product.salePrice && <del className="ml-2 text-sm font-normal text-[color:var(--ink-soft)]">{formatPrice(product.price)}</del>}</span>
            <span className="flex items-center gap-1.5 text-sm text-[color:var(--ink-soft)]">
              <FaStar className="text-[color:var(--gold)]" /> {product.rating.toFixed(1)}
            </span>
            {product.inStock ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700">
                <FaCheckCircle /> In Stock
              </span>
            ) : (
              <span className="text-xs text-red-600">Out of Stock</span>
            )}
          </div>

          <p className="mt-6 text-[color:var(--ink-soft)] leading-relaxed whitespace-pre-line">
            {product.description}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--gold)]">Material</div>
              <div className="mt-2 text-[color:var(--ink)]">{product.material}</div>
            </div>
          </div>

          {product.sizes.length > 0 && <div className="mt-8">
            <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--gold)]">Size</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((s: string) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-4 py-2 rounded-full border text-sm transition-all ${
                    size === s ? "border-[color:var(--emerald-brand)] bg-[color:var(--emerald-brand)] text-[color:var(--cream)]" : "border-border hover:border-[color:var(--emerald-brand)]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>}

          {product.colors.length > 0 && <div className="mt-6">
            <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--gold)]">Color</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.colors.map((c: string) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`px-4 py-2 rounded-full border text-sm transition-all ${
                    color === c ? "border-[color:var(--gold)] bg-[color:var(--cream)]" : "border-border hover:border-[color:var(--gold)]"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>}

          <div className="mt-8 flex items-center gap-3"><span className="text-xs uppercase tracking-[0.2em]">Quantity</span><button className="border border-border px-3 py-2" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button><span className="w-6 text-center">{quantity}</span><button className="border border-border px-3 py-2" onClick={() => setQuantity(quantity + 1)}>+</button></div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button disabled={!product.inStock} onClick={() => addToCart()} className="btn-primary !px-8 !py-4 text-base disabled:cursor-not-allowed disabled:bg-[color:var(--ink-soft)]">{product.inStock ? "Add to Cart" : "Out of Stock"}</button>
            <button disabled={!product.inStock} onClick={() => addToCart(true)} className="btn-outline !text-[color:var(--ink)] !border-border hover:!bg-[color:var(--ink)] hover:!text-white disabled:opacity-50">Buy Now</button>
          </div>
          {feedback && <p className="mt-3 text-sm text-[color:var(--ink-soft)]">{feedback}</p>}

          <div className="mt-10 pt-8 border-t border-border grid grid-cols-3 gap-4 text-xs text-[color:var(--ink-soft)]">
            <div><span className="block text-[color:var(--emerald-brand)] font-medium mb-1">Handcrafted</span>By master artisans</div>
            <div><span className="block text-[color:var(--emerald-brand)] font-medium mb-1">Worldwide</span>Careful shipping</div>
            <div><span className="block text-[color:var(--emerald-brand)] font-medium mb-1">Private</span>Personal service</div>
          </div>
        </motion.div>
      </section>

      {related.length > 0 && (
        <section className="bg-[color:var(--cream)] py-24 mt-12">
          <div className="container-luxe">
            <SectionHeading eyebrow="You May Also Love" title="Related Pieces" />
            <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
