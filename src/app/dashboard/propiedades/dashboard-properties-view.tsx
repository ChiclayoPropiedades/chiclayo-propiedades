"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  LayoutGrid,
  List,
  MapPin,
  Eye,
  Pencil,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { formatPrice } from "@/shared/lib/format";
import { SoldBadge } from "@/features/properties/components/sold-badge";
import { MarkSoldButton } from "@/features/properties/components/mark-sold-button";
import { PropertyCardDashboard } from "@/features/properties/components/property-card-dashboard";

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
  created_at: string;
  agent?: { full_name: string; phone: string | null } | { full_name: string; phone: string | null }[];
  property_images?: { url: string; is_cover: boolean }[];
}

interface Props {
  properties: DashboardProperty[];
  isAdmin: boolean;
}

const PAGE_SIZE = 12;

const typeLabels: Record<string, string> = {
  casa: "Casa",
  departamento: "Departamento",
  terreno: "Terreno",
  oficina: "Oficina",
  local: "Local",
  otro: "Otro",
};

function getAgent(agent: DashboardProperty["agent"]) {
  if (!agent) return { full_name: "", phone: null };
  if (Array.isArray(agent)) return agent[0] ?? { full_name: "", phone: null };
  return agent;
}

export function DashboardPropertiesView({ properties, isAdmin }: Props) {
  const [view, setView] = useState<"cards" | "table">("cards");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  // Filtrar
  const filtered = useMemo(() => {
    if (!search.trim()) return properties;
    const q = search.toLowerCase();
    return properties.filter((p) => {
      const agent = getAgent(p.agent);
      return (
        p.title.toLowerCase().includes(q) ||
        p.district?.toLowerCase().includes(q) ||
        (p.type && typeLabels[p.type]?.toLowerCase().includes(q)) ||
        agent.full_name?.toLowerCase().includes(q)
      );
    });
  }, [properties, search]);

  // Paginar
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  function handleSearch(value: string) {
    setSearch(value);
    setPage(0);
  }

  return (
    <div className="space-y-4">
      {/* Search + Toggle */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar por título, distrito, agente..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="border-gray-200 pl-9"
          />
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1">
          <button
            onClick={() => setView("cards")}
            className={`rounded-md p-2 transition-colors ${
              view === "cards"
                ? "bg-[#2563eb] text-white"
                : "text-gray-400 hover:text-gray-600"
            }`}
            title="Vista en cards"
          >
            <LayoutGrid className="size-4" />
          </button>
          <button
            onClick={() => setView("table")}
            className={`rounded-md p-2 transition-colors ${
              view === "table"
                ? "bg-[#2563eb] text-white"
                : "text-gray-400 hover:text-gray-600"
            }`}
            title="Vista en tabla"
          >
            <List className="size-4" />
          </button>
        </div>
      </div>

      {/* Results count */}
      {search && (
        <p className="text-xs text-gray-500">
          {filtered.length} resultado{filtered.length !== 1 ? "s" : ""} para &quot;{search}&quot;
        </p>
      )}

      {paginated.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-16">
          <p className="text-sm text-gray-500">
            {search ? "No se encontraron propiedades" : "No hay propiedades"}
          </p>
        </div>
      ) : view === "cards" ? (
        /* CARDS VIEW */
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {paginated.map((property) => (
            <PropertyCardDashboard
              key={property.id}
              property={property}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="overflow-x-auto overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-600">Propiedad</th>
                {isAdmin && (
                  <th className="hidden px-4 py-3 font-medium text-gray-600 lg:table-cell">Agente</th>
                )}
                <th className="hidden px-4 py-3 font-medium text-gray-600 sm:table-cell">Precio</th>
                <th className="hidden px-4 py-3 font-medium text-gray-600 md:table-cell">Ubicación</th>
                <th className="px-4 py-3 font-medium text-gray-600">Estado</th>
                <th className="px-4 py-3 font-medium text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginated.map((property) => {
                const agent = getAgent(property.agent);
                const status = (property.status ?? "active") as "active" | "sold" | "inactive";
                return (
                  <tr key={property.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="min-w-0">
                        <p className="font-medium text-[#1f2937]">{property.title}</p>
                        <p className="text-xs capitalize text-gray-400">{property.type} en {property.operation}</p>
                      </div>
                    </td>
                    {isAdmin && (
                      <td className="hidden px-4 py-3 lg:table-cell">
                        <p className="text-sm font-medium text-gray-700">{agent.full_name}</p>
                        {agent.phone && <p className="text-xs text-gray-400">{agent.phone}</p>}
                      </td>
                    )}
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <span className="font-semibold text-[#2563eb]">
                        {formatPrice(property.price, property.currency)}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <span className="flex items-center gap-1 text-gray-500">
                        <MapPin className="size-3.5" />
                        {property.district}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <SoldBadge status={status} saleApproved={property.sale_approved ?? false} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link href={`/propiedades/${property.slug}`} className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-[#2563eb]" title="Ver">
                          <Eye className="size-4" />
                        </Link>
                        {status !== "sold" && (
                          <Link href={`/dashboard/propiedades/${property.id}/editar`} className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-[#2563eb]" title="Editar">
                            <Pencil className="size-4" />
                          </Link>
                        )}
                        {status !== "sold" && property.operation === "venta" && (
                          <MarkSoldButton propertyId={property.id} currentPrice={property.price} currency={property.currency} />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-gray-500">
            Página {page + 1} de {totalPages} ({filtered.length} propiedades)
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="rounded-md border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-30"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="rounded-md border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-30"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
