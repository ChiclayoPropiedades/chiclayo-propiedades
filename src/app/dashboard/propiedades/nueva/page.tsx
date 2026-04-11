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
