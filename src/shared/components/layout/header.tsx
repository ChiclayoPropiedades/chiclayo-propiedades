"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { MenuIcon, User, LogOut, LayoutDashboard, Shield } from "lucide-react"

import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet"
import { createClient } from "@/shared/lib/supabase/client"
import { PROFILE_UPDATED_EVENT } from "@/shared/lib/events"

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/propiedades", label: "Propiedades" },
  { href: "/servicios", label: "Servicios" },
  { href: "/ranking", label: "Ranking" },
  { href: "/capacitaciones", label: "Capacitaciones" },
  { href: "/blog", label: "Blog" },
  { href: "/contacto", label: "Contacto" },
]

interface UserProfile {
  full_name: string
  role: string
  avatar_url: string | null
}

function Logo() {
  return (
    <Link href="/" className="flex flex-col items-center leading-none select-none">
      <span className="text-lg font-black tracking-widest text-[#1f2937] uppercase">
        Chiclayo
      </span>
      <span className="text-xs font-semibold tracking-[0.3em] text-[#b8860b] uppercase">
        Propiedades
      </span>
    </Link>
  )
}

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setProfile(null)
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from("profiles")
        .select("full_name, role, avatar_url")
        .eq("user_id", user.id)
        .single()

      setProfile(data)
      setLoading(false)
    }

    getProfile()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      getProfile()
    })

    // Escuchar cambios de perfil (avatar, nombre, etc.)
    function onProfileUpdated() {
      getProfile()
    }
    window.addEventListener(PROFILE_UPDATED_EVENT, onProfileUpdated)

    return () => {
      subscription.unsubscribe()
      window.removeEventListener(PROFILE_UPDATED_EVENT, onProfileUpdated)
    }
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setProfile(null)
    router.push("/")
    router.refresh()
  }

  const isAdmin = profile?.role === "admin"

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Navegación principal">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                pathname === link.href
                  ? "text-[#1e40af] bg-[#eff6ff]"
                  : "text-[#1f2937] hover:text-[#1e40af] hover:bg-[#eff6ff]"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden lg:flex items-center gap-3">
          {loading ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-gray-100" />
          ) : profile ? (
            <>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                >
                  <Shield className="size-4" />
                  Admin
                </Link>
              )}
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2563eb] hover:text-[#1e40af] transition-colors"
              >
                <LayoutDashboard className="size-4" />
                Panel
              </Link>
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5">
                {profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    width={28}
                    height={28}
                    className="size-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex size-7 items-center justify-center rounded-full bg-[#2563eb] text-xs font-bold text-white">
                    {profile.full_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-medium text-[#1f2937] max-w-[120px] truncate">
                  {profile.full_name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-red-600"
              >
                <LogOut className="size-4" />
                Salir
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-[#2563eb] hover:text-[#1e40af] transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/signup"
                className="inline-flex h-9 items-center justify-center rounded-lg bg-[#2563eb] px-4 text-sm font-medium text-white transition-colors hover:bg-[#1e40af] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]/50"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menú" />
            }
          >
            <MenuIcon className="size-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="border-b border-gray-200 px-6 py-4">
              <SheetTitle>
                <span className="sr-only">Menú de navegación</span>
              </SheetTitle>
              <Logo />
            </SheetHeader>

            {/* User info in mobile */}
            {profile && (
              <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-3 bg-[#eff6ff]">
                {profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    width={32}
                    height={32}
                    className="size-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex size-8 items-center justify-center rounded-full bg-[#2563eb] text-sm font-bold text-white">
                    {profile.full_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#1f2937]">{profile.full_name}</p>
                  <p className="text-xs text-gray-500 capitalize">{profile.role}</p>
                </div>
              </div>
            )}

            <nav
              className="flex flex-col gap-1 p-4"
              aria-label="Navegación móvil"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block px-4 py-2.5 text-sm font-medium rounded-md transition-colors",
                    pathname === link.href
                      ? "text-[#1e40af] bg-[#eff6ff]"
                      : "text-[#1f2937] hover:text-[#1e40af] hover:bg-[#eff6ff]"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col gap-2 border-t border-gray-200 p-4">
              {profile ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="flex h-10 items-center justify-center gap-2 rounded-md border border-[#2563eb] text-sm font-medium text-[#2563eb] transition-colors hover:bg-[#eff6ff]"
                  >
                    <LayoutDashboard className="size-4" />
                    Mi Panel
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setOpen(false)}
                      className="flex h-10 items-center justify-center gap-2 rounded-md border border-red-300 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                      <Shield className="size-4" />
                      Administración
                    </Link>
                  )}
                  <button
                    onClick={() => { setOpen(false); handleLogout(); }}
                    className="flex h-10 items-center justify-center gap-2 rounded-md bg-gray-100 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                  >
                    <LogOut className="size-4" />
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex h-10 items-center justify-center rounded-md border border-[#2563eb] text-sm font-medium text-[#2563eb] transition-colors hover:bg-[#eff6ff]"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className="flex h-10 items-center justify-center rounded-md bg-[#2563eb] text-sm font-medium text-white transition-colors hover:bg-[#1e40af]"
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
