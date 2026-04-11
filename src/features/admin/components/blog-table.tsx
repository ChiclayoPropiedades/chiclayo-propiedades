"use client";

import { useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  togglePostPublished,
  deletePost,
  type AdminPost,
} from "@/features/admin/services/admin-actions";

interface Props {
  posts: AdminPost[];
}

export function BlogTable({ posts }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleTogglePublished(id: string, current: boolean) {
    startTransition(async () => {
      try {
        await togglePostPublished(id, !current);
        toast.success(!current ? "Artículo publicado" : "Artículo despublicado");
      } catch {
        toast.error("Error al cambiar el estado del artículo");
      }
    });
  }

  function handleDelete(id: string, title: string) {
    if (!confirm(`¿Estás seguro de eliminar "${title}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    startTransition(async () => {
      try {
        await deletePost(id);
        toast.success("Artículo eliminado");
      } catch {
        toast.error("Error al eliminar el artículo");
      }
    });
  }

  if (posts.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-gray-400">
        No hay artículos registrados.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-gray-200 bg-gray-50">
          <TableHead className="text-xs font-medium text-gray-500">Título</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Categoría</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Estado</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Fecha</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id} className="border-gray-100">
            <TableCell className="font-medium text-[#1f2937]">
              <Link
                href={`/admin/blog/${post.id}/editar`}
                className="text-[#1f2937] hover:text-[#2563eb] hover:underline"
              >
                {post.title}
              </Link>
            </TableCell>
            <TableCell className="text-sm text-gray-500">
              {post.category ?? <span className="text-gray-300">—</span>}
            </TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${
                  post.is_published
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "bg-gray-100 text-gray-500 border-gray-200"
                }`}
              >
                {post.is_published ? "Publicado" : "Borrador"}
              </span>
            </TableCell>
            <TableCell className="text-xs text-gray-400">
              {post.published_at
                ? new Date(post.published_at).toLocaleDateString("es-PE", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : new Date(post.created_at).toLocaleDateString("es-PE", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1.5">
                <Link
                  href={`/admin/blog/${post.id}/editar`}
                  className="rounded-md border border-gray-200 bg-white p-1.5 text-gray-500 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-[#2563eb]"
                  title="Editar artículo"
                >
                  <Pencil className="size-3.5" aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleTogglePublished(post.id, post.is_published)}
                  className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-50 ${
                    post.is_published
                      ? "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                      : "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                  }`}
                >
                  {post.is_published ? "Despublicar" : "Publicar"}
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleDelete(post.id, post.title)}
                  className="rounded-md border border-red-200 bg-red-50 p-1.5 text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
                  aria-label={`Eliminar artículo: ${post.title}`}
                >
                  <Trash2 className="size-3.5" aria-hidden="true" />
                </button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
