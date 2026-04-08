"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MenuIcon } from "lucide-react"

import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet"

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/propiedades", label: "Propiedades" },
  { href: "/servicios", label: "Servicios" },
  { href: "/ranking", label: "Ranking" },
  { href: "/capacitaciones", label: "Capacitaciones" },
  { href: "/blog", label: "Blog" },
  { href: "/contacto", label: "Contacto" },
]

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
  const [open, setOpen] = useState(false)

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
            <div className="flex flex-col gap-3 border-t border-gray-200 p-4">
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
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
