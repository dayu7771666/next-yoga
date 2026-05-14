import { Suspense } from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import BlogCard from "@/components/BlogCard";

export const metadata: Metadata = {
  title: "Blog — Yoga Industry Insights & Customization Tips",
  description:
    "Explore the latest in yoga fashion trends, customization guides, and brand success stories.",
};

export default function BlogPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-zinc-900">Blog</h1>
      <p className="mt-2 text-zinc-600">
        Insights, guides, and stories from the yoga customization world.
      </p>

      <div className="mt-8">
        <Suspense fallback={<p className="text-zinc-400">Loading...</p>}>
          <BlogList />
        </Suspense>
      </div>
    </div>
  );
}

async function BlogList() {
  const posts = await getPosts();

  if (posts.length === 0) {
    return <p className="text-zinc-400 text-center py-20">No posts yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}

async function getPosts() {
  return prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
}
