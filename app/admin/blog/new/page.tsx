import BlogForm from "@/components/admin/BlogForm";

export default function NewBlogPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">New Blog Post</h1>
      <div className="mt-6">
        <BlogForm />
      </div>
    </div>
  );
}
