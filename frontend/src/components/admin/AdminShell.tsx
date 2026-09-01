import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiGrid,
  FiBox,
  FiTag,
  FiShoppingBag,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiChevronLeft,
} from "react-icons/fi";
import { adminStore, useAdminState } from "@/store/adminStore";

type NavItem = {
  to: string;
  label: string;
  Icon: typeof FiGrid;
  soon?: boolean;
};

const NAV: NavItem[] = [
  { to: "/admin/dashboard", label: "Dashboard", Icon: FiGrid },
  { to: "/admin/products", label: "Products", Icon: FiBox },
  { to: "/admin/categories", label: "Categories", Icon: FiTag },
  { to: "/admin/orders", label: "Orders", Icon: FiShoppingBag },
  { to: "/admin/customers", label: "Customers", Icon: FiUsers, soon: true },
  { to: "/admin/settings", label: "Settings", Icon: FiSettings },
];

export function AdminShell({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  const router = useRouter();
  const state = useAdminState();
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);

    if (!state.authed) {
      router.navigate({ to: "/admin" });
    }
  }, [state.authed, router]);

  if (!ready || !state.authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[color:var(--cream)]">
        <div className="text-sm text-[color:var(--ink-soft)]">
          Loading admin…
        </div>
      </div>
    );
  }

  const logout = () => {
    adminStore.logout();
    router.navigate({ to: "/admin" });
  };

  return (
    <div className="min-h-screen bg-[#F9F7F3] flex">
      {/* Sidebar - desktop */}
      <aside
        className={`hidden lg:flex flex-col bg-[color:var(--emerald-deep)] text-[color:var(--cream)] transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="h-20 flex items-center justify-between px-5 border-b border-white/10">
          {!collapsed && (
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-2"
            >
              <span className="text-xl font-display text-[color:var(--gold)]">
                ELME
              </span>
              <span className="text-[10px] uppercase tracking-[0.28em] opacity-70">
                Admin
              </span>
            </Link>
          )}

          <button
            onClick={() => setCollapsed((c) => !c)}
            className="p-1.5 rounded-md hover:bg-white/10"
            aria-label="Toggle sidebar"
          >
            <FiChevronLeft
              className={`transition-transform ${
                collapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          {NAV.map(({ to, label, Icon, soon }) => {
            const active =
              pathname === to || pathname.startsWith(to + "/");

            return (
              <Link
                key={to}
                to={(soon ? "/admin/dashboard" : to) as never}
                onClick={(e: React.MouseEvent) => {
                  if (soon) e.preventDefault();
                }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-[color:var(--gold)] text-[color:var(--emerald-deep)] font-medium"
                    : "hover:bg-white/10"
                } ${soon ? "opacity-50 cursor-not-allowed" : ""}`}
                title={label}
              >
                <Icon className="w-5 h-5 shrink-0" />

                {!collapsed && (
                  <span className="flex-1 flex items-center justify-between">
                    {label}

                    {soon && (
                      <span className="text-[9px] uppercase tracking-wider opacity-70">
                        Soon
                      </span>
                    )}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-white/10"
          >
            <FiLogOut className="w-5 h-5" />

            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileOpen(false)}
            />

            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "tween" }}
              className="relative w-64 h-full bg-[color:var(--emerald-deep)] text-[color:var(--cream)] flex flex-col"
            >
              <div className="h-16 flex items-center justify-between px-5 border-b border-white/10">
                <span className="text-lg font-display text-[color:var(--gold)]">
                  ELME Admin
                </span>

                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                >
                  <FiX />
                </button>
              </div>

              <nav className="flex-1 py-4 px-3 space-y-1">
                {NAV.map(({ to, label, Icon, soon }) => (
                  <Link
                    key={to}
                    to={(soon ? "/admin/dashboard" : to) as never}
                    onClick={(e: React.MouseEvent) => {
                      if (soon) e.preventDefault();
                      setMobileOpen(false);
                    }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${
                      pathname.startsWith(to)
                        ? "bg-[color:var(--gold)] text-[color:var(--emerald-deep)]"
                        : ""
                    } ${soon ? "opacity-50" : ""}`}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </Link>
                ))}

                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mt-4"
                >
                  <FiLogOut className="w-5 h-5" />
                  Logout
                </button>
              </nav>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-5 md:px-8 sticky top-0 z-30 backdrop-blur bg-white/90">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <FiMenu />
            </button>

            <div>
              <h1 className="text-lg font-display text-[color:var(--emerald-deep)]">
                {title}
              </h1>

              <p className="text-[11px] text-[color:var(--ink-soft)] uppercase tracking-[0.2em]">
                ELME Bazaar Admin
              </p>
            </div>
          </div>

          <Link
            to="/"
            className="text-xs text-[color:var(--ink-soft)] hover:text-[color:var(--emerald-brand)]"
          >
            View storefront ↗
          </Link>
        </header>

        <main className="flex-1 p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}

export function AdminCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-2xl border border-border shadow-[var(--shadow-card)] ${className}`}
    >
      {children}
    </div>
  );
}