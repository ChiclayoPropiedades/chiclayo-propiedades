import { Newspaper } from "lucide-react";
import { BlogCard } from "./blog-card";
import { BlogPost } from "../types";

interface BlogGridProps {
  posts: BlogPost[];
}

function EmptyState() {
  return (
    <div
      className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 py-20 text-center"
      role="status"
      aria-label="Sin artículos publicados"
    >
      <div className="flex size-16 items-center justify-center rounded-full bg-[#eff6ff]">
        <Newspaper className="size-8 text-[#2563eb]" aria-hidden="true" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-[#1f2937]">
          No hay artículos publicados
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          No hay artículos publicados en este momento. Vuelve pronto.
        </p>
      </div>
    </div>
  );
}

export function BlogGrid({ posts }: BlogGridProps) {
  if (posts.length === 0) {
    return <EmptyState />;
  }

  return (
    <div
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      aria-label="Artículos del blog"
    >
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}
