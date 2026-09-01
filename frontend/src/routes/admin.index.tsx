import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { adminStore, useAdminState } from "@/store/adminStore";

export const Route = createFileRoute("/admin/")({
  component: AdminLogin,
  head: () => ({
    meta: [
      { title: "Admin Login — ELME Bazaar" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});

function AdminLogin() {
  const router = useRouter();
  const { authed } = useAdminState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authed) router.navigate({ to: "/admin/dashboard" });
  }, [authed, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await adminStore.login(email, password);
      router.navigate({ to: "/admin/dashboard" });
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[color:var(--cream)]">
      {/* Brand panel */}
      <div className="hidden lg:flex flex-col justify-between bg-[color:var(--emerald-deep)] text-[color:var(--cream)] p-12 relative overflow-hidden">
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-[color:var(--gold)]/15 blur-3xl" />
        <div className="absolute -left-24 -bottom-24 w-96 h-96 rounded-full bg-[color:var(--emerald-brand)]/40 blur-3xl" />
        <div className="relative">
          <span className="text-3xl font-display text-[color:var(--gold)]">ELME Bazaar</span>
          <p className="mt-2 text-xs uppercase tracking-[0.32em] opacity-70">Admin Portal</p>
        </div>
        <div className="relative">
          <h2 className="text-4xl xl:text-5xl font-display leading-tight">
            Manage your atelier with <em className="text-[color:var(--gold)] not-italic">grace</em>.
          </h2>
          <p className="mt-6 max-w-md opacity-80 leading-relaxed">
            Publish new pieces, curate collections, and steward every detail of the ELME Bazaar storefront from one refined dashboard.
          </p>
        </div>
        <div className="relative text-xs opacity-60">© {new Date().getFullYear()} ELME Bazaar · Private Access</div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 md:p-12">
        <motion.form
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          onSubmit={submit}
          className="w-full max-w-md bg-white rounded-3xl shadow-[var(--shadow-luxe)] p-8 md:p-10 border border-border"
        >
          <div className="text-center">
            <span className="eyebrow">Welcome Back</span>
            <h1 className="mt-2 text-3xl font-display text-[color:var(--emerald-deep)]">Sign in to admin</h1>
            <div className="gold-divider" />
          </div>

          <label className="block mt-6">
            <span className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink-soft)]">Email</span>
            <div className="relative mt-2">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--ink-soft)]" />
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-[color:var(--cream)]/40 outline-none focus:border-[color:var(--emerald-brand)]"
              />
            </div>
          </label>

          <label className="block mt-4">
            <span className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink-soft)]">Password</span>
            <div className="relative mt-2">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--ink-soft)]" />
              <input
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-[color:var(--cream)]/40 outline-none focus:border-[color:var(--emerald-brand)]"
              />
            </div>
          </label>

          <div className="flex items-center justify-between mt-4 text-xs">
            <label className="flex items-center gap-2 text-[color:var(--ink-soft)]">
              <input type="checkbox" className="accent-[color:var(--emerald-brand)]" /> Remember me
            </label>
            <button type="button" className="text-[color:var(--emerald-brand)] hover:underline">
              Forgot password?
            </button>
          </div>

          <button
            type="submit" disabled={loading}
            className="btn-primary w-full justify-center mt-8 disabled:opacity-70"
          >
            {loading ? "Signing in…" : (<>Sign In <FiArrowRight /></>)}
          </button>

          <p className="mt-6 text-[11px] text-center text-[color:var(--ink-soft)]">
            Demo mode — any credentials will sign you in.
          </p>
        </motion.form>
      </div>
    </div>
  );
}
