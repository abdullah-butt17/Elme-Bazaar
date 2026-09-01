import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { FiArrowLeft, FiCheck } from "react-icons/fi";
import { createOrder } from "@/api/api";
import { useAdminState } from "@/store/adminStore";
import { cartStore, cartSubtotal, useCart } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({ component: CheckoutPage, head: () => ({ meta: [{ title: "Checkout — ELME Bazaar" }] }) });

type Form = { name: string; email: string; phone: string; address: string; city: string; postalCode: string };
const initialForm: Form = { name: "", email: "", phone: "", address: "", city: "", postalCode: "" };

function CheckoutPage() {
  const router = useRouter();
  const { items } = useCart();
  const { settings } = useAdminState();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const subtotal = cartSubtotal(items);
  const delivery = settings.deliveryCharges ?? 0;
  const update = (key: keyof Form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  if (!items.length) return <div className="container-luxe py-24 text-center"><h1 className="text-3xl font-display">Your cart is empty</h1><Link to="/shop" className="btn-primary mt-7">Continue Shopping</Link></div>;
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setError("");
    if (Object.values(form).some((value) => !value.trim())) { setError("Please complete every delivery field."); return; }
    setLoading(true);
    try {
      const response = await createOrder({ customer: form, items: items.map((item) => ({ productId: item.productId, quantity: item.quantity, selectedSize: item.selectedSize, selectedColor: item.selectedColor })) });
      cartStore.clear();
      router.navigate({ to: "/order-confirmation", search: { id: response.data.orderReference || response.data._id } as never });
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "We could not place your order. Please try again."); setLoading(false); }
  };
  return <div className="container-luxe py-12 md:py-20"><Link to="/cart" className="inline-flex items-center gap-2 text-sm text-[color:var(--ink-soft)]"><FiArrowLeft /> Back to cart</Link><div className="mt-8 grid gap-12 lg:grid-cols-[1fr_360px]"><form onSubmit={submit} className="max-w-2xl"><p className="eyebrow">Almost yours</p><h1 className="mt-2 text-4xl font-display">Checkout</h1><div className="mt-8 grid gap-5 sm:grid-cols-2">{([['name','Full Name'],['email','Email'],['phone','Phone Number'],['city','City'],['postalCode','Postal Code']] as [keyof Form,string][]).map(([key,label]) => <label key={key} className={key === 'name' || key === 'email' ? 'sm:col-span-1' : ''}><span className="text-xs uppercase tracking-[0.18em] text-[color:var(--ink-soft)]">{label}</span><input required type={key === 'email' ? 'email' : 'text'} value={form[key]} onChange={(event) => update(key, event.target.value)} className="mt-2 w-full border border-border bg-white px-4 py-3 outline-none focus:border-[color:var(--ink)]" /></label>)}<label className="sm:col-span-2"><span className="text-xs uppercase tracking-[0.18em] text-[color:var(--ink-soft)]">Delivery Address</span><textarea required value={form.address} onChange={(event) => update('address', event.target.value)} rows={4} className="mt-2 w-full resize-none border border-border bg-white px-4 py-3 outline-none focus:border-[color:var(--ink)]" /></label></div>{error && <p className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}<button disabled={loading} className="btn-primary mt-7 w-full sm:w-auto disabled:opacity-60">{loading ? 'Placing Order...' : <>Place Order <FiCheck /></>}</button></form><aside className="h-fit border border-border bg-white p-6"><h2 className="font-display text-2xl">Your order</h2><div className="mt-5 space-y-4">{items.map((item) => <div key={item.lineId} className="flex justify-between gap-3 text-sm"><span>{item.product.name} <span className="text-[color:var(--ink-soft)]">× {item.quantity}</span></span><strong>{formatPrice((item.product.salePrice ?? item.product.price) * item.quantity)}</strong></div>)}</div><div className="mt-6 space-y-3 border-t border-border pt-5 text-sm"><div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div><div className="flex justify-between"><span>Delivery</span><span>{delivery ? formatPrice(delivery) : 'Free'}</span></div><div className="flex justify-between border-t border-border pt-4 text-base font-semibold"><span>Total</span><span>{formatPrice(subtotal + delivery)}</span></div></div></aside></div></div>;
}
