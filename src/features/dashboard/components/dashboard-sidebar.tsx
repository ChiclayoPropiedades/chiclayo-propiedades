"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Building2,
  UserRound,
  GraduationCap,
  MessageSquare,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Home,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";

const sidebarLinks = [
  { href: "/dashboard", label: "Resumen", icon: LayoutDashboard },
  { href: "/dashboard/propiedades", label: "Mis Propiedades", icon: Building2 },
  { href: "/dashboard/leads", label: "Mis Consultas", icon: MessageSquare },
  { href: "/dashboard/perfil", label: "Mi Perfil", icon: UserRound },
  {
    href: "/dashboard/capacitaciones",
    label: "Mis Capacitaciones",
    icon: GraduationCap,
  },
];

interface DashboardSidebarProps {
  displayName: string;
  email: string;
  avatarUrl: string | null;
  isAdmin: boolean;
}

export function DashboardSidebar({
  displayName,
  email,
  avatarUrl,
  isAdmin,
}: DashboardSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("dashboard-sidebar-collapsed");
    if (stored === "true") setIsCollapsed(true);
  }, []);

  function toggleCollapse() {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("dashboard-sidebar-collapsed", String(next));
      return next;
    });
  }

  return (
    <aside
      className={cn(
        "relative hidden shrink-0 flex-col border-r border-gray-200 bg-white transition-[width] duration-200 md:flex",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Toggle button */}
      <button
        onClick={toggleCollapse}
        className="absolute -right-3 top-1/2 z-10 flex size-6 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-600"
        title={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
      >
        {isCollapsed ? (
          <ChevronsRight className="size-3.5" />
        ) : (
          <ChevronsLeft className="size-3.5" />
        )}
      </button>

      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-gray-100">
        <Link href="/" className="flex items-center">
          {isCollapsed ? (
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#1e3a5f] text-xs font-bold text-white">
              CP
            </div>
          ) : (
            <Image
              src="/images/logo-color.png"
              alt="Chiclayo Propiedades"
              width={160}
              height={40}
              className="h-9 w-auto"
            />
          )}
        </Link>
      </div>

      {/* User info */}
      <div className="border-b border-gray-100 px-3 py-4">
        <div
          className={cn(
            "flex items-center",
            isCollapsed ? "justify-center" : "gap-3 px-2"
          )}
        >
          {avatarUrl ? (
            <Image
              src={avatarUrl}
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
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#1f2937]">
                {displayName}
              </p>
              <p className="truncate text-xs text-gray-400">{email}</p>
            </div>
          )}
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
            title={isCollapsed ? label : undefined}
            className={cn(
              "group flex items-center rounded-lg text-sm font-medium text-gray-600 transition-colors hover:bg-[#eff6ff] hover:text-[#2563eb]",
              isCollapsed
                ? "justify-center px-2 py-2.5"
                : "justify-between px-3 py-2.5"
            )}
          >
            <span className="flex items-center gap-2.5">
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              {!isCollapsed && label}
            </span>
            {!isCollapsed && (
              <ChevronRight
                className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              />
            )}
          </Link>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="border-t border-gray-100 p-3">
        {isAdmin && (
          <Link
            href="/admin"
            title={isCollapsed ? "Panel Admin" : undefined}
            className={cn(
              "mb-1 flex items-center rounded-lg text-sm font-medium text-red-600 transition-colors hover:bg-red-50",
              isCollapsed
                ? "justify-center px-2 py-2.5"
                : "gap-2.5 px-3 py-2.5"
            )}
          >
            <LayoutDashboard className="size-4" aria-hidden="true" />
            {!isCollapsed && "Panel Admin"}
          </Link>
        )}
        <Link
          href="/"
          title={isCollapsed ? "Ir al sitio" : undefined}
          className={cn(
            "flex items-center rounded-lg text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700",
            isCollapsed
              ? "justify-center px-2 py-2.5"
              : "gap-2.5 px-3 py-2.5"
          )}
        >
          <Home className="size-4" aria-hidden="true" />
          {!isCollapsed && "Ir al sitio"}
        </Link>
      </div>
    </aside>
  );
}
