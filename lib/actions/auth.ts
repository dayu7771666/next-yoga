"use server";

import { authenticateUser, createSession } from "@/lib/auth";

export async function login(_prev: unknown, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Username and password are required." };
  }

  const valid = await authenticateUser(username, password);
  if (!valid) {
    return { error: "Invalid username or password" };
  }

  await createSession(username);
  return { success: true };
}
