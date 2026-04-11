import { type Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Home, Clock, CheckCircle2, XCircle } from "lucide-react";
import { createClient } from "@/shared/lib/supabase/server";
import { DashboardPropertiesView } from "./dashboard-properties-view";

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
  const isUser = profile.role === "user";

  // Para usuarios: ver estado de su solicitud de publicación
  let userPubRequest: { plan_name: string; plan_price: number; currency: string; status: string } | null = null;
  if (isUser) {
    const { data: req } = await supabase
      .from("publication_requests")
      .select("plan_name, plan_price, currency, status")
      .eq("profile_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    userPubRequest = req;
  }

  const query = supabase
    .from("properties")
    .select(
      "id, title, slug, price, currency, operation, type, district, is_active, featured, status, sale_price, sale_approved, bedrooms, bathrooms, area_m2, created_at, agent:profiles!agent_id(full_name, phone), property_images(url, is_cover)"
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
            {isAdmin ? "Todas las Propiedades" : "Mis Propiedades"}
          </h1>
          <p className="text-sm text-gray-500">
            {isAdmin
              ? `${myProperties.length} propiedades en la plataforma`
              : "Gestiona tus publicaciones inmobiliarias"}
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

      {/* Estado de solicitud de publicación (solo usuarios) */}
      {isUser && userPubRequest && (
        <div className={`mb-6 flex items-start gap-3 rounded-lg border p-4 ${
          userPubRequest.status === "pending"
            ? "border-yellow-200 bg-yellow-50"
            : userPubRequest.status === "approved"
              ? "border-green-200 bg-green-50"
              : "border-red-200 bg-red-50"
        }`}>
          {userPubRequest.status === "pending" ? (
            <Clock className="mt-0.5 size-5 shrink-0 text-yellow-600" />
          ) : userPubRequest.status === "approved" ? (
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-600" />
          ) : (
            <XCircle className="mt-0.5 size-5 shrink-0 text-red-600" />
          )}
          <div>
            <p className={`text-sm font-medium ${
              userPubRequest.status === "pending" ? "text-yellow-800"
                : userPubRequest.status === "approved" ? "text-green-800"
                  : "text-red-800"
            }`}>
              {userPubRequest.status === "pending"
                ? `Solicitud pendiente — Plan ${userPubRequest.plan_name} (${userPubRequest.currency === "USD" ? "$" : "S/"} ${userPubRequest.plan_price})`
                : userPubRequest.status === "approved"
                  ? `Plan ${userPubRequest.plan_name} aprobado — ¡Ya puedes publicar!`
                  : `Solicitud rechazada — Plan ${userPubRequest.plan_name}`}
            </p>
            <p className={`mt-0.5 text-xs ${
              userPubRequest.status === "pending" ? "text-yellow-600"
                : userPubRequest.status === "approved" ? "text-green-600"
                  : "text-red-600"
            }`}>
              {userPubRequest.status === "pending"
                ? "El administrador revisará tu solicitud después de recibir el pago."
                : userPubRequest.status === "approved"
                  ? "Haz click en 'Nueva Propiedad' para publicar."
                  : "Contacta al administrador para más información."}
            </p>
          </div>
        </div>
      )}

      {myProperties.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-16">
          <Home className="mb-4 size-12 text-gray-300" />
          <h2 className="text-lg font-semibold text-[#1f2937]">
            No hay propiedades publicadas
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
        <DashboardPropertiesView
          properties={myProperties}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
}
