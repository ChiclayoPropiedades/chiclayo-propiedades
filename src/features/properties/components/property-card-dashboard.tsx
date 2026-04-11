"use client";

import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Home,
  Crown,
  Pencil,
  Eye,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/shared/lib/utils";
import { formatPrice } from "@/shared/lib/format";
import { SoldBadge } from "./sold-badge";
import { MarkSoldButton } from "./mark-sold-button";
import { deleteProperty } from "@/features/admin/services/admin-actions";

interface DashboardProperty {
  id: string;
  title: string;
  slug: string;
  price: number;
  currency: "PEN" | "USD";
  operation: string;
  type: string;
  district: string;
  is_active: boolean;
  featured: boolean;
  status: string | null;
  sale_price: number | null;
  sale_approved: boolean | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  area_m2?: number | null;
  property_images?: { url: string; is_cover: boolean }[];
  agent?: { full_name: string } | { full_name: string }[];
}

interface PropertyCardDashboardProps {
  property: DashboardProperty;
  isAdmin: boolean;
}

const operationLabels: Record<string, string> = {
  venta: "Venta",
  alquiler: "Alquiler",
};

const typeLabels: Record<string, string> = {
  casa: "Casa",
  departamento: "Departamento",
  terreno: "Terreno",
  oficina: "Oficina",
  local: "Local",
  otro: "Otro",
};

function getAgentName(
  agent?: { full_name: string } | { full_name: string }[]
): string {
  if (!agent) return "";
  if (Array.isArray(agent)) return agent[0]?.full_name ?? "";
  return agent.full_name ?? "";
}

export function PropertyCardDashboard({
  property,
  isAdmin,
}: PropertyCardDashboardProps) {
  const [isPending, startTransition] = useTransition();

  const coverImage =
    property.property_images?.find((img) => img.is_cover) ??
    property.property_images?.[0] ??
    null;

  const status = (property.status ?? "active") as
    | "active"
    | "sold"
    | "inactive";
  const agentName = getAgentName(property.agent);

  function handleDelete() {
    if (!confirm(`¿Eliminar "${property.title}"? Esta acción no se puede deshacer.`)) return;
    startTransition(async () => {
      try {
        await deleteProperty(property.id);
        toast.success("Propiedad eliminada");
        window.location.reload();
      } catch {
        toast.error("Error al eliminar");
      }
    });
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-gray-100 transition-all duration-300 hover:shadow-xl">
      {/* Image */}
      <div className="relative h-36 w-full shrink-0 overflow-hidden sm:h-48">
        {coverImage ? (
          <Image
            src={coverImage.url}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50">
            <Home className="size-12 text-gray-300" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Badges top */}
        <div className="absolute left-3 top-3 flex items-center gap-2">
          {property.featured && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-[#b8860b] to-[#d4a017] px-2 py-0.5 text-xs font-semibold text-white shadow">
              <Crown className="size-3" />
              Premium
            </span>
          )}
          <SoldBadge
            status={status}
            saleApproved={property.sale_approved ?? false}
          />
        </div>

        <span
          className={cn(
            "absolute right-3 top-3 rounded-lg px-2 py-0.5 text-xs font-semibold shadow",
            property.operation === "venta"
              ? "bg-[#1e3a5f] text-white"
              : "bg-[#b8860b] text-white"
          )}
        >
          {operationLabels[property.operation] ?? property.operation}
        </span>

        {/* Price */}
        <div className="absolute bottom-3 left-3">
          <span className="rounded-lg bg-white/95 px-2.5 py-1 text-base font-bold text-[#1e3a5f] shadow backdrop-blur-sm">
            {formatPrice(property.price, property.currency)}
          </span>
        </div>

        {/* Action buttons overlay */}
        <div className="absolute right-3 bottom-3 flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
          <Link
            href={`/propiedades/${property.slug}`}
            className="rounded-lg bg-white/90 p-2 text-gray-700 shadow transition hover:bg-white"
            title="Ver publicación"
          >
            <Eye className="size-4" />
          </Link>
          <Link
            href={`/dashboard/propiedades/${property.id}/editar`}
            className="rounded-lg bg-[#2563eb]/90 p-2 text-white shadow transition hover:bg-[#2563eb]"
            title="Editar"
          >
            <Pencil className="size-4" />
          </Link>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="rounded-lg bg-red-500/90 p-2 text-white shadow transition hover:bg-red-600 disabled:opacity-50"
            title="Eliminar"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <span className="inline-flex w-fit items-center rounded-md bg-[#1e3a5f]/5 px-2 py-0.5 text-xs font-semibold text-[#1e3a5f]">
          {typeLabels[property.type] ?? property.type}
        </span>

        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-[#1f2937]">
          {property.title}
        </h3>

        <div className="flex items-center gap-1 text-xs text-gray-500">
          <MapPin className="size-3 shrink-0 text-[#b8860b]" />
          <span className="truncate">{property.district}</span>
        </div>

        {isAdmin && agentName && (
          <p className="text-xs text-blue-500">Agente: {agentName}</p>
        )}

        {property.sale_price && (
          <p className="text-xs font-medium text-green-600">
            Venta: {formatPrice(property.sale_price, property.currency)}
          </p>
        )}
      </div>

      {/* Footer specs */}
      <div className="flex items-center gap-2 border-t border-gray-100 px-3 py-2 text-xs text-gray-500 sm:gap-4 sm:px-4 sm:py-2.5">
        {property.bedrooms != null && (
          <span className="flex items-center gap-1">
            <Bed className="size-3.5 text-[#1e3a5f]" />
            {property.bedrooms} hab.
          </span>
        )}
        {property.bathrooms != null && (
          <span className="flex items-center gap-1">
            <Bath className="size-3.5 text-[#1e3a5f]" />
            {property.bathrooms} ba.
          </span>
        )}
        {property.area_m2 != null && (
          <span className="flex items-center gap-1">
            <Maximize2 className="size-3.5 text-[#1e3a5f]" />
            {property.area_m2} m²
          </span>
        )}
      </div>

      {/* Mark sold action */}
      {status !== "sold" && property.operation === "venta" && (
        <div className="border-t border-gray-100 px-4 py-2.5">
          <MarkSoldButton
            propertyId={property.id}
            currentPrice={property.price}
            currency={property.currency}
          />
        </div>
      )}
    </div>
  );
}
