type MarkdownRendererProps = {
  content: string;
};

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const html = content
    .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-6 mb-2">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-8 mb-3">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="my-4 rounded-lg w-full" />')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-purple-700 hover:underline">$1</a>')
    .replace(/^\- (.*$)/gm, '<li class="ml-4 list-disc text-zinc-600">$1</li>')
    .replace(/\n\n/g, '</p><p class="text-zinc-600 leading-relaxed mb-4">')
    .replace(/^\n/, '')
    .trim();

  return (
    <div className="prose prose-zinc max-w-none">
      <p className="text-zinc-600 leading-relaxed">{html}</p>
    </div>
  );
}
