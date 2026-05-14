"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/actions/auth";
import { useEffect } from "react";

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(login, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push("/admin");
      router.refresh();
    }
  }, [state, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <form action={action} className="w-full max-w-sm bg-white p-8 rounded-xl border border-zinc-200">
        <h1 className="text-xl font-bold text-zinc-900 text-center">Admin Login</h1>

        {state?.error && (
          <p className="mt-4 text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{state.error}</p>
        )}

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-zinc-700">Username</label>
            <input
              id="username"
              name="username"
              required
              className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="w-full py-2.5 bg-purple-700 text-white rounded-lg font-medium text-sm hover:bg-purple-800 disabled:opacity-50"
          >
            {pending ? "Signing in..." : "Sign In"}
          </button>
        </div>
      </form>
    </div>
  );
}
