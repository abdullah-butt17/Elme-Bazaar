import {createFileRoute,Link,Outlet,useRouterState,} from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiSearch, FiX } from "react-icons/fi";
import { AdminShell, AdminCard } from "@/components/admin/AdminShell";
import { formatPrice } from "@/lib/utils";
import { adminStore, useAdminState } from "@/store/adminStore";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
  head: () => ({ meta: [{ title: "Products — ELME Bazaar Admin" }, { name: "robots", content: "noindex" }] }),
});

function AdminProducts() {
  const { products } = useAdminState();

  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });

  console.log("Current route:", pathname);

  if (pathname !== "/admin/products") {
    return <Outlet />;
  }

  const [q, setQ] = useState("");
  const [brandFilter, setBrandFilter] = useState<"All" | "ELME Bazaar" | "BR Collection">("All");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const filtered = products
    .filter((p) => (brandFilter === "All" ? true : p.brand === brandFilter))
    .filter((p) =>
      !q ? true : [p.name, p.mainCategory, p.subCategory, p.collection ?? ""].some((f) => f.toLowerCase().includes(q.toLowerCase())),
    );

  const target = confirmId ? products.find((p) => p.id === confirmId) : null;

  return (
    <AdminShell title="Products">
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div className="relative w-full max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--ink-soft)]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-border bg-white text-sm outline-none focus:border-[color:var(--emerald-brand)]"
          />
        </div>
        <div className="flex items-center gap-2">
          {(["All", "ELME Bazaar", "BR Collection"] as const).map((b) => (
            <button
              key={b}
              onClick={() => setBrandFilter(b)}
              className={`px-4 py-2 rounded-full text-xs border transition-colors ${
                brandFilter === b
                  ? "bg-[color:var(--emerald-deep)] text-[color:var(--cream)] border-[color:var(--emerald-deep)]"
                  : "border-border bg-white hover:border-[color:var(--emerald-brand)]"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
        <Link to="/admin/products/new" className="btn-primary text-sm">
          <FiPlus /> Add Product
        </Link>
      </div>

      <AdminCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[color:var(--cream)]/60 text-left text-[10px] uppercase tracking-[0.2em] text-[color:var(--ink-soft)]">
              <tr>
                <th className="p-4">Image</th>
                <th className="p-4">Name</th>
                <th className="p-4">Brand</th>
                <th className="p-4">Main</th>
                <th className="p-4">Sub</th>
                <th className="p-4">Collection</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Featured</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-[color:var(--cream)]/30 transition-colors">
                  <td className="p-3">
                    <img src={p.image} alt="" className="w-12 h-12 object-cover rounded-lg" />
                  </td>
                  <td className="p-3 font-medium text-[color:var(--ink)] max-w-[220px] truncate">{p.name}</td>
                  <td className="p-3">
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${
                      p.brand === "ELME Bazaar" ? "bg-[color:var(--gold)]/20 text-[color:var(--emerald-deep)]" : "bg-[color:var(--emerald-brand)]/15 text-[color:var(--emerald-brand)]"
                    }`}>
                      {p.brand}
                    </span>
                  </td>
                  <td className="p-3">{p.mainCategory}</td>
                  <td className="p-3 text-[color:var(--ink-soft)]">{p.subCategory}</td>
                  <td className="p-3 text-[color:var(--ink-soft)]">{p.collection || "—"}</td>
                  <td className="p-3 text-[color:var(--emerald-brand)] font-medium">{formatPrice(p.price)}</td>
                  <td className="p-3">
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${
                      p.inStock ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700"
                    }`}>
                      {p.inStock ? "In Stock" : "Sold Out"}
                    </span>
                  </td>
                  <td className="p-3">
                    {p.featured ? <span className="text-[color:var(--gold)]">★</span> : <span className="text-[color:var(--ink-soft)]/40">—</span>}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to="/product/$id" params={{ id: p.id }} target="_blank"
                        className="p-2 rounded-lg hover:bg-[color:var(--cream)]"
                        title="View"
                      ><FiEye /></Link>
                      <Link
                        to="/admin/products/$id/edit" params={{ id: p.id }}
                        className="p-2 rounded-lg hover:bg-[color:var(--cream)] text-[color:var(--emerald-brand)]"
                        title="Edit"
                      ><FiEdit2 /></Link>
                      <button
                        onClick={() => setConfirmId(p.id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                        title="Delete"
                      ><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={10} className="p-10 text-center text-[color:var(--ink-soft)]">No products found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>

      {/* Delete modal */}
      <AnimatePresence>
        {target && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setConfirmId(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl text-[color:var(--emerald-deep)]">Delete product?</h3>
                  <p className="text-sm text-[color:var(--ink-soft)] mt-2">
                    You're about to permanently remove <strong>{target.name}</strong>. This action cannot be undone.
                  </p>
                </div>
                <button onClick={() => setConfirmId(null)} className="p-1"><FiX /></button>
              </div>
              <div className="mt-8 flex justify-end gap-3">
                <button onClick={() => setConfirmId(null)} className="px-5 py-2.5 rounded-full border border-border text-sm">
                  Cancel
                </button>
                <button
                  onClick={() => { adminStore.deleteProduct(target.id); setConfirmId(null); }}
                  className="px-5 py-2.5 rounded-full bg-red-600 text-white text-sm hover:bg-red-700"
                >
                  Delete Product
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminShell>
  );
}
