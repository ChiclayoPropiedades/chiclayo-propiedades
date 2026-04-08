export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Chiclayo Propiedades',
    url: 'https://chiclayopropiedades.com',
    telephone: '+51928216206',
    email: 'info@chiclayopropiedades.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Av. Luis Gonzales 456',
      addressLocality: 'Chiclayo',
      addressRegion: 'Lambayeque',
      addressCountry: 'PE',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '13:00',
      },
    ],
  }
}

export function propertyJsonLd(property: {
  title: string
  description: string | null
  price: number
  currency: string
  address: string
  district: string
  type: string
  slug: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description,
    url: `https://chiclayopropiedades.com/propiedades/${property.slug}`,
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: property.currency,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.address,
      addressLocality: property.district,
      addressRegion: 'Lambayeque',
      addressCountry: 'PE',
    },
  }
}

export function articleJsonLd(post: {
  title: string
  excerpt: string | null
  slug: string
  published_at: string | null
  author?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    url: `https://chiclayopropiedades.com/blog/${post.slug}`,
    datePublished: post.published_at,
    author: { '@type': 'Person', name: post.author ?? 'Chiclayo Propiedades' },
    publisher: { '@type': 'Organization', name: 'Chiclayo Propiedades' },
  }
}

export function courseJsonLd(training: {
  title: string
  description: string
  price: number
  currency: string
  slug: string
  instructor: string | null
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: training.title,
    description: training.description,
    url: `https://chiclayopropiedades.com/capacitaciones/${training.slug}`,
    provider: { '@type': 'Organization', name: 'Chiclayo Propiedades' },
    instructor: training.instructor
      ? { '@type': 'Person', name: training.instructor }
      : undefined,
    offers: {
      '@type': 'Offer',
      price: training.price,
      priceCurrency: training.currency,
    },
  }
}
