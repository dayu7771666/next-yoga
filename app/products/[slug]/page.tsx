import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import InquiryForm from "@/components/InquiryForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};

  return {
    title: product.seoTitle || product.title,
    description: product.seoDescription || product.description,
  };
}

export default function ProductDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 py-16"><p className="text-zinc-400">Loading...</p></div>}>
      <ProductDetailContent params={params} />
    </Suspense>
  );
}

async function ProductDetailContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const images: string[] = JSON.parse(product.images || "[]");
  const features: string[] = JSON.parse(product.features || "[]");

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3">
          <div className="aspect-[4/3] bg-zinc-100 rounded-xl overflow-hidden">
            {images[0] ? (
              <img
                src={images[0]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-300">
                No image
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto">
              {images.map((img, i) => (
                <div key={i} className="w-20 h-20 bg-zinc-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <span className="text-xs font-medium text-purple-700 uppercase tracking-wider">
            {product.category}
          </span>
          <h1 className="mt-1 text-2xl font-bold text-zinc-900">{product.title}</h1>
          <p className="mt-4 text-zinc-600 leading-relaxed">{product.description}</p>

          <div className="mt-6 space-y-3 text-sm">
            {product.materials && (
              <div>
                <span className="font-medium text-zinc-900">Materials: </span>
                <span className="text-zinc-600">{product.materials}</span>
              </div>
            )}
            {product.sizes && (
              <div>
                <span className="font-medium text-zinc-900">Sizes: </span>
                <span className="text-zinc-600">{product.sizes}</span>
              </div>
            )}
            <div>
              <span className="font-medium text-zinc-900">Min Order: </span>
              <span className="text-zinc-600">{product.minOrder}</span>
            </div>
            {product.priceRange && (
              <div>
                <span className="font-medium text-zinc-900">Price Range: </span>
                <span className="text-emerald-600 font-medium">{product.priceRange}</span>
              </div>
            )}
            <div>
              <span className="font-medium text-zinc-900">Lead Time: </span>
              <span className="text-zinc-600">{product.leadTime}</span>
            </div>
          </div>

          {features.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium text-zinc-900">Features</h3>
              <ul className="mt-2 space-y-1">
                {features.map((f, i) => (
                  <li key={i} className="text-sm text-zinc-600 flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8">
            <InquiryForm productId={product.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug, published: true },
  });
}
