import Link from "next/link";
import Image from "next/image";
import { MapPin, Bed, Bath, Maximize2, Home, Crown } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { formatPrice } from "@/shared/lib/format";
import { Property } from "../types";

interface PropertyCardProps {
  property: Property;
  className?: string;
}

const operationLabels: Record<Property["operation"], string> = {
  venta: "Venta",
  alquiler: "Alquiler",
};

const typeLabels: Record<Property["type"], string> = {
  casa: "Casa",
  departamento: "Departamento",
  terreno: "Terreno",
  oficina: "Oficina",
  local: "Local",
  otro: "Otro",
};

function ImagePlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50">
      <Home className="size-12 text-gray-300" aria-hidden="true" />
    </div>
  );
}

export function PropertyCard({ property, className }: PropertyCardProps) {
  const coverImage =
    property.property_images?.find((img) => img.is_cover) ??
    property.property_images?.[0] ??
    null;

  return (
    <Link
      href={`/propiedades/${property.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1e3a5f]/50",
        className
      )}
      aria-label={`Ver propiedad: ${property.title}`}
    >
      {/* Image container */}
      <div className="relative h-52 w-full shrink-0 overflow-hidden">
        {coverImage ? (
          <Image
            src={coverImage.url}
            alt={coverImage.alt_text ?? property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <ImagePlaceholder />
        )}

        {/* Gradient overlay on image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Premium badge */}
        {property.featured && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-[#b8860b] to-[#d4a017] px-3 py-1 text-xs font-semibold text-white shadow-lg">
            <Crown className="size-3" aria-hidden="true" />
            Premium
          </span>
        )}

        {/* Operation badge */}
        <span
          className={cn(
            "absolute right-3 top-3 inline-flex items-center rounded-lg px-3 py-1 text-xs font-semibold shadow-lg",
            property.operation === "venta"
              ? "bg-[#1e3a5f] text-white"
              : "bg-[#b8860b] text-white"
          )}
        >
          {operationLabels[property.operation]}
        </span>

        {/* Price overlay on image */}
        <div className="absolute bottom-3 left-3">
          <span className="rounded-lg bg-white/95 px-3 py-1.5 text-lg font-bold text-[#1e3a5f] shadow-lg backdrop-blur-sm">
            {formatPrice(property.price, property.currency)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-5">
        {/* Type chip */}
        <span className="inline-flex w-fit items-center rounded-md bg-[#1e3a5f]/5 px-2.5 py-0.5 text-xs font-semibold text-[#1e3a5f]">
          {typeLabels[property.type]}
        </span>

        {/* Title */}
        <h3 className="line-clamp-2 text-base font-bold leading-snug text-[#1f2937] transition-colors group-hover:text-[#1e3a5f]">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <MapPin className="size-4 shrink-0 text-[#b8860b]" aria-hidden="true" />
          <span className="truncate">
            {property.district}, {property.city}
          </span>
        </div>
      </div>

      {/* Footer specs */}
      <div className="flex items-center gap-5 border-t border-gray-100 bg-gray-50/50 px-5 py-3.5 text-sm text-gray-600">
        {property.bedrooms !== null && (
          <span className="flex items-center gap-1.5">
            <Bed className="size-4 text-[#1e3a5f]" aria-hidden="true" />
            <span className="font-medium">{property.bedrooms}</span>
            <span className="text-gray-400">hab.</span>
          </span>
        )}
        {property.bathrooms !== null && (
          <span className="flex items-center gap-1.5">
            <Bath className="size-4 text-[#1e3a5f]" aria-hidden="true" />
            <span className="font-medium">{property.bathrooms}</span>
            <span className="text-gray-400">ba.</span>
          </span>
        )}
        {property.area_m2 !== null && (
          <span className="flex items-center gap-1.5">
            <Maximize2 className="size-4 text-[#1e3a5f]" aria-hidden="true" />
            <span className="font-medium">{property.area_m2}</span>
            <span className="text-gray-400">m²</span>
          </span>
        )}
        {property.bedrooms === null && property.bathrooms === null && property.area_m2 === null && (
          <span className="text-gray-400 italic text-xs">Sin especificaciones</span>
        )}
      </div>
    </Link>
  );
}
