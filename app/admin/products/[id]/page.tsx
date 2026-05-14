import { Suspense } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">Edit Product</h1>
      <div className="mt-6">
        <Suspense fallback={<p className="text-zinc-400">Loading...</p>}>
          <EditProductForm params={params} />
        </Suspense>
      </div>
    </div>
  );
}

async function EditProductForm({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();
  return <ProductForm product={product} />;
}
