import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { deletePost } from "@/lib/actions/blog";

export default function AdminBlogPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Blog Posts</h1>
        <Link
          href="/admin/blog/new"
          className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-medium hover:bg-purple-800"
        >
          + New Post
        </Link>
      </div>

      <div className="mt-6 bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <Suspense fallback={<p className="p-6 text-zinc-400 text-center">Loading...</p>}>
          <BlogList />
        </Suspense>
      </div>
    </div>
  );
}

async function BlogList() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  if (posts.length === 0) {
    return <p className="p-6 text-zinc-400 text-center">No posts yet.</p>;
  }

  return (
    <table className="w-full text-sm">
      <thead className="bg-zinc-50 border-b border-zinc-200">
        <tr>
          <th className="text-left px-4 py-3 font-medium text-zinc-600">Title</th>
          <th className="text-left px-4 py-3 font-medium text-zinc-600">Author</th>
          <th className="text-left px-4 py-3 font-medium text-zinc-600">Status</th>
          <th className="text-right px-4 py-3 font-medium text-zinc-600">Actions</th>
        </tr>
      </thead>
      <tbody>
        {posts.map((p) => (
          <tr key={p.id} className="border-b border-zinc-100 last:border-0">
            <td className="px-4 py-3">{p.title}</td>
            <td className="px-4 py-3">{p.author}</td>
            <td className="px-4 py-3">
              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                p.published ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-500"
              }`}>
                {p.published ? "Published" : "Draft"}
              </span>
            </td>
            <td className="px-4 py-3 text-right">
              <Link href={`/admin/blog/${p.id}`} className="text-purple-700 hover:text-purple-800 mr-3">
                Edit
              </Link>
              <form
                action={deletePost.bind(null, p.id)}
                className="inline"
                onSubmit={(e) => {
                  if (!confirm("Delete this post?")) e.preventDefault();
                }}
              >
                <button type="submit" className="text-red-500 hover:text-red-600">
                  Delete
                </button>
              </form>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
