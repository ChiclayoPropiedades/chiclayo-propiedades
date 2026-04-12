import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
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
