import { Suspense } from "react";
import { prisma } from "@/lib/db";
import { updateInquiryStatus } from "@/lib/actions/inquiries";

export default function AdminInquiriesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">Inquiries</h1>

      <div className="mt-6 bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <Suspense fallback={<p className="p-6 text-zinc-400 text-center">Loading...</p>}>
          <InquiryList />
        </Suspense>
      </div>
    </div>
  );
}

async function InquiryList() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: { select: { title: true, slug: true } } },
  });

  if (inquiries.length === 0) {
    return <p className="p-6 text-zinc-400 text-center">No inquiries yet.</p>;
  }

  return (
    <table className="w-full text-sm">
      <thead className="bg-zinc-50 border-b border-zinc-200">
        <tr>
          <th className="text-left px-4 py-3 font-medium text-zinc-600">Name</th>
          <th className="text-left px-4 py-3 font-medium text-zinc-600">Phone</th>
          <th className="text-left px-4 py-3 font-medium text-zinc-600">Product</th>
          <th className="text-left px-4 py-3 font-medium text-zinc-600">Message</th>
          <th className="text-left px-4 py-3 font-medium text-zinc-600">Date</th>
          <th className="text-left px-4 py-3 font-medium text-zinc-600">Status</th>
          <th className="text-right px-4 py-3 font-medium text-zinc-600">Actions</th>
        </tr>
      </thead>
      <tbody>
        {inquiries.map((inq) => (
          <tr key={inq.id} className="border-b border-zinc-100 last:border-0">
            <td className="px-4 py-3 font-medium">{inq.name}</td>
            <td className="px-4 py-3">{inq.phone}</td>
            <td className="px-4 py-3">
              {inq.product ? (
                <a href={`/products/${inq.product.slug}`} target="_blank" className="text-purple-700 hover:underline">
                  {inq.product.title}
                </a>
              ) : (
                <span className="text-zinc-400">—</span>
              )}
            </td>
            <td className="px-4 py-3 max-w-xs">
              <p className="truncate text-zinc-600">{inq.message}</p>
            </td>
            <td className="px-4 py-3 text-zinc-500 text-xs whitespace-nowrap">
              {inq.createdAt.toLocaleDateString("en-US", {
                year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
              })}
            </td>
            <td className="px-4 py-3">
              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                inq.status === "new"
                  ? "bg-blue-100 text-blue-700"
                  : inq.status === "contacted"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-zinc-100 text-zinc-500"
              }`}>
                {inq.status}
              </span>
            </td>
            <td className="px-4 py-3 text-right">
              {inq.status === "new" && (
                <form action={updateInquiryStatus.bind(null, inq.id, "contacted")} className="inline">
                  <button type="submit" className="text-amber-600 hover:text-amber-700 text-xs mr-2">
                    Mark Contacted
                  </button>
                </form>
              )}
              {inq.status !== "closed" && (
                <form action={updateInquiryStatus.bind(null, inq.id, "closed")} className="inline">
                  <button type="submit" className="text-red-500 hover:text-red-600 text-xs">
                    Close
                  </button>
                </form>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
