import Link from "next/link";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { getAdminPosts } from "@/features/admin/services/admin-actions";
import { BlogTable } from "@/features/admin/components/blog-table";

export default async function AdminBlogPage() {
  const posts = await getAdminPosts();

  const published = posts.filter((p) => p.is_published).length;
  const drafts = posts.filter((p) => !p.is_published).length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1f2937]">Blog</h2>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona los artículos del blog
          </p>
        </div>
        <Link href="/admin/blog/nuevo" className="inline-flex items-center gap-2 rounded-md bg-[#2563eb] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1e40af] shrink-0">
          <Plus className="size-4" aria-hidden="true" />
          Nuevo Artículo
        </Link>
      </div>

      {/* Mini stats */}
      <div className="flex gap-3">
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
          <p className="text-xl font-bold text-green-700">{published}</p>
          <p className="text-xs text-green-600">Publicados</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
          <p className="text-xl font-bold text-gray-600">{drafts}</p>
          <p className="text-xs text-gray-500">Borradores</p>
        </div>
      </div>

      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-[#1f2937]">
            Todos los artículos ({posts.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <BlogTable posts={posts} />
        </CardContent>
      </Card>
    </div>
  );
}
