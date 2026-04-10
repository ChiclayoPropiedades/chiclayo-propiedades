import Link from "next/link"
import { Building2, TrendingUp, Users, ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section
      className="relative min-h-svh overflow-hidden flex items-center justify-center"
      aria-labelledby="hero-heading"
    >
      {/* Background image de Chiclayo (foto real de la ciudad) */}
      <div
        className="absolute inset-0 bg-[url('https://horizons-cdn.hostinger.com/170c28dc-2f08-41f8-b898-3a166aeca6d3/recurso-1-ifv8K.png')] bg-cover bg-center"
        aria-hidden="true"
      />
      {/* Overlay oscuro para legibilidad */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/30"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        {/* Logo accent */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/80 backdrop-blur-sm">
          <Building2 className="size-4" aria-hidden="true" />
          Plataforma inmobiliaria N°1 en Chiclayo
        </div>

        <h1
          id="hero-heading"
          className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          Encuentra el lugar perfecto para tu{" "}
          <span className="text-[#fbbf24]">próxima historia</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-blue-100">
          Conectamos tus sueños con la realidad. Miles de propiedades en venta y
          alquiler en Chiclayo y Lambayeque te esperan.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/propiedades"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-[#1e40af] shadow-lg transition-all hover:bg-blue-50 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            Explorar Propiedades
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link
            href="/contacto"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-white/40 px-6 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/70 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            Vender un inmueble
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-white/40 px-6 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/70 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            Registro de agente
          </Link>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-14 grid max-w-lg grid-cols-3 gap-6 sm:max-w-2xl sm:gap-8">
          {[
            { icon: Building2, value: "500+", label: "Propiedades" },
            { icon: Users, value: "200+", label: "Agentes" },
            { icon: TrendingUp, value: "1,200+", label: "Clientes felices" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <Icon className="size-5 text-blue-200" aria-hidden="true" />
              <span className="text-2xl font-bold text-white">{value}</span>
              <span className="text-xs text-blue-200">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
