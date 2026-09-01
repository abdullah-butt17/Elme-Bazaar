import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FiRefreshCw, FiTrash2, FiX } from "react-icons/fi";
import { deleteOrder, getOrders, updateOrder, type ApiOrder } from "@/api/api";
import { AdminShell, AdminCard } from "@/components/admin/AdminShell";
import { formatPrice } from "@/lib/utils";

export const Route = createFileRoute("/admin/orders")({ component: Orders });
const nextStatuses: Record<ApiOrder["status"], ApiOrder["status"][]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

function Orders() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [selected, setSelected] = useState<ApiOrder | null>(null);
  const [trackingCode, setTrackingCode] = useState("");
  const [courierName, setCourierName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try { const response = await getOrders(); setOrders(response.data); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);

  const changeStatus = async (order: ApiOrder, status: ApiOrder["status"]) => {
    if (status === order.status) return;
    setError("");
    try {
      const response = await updateOrder(order._id, status, trackingCode.trim() || order.trackingCode, courierName.trim() || order.courierName);
      setOrders((current) => current.map((item) => item._id === order._id ? response.data : item));
      setSelected(response.data);
      setTrackingCode(response.data.trackingCode || "");
      setCourierName(response.data.courierName || "");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not update order status.");
    }
  };

  const removeOrder = async () => {
    if (!selected || !["cancelled", "delivered"].includes(selected.status)) return;
    if (!window.confirm(`Permanently delete order ${selected._id.slice(-8)}? This cannot be undone.`)) return;

    setDeleting(true);
    setError("");
    try {
      await deleteOrder(selected._id);
      setOrders((current) => current.filter((order) => order._id !== selected._id));
      setSelected(null);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not delete order.");
    } finally {
      setDeleting(false);
    }
  };

  return <AdminShell title="Orders">
    <div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-[0.2em] text-[color:var(--ink-soft)]">Storefront activity</p><h2 className="mt-1 text-3xl font-display">Orders</h2></div><button onClick={() => void load()} className="btn-outline !text-[color:var(--ink)] !border-border"><FiRefreshCw /> Refresh</button></div>
    {error && <p className="mt-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
    <AdminCard className="mt-6 overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-[color:var(--surface)] text-xs uppercase tracking-[0.15em] text-[color:var(--ink-soft)]"><tr><th className="p-4">Order</th><th className="p-4">Customer</th><th className="p-4">Phone</th><th className="p-4">Total</th><th className="p-4">Status</th><th className="p-4">Date</th></tr></thead><tbody className="divide-y divide-border">{loading ? <tr><td className="p-6" colSpan={6}>Loading orders...</td></tr> : orders.map((order) => <tr key={order._id} onClick={() => { setSelected(order); setTrackingCode(order.trackingCode || ""); setCourierName(order.courierName || ""); }} className="cursor-pointer hover:bg-[color:var(--surface)]"><td className="p-4 font-mono text-xs">{order._id.slice(-8)}</td><td className="p-4">{order.customer.name}</td><td className="p-4">{order.customer.phone}</td><td className="p-4">{formatPrice(order.total)}</td><td className="p-4"><select value={order.status} disabled={nextStatuses[order.status].length === 0} onClick={(event) => event.stopPropagation()} onChange={(event) => void changeStatus(order, event.target.value as ApiOrder["status"])} className="border border-border bg-background px-2 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-60"><option value={order.status}>{order.status}</option>{nextStatuses[order.status].map((status) => <option key={status}>{status}</option>)}</select></td><td className="p-4 text-xs text-[color:var(--ink-soft)]">{new Date(order.createdAt).toLocaleDateString()}</td></tr>)}</tbody></table></div>{!loading && !orders.length && <p className="p-10 text-center text-sm text-[color:var(--ink-soft)]">No orders yet.</p>}</AdminCard>
    {selected && <AdminCard className="mt-6 p-6 md:p-8"><div className="flex items-start justify-between gap-4 border-b border-border pb-5"><div><p className="eyebrow">Order details</p><h3 className="mt-1 font-display text-2xl">{selected.customer.name}</h3><p className="text-sm text-[color:var(--ink-soft)]">Order #{selected._id.slice(-8)} · {new Date(selected.createdAt).toLocaleString()}</p></div><button aria-label="Close order details" title="Close" className="rounded-full p-2 text-[color:var(--ink-soft)] transition hover:bg-[color:var(--surface)]" onClick={() => setSelected(null)}><FiX /></button></div><div className="mt-6 grid gap-6 md:grid-cols-[1fr_1fr_auto]"><div><p className="text-xs uppercase tracking-[0.16em] text-[color:var(--ink-soft)]">Customer</p><p className="mt-2 text-sm">{selected.customer.email}</p><p className="mt-1 text-sm">{selected.customer.phone}</p></div><div><p className="text-xs uppercase tracking-[0.16em] text-[color:var(--ink-soft)]">Delivery address</p><p className="mt-2 text-sm">{selected.customer.address}</p><p className="mt-1 text-sm">{selected.customer.city}, {selected.customer.postalCode}</p></div><div><p className="text-xs uppercase tracking-[0.16em] text-[color:var(--ink-soft)]">Order total</p><p className="mt-2 font-display text-2xl">{formatPrice(selected.total)}</p></div></div><div className="mt-8"><div className="flex items-center justify-between gap-3"><h4 className="font-display text-xl">Articles</h4><span className="text-sm text-[color:var(--ink-soft)]">{selected.items.reduce((total, item) => total + item.quantity, 0)} items</span></div><div className="mt-3 divide-y divide-border border-y border-border">{selected.items.map((item) => <div key={`${item.productId}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-4 py-4"><img src={item.image} alt="" className="h-16 w-16 rounded-lg object-cover" /><div className="min-w-0 flex-1"><p className="font-medium">{item.productName}</p><p className="mt-1 text-xs text-[color:var(--ink-soft)]">Article · {item.productId}</p><p className="mt-1 text-xs text-[color:var(--ink-soft)]">Qty: {item.quantity}{item.selectedSize ? ` · Size: ${item.selectedSize}` : ""}{item.selectedColor ? ` · Color: ${item.selectedColor}` : ""}</p></div><p className="text-sm font-medium">{formatPrice(item.subtotal)}</p></div>)}</div></div><div className="mt-7 grid gap-4 md:grid-cols-2"><label className="block text-xs uppercase tracking-[0.18em] text-[color:var(--ink-soft)]">Courier company<input disabled={["shipped", "delivered", "cancelled"].includes(selected.status)} value={courierName} onChange={(event) => setCourierName(event.target.value)} placeholder="e.g. TCS, Leopards, M&P" className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-[color:var(--ink)] disabled:cursor-not-allowed disabled:opacity-60" /></label><label className="block text-xs uppercase tracking-[0.18em] text-[color:var(--ink-soft)]">Tracking number<input disabled={["shipped", "delivered", "cancelled"].includes(selected.status)} value={trackingCode} onChange={(event) => setTrackingCode(event.target.value)} placeholder="Enter before shipping" className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-[color:var(--ink)] disabled:cursor-not-allowed disabled:opacity-60" /></label></div><div className="mt-4 text-sm md:text-right"><p className="text-[color:var(--ink-soft)]">Status</p><p className="mt-1 font-medium capitalize">{selected.status}</p></div><p className="mt-2 text-xs text-[color:var(--ink-soft)]">{["shipped", "delivered", "cancelled"].includes(selected.status) ? "This order is locked and cannot be edited." : "Add courier details before selecting Shipped. The customer will receive tracking information only after dispatch."}</p>{["cancelled", "delivered"].includes(selected.status) && <button type="button" disabled={deleting} onClick={() => void removeOrder()} className="mt-5 inline-flex items-center gap-2 border border-red-200 px-4 py-2.5 text-sm text-red-700 transition hover:bg-red-50 disabled:opacity-60"><FiTrash2 />{deleting ? "Deleting..." : "Delete order"}</button>}</AdminCard>}
  </AdminShell>;
}
