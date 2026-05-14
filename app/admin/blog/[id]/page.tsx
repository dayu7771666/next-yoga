import { Suspense } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import BlogForm from "@/components/admin/BlogForm";

export default function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">Edit Blog Post</h1>
      <div className="mt-6">
        <Suspense fallback={<p className="text-zinc-400">Loading...</p>}>
          <EditBlogForm params={params} />
        </Suspense>
      </div>
    </div>
  );
}

async function EditBlogForm({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();
  return <BlogForm post={post} />;
}
