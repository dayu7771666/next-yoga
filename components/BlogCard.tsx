import Link from "next/link";

type BlogCardProps = {
  post: {
    slug: string;
    title: string;
    coverImage: string | null;
    excerpt: string | null;
    publishedAt: Date | null;
    tags: string;
  };
};

export default function BlogCard({ post }: BlogCardProps) {
  const tags: string[] = JSON.parse(post.tags || "[]");

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="aspect-[16/9] bg-zinc-100 overflow-hidden">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-300">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        {tags.length > 0 && (
          <div className="flex gap-2 mb-2">
            {tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
        <h3 className="font-semibold text-zinc-900 group-hover:text-purple-700 transition-colors line-clamp-2">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-2 text-sm text-zinc-500 line-clamp-2">{post.excerpt}</p>
        )}
      </div>
    </Link>
  );
}
