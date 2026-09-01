import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";
import { useAdminState } from "@/store/adminStore";

export const Route = createFileRoute("/admin/products/$id/edit")({
  component: EditProduct,
  head: () => ({
    meta: [
      { title: "Edit Product — ELME Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function EditProduct() {
  const { id } = Route.useParams();
  const { products } = useAdminState();
  const product = products.find((p) => p.id === id);

  return (
    <AdminShell title="Edit Product">
      {product ? (
        <ProductForm mode="edit" initial={product} />
      ) : (
        <div className="text-center py-24">
          <p className="text-[color:var(--ink-soft)]">
            Product not found.
          </p>

          <Link
            to="/admin/products"
            className="btn-primary mt-6 inline-flex"
          >
            Back to products
          </Link>
        </div>
      )}
    </AdminShell>
  );
}