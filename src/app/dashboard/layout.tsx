import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Building2,
  UserRound,
  GraduationCap,
  ChevronRight,
} from "lucide-react";

import { Header } from "@/shared/components/layout/header";
import { Footer } from "@/shared/components/layout/footer";
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

  // Try to fetch display name from profiles
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .single();

  const displayName =
    profile?.full_name ?? user.user_metadata?.full_name ?? user.email ?? "Usuario";

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white md:block">
          <div className="flex h-full flex-col">
            {/* User info */}
            <div className="border-b border-gray-100 px-5 py-5">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#eff6ff] text-sm font-bold text-[#2563eb]">
                  {displayName[0]?.toUpperCase() ?? "U"}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#1f2937]">
                    {displayName}
                  </p>
                  <p className="truncate text-xs text-gray-400">
                    {profile?.email ?? user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-1 p-3" aria-label="Navegación del panel">
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
          </div>
        </aside>

        {/* Mobile nav */}
        <div className="w-full md:hidden">
          <nav
            className="flex items-center gap-1 overflow-x-auto border-b border-gray-200 bg-white px-4 py-2"
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
        </div>

        {/* Main content */}
        <main className="flex-1 bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
