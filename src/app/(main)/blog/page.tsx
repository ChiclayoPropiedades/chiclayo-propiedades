import { type Metadata } from "next";
import { Newspaper } from "lucide-react";
import { getPosts } from "@/features/blog/services/get-posts";
import { BlogGrid } from "@/features/blog/components/blog-grid";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog Inmobiliario",
  description:
    "Consejos, tendencias y noticias del mercado inmobiliario en Chiclayo y Lambayeque.",
  openGraph: {
    title: "Blog Inmobiliario",
    description:
      "Consejos, tendencias y noticias del mercado inmobiliario en Chiclayo y Lambayeque.",
    type: "website",
  },
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      {/* Page header */}
      <section
        className="bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#2563eb] py-14 sm:py-20"
        aria-labelledby="blog-heading"
      >
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-4 inline-flex size-14 items-center justify-center rounded-full bg-white/10">
            <Newspaper className="size-7 text-white" aria-hidden="true" />
          </div>
          <h1
            id="blog-heading"
            className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
          >
            Blog Inmobiliario
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-blue-100">
            Consejos, tendencias y noticias del mercado inmobiliario en Chiclayo
          </p>
        </div>
      </section>

      {/* Blog grid */}
      <section className="bg-white py-12 sm:py-16" aria-label="Artículos del blog">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <BlogGrid posts={posts} />
        </div>
      </section>
    </>
  );
}
