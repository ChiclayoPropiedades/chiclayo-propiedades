import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Supabase Storage — reemplaza <project-ref> con el ID real del proyecto
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
        // Imagenes del sitio original (Hostinger Horizons)
        protocol: "https",
        hostname: "www.chiclayopropiedades.com",
        pathname: "/hcgi/**",
      },
    ],
  },
};

export default nextConfig;
