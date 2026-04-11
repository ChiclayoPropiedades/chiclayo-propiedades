import { type Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronRight, Calendar, User, Tag, Newspaper } from "lucide-react";
import { getPostBySlug } from "@/features/blog/services/get-posts";
import { articleJsonLd } from "@/shared/lib/structured-data";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Artículo no encontrado",
    };
  }

  const description = post.excerpt ?? post.content.slice(0, 160);

  return {
    title: `${post.title} | Blog`,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      publishedTime: post.published_at ?? post.created_at,
      ...(post.cover_image && { images: [{ url: post.cover_image }] }),
    },
  };
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

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const displayDate = post.published_at ?? post.created_at;
  const author = Array.isArray(post.author) ? post.author[0] : post.author;
  const authorName = author?.full_name ?? "Chiclayo Propiedades";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            articleJsonLd({
              title: post.title,
              excerpt: post.excerpt,
              slug: post.slug,
              published_at: post.published_at,
              author: authorName,
            })
          ),
        }}
      />
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="border-b border-gray-100 bg-white"
      >
        <div className="mx-auto max-w-4xl px-4 py-3 sm:px-6 lg:px-8">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
            <li>
              <Link
                href="/"
                className="transition-colors hover:text-[#2563eb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]/50 rounded"
              >
                Inicio
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3.5" />
            </li>
            <li>
              <Link
                href="/blog"
                className="transition-colors hover:text-[#2563eb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]/50 rounded"
              >
                Blog
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3.5" />
            </li>
            <li
              className="max-w-[200px] truncate font-medium text-[#1f2937] sm:max-w-xs"
              aria-current="page"
            >
              {post.title}
            </li>
          </ol>
        </div>
      </nav>

      {/* Article */}
      <article className="bg-white py-10 sm:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Category */}
          {post.category && (
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eff6ff] px-3 py-1 text-xs font-semibold text-[#2563eb]">
                <Tag className="size-3" aria-hidden="true" />
                {post.category}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-[#1f2937] sm:text-4xl">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <User className="size-4 shrink-0 text-[#2563eb]" aria-hidden="true" />
              <span>{authorName}</span>
            </span>
            {displayDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="size-4 shrink-0 text-[#2563eb]" aria-hidden="true" />
                <time dateTime={displayDate}>{formatDate(displayDate)}</time>
              </span>
            )}
          </div>

          {/* Cover image */}
          {post.cover_image ? (
            <div className="relative mt-8 h-64 w-full overflow-hidden rounded-2xl sm:h-96">
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 896px) 100vw, 896px"
                className="object-cover"
              />
            </div>
          ) : (
            <div
              className="mt-8 flex h-48 w-full items-center justify-center rounded-2xl bg-gray-100 sm:h-64"
              aria-hidden="true"
            >
              <Newspaper className="size-16 text-gray-300" />
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-lg max-w-none mt-10 prose-headings:text-[#1f2937] prose-a:text-[#2563eb] prose-strong:text-[#1f2937]"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Back to blog */}
          <div className="mt-12 border-t border-gray-100 pt-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-lg border border-[#2563eb] px-4 py-2.5 text-sm font-semibold text-[#2563eb] transition-colors hover:bg-[#eff6ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]/50"
            >
              Volver al Blog
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
