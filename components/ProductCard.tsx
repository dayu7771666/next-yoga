import Link from "next/link";

type ProductCardProps = {
  product: {
    slug: string;
    title: string;
    images: string;
    category: string;
    description: string;
    priceRange: string | null;
  };
};

export default function ProductCard({ product }: ProductCardProps) {
  const images: string[] = JSON.parse(product.images || "[]");

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="aspect-[4/3] bg-zinc-100 flex items-center justify-center text-zinc-400 overflow-hidden">
        {images[0] ? (
          <img
            src={images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        )}
      </div>
      <div className="p-4">
        <span className="text-xs font-medium text-purple-700 uppercase tracking-wider">
          {product.category}
        </span>
        <h3 className="mt-1 font-semibold text-zinc-900 group-hover:text-purple-700 transition-colors">
          {product.title}
        </h3>
        <p className="mt-1 text-sm text-zinc-500 line-clamp-2">
          {product.description}
        </p>
        {product.priceRange && (
          <p className="mt-2 text-sm font-medium text-emerald-600">
            {product.priceRange}
          </p>
        )}
      </div>
    </Link>
  );
}
