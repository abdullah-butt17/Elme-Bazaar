import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { FiEye } from "react-icons/fi";
import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/utils";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: "easeOut" }}
      className="group relative flex flex-col"
    >
      <Link
        to="/product/$id"
        params={{ id: product.id }}
        className="relative block overflow-hidden rounded-2xl bg-[color:var(--cream)] aspect-[4/5]"
      >
        <motion.img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
        {product.isNew && (
          <span className="absolute top-4 left-4 bg-[color:var(--gold)] text-[color:var(--emerald-deep)] text-[10px] tracking-[0.24em] uppercase px-3 py-1 rounded-full font-semibold">
            New
          </span>
        )}
        {!product.inStock && (
          <span className="absolute top-4 right-4 bg-white/90 text-[color:var(--ink)] text-[10px] tracking-[0.24em] uppercase px-3 py-1 rounded-full">
            Sold Out
          </span>
        )}

        <div className="absolute inset-x-4 bottom-4 flex gap-2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
          <span className="btn-primary !py-2 !px-4 text-xs w-full">
            <FiEye className="w-3.5 h-3.5" /> Quick View
          </span>
        </div>
      </Link>

      <div className="pt-5 flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-[0.24em] px-2 py-0.5 rounded-full bg-[color:var(--emerald-deep)] text-[color:var(--cream)]">
            {product.mainCategory}
          </span>
          <span className="text-[10px] uppercase tracking-[0.24em] px-2 py-0.5 rounded-full bg-[color:var(--gold-soft)] text-[color:var(--emerald-deep)]">
            {product.subCategory}
          </span>
          {product.collection && (
            <span className="text-[10px] uppercase tracking-[0.22em] px-2 py-0.5 rounded-full border border-[color:var(--gold)]/50 text-[color:var(--gold)]">
              {product.collection}
            </span>
          )}
        </div>
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-display leading-snug text-[color:var(--ink)]">
            <Link to="/product/$id" params={{ id: product.id }} className="hover:text-[color:var(--emerald-brand)] transition-colors">
              {product.name}
            </Link>
          </h3>
          <span className="text-base font-medium text-[color:var(--emerald-brand)] whitespace-nowrap">
            {formatPrice(product.salePrice ?? product.price)}
            {product.salePrice && <del className="ml-2 text-xs font-normal text-[color:var(--ink-soft)]">{formatPrice(product.price)}</del>}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[color:var(--ink-soft)]">
          <FaStar className="w-3 h-3 text-[color:var(--gold)]" />
          <span>{product.rating.toFixed(1)}</span>
        </div>

        <div className="flex gap-2 mt-3">
          <Link
            to="/product/$id"
            params={{ id: product.id }}
            className="flex-1 text-center text-xs tracking-wide border border-border rounded-full py-2.5 hover:border-[color:var(--emerald-brand)] hover:text-[color:var(--emerald-brand)] transition-colors"
          >
            View Details
          </Link>
          <Link to="/product/$id" params={{ id: product.id }} className="btn-primary !py-2.5 !px-4 text-xs">Add to Cart</Link>
        </div>
      </div>
    </motion.article>
  );
}
