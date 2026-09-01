import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FiBox, FiTag, FiStar, FiPlus, FiGrid, FiArrowRight } from "react-icons/fi";
import { AdminShell, AdminCard } from "@/components/admin/AdminShell";
import { formatPrice } from "@/lib/utils";
import { useAdminState } from "@/store/adminStore";

export const Route = createFileRoute("/admin/dashboard")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Dashboard — ELME Bazaar Admin" }, { name: "robots", content: "noindex" }] }),
});

function Dashboard() {
  const { products, categories } = useAdminState();
  const elme = products.filter((p) => p.mainCategory === "ELME Bazaar").length;
  const br = products.filter((p) => p.mainCategory === "BR Collection").length;
  const featured = products.filter((p) => p.featured).length;

  const stats = [
    { label: "Total Products", value: products.length, Icon: FiBox, tone: "emerald" },
    { label: "ELME Bazaar", value: elme, Icon: FiGrid, tone: "gold" },
    { label: "BR Collection", value: br, Icon: FiGrid, tone: "emerald" },
    { label: "Featured", value: featured, Icon: FiStar, tone: "gold" },
  ];

  const recent = products.slice(0, 5);

  return (
    <AdminShell title="Dashboard">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
          >
            <AdminCard className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--ink-soft)]">{s.label}</span>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                  s.tone === "gold" ? "bg-[color:var(--gold-soft)] text-[color:var(--emerald-deep)]" : "bg-[color:var(--emerald-deep)] text-[color:var(--gold)]"
                }`}>
                  <s.Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 text-3xl font-display text-[color:var(--emerald-deep)]">{s.value}</div>
            </AdminCard>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AdminCard className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl text-[color:var(--emerald-deep)]">Recent Products</h2>
              <p className="text-xs text-[color:var(--ink-soft)] mt-1">Latest additions to your catalog.</p>
            </div>
            <Link to="/admin/products" className="text-xs text-[color:var(--emerald-brand)] hover:underline inline-flex items-center gap-1">
              View all <FiArrowRight />
            </Link>
          </div>
          <ul className="mt-5 divide-y divide-border">
            {recent.map((p) => (
              <li key={p.id} className="flex items-center gap-4 py-3">
                <img src={p.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate text-[color:var(--ink)]">{p.name}</div>
                  <div className="text-[11px] text-[color:var(--ink-soft)]">
                    {p.mainCategory} · {p.subCategory}{p.collection ? ` · ${p.collection}` : ""}
                  </div>
                </div>
                <span className="text-sm text-[color:var(--emerald-brand)]">{formatPrice(p.price)}</span>
              </li>
            ))}
          </ul>
        </AdminCard>

        <div className="space-y-6">
          <AdminCard className="p-6">
            <h2 className="font-display text-xl text-[color:var(--emerald-deep)]">Quick Actions</h2>
            <div className="mt-4 flex flex-col gap-2">
              <Link to="/admin/products/new" className="btn-primary justify-center">
                <FiPlus /> Add Product
              </Link>
              <Link to="/admin/products" className="btn-outline !text-[color:var(--emerald-deep)] !border-[color:var(--emerald-brand)]/40 justify-center">
                Manage Products
              </Link>
            </div>
          </AdminCard>

          <AdminCard className="p-6">
            <h2 className="font-display text-xl text-[color:var(--emerald-deep)]">Recent Activity</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-3"><span className="w-2 h-2 rounded-full bg-[color:var(--gold)] mt-2" /><span>New product added to catalog</span></li>
              <li className="flex gap-3"><span className="w-2 h-2 rounded-full bg-[color:var(--emerald-brand)] mt-2" /><span>Settings updated</span></li>
              <li className="flex gap-3"><span className="w-2 h-2 rounded-full bg-[color:var(--gold)] mt-2" /><span>Category renamed</span></li>
              <li className="flex gap-3"><span className="w-2 h-2 rounded-full bg-[color:var(--emerald-brand)] mt-2" /><span>Signed in from a new device</span></li>
            </ul>
          </AdminCard>
        </div>
      </div>
    </AdminShell>
  );
}
