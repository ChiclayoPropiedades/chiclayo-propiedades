import Link from "next/link";
import Image from "next/image";
import { MapPin, Bed, Bath, Maximize2, Home } from "lucide-react";

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
    <div className="flex h-full w-full items-center justify-center bg-gray-100">
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
        "group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]/50",
        className
      )}
      aria-label={`Ver propiedad: ${property.title}`}
    >
      {/* Image container */}
      <div className="relative h-48 w-full shrink-0 overflow-hidden bg-gray-100">
        {coverImage ? (
          <Image
            src={coverImage.url}
            alt={coverImage.alt_text ?? property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <ImagePlaceholder />
        )}

        {/* Premium badge */}
        {property.featured && (
          <span className="absolute left-3 top-3 inline-flex items-center rounded-md bg-[#2563eb] px-2.5 py-1 text-xs font-semibold text-white shadow">
            Premium
          </span>
        )}

        {/* Operation badge */}
        <span
          className={cn(
            "absolute right-3 top-3 inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold shadow",
            property.operation === "venta"
              ? "bg-emerald-600 text-white"
              : "bg-amber-500 text-white"
          )}
        >
          {operationLabels[property.operation]}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {/* Type chip */}
        <span className="text-xs font-medium text-[#2563eb]">
          {typeLabels[property.type]}
        </span>

        {/* Title */}
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-[#1f2937] group-hover:text-[#2563eb] transition-colors">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <MapPin className="size-3.5 shrink-0 text-[#2563eb]" aria-hidden="true" />
          <span className="truncate">
            {property.district}, {property.city}
          </span>
        </div>

        {/* Price */}
        <p className="mt-auto text-lg font-bold text-[#1f2937]">
          {formatPrice(property.price, property.currency)}
        </p>
      </div>

      {/* Footer specs */}
      <div className="flex items-center gap-4 border-t border-gray-100 px-4 py-3 text-xs text-gray-500">
        {property.bedrooms !== null && (
          <span className="flex items-center gap-1">
            <Bed className="size-3.5 text-gray-400" aria-hidden="true" />
            <span>{property.bedrooms} hab.</span>
          </span>
        )}
        {property.bathrooms !== null && (
          <span className="flex items-center gap-1">
            <Bath className="size-3.5 text-gray-400" aria-hidden="true" />
            <span>{property.bathrooms} ba.</span>
          </span>
        )}
        {property.area_m2 !== null && (
          <span className="flex items-center gap-1">
            <Maximize2 className="size-3.5 text-gray-400" aria-hidden="true" />
            <span>{property.area_m2} m²</span>
          </span>
        )}
        {property.bedrooms === null && property.bathrooms === null && property.area_m2 === null && (
          <span className="text-gray-400 italic">Sin especificaciones</span>
        )}
      </div>
    </Link>
  );
}
