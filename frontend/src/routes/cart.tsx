import { createFileRoute, Link } from "@tanstack/react-router";
import { FiMinus, FiPlus, FiTrash2, FiArrowRight } from "react-icons/fi";
import { useCart, cartSubtotal, cartCount, cartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";

export const Route = createFileRoute("/cart")({ component: CartPage, head: () => ({ meta: [{ title: "Cart — ELME Bazaar" }] }) });

function CartPage() {
  const { items } = useCart();
  const subtotal = cartSubtotal(items);
  return <div className="container-luxe py-12 md:py-20">
    <div className="flex items-end justify-between border-b border-border pb-6"><div><p className="eyebrow">Your selection</p><h1 className="mt-2 text-4xl font-display">Shopping cart</h1></div><span className="text-sm text-[color:var(--ink-soft)]">{cartCount(items)} item{cartCount(items) === 1 ? "" : "s"}</span></div>
    {items.length === 0 ? <div className="py-24 text-center"><h2 className="text-3xl font-display">Your cart is empty</h2><p className="mt-3 text-sm text-[color:var(--ink-soft)]">Find something considered for your next look.</p><Link to="/shop" className="btn-primary mt-7">Continue Shopping <FiArrowRight /></Link></div> : <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
      <div className="divide-y divide-border">{items.map((item) => { const price = item.product.salePrice ?? item.product.price; return <article key={item.lineId} className="flex gap-4 py-5 first:pt-0"><img src={item.product.image} alt={item.product.name} className="h-32 w-24 object-cover bg-[color:var(--surface)]" /><div className="min-w-0 flex-1"><div className="flex justify-between gap-3"><div><h2 className="font-display text-xl">{item.product.name}</h2><p className="mt-1 text-xs text-[color:var(--ink-soft)]">{item.selectedSize && `Size: ${item.selectedSize}`} {item.selectedColor && ` · Color: ${item.selectedColor}`}</p></div><strong className="text-sm">{formatPrice(price * item.quantity)}</strong></div><div className="mt-6 flex items-center justify-between"><div className="inline-flex items-center border border-border"><button aria-label="Decrease quantity" className="p-2" onClick={() => cartStore.update(item.lineId, item.quantity - 1)}><FiMinus /></button><span className="w-8 text-center text-sm">{item.quantity}</span><button aria-label="Increase quantity" className="p-2" onClick={() => cartStore.update(item.lineId, item.quantity + 1)}><FiPlus /></button></div><button onClick={() => cartStore.remove(item.lineId)} className="inline-flex items-center gap-1 text-xs text-[color:var(--ink-soft)] hover:text-red-700"><FiTrash2 /> Remove</button></div></div></article>; })}</div>
      <aside className="h-fit border border-border bg-white p-6"><h2 className="font-display text-2xl">Order summary</h2><div className="mt-6 flex justify-between border-t border-border pt-4 text-sm"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div><p className="mt-3 text-xs text-[color:var(--ink-soft)]">Delivery charges are calculated at checkout.</p><Link to="/checkout" className="btn-primary mt-7 w-full">Proceed to Checkout <FiArrowRight /></Link><Link to="/shop" className="btn-outline !text-[color:var(--ink)] !border-border mt-3 w-full">Continue Shopping</Link></aside>
    </div>}
  </div>;
}
