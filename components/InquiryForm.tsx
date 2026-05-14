"use client";

import { submitInquiry } from "@/lib/actions/inquiries";
import { useActionState } from "react";

export default function InquiryForm({ productId }: { productId?: string }) {
  const [state, action, pending] = useActionState(submitInquiry, null);

  return (
    <form action={action} className="bg-zinc-50 rounded-xl p-6 border border-zinc-200">
      <h3 className="text-lg font-semibold text-zinc-900">Get a Quote</h3>
      <p className="mt-1 text-sm text-zinc-500">
        Tell us about your needs and we&apos;ll get back to you within 24 hours.
      </p>

      {state?.success ? (
        <p className="mt-4 text-emerald-600 font-medium">
          Thank you! We&apos;ll contact you shortly.
        </p>
      ) : (
        <div className="mt-4 space-y-4">
          {productId && (
            <input type="hidden" name="productId" value={productId} />
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-700">
              Name *
            </label>
            <input
              id="name"
              name="name"
              required
              className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {state?.errors?.name && (
              <p className="mt-1 text-xs text-red-500">{state.errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-zinc-700">
              Phone *
            </label>
            <input
              id="phone"
              name="phone"
              required
              className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {state?.errors?.phone && (
              <p className="mt-1 text-xs text-red-500">{state.errors.phone}</p>
            )}
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-zinc-700">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={3}
              className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Describe your requirements — product type, quantity, design needs..."
            />
            {state?.errors?.message && (
              <p className="mt-1 text-xs text-red-500">{state.errors.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full px-4 py-2.5 bg-purple-700 text-white rounded-lg font-medium text-sm hover:bg-purple-800 disabled:opacity-50 transition-colors"
          >
            {pending ? "Sending..." : "Send Inquiry"}
          </button>
        </div>
      )}
    </form>
  );
}
