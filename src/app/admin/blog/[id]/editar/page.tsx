import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { getAdminPostById } from "@/features/admin/services/admin-actions";
import { EditPostForm } from "@/features/admin/components/edit-post-form";

interface AdminBlogEditarPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminBlogEditarPage({ params }: AdminBlogEditarPageProps) {
  const { id } = await params;

  const post = await getAdminPostById(id);

  if (!post) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/blog"
          className="mb-3 inline-flex items-center gap-1 text-xs text-gray-400 transition-colors hover:text-[#2563eb]"
        >
          <ChevronLeft className="size-3.5" aria-hidden="true" />
          Volver al Blog
        </Link>
        <h2 className="text-2xl font-bold text-[#1f2937]">Editar Artículo</h2>
        <p className="mt-1 text-sm text-gray-500">
          Modifica el contenido del artículo
        </p>
      </div>

      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-[#1f2937]">
            Información del artículo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EditPostForm
            postId={post.id}
            initialData={{
              title: post.title,
              slug: post.slug,
              category: post.category,
              excerpt: post.excerpt,
              content: post.content,
              cover_image: post.cover_image,
              is_published: post.is_published,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
