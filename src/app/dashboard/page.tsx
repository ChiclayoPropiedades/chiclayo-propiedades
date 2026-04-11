import { type Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  MessageSquare,
  GraduationCap,
  TrendingUp,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Calendar,
} from "lucide-react";

import { createClient } from "@/shared/lib/supabase/server";
import { getDashboardStats } from "@/features/dashboard/services/get-dashboard-data";
import { getSubscriptionStatus } from "@/features/subscriptions/services/subscription-actions";

export const metadata: Metadata = {
  title: "Panel de Control",
  description: "Gestiona tus propiedades, consultas y capacitaciones.",
};

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  accentClass: string;
}

function StatCard({
  title,
  value,
  description,
  icon,
  accentClass,
}: StatCardProps) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div
        className={[
          "flex size-12 shrink-0 items-center justify-center rounded-xl",
          accentClass,
        ].join(" ")}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="mt-1 text-3xl font-extrabold tabular-nums text-[#1f2937]">
          {value}
        </p>
        <p className="mt-0.5 text-xs text-gray-400">{description}</p>
      </div>
    </div>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("user_id", user.id)
    .maybeSingle();

  const stats = await getDashboardStats(user.id);

  // Verificar suscripción si es agente
  const isAgent = profile?.role === "agent";
  const subscription = isAgent && profile
    ? await getSubscriptionStatus(profile.id)
    : null;

  return (
    <div className="flex flex-col gap-8">
      {/* Page title */}
      <div className="flex items-center gap-3">
        <TrendingUp className="size-6 text-[#2563eb]" aria-hidden="true" />
        <div>
          <h1 className="text-2xl font-bold text-[#1f2937]">
            Panel de Control
          </h1>
          <p className="text-sm text-gray-500">
            Resumen de tu actividad en la plataforma
          </p>
        </div>
      </div>

      {/* Subscription status for agents */}
      {isAgent && subscription && (
        <div
          className={`flex items-center gap-4 rounded-xl border p-5 ${
            subscription.active
              ? "border-green-200 bg-green-50"
              : "border-yellow-200 bg-yellow-50"
          }`}
        >
          <div
            className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${
              subscription.active ? "bg-green-100" : "bg-yellow-100"
            }`}
          >
            {subscription.active ? (
              <CheckCircle2 className="size-6 text-green-600" />
            ) : (
              <AlertTriangle className="size-6 text-yellow-600" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p
              className={`text-sm font-semibold ${
                subscription.active ? "text-green-800" : "text-yellow-800"
              }`}
            >
              {subscription.active
                ? "Suscripción activa"
                : "Sin suscripción activa"}
            </p>
            {subscription.active && subscription.expiresAt ? (
              <div className="mt-1 flex items-center gap-1.5 text-xs text-green-600">
                <Calendar className="size-3.5" />
                <span>Válida hasta el {formatDate(subscription.expiresAt)}</span>
              </div>
            ) : (
              <p className="mt-1 text-xs text-yellow-700">
                Necesitas una suscripción activa para publicar propiedades.
              </p>
            )}
          </div>
          {!subscription.active && (
            <Link
              href="/dashboard/propiedades/nueva"
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1e40af]"
            >
              <Shield className="size-4" />
              Suscribirme
            </Link>
          )}
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Propiedades Activas"
          value={stats.propertiesCount}
          description="Publicaciones vigentes en el portal"
          icon={
            <Building2
              className="size-6 text-[#2563eb]"
              aria-hidden="true"
            />
          }
          accentClass="bg-[#eff6ff]"
        />
        <StatCard
          title="Consultas Recibidas"
          value={stats.inquiriesCount}
          description="Mensajes de clientes interesados"
          icon={
            <MessageSquare
              className="size-6 text-violet-600"
              aria-hidden="true"
            />
          }
          accentClass="bg-violet-50"
        />
        <StatCard
          title="Capacitaciones"
          value={stats.enrollmentsCount}
          description="Cursos en los que estás inscrito"
          icon={
            <GraduationCap
              className="size-6 text-emerald-600"
              aria-hidden="true"
            />
          }
          accentClass="bg-emerald-50"
        />
      </div>

      {/* Empty state when all zeros */}
      {stats.propertiesCount === 0 &&
        stats.inquiriesCount === 0 &&
        stats.enrollmentsCount === 0 && (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white p-10 text-center">
            <TrendingUp
              className="mx-auto size-10 text-gray-300"
              aria-hidden="true"
            />
            <h2 className="mt-4 text-base font-semibold text-[#1f2937]">
              Bienvenido a tu panel
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Aquí aparecerá un resumen de tu actividad una vez que tengas
              propiedades publicadas, consultas o inscripciones.
            </p>
          </div>
        )}
    </div>
  );
}
