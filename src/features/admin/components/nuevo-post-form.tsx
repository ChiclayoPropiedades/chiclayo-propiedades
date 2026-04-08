"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import { createPost } from "@/features/admin/services/admin-actions";

const CATEGORIES = [
  "Consejos",
  "Mercado Inmobiliario",
  "Inversión",
  "Noticias",
  "Guías",
  "Entrevistas",
];

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function NuevoPostForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugManuallyEdited) {
      setSlug(generateSlug(value));
    }
  }

  function handleSlugChange(value: string) {
    setSlugManuallyEdited(true);
    setSlug(generateSlug(value));
  }

  function handleSubmit(isPublished: boolean) {
    if (!title.trim()) {
      toast.error("El título es obligatorio");
      return;
    }
    if (!slug.trim()) {
      toast.error("El slug es obligatorio");
      return;
    }
    if (!content.trim()) {
      toast.error("El contenido es obligatorio");
      return;
    }

    startTransition(async () => {
      try {
        await createPost({
          title: title.trim(),
          slug: slug.trim(),
          category: category.trim(),
          excerpt: excerpt.trim(),
          content: content.trim(),
          cover_image: coverImage.trim(),
          is_published: isPublished,
        });
        toast.success(
          isPublished ? "Artículo publicado correctamente" : "Artículo guardado como borrador"
        );
        router.push("/admin/blog");
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Error al guardar el artículo"
        );
      }
    });
  }

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-6"
      aria-label="Formulario de nuevo artículo"
    >
      {/* Título */}
      <div className="space-y-1.5">
        <Label htmlFor="title">
          Título <span className="text-red-500" aria-hidden="true">*</span>
        </Label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Título del artículo"
          disabled={isPending}
          required
          className="border-gray-200 focus:border-[#2563eb] focus:ring-[#2563eb]/20"
        />
      </div>

      {/* Slug */}
      <div className="space-y-1.5">
        <Label htmlFor="slug">
          Slug (URL) <span className="text-red-500" aria-hidden="true">*</span>
        </Label>
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-xs text-gray-400">/blog/</span>
          <Input
            id="slug"
            type="text"
            value={slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            placeholder="url-del-articulo"
            disabled={isPending}
            required
            className="border-gray-200 font-mono text-sm focus:border-[#2563eb] focus:ring-[#2563eb]/20"
          />
        </div>
        <p className="text-xs text-gray-400">
          Se genera automáticamente desde el título. Solo letras, números y guiones.
        </p>
      </div>

      {/* Categoría */}
      <div className="space-y-1.5">
        <Label htmlFor="category">Categoría</Label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={isPending}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 disabled:opacity-50"
        >
          <option value="">Sin categoría</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Cover Image */}
      <div className="space-y-1.5">
        <Label htmlFor="cover_image">URL de imagen de portada</Label>
        <Input
          id="cover_image"
          type="url"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          placeholder="https://ejemplo.com/imagen.jpg"
          disabled={isPending}
          className="border-gray-200 focus:border-[#2563eb] focus:ring-[#2563eb]/20"
        />
      </div>

      {/* Excerpt */}
      <div className="space-y-1.5">
        <Label htmlFor="excerpt">Extracto (resumen breve)</Label>
        <Textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Breve descripción del artículo para listados y SEO..."
          rows={3}
          disabled={isPending}
          className="resize-none border-gray-200 focus:border-[#2563eb] focus:ring-[#2563eb]/20"
        />
      </div>

      {/* Contenido */}
      <div className="space-y-1.5">
        <Label htmlFor="content">
          Contenido <span className="text-red-500" aria-hidden="true">*</span>
        </Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escribe el contenido del artículo aquí..."
          rows={16}
          disabled={isPending}
          required
          className="resize-y border-gray-200 font-mono text-sm focus:border-[#2563eb] focus:ring-[#2563eb]/20"
        />
        <p className="text-xs text-gray-400">
          {content.length} caracteres
        </p>
      </div>

      {/* Acciones */}
      <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 pt-6">
        <Button
          type="button"
          onClick={() => handleSubmit(true)}
          disabled={isPending}
          className="bg-[#2563eb] hover:bg-[#1e40af]"
        >
          {isPending ? "Guardando..." : "Publicar"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSubmit(false)}
          disabled={isPending}
          className="border-gray-200"
        >
          {isPending ? "Guardando..." : "Guardar como borrador"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin/blog")}
          disabled={isPending}
          className="text-gray-500"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
