import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Home,
  MessageSquare,
  FileText,
  GraduationCap,
  Briefcase,
  Trophy,
  Settings,
} from "lucide-react";

import { createClient } from "@/shared/lib/supabase/server";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
  { href: "/admin/propiedades", label: "Propiedades", icon: Home },
  { href: "/admin/leads", label: "Leads", icon: MessageSquare },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/capacitaciones", label: "Capacitaciones", icon: GraduationCap },
  { href: "/admin/servicios", label: "Servicios", icon: Briefcase },
  { href: "/admin/ranking", label: "Ranking", icon: Trophy },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
];

export default async function AdminLayout({
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
    .select("full_name, role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  const displayName = profile?.full_name ?? user.email ?? "Admin";

  return (
    <div className="flex min-h-screen">
      {/* Sidebar desktop */}
      <aside
        className="hidden w-60 shrink-0 flex-col bg-[#1f2937] text-white md:flex"
        aria-label="Navegación del panel de administración"
      >
        {/* Logo / Título */}
        <div className="border-b border-white/10 px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/50">
            Panel Admin
          </p>
          <p className="mt-0.5 text-sm font-bold text-white">
            Chiclayo Propiedades
          </p>
        </div>

        {/* Admin info */}
        <div className="border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#2563eb] text-xs font-bold text-white">
              {displayName[0]?.toUpperCase() ?? "A"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-white">
                {displayName}
              </p>
              <p className="text-[10px] text-white/40">Administrador</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex flex-1 flex-col gap-0.5 p-3">
          {sidebarLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Footer link */}
        <div className="border-t border-white/10 p-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-white/40 transition-colors hover:text-white/70"
          >
            Ir al Dashboard
          </Link>
        </div>
      </aside>

      {/* Layout principal */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
          <h1 className="text-sm font-semibold text-[#1f2937]">
            Panel de Administración
          </h1>
          <span className="text-xs text-gray-500">{displayName}</span>
        </header>

        {/* Mobile nav */}
        <nav
          className="flex items-center gap-1 overflow-x-auto border-b border-gray-200 bg-[#1f2937] px-3 py-2 md:hidden"
          aria-label="Navegación del panel (móvil)"
        >
          {sidebarLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex shrink-0 flex-col items-center gap-1 rounded-lg px-2.5 py-2 text-[10px] font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Icon className="size-4" aria-hidden="true" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Contenido */}
        <main className="flex-1 bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
