import type { MetadataRoute } from 'next'
import { createPublicClient } from '@/shared/lib/supabase/server'

export const revalidate = 3600

const BASE_URL = 'https://chiclayopropiedades.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/propiedades`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/servicios`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/ranking`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/capacitaciones`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contacto`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  const supabase = createPublicClient()

  // Propiedades activas
  const { data: properties } = await supabase
    .from('properties')
    .select('slug, updated_at')
    .eq('is_active', true)
    .order('updated_at', { ascending: false })

  const propertyPages: MetadataRoute.Sitemap = (properties ?? []).map((property) => ({
    url: `${BASE_URL}/propiedades/${property.slug}`,
    lastModified: property.updated_at ? new Date(property.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Posts publicados
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, updated_at')
    .eq('is_published', true)
    .order('updated_at', { ascending: false })

  const blogPages: MetadataRoute.Sitemap = (posts ?? []).map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Trainings activos
  const { data: trainings } = await supabase
    .from('trainings')
    .select('slug, created_at')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  const trainingPages: MetadataRoute.Sitemap = (trainings ?? []).map((training) => ({
    url: `${BASE_URL}/capacitaciones/${training.slug}`,
    lastModified: training.created_at ? new Date(training.created_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...propertyPages, ...blogPages, ...trainingPages]
}
