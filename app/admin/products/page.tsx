import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { deleteProduct } from "@/lib/actions/products";

export default function AdminProductsPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Products</h1>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-medium hover:bg-purple-800"
        >
          + New Product
        </Link>
      </div>

      <div className="mt-6 bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <Suspense fallback={<p className="p-6 text-zinc-400 text-center">Loading...</p>}>
          <ProductList />
        </Suspense>
      </div>
    </div>
  );
}

async function ProductList() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  if (products.length === 0) {
    return <p className="p-6 text-zinc-400 text-center">No products yet.</p>;
  }

  return (
    <table className="w-full text-sm">
      <thead className="bg-zinc-50 border-b border-zinc-200">
        <tr>
          <th className="text-left px-4 py-3 font-medium text-zinc-600">Title</th>
          <th className="text-left px-4 py-3 font-medium text-zinc-600">Category</th>
          <th className="text-left px-4 py-3 font-medium text-zinc-600">Status</th>
          <th className="text-right px-4 py-3 font-medium text-zinc-600">Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.id} className="border-b border-zinc-100 last:border-0">
            <td className="px-4 py-3">{p.title}</td>
            <td className="px-4 py-3 capitalize">{p.category}</td>
            <td className="px-4 py-3">
              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                p.published ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-500"
              }`}>
                {p.published ? "Published" : "Draft"}
              </span>
            </td>
            <td className="px-4 py-3 text-right">
              <Link
                href={`/admin/products/${p.id}`}
                className="text-purple-700 hover:text-purple-800 mr-3"
              >
                Edit
              </Link>
              <form
                action={deleteProduct.bind(null, p.id)}
                className="inline"
                onSubmit={(e) => {
                  if (!confirm("Delete this product?")) e.preventDefault();
                }}
              >
                <button type="submit" className="text-red-500 hover:text-red-600">
                  Delete
                </button>
              </form>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
