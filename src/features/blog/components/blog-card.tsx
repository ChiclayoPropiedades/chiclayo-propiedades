import Link from "next/link";
import Image from "next/image";
import { Newspaper, Calendar, Tag } from "lucide-react";
import { BlogPost } from "../types";

interface BlogCardProps {
  post: BlogPost;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  try {
    return new Intl.DateTimeFormat("es-PE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

function CoverPlaceholder() {
  return (
    <div
      className="flex h-full w-full items-center justify-center bg-gray-100"
      aria-hidden="true"
    >
      <Newspaper className="size-12 text-gray-300" />
    </div>
  );
}

export function BlogCard({ post }: BlogCardProps) {
  const displayDate = post.published_at ?? post.created_at;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Cover image */}
      <Link
        href={`/blog/${post.slug}`}
        className="relative block h-48 w-full shrink-0 overflow-hidden bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]/50"
        tabIndex={-1}
        aria-hidden="true"
      >
        {post.cover_image ? (
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <CoverPlaceholder />
        )}

        {/* Category badge over image */}
        {post.category && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-[#2563eb] px-2.5 py-1 text-xs font-semibold text-white shadow">
            <Tag className="size-3" aria-hidden="true" />
            {post.category}
          </span>
        )}
      </Link>

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {/* Category (visible without image) */}
        {post.category && !post.cover_image && (
          <span className="inline-flex w-fit items-center gap-1 rounded-full bg-[#eff6ff] px-2.5 py-0.5 text-xs font-semibold text-[#2563eb]">
            <Tag className="size-3" aria-hidden="true" />
            {post.category}
          </span>
        )}

        {/* Title */}
        <Link
          href={`/blog/${post.slug}`}
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]/50 rounded"
        >
          <h2 className="line-clamp-2 text-base font-semibold leading-snug text-[#1f2937] transition-colors group-hover:text-[#2563eb]">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="line-clamp-2 text-sm leading-relaxed text-gray-500">
            {post.excerpt}
          </p>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center gap-1.5 pt-2 text-xs text-gray-400">
          <Calendar className="size-3.5 shrink-0" aria-hidden="true" />
          <time dateTime={displayDate ?? undefined}>
            {formatDate(displayDate)}
          </time>
        </div>
      </div>
    </article>
  );
}
