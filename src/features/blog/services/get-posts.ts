import { createClient } from "@/shared/lib/supabase/server";
import { BlogPost } from "../types";

export async function getPosts(category?: string): Promise<BlogPost[]> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("blog_posts")
      .select(
        "id, author_id, title, slug, content, excerpt, cover_image, category, is_published, published_at, created_at, updated_at, author:profiles!author_id(is_active)"
      )
      .eq("is_published", true)
      .order("published_at", { ascending: false });

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) return [];

    // Filtrar posts de autores inactivos
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ((data ?? []) as any[]).filter((p) => {
      const author = Array.isArray(p.author) ? p.author[0] : p.author;
      return !author || author.is_active !== false;
    }) as BlogPost[];
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("blog_posts")
      .select(
        `id, author_id, title, slug, content, excerpt, cover_image, category, is_published, published_at, created_at, updated_at,
        author:profiles!author_id(full_name, avatar_url, is_active)`
      )
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (error) return null;

    // Si el autor está inactivo, no mostrar
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const author = Array.isArray((data as any).author) ? (data as any).author[0] : (data as any).author;
    if (author?.is_active === false) return null;

    return data as BlogPost;
  } catch {
    return null;
  }
}
