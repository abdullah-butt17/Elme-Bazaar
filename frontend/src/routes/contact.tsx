import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebook,
  FaPinterest,
} from "react-icons/fa";
import { FiMapPin, FiPhone, FiMail, FiClock } from "react-icons/fi";

import { SectionHeading } from "@/components/SectionHeading";
import { generalWhatsAppUrl } from "@/lib/whatsapp";
import { useAdminState } from "@/store/adminStore";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "Contact — ELME Bazaar" },
      {
        name: "description",
        content:
          "Reach out to ELME Bazaar for orders and inquiries on ELME Bazaar men's wear or BR Collection women's unstitched suits.",
      },
      { property: "og:title", content: "Contact ELME Bazaar" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
});

function Contact() {
  const { settings } = useAdminState();

  const whatsappNumber = settings?.whatsapp || "";
  const whatsappUrl = whatsappNumber
    ? generalWhatsAppUrl(
        "Hello, I would like to know more about ELME Bazaar.",
        whatsappNumber
      )
    : "";
  const contactPhone = whatsappNumber || "+92 300 0000000";

  return (
    <div>
      <section className="bg-[color:var(--cream)] py-20">
        <div className="container-luxe">
          <SectionHeading
            eyebrow="Say Hello"
            title="Get in Touch"
            subtitle="Whether you're placing an order or dreaming up a custom piece, we'd love to hear from you."
          />
        </div>
      </section>

      <section className="container-luxe py-16 grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="rounded-[2rem] border border-border bg-white p-8 md:p-10 shadow-[var(--shadow-card)]"
        >
          <span className="eyebrow">Preferred Contact</span>

          <h2 className="mt-3 text-3xl md:text-4xl font-display text-[color:var(--emerald-deep)]">
            Let’s talk about your next custom piece.
          </h2>

          <p className="mt-4 text-[color:var(--ink-soft)] leading-relaxed max-w-2xl">
            Whether you are placing a bespoke order, asking for styling advice,
            or simply want to know more about our process, our team is happy to
            help.
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-[color:var(--gold)]/25 bg-[color:var(--cream)] p-5 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center gap-3 text-[color:var(--emerald-deep)] font-semibold">
                  <FaWhatsapp className="text-[color:var(--gold)]" />
                  WhatsApp Support
                </div>

                <p className="mt-2 text-sm text-[color:var(--ink-soft)]">
                  Fast replies for orders, styling, and availability.
                </p>
              </a>
            )}

            <a
              href={`mailto:${settings?.email || "hello@elmebazaar.com"}`}
              className="rounded-2xl border border-border p-5 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center gap-3 text-[color:var(--emerald-deep)] font-semibold">
                <FiMail className="text-[color:var(--gold)]" />
                Email Us
              </div>

              <p className="mt-2 text-sm text-[color:var(--ink-soft)]">
                {settings?.email || "hello@elmebazaar.com"}
              </p>
            </a>
          </div>

          <div className="mt-8 rounded-2xl bg-[color:var(--emerald-deep)] text-[color:var(--cream)] p-6 md:p-8">
            <div className="flex items-center gap-3 text-[color:var(--gold)] font-semibold uppercase tracking-[0.24em] text-xs">
              <FiClock />
              Business Hours
            </div>

            <p className="mt-3 text-lg">Mon–Sat · 10:00 AM – 8:00 PM</p>

            <p className="mt-2 text-sm text-[color:var(--cream)]/80">
              We reply to messages and custom requests as quickly as possible.
            </p>
          </div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="space-y-6"
        >
          <div className="rounded-[2rem] bg-[color:var(--cream)] border border-border p-7 md:p-8">
            <h3 className="text-2xl font-display text-[color:var(--emerald-deep)]">
              Contact Details
            </h3>

            <div className="w-10 h-px bg-[color:var(--gold)] my-4" />

            <ul className="space-y-4 text-sm text-[color:var(--ink-soft)]">
              <li className="flex gap-3">
                <FiMapPin className="w-4 h-4 text-[color:var(--gold)] mt-1" />
                {settings?.address || "Lahore, Pakistan"}
              </li>

              <li className="flex gap-3">
                <FiPhone className="w-4 h-4 text-[color:var(--gold)] mt-1" />
                {settings?.whatsapp || "+92 300 0000000"}
              </li>

              <li className="flex gap-3">
                <FaWhatsapp className="w-4 h-4 text-[color:var(--gold)] mt-1" />
                WhatsApp:{" "}
                {settings?.whatsapp || "+92 300 0000000"}
              </li>

              <li className="flex gap-3">
                <FiMail className="w-4 h-4 text-[color:var(--gold)] mt-1" />
                {settings?.email || "hello@elmebazaar.com"}
              </li>
            </ul>
          </div>

          <div className="rounded-[2rem] border border-border bg-white p-7 md:p-8">
            <h3 className="text-xl font-display text-[color:var(--emerald-deep)]">
              Follow Along
            </h3>

            <p className="mt-2 text-sm text-[color:var(--ink-soft)]">
              Stay updated with new collections, launches, and behind-the-scenes
              moments.
            </p>

            <div className="mt-5 flex gap-3">
              {[
                {
                  Icon: FaInstagram,
                  href: settings?.instagram,
                },
                {
                  Icon: FaFacebook,
                  href: settings?.facebook,
                },
                {
                  Icon: FaPinterest,
                  href: settings?.tiktok,
                },
              ]
                .filter((item) => item.href)
                .map(({ Icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-full border border-border flex items-center justify-center text-[color:var(--emerald-deep)] hover:bg-[color:var(--gold)] hover:text-[color:var(--emerald-deep)] transition-all"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
            </div>
          </div>

          <div className="rounded-[2rem] overflow-hidden border border-border aspect-[4/3] bg-[color:var(--cream)] relative">
            <iframe
              title="ELME Bazaar location"
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d211.1383724978651!2d74.16296046700589!3d32.144524181838555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzLCsDA4JzQwLjAiTiA3NMKwMDknNDYuOCJF!5e0!3m2!1sen!2s!4v1788261601335!5m2!1sen!2s"
              className="w-full h-full grayscale"
              loading="lazy"
            />
          </div>
        </motion.aside>
      </section>
    </div>
  );
}
