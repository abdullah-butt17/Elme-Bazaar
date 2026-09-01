import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FiCheck, FiSearch } from "react-icons/fi";
import { trackOrder, type ApiOrder } from "@/api/api";
import { formatPrice } from "@/lib/utils";

export const Route = createFileRoute("/tracking")({ component: TrackingPage, head: () => ({ meta: [{ title: "Track Order — ELME Bazaar" }] }) });

const statuses: ApiOrder["status"][] = ["pending", "confirmed", "processing", "shipped", "delivered"];

function TrackingPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await trackOrder(orderId.trim(), email.trim());
      setOrder(response.data);
    } catch (requestError) {
      setOrder(null);
      setError(requestError instanceof Error ? requestError.message : "We could not find that order.");
    } finally {
      setLoading(false);
    }
  };

  const currentIndex = order ? statuses.indexOf(order.status) : -1;
  const displayReference = order?.orderReference || order?._id;

  return (
    <div className="container-luxe py-16 md:py-24">
      <div className="mx-auto max-w-2xl">
        <p className="eyebrow">Order care</p>
        <h1 className="mt-2 text-4xl font-display md:text-5xl">Track your order</h1>
        <p className="mt-4 max-w-lg text-sm leading-6 text-[color:var(--ink-soft)]">Enter your short order reference and the email address used at checkout.</p>
        <form onSubmit={submit} className="mt-8 grid gap-4 border border-border bg-white p-6 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <label className="text-xs uppercase tracking-[0.16em] text-[color:var(--ink-soft)]">Order reference<input required value={orderId} onChange={(event) => setOrderId(event.target.value)} placeholder="e.g. 7KQ4M9X2PA" className="mt-2 w-full border border-border px-3 py-3 text-sm uppercase tracking-normal outline-none focus:border-[color:var(--ink)]" /></label>
          <label className="text-xs uppercase tracking-[0.16em] text-[color:var(--ink-soft)]">Checkout email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="mt-2 w-full border border-border px-3 py-3 text-sm normal-case tracking-normal outline-none focus:border-[color:var(--ink)]" /></label>
          <button disabled={loading} className="btn-primary h-[46px] justify-center disabled:opacity-60"><FiSearch />{loading ? "Searching" : "Track"}</button>
        </form>
        {error && <p className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {order && <div className="mt-10 border border-border bg-white p-6 md:p-8"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.16em] text-[color:var(--ink-soft)]">Order #{displayReference}</p><h2 className="mt-2 font-display text-3xl">{order.status === "cancelled" ? "Order cancelled" : `Order ${order.status}`}</h2></div><p className="font-display text-2xl">{formatPrice(order.total)}</p></div>{order.status === "cancelled" ? <p className="mt-8 border border-red-200 bg-red-50 p-4 text-sm text-red-700">Please contact us if you need help with this order.</p> : <div className="mt-10 grid gap-5 sm:grid-cols-5">{statuses.map((status, index) => <div key={status} className="relative"><div className={`flex h-10 w-10 items-center justify-center border ${index <= currentIndex ? "border-[color:var(--ink)] bg-[color:var(--ink)] text-white" : "border-border text-[color:var(--ink-soft)]"}`}>{index <= currentIndex ? <FiCheck /> : index + 1}</div><p className={`mt-3 text-xs capitalize ${index <= currentIndex ? "font-semibold text-[color:var(--ink)]" : "text-[color:var(--ink-soft)]"}`}>{status}</p></div>)}</div>}{order.status === "shipped" && order.trackingCode && <div className="mt-8 border-t border-border pt-6"><p className="text-xs uppercase tracking-[0.16em] text-[color:var(--ink-soft)]">Shipment tracking</p><p className="mt-2 text-sm text-[color:var(--ink-soft)]">Courier company: <strong className="text-[color:var(--ink)]">{order.courierName || "Courier"}</strong></p><p className="mt-2 font-mono text-xl tracking-wider">{order.trackingCode}</p></div>}<div className="mt-8 border-t border-border pt-6 text-sm leading-6 text-[color:var(--ink-soft)]">Delivering to {order.customer.address}, {order.customer.city}, {order.customer.postalCode}</div></div>}
      </div>
    </div>
  );
}
