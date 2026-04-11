import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Phone, Mail, FileText } from "lucide-react";

import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import {
  getUserProfile,
  getUserProperties,
  getUserInquiries,
} from "@/features/admin/services/user-detail-actions";
import { UserDetailTabs } from "@/features/admin/components/user-detail-tabs";
import { getSubscriptionStatus } from "@/features/subscriptions/services/subscription-actions";
import { ExtendSubscriptionForm } from "@/features/subscriptions/components/extend-subscription-form";
import { EditUserForm } from "@/features/admin/components/edit-user-form";
import { PublicationRequestsTable } from "@/features/admin/components/publication-requests-table";
import { createAdminClient } from "@/shared/lib/supabase/admin";
import { getAllPublicationRequests } from "@/features/subscriptions/services/publication-actions";

const roleLabels: Record<string, string> = {
  admin: "Administrador",
  agent: "Agente",
  user: "Usuario",
};

const roleColors: Record<string, string> = {
  admin: "border-red-200 bg-red-100 text-red-800",
  agent: "border-blue-200 bg-blue-100 text-blue-800",
  user: "border-gray-200 bg-gray-100 text-gray-700",
};

async function UserPublicationSection({ profileId }: { profileId: string }) {
  const allRequests = await getAllPublicationRequests();
  const userRequests = allRequests.filter((r) => r.profile_id === profileId);

  if (userRequests.length === 0) {
    return (
      <Card className="border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FileText className="size-4" />
            <span>Este usuario no tiene solicitudes de publicación.</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200">
      <CardContent className="p-0">
        <div className="flex items-center gap-2 border-b border-gray-200 px-6 py-3">
          <FileText className="size-4 text-[#2563eb]" />
          <h3 className="text-sm font-semibold text-[#1f2937]">
            Solicitudes de publicación ({userRequests.length})
          </h3>
        </div>
        <PublicationRequestsTable requests={userRequests} />
      </CardContent>
    </Card>
  );
}

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [profile, properties, inquiries] = await Promise.all([
    getUserProfile(id),
    getUserProperties(id),
    getUserInquiries(id),
  ]);

  // Suscripción solo para agentes
  const isAgent = profile?.role === "agent";
  const subscription = isAgent ? await getSubscriptionStatus(id) : null;

  if (!profile) {
    notFound();
  }

  // Obtener email del usuario
  const adminSupabase = createAdminClient();
  const { data: authUserData } = await adminSupabase.auth.admin.getUserById(
    profile.user_id
  );
  const userEmail = authUserData?.user?.email ?? "";

  const displayName = profile.full_name ?? "Sin nombre";

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/admin/usuarios"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-[#2563eb]"
      >
        <ArrowLeft className="size-4" />
        Volver a usuarios
      </Link>

      {/* User header */}
      <Card className="border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={displayName}
                width={64}
                height={64}
                className="size-16 rounded-full border border-gray-200 object-cover"
              />
            ) : (
              <div className="flex size-16 items-center justify-center rounded-full bg-[#eff6ff] text-xl font-bold text-[#2563eb]">
                {displayName[0]?.toUpperCase() ?? "U"}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-[#1f2937]">
                  {displayName}
                </h2>
                <Badge
                  variant="outline"
                  className={roleColors[profile.role ?? "user"]}
                >
                  {roleLabels[profile.role ?? "user"] ?? profile.role}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    profile.is_active !== false
                      ? "border-green-200 bg-green-100 text-green-800"
                      : "border-red-200 bg-red-100 text-red-800"
                  }
                >
                  {profile.is_active !== false ? "Activo" : "Inactivo"}
                </Badge>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                {userEmail && (
                  <span className="flex items-center gap-1">
                    <Mail className="size-3.5" />
                    {userEmail}
                  </span>
                )}
                {profile.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="size-3.5" />
                    {profile.phone}
                  </span>
                )}
              </div>
            </div>

            {/* Quick stats */}
            <div className="hidden gap-6 sm:flex">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#1f2937]">
                  {properties.length}
                </p>
                <p className="text-xs text-gray-500">Propiedades</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#1f2937]">
                  {inquiries.length}
                </p>
                <p className="text-xs text-gray-500">Leads</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#1f2937]">
                  {properties.filter((p) => p.status === "sold").length}
                </p>
                <p className="text-xs text-gray-500">Ventas</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription management for agents */}
      {/* Suscripción agente */}
      {isAgent && (
        <ExtendSubscriptionForm
          profileId={id}
          hasActiveSubscription={subscription?.active ?? false}
          expiresAt={subscription?.expiresAt ?? null}
        />
      )}

      {/* Solicitudes de publicación (usuarios) */}
      {profile.role === "user" && (
        <UserPublicationSection profileId={id} />
      )}

      {/* Edit user form */}
      <EditUserForm
        profileId={id}
        userId={profile.user_id}
        initialData={{
          full_name: profile.full_name ?? "",
          phone: profile.phone ?? "",
          bio: profile.bio ?? "",
          role: profile.role ?? "user",
          email: userEmail,
          avatar_url: profile.avatar_url ?? "",
        }}
      />

      {/* Tabs */}
      <UserDetailTabs properties={properties} inquiries={inquiries} />
    </div>
  );
}
