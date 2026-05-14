import { createProduct, updateProduct } from "@/lib/actions/products";

type ProductData = {
  id?: string;
  title: string;
  description: string;
  category: string;
  images: string;
  features: string;
  materials: string | null;
  sizes: string | null;
  minOrder: string;
  priceRange: string | null;
  leadTime: string;
  seoTitle: string | null;
  seoDescription: string | null;
  published: boolean;
};

export default function ProductForm({ product }: { product?: ProductData }) {
  const action = product
    ? updateProduct.bind(null, product.id!)
    : createProduct;

  return (
    <form action={action} className="max-w-2xl space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-700">Title *</label>
        <input
          name="title"
          required
          defaultValue={product?.title}
          className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Category *</label>
        <select
          name="category"
          required
          defaultValue={product?.category || "apparel"}
          className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="apparel">Apparel</option>
          <option value="accessories">Accessories</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Description *</label>
        <textarea
          name="description"
          required
          rows={4}
          defaultValue={product?.description}
          className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">
          Image URLs (JSON array, e.g. ["url1", "url2"])
        </label>
        <input
          name="images"
          defaultValue={product?.images || "[]"}
          className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">
          Features (JSON array)
        </label>
        <input
          name="features"
          defaultValue={product?.features || "[]"}
          className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700">Materials</label>
          <input
            name="materials"
            defaultValue={product?.materials || ""}
            className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">Sizes</label>
          <input
            name="sizes"
            defaultValue={product?.sizes || ""}
            className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700">Min Order</label>
          <input
            name="minOrder"
            defaultValue={product?.minOrder || "1 piece"}
            className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">Price Range</label>
          <input
            name="priceRange"
            defaultValue={product?.priceRange || ""}
            placeholder="$15-$50 USD"
            className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">Lead Time</label>
          <input
            name="leadTime"
            defaultValue={product?.leadTime || "7-15 days"}
            className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <details className="border border-zinc-200 rounded-lg p-4">
        <summary className="text-sm font-medium text-zinc-700 cursor-pointer">SEO Settings</summary>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700">SEO Title</label>
            <input
              name="seoTitle"
              defaultValue={product?.seoTitle || ""}
              className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">SEO Description</label>
            <textarea
              name="seoDescription"
              rows={2}
              defaultValue={product?.seoDescription || ""}
              className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </details>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="published"
          defaultChecked={product?.published}
          className="rounded border-zinc-300 text-purple-700 focus:ring-purple-500"
        />
        <span className="text-sm font-medium text-zinc-700">Published</span>
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-medium hover:bg-purple-800 transition-colors"
        >
          {product ? "Update Product" : "Create Product"}
        </button>
        <a
          href="/admin/products"
          className="px-4 py-2 border border-zinc-300 rounded-lg text-sm text-zinc-600 hover:bg-zinc-50"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
