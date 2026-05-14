import { createPost, updatePost } from "@/lib/actions/blog";

type BlogData = {
  id?: string;
  title: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  author: string;
  tags: string;
  seoTitle: string | null;
  seoDescription: string | null;
  published: boolean;
};

export default function BlogForm({ post }: { post?: BlogData }) {
  const action = post ? updatePost.bind(null, post.id!) : createPost;

  return (
    <form action={action} className="max-w-2xl space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-700">Title *</label>
        <input
          name="title"
          required
          defaultValue={post?.title}
          className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Excerpt</label>
        <textarea
          name="excerpt"
          rows={2}
          defaultValue={post?.excerpt || ""}
          className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Content (Markdown) *</label>
        <textarea
          name="content"
          required
          rows={16}
          defaultValue={post?.content}
          className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700">Cover Image URL</label>
          <input
            name="coverImage"
            defaultValue={post?.coverImage || ""}
            className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">Author</label>
          <input
            name="author"
            defaultValue={post?.author || "Admin"}
            className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Tags (JSON array, e.g. ["yoga", "trends"])</label>
        <input
          name="tags"
          defaultValue={post?.tags || "[]"}
          className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <details className="border border-zinc-200 rounded-lg p-4">
        <summary className="text-sm font-medium text-zinc-700 cursor-pointer">SEO Settings</summary>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700">SEO Title</label>
            <input
              name="seoTitle"
              defaultValue={post?.seoTitle || ""}
              className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">SEO Description</label>
            <textarea
              name="seoDescription"
              rows={2}
              defaultValue={post?.seoDescription || ""}
              className="mt-1 w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </details>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="published"
          defaultChecked={post?.published}
          className="rounded border-zinc-300 text-purple-700 focus:ring-purple-500"
        />
        <span className="text-sm font-medium text-zinc-700">Published</span>
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          className="px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-medium hover:bg-purple-800 transition-colors"
        >
          {post ? "Update Post" : "Create Post"}
        </button>
        <a
          href="/admin/blog"
          className="px-4 py-2 border border-zinc-300 rounded-lg text-sm text-zinc-600 hover:bg-zinc-50"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
