import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import ProductCard from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "Products — Custom Yoga Apparel & Accessories",
  description:
    "Browse our range of customizable yoga products. From premium yoga apparel to accessories, all available with your brand.",
};

export default function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-zinc-900">Our Products</h1>
      <p className="mt-2 text-zinc-600">
        Fully customizable yoga apparel and accessories for your brand.
      </p>

      <div className="mt-6 flex gap-4 border-b border-zinc-200">
        <CategoryLink href="/products" label="All" />
        <CategoryLink href="/products?category=apparel" label="Apparel" />
        <CategoryLink href="/products?category=accessories" label="Accessories" />
      </div>

      <div className="mt-8">
        <Suspense fallback={<p className="text-zinc-400">Loading...</p>}>
          <ProductList searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

function CategoryLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-zinc-500 hover:text-purple-700 pb-3 border-b-2 border-transparent hover:border-purple-700 transition-colors"
    >
      {label}
    </Link>
  );
}

async function ProductList({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const products = await getProducts(category);

  if (products.length === 0) {
    return <p className="text-zinc-400 text-center py-20">No products found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

async function getProducts(category?: string) {
  return prisma.product.findMany({
    where: {
      published: true,
      ...(category ? { category: category as "apparel" | "accessories" } : {}),
    },
    orderBy: { createdAt: "desc" },
  });
}
