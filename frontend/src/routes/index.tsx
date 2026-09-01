import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FaWhatsapp, FaStar, FaAward, FaTruck, FaHeart, FaGem, FaHandsHelping } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import { formatPrice } from "@/lib/utils";
import { generalWhatsAppUrl } from "@/lib/whatsapp";
import { useAdminState } from "@/store/adminStore";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "ELME Bazaar — Fashion for Him & Her" },
      { name: "description", content: "Shop ELME Bazaar men's shirts, polos & casualwear and BR Collection women's unstitched suits with delivery across Pakistan." },
    ],
  }),
});

const BRAND_SECTIONS = [
  {
    to: "/men" as const,
    brand: "ELME Bazaar",
    tagline: "Men's Collection",
    cta: "Shop Men's Collection",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=80",
  },
  {
    to: "/women" as const,
    brand: "BR Collection",
    tagline: "Women's Collection",
    cta: "Shop Women's Collection",
    image: "https://res.cloudinary.com/kwoazwf4/image/upload/v1787996831/360_F_377646411_8DfyvyjBptAeoGbTRXvxnMwnIjOZBX09.jpg",
  },
];

const FEATURES = [
  { Icon: FaGem, title: "Premium Quality", desc: "Carefully sourced fabrics for men's and women's wear." },
  { Icon: FaHandsHelping, title: "Two Trusted Brands", desc: "ELME Bazaar for him, BR Collection for her." },
  { Icon: FaTruck, title: "Fast Delivery", desc: "Carefully packaged & shipped across Pakistan." },
  { Icon: FaHeart, title: "Customer Care", desc: "Personal support on WhatsApp, always." },
  { Icon: FaAward, title: "Fair Pricing", desc: "Honest prices on every piece, every time." },
];

const TESTIMONIALS = [
  { name: "Bilal A.", role: "Lahore", text: "The Oxford shirt from ELME Bazaar fits perfectly and the fabric feels premium." },
  { name: "Sana R.", role: "Islamabad", text: "My BR Collection lawn suit arrived beautifully packaged — the embroidery is stunning." },
  { name: "Hamza K.", role: "Karachi", text: "Ordered on WhatsApp and got quick, friendly replies. Great store for both men and women." },
];

function Home() {
  const { products, settings } = useAdminState();
  const featured = products.filter((p) => p.featured);
  const newArrivals = products.filter((p) => p.isNew);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://res.cloudinary.com/kwoazwf4/image/upload/w_2400,h_1400,c_fill,g_center,q_auto,f_auto/v1787996831/360_F_377646411_8DfyvyjBptAeoGbTRXvxnMwnIjOZBX09.jpg"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--emerald-deep)]/95 via-[color:var(--emerald-deep)]/70 to-[color:var(--emerald-deep)]/30" />
        </div>

        <div className="container-luxe relative min-h-[86vh] flex items-center py-24">
          <div className="max-w-2xl text-[color:var(--cream)]">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-[color:var(--gold)] eyebrow"
            >
              ELME Bazaar · Fashion Store
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15 }}
              className="mt-6 text-5xl md:text-7xl lg:text-8xl font-display leading-[1.05]"
            >
              Fashion <br />
              for <em className="text-[color:var(--gold)] not-italic">Him & Her</em>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35 }}
              className="mt-8 text-lg text-[color:var(--cream)]/85 max-w-lg leading-relaxed"
            >
              ELME Bazaar men's fashion and BR Collection women's unstitched suits — one store, two trusted brands.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.55 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link to="/shop" className="btn-gold">
                Shop Now <FiArrowRight />
              </Link>
              <Link to="/contact" className="btn-outline">
                Contact Us
              </Link>
            </motion.div>
          </div>
        </div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[color:var(--cream)]/60 text-xs tracking-[0.3em] uppercase"
        >
          Scroll
        </motion.div>
      </section>

      {/* BRANDS */}
      <section className="py-24 bg-white">
        <div className="container-luxe">
          <SectionHeading
            eyebrow="Shop By Brand"
            title="Two Brands, One Store"
            subtitle="ELME Bazaar for men's fashion, BR Collection for women's unstitched suits."
          />
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
            {BRAND_SECTIONS.map((b, i) => (
              <motion.div
                key={b.brand}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <Link to={b.to} className="group block relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <img
                    src={b.image}
                    alt={b.tagline}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--emerald-deep)]/90 via-[color:var(--emerald-deep)]/20 to-transparent" />
                  <div className="absolute inset-x-6 bottom-6 text-[color:var(--cream)]">
                    <span className="text-xs uppercase tracking-[0.28em] text-[color:var(--gold)]">{b.tagline}</span>
                    <h3 className="text-2xl md:text-3xl font-display mt-1">{b.brand}</h3>
                    <div className="mt-4 inline-flex items-center gap-2 text-sm tracking-wide text-[color:var(--gold)]">
                      {b.cta} <FiArrowRight />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="py-24 bg-[color:var(--cream)]">
        <div className="container-luxe">
          <SectionHeading
            eyebrow="Signature Pieces"
            title="Featured Products"
            subtitle="Our most beloved pieces, handpicked from both brands."
          />
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featured.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS - horizontal */}
      <section className="py-24 bg-white">
        <div className="container-luxe">
          <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
            <div>
              <span className="eyebrow">Just Arrived</span>
              <h2 className="text-3xl md:text-5xl font-display mt-3 text-[color:var(--emerald-deep)]">
                New Arrivals
              </h2>
            </div>
            <Link to="/shop" className="text-sm underline underline-offset-4 hover:text-[color:var(--gold)]">
              View all
            </Link>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory -mx-5 px-5 [scrollbar-width:thin]">
            {newArrivals.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="min-w-[280px] md:min-w-[360px] snap-start"
              >
                <Link to="/product/$id" params={{ id: p.id }} className="group block">
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[color:var(--cream)]">
                    <img src={p.image} alt={p.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <span className="absolute top-4 left-4 bg-[color:var(--gold)] text-[color:var(--emerald-deep)] text-[10px] tracking-[0.24em] uppercase px-3 py-1 rounded-full font-semibold">
                      New
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--gold)]">{p.category}</span>
                      <h3 className="text-lg font-display mt-1">{p.name}</h3>
                    </div>
                    <span className="text-[color:var(--emerald-brand)] font-medium">{formatPrice(p.price)}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24 bg-[color:var(--emerald-deep)] text-[color:var(--cream)]">
        <div className="container-luxe">
          <div className="text-center max-w-2xl mx-auto">
            <span className="eyebrow">The ELME Bazaar Promise</span>
            <h2 className="text-3xl md:text-5xl font-display mt-3">Why Choose Us</h2>
            <div className="gold-divider" />
          </div>
          <div className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-8">
            {FEATURES.map(({ Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-full border border-[color:var(--gold)]/40 flex items-center justify-center text-[color:var(--gold)]">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="mt-5 text-lg font-display">{title}</h3>
                <p className="mt-2 text-sm text-[color:var(--cream)]/70 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-[color:var(--cream)]">
        <div className="container-luxe">
          <SectionHeading eyebrow="Kind Words" title="What Our Clients Say" />
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.blockquote
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-[var(--shadow-card)]"
              >
                <div className="flex text-[color:var(--gold)] gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, k) => <FaStar key={k} className="w-3.5 h-3.5" />)}
                </div>
                <p className="text-[color:var(--ink)] leading-relaxed font-display text-lg">
                  "{t.text}"
                </p>
                <footer className="mt-6 text-sm">
                  <span className="font-medium text-[color:var(--emerald-deep)]">{t.name}</span>
                  <span className="text-[color:var(--ink-soft)]"> · {t.role}</span>
                </footer>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* WHATSAPP CTA */}
      {/* WHATSAPP CTA */}
      <section className="py-24 bg-white">
        <div className="container-luxe">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-3xl bg-[color:var(--emerald-deep)] px-8 md:px-16 py-16 md:py-24"
          >
            <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[color:var(--gold)]/15 blur-3xl" />
            <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-[color:var(--emerald-brand)]/40 blur-3xl" />

            <div className="relative text-center max-w-2xl mx-auto text-[color:var(--cream)]">
              <span className="eyebrow">Order Directly</span>

              <h2 className="text-3xl md:text-5xl font-display mt-3">
                Need help choosing?
              </h2>

              <div className="gold-divider" />

              <p className="mt-4 text-[color:var(--cream)]/80 leading-relaxed">
                Our team can help with sizing, availability, and styling before you
                place your order online.
              </p>

              {settings?.whatsapp && (
                <a
                  href={generalWhatsAppUrl(
                    "Hello, I would like to know more about ELME Bazaar.",
                    settings.whatsapp
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold mt-8"
                >
                  <FaWhatsapp className="w-5 h-5" />
                  Chat with us on WhatsApp
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
