import { Suspense } from "react";
import { prisma } from "@/lib/db";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">Dashboard</h1>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Suspense fallback={<StatCardSkeleton />}>
          <DashboardStats />
        </Suspense>
      </div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 border border-zinc-200 animate-pulse">
      <div className="h-4 bg-zinc-200 rounded w-16" />
      <div className="mt-2 h-8 bg-zinc-200 rounded w-12" />
    </div>
  );
}

async function DashboardStats() {
  const [productCount, postCount, newInquiries] = await Promise.all([
    prisma.product.count(),
    prisma.blogPost.count(),
    prisma.inquiry.count({ where: { status: "new" } }),
  ]);

  return (
    <>
      <div className="bg-white rounded-xl p-6 border border-zinc-200">
        <p className="text-sm text-zinc-500">Products</p>
        <p className="mt-1 text-3xl font-bold text-zinc-900">{productCount}</p>
      </div>
      <div className="bg-white rounded-xl p-6 border border-zinc-200">
        <p className="text-sm text-zinc-500">Blog Posts</p>
        <p className="mt-1 text-3xl font-bold text-zinc-900">{postCount}</p>
      </div>
      <div className="bg-white rounded-xl p-6 border border-zinc-200">
        <p className="text-sm text-zinc-500">New Inquiries</p>
        <p className="mt-1 text-3xl font-bold text-zinc-900">{newInquiries}</p>
      </div>
    </>
  );
}
