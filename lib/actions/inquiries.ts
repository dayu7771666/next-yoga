"use server";

import { prisma } from "@/lib/db";

export async function submitInquiry(
  prevState: unknown,
  formData: FormData
): Promise<{
  success?: boolean;
  errors?: { name?: string; phone?: string; message?: string };
}> {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const message = formData.get("message") as string;
  const productId = formData.get("productId") as string | null;

  const errors: { name?: string; phone?: string; message?: string } = {};

  if (!name || name.length < 2) errors.name = "Name is required";
  if (!phone || phone.length < 5) errors.phone = "Phone is required";
  if (!message || message.length < 10)
    errors.message = "Please provide at least 10 characters";

  if (Object.keys(errors).length > 0) return { errors };

  await prisma.inquiry.create({
    data: {
      name,
      phone,
      message,
      ...(productId ? { productId } : {}),
    },
  });

  return { success: true };
}

export async function updateInquiryStatus(id: string, status: "contacted" | "closed") {
  await prisma.inquiry.update({ where: { id }, data: { status } });
}
