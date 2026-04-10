import Link from "next/link"
import Image from "next/image"
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react"

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.17 8.17 0 0 0 4.77 1.52V6.75a4.85 4.85 0 0 1-1-.06z" />
    </svg>
  )
}

const quickLinks = [
  { href: "/propiedades", label: "Propiedades" },
  { href: "/servicios", label: "Servicios" },
  { href: "/capacitaciones", label: "Capacitaciones" },
  { href: "/blog", label: "Blog" },
  { href: "/ranking", label: "Ranking" },
  { href: "/contacto", label: "Contacto" },
]

const socialLinks = [
  { href: "https://facebook.com/chiclayopropiedades", label: "Facebook", Icon: FacebookIcon },
  { href: "https://instagram.com/chiclayopropiedades", label: "Instagram", Icon: InstagramIcon },
  { href: "https://youtube.com/@chiclayopropiedades", label: "YouTube", Icon: YoutubeIcon },
  { href: "https://tiktok.com/@chiclayopropiedades", label: "TikTok", Icon: TikTokIcon },
]

export function Footer() {
  return (
    <footer className="bg-[#0a1628] text-gray-300" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Pie de página</h2>

      {/* Separator line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#b8860b]/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-5 pt-14 pb-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: Logo + descripción + redes */}
          <div className="flex flex-col gap-5">
            <div className="inline-flex rounded-xl bg-white px-5 py-3">
              <Image
                src="/images/logo-color.png"
                alt="Chiclayo Propiedades"
                width={130}
                height={48}
                className="h-9 w-auto"
              />
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Tu socio inmobiliario de confianza en Chiclayo y Lambayeque.
              Conectamos personas con sus hogares ideales.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-lg bg-white/5 text-gray-400 ring-1 ring-white/10 transition-all hover:bg-[#b8860b] hover:text-white hover:ring-[#b8860b]"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Enlaces rápidos */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-widest text-[#b8860b]">
              Enlaces rápidos
            </h3>
            <ul className="flex flex-col gap-3" role="list">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    <ArrowRight className="size-3 text-gray-600 transition-all group-hover:text-[#b8860b] group-hover:translate-x-0.5" aria-hidden="true" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contacto */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-widest text-[#b8860b]">
              Contacto
            </h3>
            <ul className="flex flex-col gap-4" role="list">
              <li className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
                  <MapPin className="size-4 text-[#b8860b]" aria-hidden="true" />
                </div>
                <span className="text-sm text-gray-400">
                  Av. Luis Gonzales 456, Chiclayo, Lambayeque
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
                  <Phone className="size-4 text-[#b8860b]" aria-hidden="true" />
                </div>
                <a href="tel:+51928216206" className="text-sm text-gray-400 transition-colors hover:text-white">
                  +51 928 216 206
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
                  <Mail className="size-4 text-[#b8860b]" aria-hidden="true" />
                </div>
                <a href="mailto:info@chiclayopropiedades.com" className="text-sm text-gray-400 transition-colors hover:text-white">
                  info@chiclayopropiedades.com
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Horario */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-widest text-[#b8860b]">
              Horario de atención
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-gray-400">
              <li className="flex justify-between">
                <span>Lunes - Viernes</span>
                <span className="font-medium text-white">9:00 - 18:00</span>
              </li>
              <li className="flex justify-between">
                <span>Sábado</span>
                <span className="font-medium text-white">9:00 - 13:00</span>
              </li>
              <li className="flex justify-between">
                <span>Domingo</span>
                <span className="text-gray-500">Cerrado</span>
              </li>
            </ul>
            <a
              href="https://wa.me/51928216206"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#25d366] text-sm font-semibold text-white transition-all hover:bg-[#1da851] hover:scale-[1.02]"
            >
              Contactar por WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 sm:flex-row">
          <p className="text-xs text-gray-500">
            &copy; 2026 Chiclayo Propiedades. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacidad" className="text-xs text-gray-500 transition-colors hover:text-gray-300">
              Política de Privacidad
            </Link>
            <Link href="/terminos" className="text-xs text-gray-500 transition-colors hover:text-gray-300">
              Términos de Servicio
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
