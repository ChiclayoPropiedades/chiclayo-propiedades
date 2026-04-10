import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Building2,
  UserRound,
  GraduationCap,
  MessageSquare,
  Users,
  FileText,
  Briefcase,
  Trophy,
  Settings,
  Home,
  LogOut,
} from "lucide-react";

import { createClient } from "@/shared/lib/supabase/server";
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";

const mobileLinks = [
  { href: "/dashboard", label: "Resumen", icon: LayoutDashboard },
  { href: "/dashboard/propiedades", label: "Propiedades", icon: Building2 },
  { href: "/dashboard/leads", label: "Consultas", icon: MessageSquare },
  { href: "/dashboard/perfil", label: "Perfil", icon: UserRound },
  { href: "/dashboard/capacitaciones", label: "Cursos", icon: GraduationCap },
];

const mobileAdminLinks = [
  { href: "/admin", label: "Admin", icon: LayoutDashboard },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
  { href: "/admin/propiedades", label: "Props", icon: Home },
  { href: "/admin/leads", label: "Leads", icon: MessageSquare },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/capacitaciones", label: "Cursos", icon: GraduationCap },
  { href: "/admin/servicios", label: "Servicios", icon: Briefcase },
  { href: "/admin/ranking", label: "Ranking", icon: Trophy },
  { href: "/admin/configuracion", label: "Config", icon: Settings },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, role")
    .eq("user_id", user.id)
    .single();

  const displayName =
    profile?.full_name ??
    user.user_metadata?.full_name ??
    user.email ??
    "Usuario";

  const isAdmin = profile?.role === "admin";

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar — desktop (colapsable) */}
      <DashboardSidebar
        displayName={displayName}
        email={user.email ?? ""}
        avatarUrl={profile?.avatar_url ?? null}
        isAdmin={isAdmin}
      />

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar — mobile */}
        <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 md:hidden">
          <Link href="/">
            <Image
              src="/images/logo-color.png"
              alt="Chiclayo Propiedades"
              width={120}
              height={30}
              className="h-7 w-auto"
            />
          </Link>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              title="Cerrar sesión"
            >
              <LogOut className="size-4" />
            </button>
          </form>
        </header>

        {/* Mobile nav tabs */}
        <nav
          className="flex items-center gap-1 overflow-x-auto border-b border-gray-200 bg-white px-4 py-2 md:hidden"
          aria-label="Navegación del panel (móvil)"
        >
          {mobileLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex shrink-0 flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium text-gray-600 transition-colors hover:bg-[#eff6ff] hover:text-[#2563eb]"
            >
              <Icon className="size-4" aria-hidden="true" />
              <span>{label}</span>
            </Link>
          ))}
          {isAdmin && (
            <>
              <div className="mx-1 h-6 w-px shrink-0 bg-gray-200" />
              {mobileAdminLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex shrink-0 flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <Icon className="size-4" aria-hidden="true" />
                  <span>{label}</span>
                </Link>
              ))}
            </>
          )}
        </nav>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
