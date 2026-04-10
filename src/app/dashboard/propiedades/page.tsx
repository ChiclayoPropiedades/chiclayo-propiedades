import { type Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Home, MapPin, Eye, Pencil } from "lucide-react";
import { createClient } from "@/shared/lib/supabase/server";
import { formatPrice } from "@/shared/lib/format";
import { SoldBadge } from "@/features/properties/components/sold-badge";
import { MarkSoldButton } from "@/features/properties/components/mark-sold-button";

export const metadata: Metadata = {
  title: "Mis Propiedades",
};

export default async function MisPropiedadesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("user_id", user.id)
    .single();

  if (!profile) redirect("/login");

  const isAdmin = profile.role === "admin";

  // Admin ve TODAS las propiedades, agente solo las suyas
  const query = supabase
    .from("properties")
    .select(
      "id, title, slug, price, currency, operation, type, district, is_active, featured, status, sale_price, sale_approved, created_at, agent:profiles!agent_id(full_name)"
    )
    .order("created_at", { ascending: false });

  if (!isAdmin) {
    query.eq("agent_id", profile.id);
  }

  const { data: properties } = await query;

  const myProperties = properties ?? [];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1f2937]">
            Mis Propiedades
          </h1>
          <p className="text-sm text-gray-500">
            Gestiona tus publicaciones inmobiliarias
          </p>
        </div>
        <Link
          href="/dashboard/propiedades/nueva"
          className="inline-flex items-center gap-2 rounded-lg bg-[#2563eb] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1e40af]"
        >
          <Plus className="size-4" />
          Nueva Propiedad
        </Link>
      </div>

      {myProperties.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-16">
          <Home className="mb-4 size-12 text-gray-300" />
          <h2 className="text-lg font-semibold text-[#1f2937]">
            No tienes propiedades publicadas
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Publica tu primera propiedad para empezar a recibir consultas
          </p>
          <Link
            href="/dashboard/propiedades/nueva"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1e40af]"
          >
            <Plus className="size-4" />
            Publicar Propiedad
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-600">
                  Propiedad
                </th>
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
              {myProperties.map((property) => (
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
                        {isAdmin && (property as Record<string, unknown>).agent && (
                          <span className="ml-1 text-blue-500">
                            · {(() => {
                              const agent = (property as Record<string, unknown>).agent;
                              if (Array.isArray(agent)) return (agent[0] as Record<string, string>)?.full_name ?? "";
                              return (agent as Record<string, string>)?.full_name ?? "";
                            })()}
                          </span>
                        )}
                      </p>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span className="font-semibold text-[#2563eb]">
                      {formatPrice(property.price, property.currency)}
                    </span>
                    {property.sale_price && (
                      <p className="text-xs text-green-600">
                        Venta: {formatPrice(property.sale_price, property.currency)}
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
                      status={property.status ?? "active"}
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
                      {(property.status ?? "active") !== "sold" && (
                        <>
                          <Link
                            href={`/dashboard/propiedades/${property.id}/editar`}
                            className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-[#2563eb]"
                            title="Editar"
                          >
                            <Pencil className="size-4" />
                          </Link>
                          {property.operation === "venta" && (
                            <MarkSoldButton
                              propertyId={property.id}
                              currentPrice={property.price}
                              currency={property.currency}
                            />
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
