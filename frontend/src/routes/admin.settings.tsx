import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FiSave } from "react-icons/fi";
import { AdminShell, AdminCard } from "@/components/admin/AdminShell";
import { adminStore, useAdminState } from "@/store/adminStore";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
  head: () => ({
    meta: [
      { title: "Settings — ELME Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function SettingsPage() {
  const router = useRouter();
  const { settings } = useAdminState();
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const set = <K extends keyof typeof form>(
    k: K,
    v: (typeof form)[K]
  ) => {
    setForm((s) => ({ ...s, [k]: v }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await adminStore.updateSettings(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
      await router.navigate({ to: "/admin/dashboard" });
    } catch (error) {
      console.error("Failed to save settings", error);
      setSaved(false);
    }
  };

  return (
    <AdminShell title="Settings">
      <form
        onSubmit={submit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <AdminCard className="lg:col-span-2 p-6">
          <h2 className="font-display text-xl text-[color:var(--emerald-deep)] mb-6">
            Business Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Business Name"
              value={form.businessName}
              onChange={(v) => set("businessName", v)}
            />

            <Input
              label="WhatsApp Number"
              value={form.whatsapp}
              onChange={(v) => set("whatsapp", v)}
            />

            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(v) => set("email", v)}
            />

            <Input
              label="Address"
              value={form.address}
              onChange={(v) => set("address", v)}
            />

            <Input
              label="Facebook URL"
              value={form.facebook}
              onChange={(v) => set("facebook", v)}
            />

            <Input
              label="Instagram URL"
              value={form.instagram}
              onChange={(v) => set("instagram", v)}
            />

            <Input
              label="TikTok URL"
              value={form.tiktok}
              onChange={(v) => set("tiktok", v)}
            />
          </div>
        </AdminCard>

        <div className="space-y-6">
          <button
            type="submit"
            className="btn-primary w-full justify-center"
          >
            <FiSave /> Save Settings
          </button>

          {saved && (
            <p className="text-xs text-emerald-700 text-center">
              Settings saved.
            </p>
          )}
        </div>
      </form>
    </AdminShell>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--ink-soft)]">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full px-3 py-2.5 rounded-lg border border-border bg-white text-sm outline-none focus:border-[color:var(--emerald-brand)]"
      />
    </label>
  );
}