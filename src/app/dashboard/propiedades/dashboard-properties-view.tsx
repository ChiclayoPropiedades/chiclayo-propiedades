"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutGrid,
  List,
  MapPin,
  Eye,
  Pencil,
} from "lucide-react";
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
  agent?: { full_name: string; email: string; phone: string | null } | { full_name: string; email: string; phone: string | null }[];
  property_images?: { url: string; is_cover: boolean }[];
}

interface Props {
  properties: DashboardProperty[];
  isAdmin: boolean;
}

function getAgent(agent: DashboardProperty["agent"]) {
  if (!agent) return { full_name: "", email: "", phone: null };
  if (Array.isArray(agent)) return agent[0] ?? { full_name: "", email: "", phone: null };
  return agent;
}

export function DashboardPropertiesView({ properties, isAdmin }: Props) {
  const [view, setView] = useState<"cards" | "table">("cards");

  return (
    <div>
      {/* Toggle */}
      <div className="mb-4 flex items-center justify-end gap-1 rounded-lg border border-gray-200 bg-white p-1 w-fit ml-auto">
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

      {view === "cards" ? (
        /* CARDS VIEW */
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {properties.map((property) => (
            <PropertyCardDashboard
              key={property.id}
              property={property}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-600">
                  Propiedad
                </th>
                {isAdmin && (
                  <th className="hidden px-4 py-3 font-medium text-gray-600 lg:table-cell">
                    Agente
                  </th>
                )}
                <th className="hidden px-4 py-3 font-medium text-gray-600 sm:table-cell">
                  Precio
                </th>
                <th className="hidden px-4 py-3 font-medium text-gray-600 md:table-cell">
                  Ubicación
                </th>
                <th className="px-4 py-3 font-medium text-gray-600">Estado</th>
                <th className="px-4 py-3 font-medium text-gray-600">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {properties.map((property) => {
                const agent = getAgent(property.agent);
                const status = (property.status ?? "active") as
                  | "active"
                  | "sold"
                  | "inactive";
                return (
                  <tr
                    key={property.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-[#1f2937]">
                          {property.title}
                        </p>
                        <p className="text-xs capitalize text-gray-400">
                          {property.type} en {property.operation}
                        </p>
                      </div>
                    </td>
                    {isAdmin && (
                      <td className="hidden px-4 py-3 lg:table-cell">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-gray-700">
                            {agent.full_name}
                          </p>
                          <p className="truncate text-xs text-gray-400">
                            {agent.email}
                          </p>
                        </div>
                      </td>
                    )}
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <span className="font-semibold text-[#2563eb]">
                        {formatPrice(property.price, property.currency)}
                      </span>
                      {property.sale_price && (
                        <p className="text-xs text-green-600">
                          Venta:{" "}
                          {formatPrice(
                            property.sale_price,
                            property.currency
                          )}
                        </p>
                      )}
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <span className="flex items-center gap-1 text-gray-500">
                        <MapPin className="size-3.5" />
                        {property.district}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <SoldBadge
                        status={status}
                        saleApproved={property.sale_approved ?? false}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/propiedades/${property.slug}`}
                          className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-[#2563eb]"
                          title="Ver"
                        >
                          <Eye className="size-4" />
                        </Link>
                        {status !== "sold" && (
                          <Link
                            href={`/dashboard/propiedades/${property.id}/editar`}
                            className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-[#2563eb]"
                            title="Editar"
                          >
                            <Pencil className="size-4" />
                          </Link>
                        )}
                        {status !== "sold" &&
                          property.operation === "venta" && (
                            <MarkSoldButton
                              propertyId={property.id}
                              currentPrice={property.price}
                              currency={property.currency}
                            />
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
    </div>
  );
}
