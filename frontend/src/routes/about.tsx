import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { SectionHeading } from "@/components/SectionHeading";
import { generalWhatsAppUrl } from "@/lib/whatsapp";
import { useAdminState } from "@/store/adminStore";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "About — ELME Bazaar" },
      { name: "description", content: "The story behind ELME Bazaar and BR Collection: two family fashion brands, one home for men's and women's style." },
      { property: "og:title", content: "About ELME Bazaar" },
      { property: "og:description", content: "Two brands, one store — ELME Bazaar for men, BR Collection for women." },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
});

const TIMELINE = [
  { year: "The Origin", title: "Two family businesses", text: "ELME Bazaar and BR Collection began as separate family ventures — one in men's fashion, one in women's unstitched suits." },
  { year: "The Craft", title: "Quality first", text: "Every piece is chosen and finished with an eye for fabric, fit, and finish, so customers keep coming back." },
  { year: "The Store", title: "Joining forces", text: "We brought both brands together under one store, so shoppers can find fashion for the whole family in one place." },
  { year: "Today", title: "Made for you", text: "From everyday shirts to festive unstitched suits, every order is packed with care and shipped across Pakistan." },
];

const VALUES = [
  { title: "Mission", text: "To make quality men's and women's fashion easy to find, order, and trust — all in one store." },
  { title: "Vision", text: "One home for ELME Bazaar and BR Collection, where every customer finds their style." },
  { title: "Values", text: "Quality over hype. Fair pricing. Real customer service." },
];

function About() {
  const { settings } = useAdminState();
  const whatsappNumber = settings?.whatsapp;

  return (
    <div>
      {/* Hero */}
      <section className="relative py-32 overflow-hidden bg-[color:var(--emerald-deep)] text-[color:var(--cream)]">
        <div className="absolute inset-0 opacity-25">
          <img
            src="https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?auto=format&fit=crop&w=2000&q=80"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        <div className="container-luxe relative text-center max-w-3xl mx-auto">
          <motion.span initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="eyebrow">Our Story</motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-4 text-5xl md:text-7xl font-display"
          >
            Fashion, <br /> made for <em className="text-[color:var(--gold)] not-italic">him & her.</em>
          </motion.h1>
          <div className="gold-divider" />
          <p className="mt-6 text-[color:var(--cream)]/80 text-lg leading-relaxed">
            ELME Bazaar is a men's fashion brand, and BR Collection is a women's unstitched-suit brand — brought together under one store so every customer finds their style in one place.
          </p>
        </div>
      </section>

      {/* Story with image */}
      <section className="container-luxe py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="aspect-[4/5] rounded-2xl overflow-hidden"
        >
          <img
            src="https://res.cloudinary.com/ntx8ixhh/image/upload/v1784817814/images_jimpgw.jpg"
            alt="Artisan working on handmade clothing"
            className="h-full w-full object-cover"
          />
        </motion.div>
        <div>
          <span className="eyebrow">The Store</span>
          <h2 className="text-3xl md:text-5xl font-display mt-3 text-[color:var(--emerald-deep)]">
            Two brands, one destination
          </h2>
          <div className="mt-6 space-y-4 text-[color:var(--ink-soft)] leading-relaxed">
            <p>ELME Bazaar brings men's shirts, polos, and casual and formal wear. BR Collection brings women's unstitched suits in lawn and cotton — 2 and 3 piece.</p>
            <p>We work directly with fabric suppliers and stitching partners to keep quality consistent and prices fair, so every order — for him or for her — feels considered.</p>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-6">
            {[{n:"2", l:"Brands, 1 store"},{n:"100%", l:"Quality checked"},{n:"PK", l:"Nationwide delivery"}].map((s) => (
              <div key={s.l}>
                <div className="text-3xl font-display text-[color:var(--emerald-brand)]">{s.n}</div>
                <div className="text-xs uppercase tracking-[0.24em] text-[color:var(--ink-soft)] mt-2">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[color:var(--cream)] py-24">
        <div className="container-luxe">
          <SectionHeading eyebrow="What We Stand For" title="Mission · Vision · Values" />
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-white rounded-2xl p-10 shadow-[var(--shadow-card)]"
              >
                <h3 className="text-2xl font-display text-[color:var(--emerald-deep)]">{v.title}</h3>
                <div className="w-10 h-px bg-[color:var(--gold)] my-4" />
                <p className="text-[color:var(--ink-soft)] leading-relaxed">{v.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="container-luxe py-24">
        <SectionHeading eyebrow="Our Journey" title="A Handmade Tradition" />
        <div className="mt-16 relative max-w-3xl mx-auto">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-[color:var(--gold)]/40" />
          <div className="space-y-14">
            {TIMELINE.map((t, i) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="relative pl-14 md:pl-0 md:grid md:grid-cols-2 md:gap-14 md:items-center"
              >
                {i % 2 === 0 ? (
                  <>
                    {/* Right side text */}
                    <div className="md:col-start-2 md:text-left">
                      <span className="eyebrow">{t.year}</span>
                      <h3 className="text-2xl font-display mt-2 text-[color:var(--emerald-deep)]">
                        {t.title}
                      </h3>
                      <p className="text-[color:var(--ink-soft)] mt-2 leading-relaxed">
                        {t.text}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Left side text */}
                    <div className="md:col-start-1 md:text-right">
                      <span className="eyebrow">{t.year}</span>
                      <h3 className="text-2xl font-display mt-2 text-[color:var(--emerald-deep)]">
                        {t.title}
                      </h3>
                      <p className="text-[color:var(--ink-soft)] mt-2 leading-relaxed">
                        {t.text}
                      </p>
                    </div>
                  </>
                )}

                {/* Center dot */}
                <span className="absolute left-4 md:left-1/2 top-2 w-3 h-3 rounded-full bg-[color:var(--gold)] -translate-x-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {/* CTA */}
      <section className="container-luxe pb-24">
        <div className="rounded-3xl bg-[color:var(--emerald-deep)] text-[color:var(--cream)] px-8 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-display">
            Ready to find your piece?
          </h2>

          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <Link to="/shop" className="btn-gold">
              Explore the Collection
            </Link>

            {settings?.whatsapp && (
              <a
                href={generalWhatsAppUrl(
                  "Hello, I would like to know more about ELME Bazaar.",
                  settings.whatsapp
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                <FaWhatsapp />
                WhatsApp Us
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
