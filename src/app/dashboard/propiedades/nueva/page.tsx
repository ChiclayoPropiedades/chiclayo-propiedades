import { type Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/shared/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { PropertyForm } from "@/features/properties/components/property-form";
import { createProperty } from "@/features/properties/services/property-actions";
import { isStripeConfigured } from "@/shared/lib/stripe";
import { isMercadoPagoConfigured } from "@/shared/lib/mercadopago";
import {
  getSubscriptionStatus,
  getSubscriptionSettings,
} from "@/features/subscriptions/services/subscription-actions";
import { SubscriptionWall } from "@/features/subscriptions/components/subscription-wall";
import { PublicationPlanWall } from "@/features/subscriptions/components/publication-plan-wall";
import { hasApprovedPlan } from "@/features/subscriptions/services/publication-actions";

export const metadata: Metadata = {
  title: "Nueva Propiedad",
};

export default async function NuevaPropiedadPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) redirect("/login");

  // Agentes necesitan suscripción. Admins pueden publicar sin restricción.
  if (profile.role === "agent") {
    const { active, expiresAt } = await getSubscriptionStatus(profile.id);

    if (!active) {
      const settings = await getSubscriptionSettings();

      // Leer configuración de suscripción
      const { data: subSettings } = await supabase
        .from("platform_settings")
        .select("key, value")
        .in("key", [
          "free_subscription_enabled",
          "whatsapp_payment_enabled",
          "whatsapp_payment_number",
          "whatsapp_payment_message",
        ]);

      const settingsMap: Record<string, string> = {};
      for (const row of subSettings ?? []) {
        settingsMap[row.key] = row.value;
      }
      const freeEnabled = settingsMap.free_subscription_enabled === "true";

      // Buscar si tiene suscripción expirada
      const { data: expiredSub } = await supabase
        .from("agent_subscriptions")
        .select("expires_at")
        .eq("profile_id", profile.id)
        .eq("status", "expired")
        .order("expires_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      return (
        <div className="space-y-6">
          <div>
            <Link
              href="/dashboard/propiedades"
              className="mb-3 inline-flex items-center gap-1 text-xs text-gray-400 transition-colors hover:text-[#2563eb]"
            >
              <ChevronLeft className="size-3.5" aria-hidden="true" />
              Volver a Mis Propiedades
            </Link>
            <h1 className="text-2xl font-bold text-[#1f2937]">
              Nueva Propiedad
            </h1>
          </div>
          <SubscriptionWall
            price={settings.price}
            currency={settings.currency}
            isStripeConfigured={isStripeConfigured()}
            isMercadoPagoConfigured={isMercadoPagoConfigured()}
            freeSubscriptionEnabled={freeEnabled}
            whatsappPayment={{
              enabled: settingsMap.whatsapp_payment_enabled === "true",
              number: settingsMap.whatsapp_payment_number ?? "51928216206",
              message: settingsMap.whatsapp_payment_message ?? "Hola, quiero realizar el pago de mi suscripción",
            }}
            expiredAt={expiredSub?.expires_at}
          />
        </div>
      );
    }
  }

  // Usuarios (rol user) necesitan pagar por publicación individual
  if (profile.role === "user") {
    // Verificar si ya tiene plan aprobado → mostrar formulario
    const { approved, plan } = await hasApprovedPlan(profile.id);
    if (approved && plan) {
      return (
        <div className="space-y-6">
          <div>
            <Link href="/dashboard/propiedades" className="mb-3 inline-flex items-center gap-1 text-xs text-gray-400 transition-colors hover:text-[#2563eb]">
              <ChevronLeft className="size-3.5" aria-hidden="true" />
              Volver a Mis Propiedades
            </Link>
            <h1 className="text-2xl font-bold text-[#1f2937]">Nueva Propiedad</h1>
            <p className="mt-1 text-sm text-gray-500">
              Plan {plan.name} aprobado — Máximo {plan.maxPhotos} foto{plan.maxPhotos > 1 ? "s" : ""}
            </p>
          </div>
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-[#1f2937]">
                Información de la propiedad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PropertyForm action={createProperty} />
            </CardContent>
          </Card>
        </div>
      );
    }

    const { data: pubSettings } = await supabase
      .from("platform_settings")
      .select("key, value")
      .in("key", [
        "user_pub_enabled",
        "user_pub_basic_price",
        "user_pub_basic_photos",
        "user_pub_basic_name",
        "user_pub_advanced_price",
        "user_pub_advanced_photos",
        "user_pub_advanced_name",
        "user_pub_advanced_extras",
        "user_pub_currency",
        "whatsapp_payment_number",
      ]);

    const ps: Record<string, string> = {};
    for (const row of pubSettings ?? []) ps[row.key] = row.value;

    if (ps.user_pub_enabled !== "true") {
      return (
        <div className="space-y-6">
          <div>
            <Link href="/dashboard/propiedades" className="mb-3 inline-flex items-center gap-1 text-xs text-gray-400 transition-colors hover:text-[#2563eb]">
              <ChevronLeft className="size-3.5" aria-hidden="true" />
              Volver a Mis Propiedades
            </Link>
            <h1 className="text-2xl font-bold text-[#1f2937]">Nueva Propiedad</h1>
          </div>
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 text-center">
            <p className="text-sm font-medium text-yellow-800">Publicación de propiedades no disponible</p>
            <p className="mt-1 text-xs text-yellow-600">Contacta al administrador para más información.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div>
          <Link href="/dashboard/propiedades" className="mb-3 inline-flex items-center gap-1 text-xs text-gray-400 transition-colors hover:text-[#2563eb]">
            <ChevronLeft className="size-3.5" aria-hidden="true" />
            Volver a Mis Propiedades
          </Link>
          <h1 className="text-2xl font-bold text-[#1f2937]">Nueva Propiedad</h1>
        </div>
        <PublicationPlanWall
          basic={{
            name: ps.user_pub_basic_name ?? "Básica",
            price: parseFloat(ps.user_pub_basic_price ?? "50"),
            photos: parseInt(ps.user_pub_basic_photos ?? "1"),
          }}
          advanced={{
            name: ps.user_pub_advanced_name ?? "Avanzada",
            price: parseFloat(ps.user_pub_advanced_price ?? "100"),
            photos: parseInt(ps.user_pub_advanced_photos ?? "10"),
            extras: ps.user_pub_advanced_extras ?? "",
          }}
          currency={ps.user_pub_currency ?? "PEN"}
          whatsappNumber={ps.whatsapp_payment_number ?? "51928216206"}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard/propiedades"
          className="mb-3 inline-flex items-center gap-1 text-xs text-gray-400 transition-colors hover:text-[#2563eb]"
        >
          <ChevronLeft className="size-3.5" aria-hidden="true" />
          Volver a Mis Propiedades
        </Link>
        <h1 className="text-2xl font-bold text-[#1f2937]">Nueva Propiedad</h1>
        <p className="mt-1 text-sm text-gray-500">
          Completa los datos para publicar tu propiedad en Chiclayo Propiedades
        </p>
      </div>

      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-[#1f2937]">
            Información de la propiedad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PropertyForm action={createProperty} />
        </CardContent>
      </Card>
    </div>
  );
}
