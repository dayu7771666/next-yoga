import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 via-white to-emerald-50">
        <div className="max-w-6xl mx-auto px-4 py-24 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 leading-tight">
              Custom Yoga Wear for{" "}
              <span className="text-purple-700">Designers & Brands</span>
            </h1>
            <p className="mt-6 text-lg text-zinc-600 leading-relaxed">
              From concept to sample in days, not months. One-piece minimum order.
              Custom logos, packaging, and full-brand solutions for yoga
              apparel and accessories.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center px-6 py-3 bg-purple-700 text-white rounded-lg font-medium hover:bg-purple-800 transition-colors"
              >
                Explore Products
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 border border-zinc-300 text-zinc-700 rounded-lg font-medium hover:bg-zinc-50 transition-colors"
              >
                Get a Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-zinc-900">
            Why Choose YogaCustom
          </h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {advantages.map((adv) => (
              <div key={adv.title} className="text-center p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto text-purple-700 text-2xl">
                  {adv.icon}
                </div>
                <h3 className="mt-4 font-semibold text-zinc-900">{adv.title}</h3>
                <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                  {adv.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <Suspense fallback={null}>
        <FeaturedProducts />
      </Suspense>

      {/* Latest Blog */}
      <Suspense fallback={null}>
        <LatestPosts />
      </Suspense>
    </div>
  );
}

async function FeaturedProducts() {
  const products = await getFeaturedProducts();
  if (products.length === 0) return null;

  return (
    <section className="py-20 bg-zinc-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-zinc-900">Featured Products</h2>
          <Link href="/products" className="text-sm font-medium text-purple-700 hover:text-purple-800">
            View All →
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

async function LatestPosts() {
  const posts = await getLatestPosts();
  if (posts.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-zinc-900">Latest Blog</h2>
          <Link href="/blog" className="text-sm font-medium text-purple-700 hover:text-purple-800">
            View All →
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}

const advantages = [
  {
    icon: "✦",
    title: "One-Piece MOQ",
    description:
      "Order as little as one piece for samples. Test your designs before committing to bulk production.",
  },
  {
    icon: "↻",
    title: "Fast Turnaround",
    description:
      "Sample production in 3-5 days, bulk orders in 7-15 days. From design to delivery in record time.",
  },
  {
    icon: "◎",
    title: "Full Customization",
    description:
      "Custom logos, packaging, tags, and labels. We handle every detail so your brand stands out.",
  },
];

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { published: true },
    take: 6,
    orderBy: { createdAt: "desc" },
  });
}

async function getLatestPosts() {
  return prisma.blogPost.findMany({
    where: { published: true },
    take: 3,
    orderBy: { publishedAt: "desc" },
  });
}

function ProductCard({ product }: { product: { slug: string; title: string; images: string; category: string; description: string } }) {
  const images: string[] = JSON.parse(product.images || "[]");
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="aspect-[4/3] bg-zinc-100 flex items-center justify-center text-zinc-400">
        {images[0] ? (
          <img src={images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        ) : (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        )}
      </div>
      <div className="p-4">
        <span className="text-xs font-medium text-purple-700 uppercase tracking-wider">{product.category}</span>
        <h3 className="mt-1 font-semibold text-zinc-900 group-hover:text-purple-700 transition-colors">{product.title}</h3>
        <p className="mt-1 text-sm text-zinc-500 line-clamp-2">{product.description}</p>
      </div>
    </Link>
  );
}

function BlogCard({ post }: { post: { slug: string; title: string; coverImage: string | null; excerpt: string | null } }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="aspect-[16/9] bg-zinc-100 flex items-center justify-center text-zinc-400">
        {post.coverImage ? (
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
        ) : (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
          </svg>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-zinc-900 group-hover:text-purple-700 transition-colors">{post.title}</h3>
        {post.excerpt && <p className="mt-1 text-sm text-zinc-500 line-clamp-2">{post.excerpt}</p>}
      </div>
    </Link>
  );
}
