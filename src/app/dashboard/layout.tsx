import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Building2,
  UserRound,
  GraduationCap,
  MessageSquare,
  ChevronRight,
  LogOut,
  Home,
} from "lucide-react";

import { createClient } from "@/shared/lib/supabase/server";

const sidebarLinks = [
  {
    href: "/dashboard",
    label: "Resumen",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/propiedades",
    label: "Mis Propiedades",
    icon: Building2,
  },
  {
    href: "/dashboard/leads",
    label: "Mis Consultas",
    icon: MessageSquare,
  },
  {
    href: "/dashboard/perfil",
    label: "Mi Perfil",
    icon: UserRound,
  },
  {
    href: "/dashboard/capacitaciones",
    label: "Mis Capacitaciones",
    icon: GraduationCap,
  },
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
      {/* Sidebar — desktop */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-gray-200 bg-white md:flex">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-gray-100 px-5">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo-color.png"
              alt="Chiclayo Propiedades"
              width={160}
              height={40}
              className="h-9 w-auto"
            />
          </Link>
        </div>

        {/* User info */}
        <div className="border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-3">
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={displayName}
                width={40}
                height={40}
                className="size-10 shrink-0 rounded-full border border-gray-200 object-cover"
              />
            ) : (
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#eff6ff] text-sm font-bold text-[#2563eb]">
                {displayName[0]?.toUpperCase() ?? "U"}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#1f2937]">
                {displayName}
              </p>
              <p className="truncate text-xs text-gray-400">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav
          className="flex flex-1 flex-col gap-1 overflow-y-auto p-3"
          aria-label="Navegación del panel"
        >
          {sidebarLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-[#eff6ff] hover:text-[#2563eb]"
            >
              <span className="flex items-center gap-2.5">
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                {label}
              </span>
              <ChevronRight
                className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              />
            </Link>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="border-t border-gray-100 p-3">
          {isAdmin && (
            <Link
              href="/admin"
              className="mb-1 flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              <LayoutDashboard className="size-4" aria-hidden="true" />
              Panel Admin
            </Link>
          )}
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <Home className="size-4" aria-hidden="true" />
            Ir al sitio
          </Link>
        </div>
      </aside>

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
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link
                href="/admin"
                className="rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                Admin
              </Link>
            )}
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                title="Cerrar sesión"
              >
                <LogOut className="size-4" />
              </button>
            </form>
          </div>
        </header>

        {/* Mobile nav tabs */}
        <nav
          className="flex items-center gap-1 overflow-x-auto border-b border-gray-200 bg-white px-4 py-2 md:hidden"
          aria-label="Navegación del panel (móvil)"
        >
          {sidebarLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex shrink-0 flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium text-gray-600 transition-colors hover:bg-[#eff6ff] hover:text-[#2563eb]"
            >
              <Icon className="size-4" aria-hidden="true" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
