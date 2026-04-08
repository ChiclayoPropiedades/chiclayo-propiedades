import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/',
        '/admin/',
        '/api/',
        '/login',
        '/signup',
        '/password-recovery',
        '/verify-email',
        '/stripe-success',
        '/stripe-cancel',
      ],
    },
    sitemap: 'https://chiclayopropiedades.com/sitemap.xml',
  }
}
