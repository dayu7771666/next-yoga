"use server";

import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const slug = slugify(title);
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const coverImage = formData.get("coverImage") as string;
  const author = formData.get("author") as string || "Admin";
  const tags = formData.get("tags") as string || "[]";
  const seoTitle = formData.get("seoTitle") as string;
  const seoDescription = formData.get("seoDescription") as string;
  const published = formData.get("published") === "on";

  await prisma.blogPost.create({
    data: {
      title, slug, excerpt, content, coverImage, author, tags,
      seoTitle, seoDescription, published,
      publishedAt: published ? new Date() : null,
    },
  });

  revalidateTag("posts", "max");
  redirect("/admin/blog");
}

export async function updatePost(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const slug = slugify(title);
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const coverImage = formData.get("coverImage") as string;
  const author = formData.get("author") as string || "Admin";
  const tags = formData.get("tags") as string || "[]";
  const seoTitle = formData.get("seoTitle") as string;
  const seoDescription = formData.get("seoDescription") as string;
  const published = formData.get("published") === "on";

  const existing = await prisma.blogPost.findUnique({ where: { id } });
  const now = new Date();

  await prisma.blogPost.update({
    where: { id },
    data: {
      title, slug, excerpt, content, coverImage, author, tags,
      seoTitle, seoDescription, published,
      publishedAt: published && !existing?.publishedAt ? now : existing?.publishedAt,
    },
  });

  revalidateTag("posts", "max");
  redirect("/admin/blog");
}

export async function deletePost(id: string) {
  await prisma.blogPost.delete({ where: { id } });
  revalidateTag("posts", "max");
}
