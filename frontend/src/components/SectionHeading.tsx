import { motion } from "framer-motion";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className={align === "center" ? "text-center max-w-2xl mx-auto" : "max-w-2xl"}
    >
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="text-3xl md:text-5xl font-display mt-3 text-[color:var(--emerald-deep)]">
        {title}
      </h2>
      {align === "center" && <div className="gold-divider" />}
      {subtitle && (
        <p className="text-[color:var(--ink-soft)] leading-relaxed mt-3">{subtitle}</p>
      )}
    </motion.div>
  );
}
