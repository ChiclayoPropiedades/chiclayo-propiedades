import { createClient } from "@/shared/lib/supabase/server";
import { BlogPost } from "../types";

export async function getPosts(category?: string): Promise<BlogPost[]> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("blog_posts")
      .select(
        "id, author_id, title, slug, content, excerpt, cover_image, category, is_published, published_at, created_at, updated_at"
      )
      .eq("is_published", true)
      .order("published_at", { ascending: false });

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) return [];
    return (data ?? []) as BlogPost[];
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
        author:profiles(full_name, avatar_url)`
      )
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (error) return null;
    return data as BlogPost;
  } catch {
    return null;
  }
}
