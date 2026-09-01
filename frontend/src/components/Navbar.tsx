import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FiSearch, FiMenu, FiX, FiShoppingBag, FiMoon, FiSun } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

import { generalWhatsAppUrl } from "@/lib/whatsapp";
import { useAdminState } from "@/store/adminStore";
import { cartCount, useCart } from "@/store/cartStore";
import { useTheme } from "@/components/ThemeProvider";

const links = [
  { to: "/", label: "Home" },
  { to: "/men", label: "Men" },
  { to: "/women", label: "Women" },
  { to: "/shop", label: "Shop" },
  { to: "/tracking", label: "Track Order" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const { settings } = useAdminState();
  const { items } = useCart();

  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");

  const { theme, toggleTheme } = useTheme();

  const whatsappUrl = settings?.whatsapp
    ? generalWhatsAppUrl(
        "Hello, I would like to know more about ELME Bazaar.",
        settings.whatsapp
      )
    : "";

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/85 border-b border-border/60">
      <div className="container-luxe flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-display tracking-wide text-[color:var(--emerald-brand)]">
            ELME
          </span>

          <span className="h-6 w-px bg-[color:var(--gold)]/50" />

          <span className="text-xs uppercase tracking-[0.32em] text-[color:var(--ink-soft)] group-hover:text-[color:var(--gold)] transition-colors">
            Bazaar
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-10">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm tracking-wide text-[color:var(--ink)] hover:text-[color:var(--gold)] transition-colors relative"
              activeProps={{
                className: "text-[color:var(--gold)]",
              }}
              activeOptions={{
                exact: link.to === "/",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* SEARCH */}
          <button
            type="button"
            aria-label="Search"
            onClick={() => setSearchOpen((state) => !state)}
            className="p-2 rounded-full hover:bg-[color:var(--cream)] transition-colors"
          >
            <FiSearch className="w-5 h-5" />
          </button>

          {/* THEME */}
          <button
            type="button"
            aria-label={
              theme === "light"
                ? "Switch to dark theme"
                : "Switch to light theme"
            }
            title={
              theme === "light"
                ? "Switch to dark theme"
                : "Switch to light theme"
            }
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-[color:var(--cream)] transition-colors"
          >
            {theme === "light" ? (
              <FiMoon className="w-5 h-5" />
            ) : (
              <FiSun className="w-5 h-5" />
            )}
          </button>

          {/* CART */}
          <Link
            to="/cart"
            className="relative p-2"
            aria-label={`Cart, ${cartCount(items)} items`}
          >
            <FiShoppingBag className="h-5 w-5" />

            {cartCount(items) > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center bg-[color:var(--ink)] px-1 text-[10px] text-white">
                {cartCount(items)}
              </span>
            )}
          </Link>

          {/* DESKTOP WHATSAPP */}
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary hidden md:inline-flex text-sm !py-2.5 !px-5"
            >
              <FaWhatsapp className="w-4 h-4" />
              Order Now
            </a>
          )}

          {/* MOBILE MENU */}
          <button
            type="button"
            aria-label="Menu"
            className="lg:hidden p-2"
            onClick={() => setOpen((state) => !state)}
          >
            {open ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* SEARCH PANEL */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            className="border-t border-border overflow-hidden"
          >
            <div className="container-luxe py-4 flex gap-3">
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search shirts, unstitched suits…"
                className="flex-1 bg-transparent outline-none border-b border-border py-2 text-sm placeholder:text-[color:var(--ink-soft)]"
              />

              <Link
                to="/shop"
                search={{ q } as never}
                onClick={() => setSearchOpen(false)}
                className="btn-gold text-sm !py-2 !px-5"
              >
                Search
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE NAV */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{
              opacity: 0,
              y: -8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -8,
            }}
            className="lg:hidden border-t border-border bg-background"
          >
            <div className="container-luxe py-6 flex flex-col gap-4">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="text-base tracking-wide"
                >
                  {link.label}
                </Link>
              ))}

              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-sm w-fit"
                >
                  <FaWhatsapp className="w-4 h-4" />
                  WhatsApp Support
                </a>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}