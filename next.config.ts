import type { NextConfig } from "next";

/**
 * Headers HTTP de seguridad (H-1.4).
 *
 * Politica: CSP en modo Report-Only para empezar (no rompe UI, solo emite
 * violations a console/report-uri). Tras 1-2 semanas validando, mover a
 * Content-Security-Policy estricta. Los demas headers son enforcement directo
 * y no afectan funcionalidad de usuarios legitimos.
 */
const SECURITY_HEADERS = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=()",
  },
  {
    key: "Content-Security-Policy-Report-Only",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://sdk.mercadopago.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://*.supabase.co https://*.supabase.in https://www.chiclayopropiedades.com https://chiclayopropiedades.com https://images.unsplash.com https://horizons-cdn.hostinger.com",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://api.mercadopago.com",
      "frame-src https://js.stripe.com https://hooks.stripe.com https://www.mercadopago.com",
      "frame-ancestors 'none'",
      "form-action 'self' https://checkout.stripe.com https://www.mercadopago.com",
      "base-uri 'self'",
      "object-src 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
    ];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        // Supabase Storage
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        // Supabase CDN alternativo
        protocol: "https",
        hostname: "*.supabase.in",
        pathname: "/storage/v1/object/public/**",
      },
      {
        // Imagenes del sitio original (Hostinger Horizons) - con www
        protocol: "https",
        hostname: "www.chiclayopropiedades.com",
        pathname: "/hcgi/**",
      },
      {
        // Imagenes del sitio original (Hostinger Horizons) - sin www
        protocol: "https",
        hostname: "chiclayopropiedades.com",
        pathname: "/hcgi/**",
      },
      {
        // Unsplash (imagen hero)
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        // Hostinger CDN (logos del sitio original)
        protocol: "https",
        hostname: "horizons-cdn.hostinger.com",
      },
    ],
  },
};

export default nextConfig;
