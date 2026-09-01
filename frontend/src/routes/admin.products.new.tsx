import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";

export const Route = createFileRoute("/admin/products/new")({
  component: NewProduct,
  head: () => ({
    meta: [
      { title: "Add Product — ELME Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function NewProduct() {
  return (
    <AdminShell title="Add Product">
      <ProductForm mode="new" />
    </AdminShell>
  );
}