import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import MarkdownRenderer from "@/components/MarkdownRenderer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || "",
  };
}

export default function BlogDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-16"><p className="text-zinc-400">Loading...</p></div>}>
      <BlogDetailContent params={params} />
    </Suspense>
  );
}

async function BlogDetailContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const tags: string[] = JSON.parse(post.tags || "[]");

  return (
    <article className="max-w-3xl mx-auto px-4 py-16">
      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full aspect-video object-cover rounded-xl mb-8"
        />
      )}

      <h1 className="text-3xl font-bold text-zinc-900">{post.title}</h1>

      <div className="mt-4 flex items-center gap-4 text-sm text-zinc-500">
        <span>{post.author}</span>
        <span>•</span>
        <span>
          {post.publishedAt?.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>

      {tags.length > 0 && (
        <div className="mt-4 flex gap-2">
          {tags.map((tag) => (
            <span key={tag} className="text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-8">
        <MarkdownRenderer content={post.content} />
      </div>
    </article>
  );
}

async function getPost(slug: string) {
  return prisma.blogPost.findUnique({
    where: { slug, published: true },
  });
}
