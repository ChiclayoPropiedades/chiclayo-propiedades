import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LogOut } from "lucide-react";

import { createClient } from "@/shared/lib/supabase/server";
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";

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
    .select("full_name, avatar_url, role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  const displayName =
    profile?.full_name ??
    user.user_metadata?.full_name ??
    user.email ??
    "Admin";

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar — mismo componente que el dashboard */}
      <DashboardSidebar
        displayName={displayName}
        email={user.email ?? ""}
        avatarUrl={profile?.avatar_url ?? null}
        isAdmin={true}
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
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="rounded-lg px-2 py-1 text-xs font-medium text-[#2563eb] hover:bg-[#eff6ff]"
            >
              Dashboard
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
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
