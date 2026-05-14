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

export async function createProduct(formData: FormData) {
  const title = formData.get("title") as string;
  const slug = slugify(title);
  const description = formData.get("description") as string;
  const category = formData.get("category") as "apparel" | "accessories";
  const images = formData.get("images") as string || "[]";
  const features = formData.get("features") as string || "[]";
  const materials = formData.get("materials") as string;
  const sizes = formData.get("sizes") as string;
  const minOrder = formData.get("minOrder") as string || "1 piece";
  const priceRange = formData.get("priceRange") as string;
  const leadTime = formData.get("leadTime") as string || "7-15 days";
  const seoTitle = formData.get("seoTitle") as string;
  const seoDescription = formData.get("seoDescription") as string;
  const published = formData.get("published") === "on";

  await prisma.product.create({
    data: { title, slug, description, category, images, features, materials, sizes, minOrder, priceRange, leadTime, seoTitle, seoDescription, published },
  });

  revalidateTag("products", "max");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const slug = slugify(title);
  const description = formData.get("description") as string;
  const category = formData.get("category") as "apparel" | "accessories";
  const images = formData.get("images") as string || "[]";
  const features = formData.get("features") as string || "[]";
  const materials = formData.get("materials") as string;
  const sizes = formData.get("sizes") as string;
  const minOrder = formData.get("minOrder") as string || "1 piece";
  const priceRange = formData.get("priceRange") as string;
  const leadTime = formData.get("leadTime") as string || "7-15 days";
  const seoTitle = formData.get("seoTitle") as string;
  const seoDescription = formData.get("seoDescription") as string;
  const published = formData.get("published") === "on";

  await prisma.product.update({
    where: { id },
    data: { title, slug, description, category, images, features, materials, sizes, minOrder, priceRange, leadTime, seoTitle, seoDescription, published },
  });

  revalidateTag("products", "max");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidateTag("products", "max");
}
