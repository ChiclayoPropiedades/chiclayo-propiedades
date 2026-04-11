import { ArrowRight, Bell, Shield, Sparkles, Home } from "lucide-react"

const benefits = [
  { icon: Home, text: "Propiedades exclusivas antes que nadie" },
  { icon: Sparkles, text: "Análisis del mercado inmobiliario" },
  { icon: Shield, text: "Consejos de expertos para tu inversión" },
]

export function NewsletterSection() {
  return (
    <section
      className="relative min-h-svh overflow-hidden bg-gradient-to-br from-[#0a1628] to-[#1e3a5f] flex flex-col justify-center py-16 sm:py-20"
      aria-labelledby="newsletter-heading"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE0djRoLTJ2LTRoMnptMC0ySDM0VjhoMnY0em0wIDE0di00SDM0djRoMnpNMzQgMjZoMnY0aC0ydi00em0wIDZoMnY0aC0ydi00em0wIDZoMnY0aC0ydi00em0wLTMwaC0yVjhoMnY0eiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" aria-hidden="true" />
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-[#b8860b]/8 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-400/8 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Text + Benefits */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#b8860b]/20 px-5 py-2 text-sm font-medium text-[#d4a017] ring-1 ring-[#b8860b]/30">
              <Bell className="size-4" aria-hidden="true" />
              Mantente informado
            </div>
            <h2
              id="newsletter-heading"
              className="text-4xl font-bold text-white sm:text-5xl"
            >
              No te pierdas ninguna{" "}
              <span className="text-[#d4a017]">oportunidad</span>
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-gray-300 sm:text-xl">
              Suscríbete y recibe las mejores propiedades, noticias y consejos
              inmobiliarios directamente en tu correo.
            </p>

            {/* Benefits list */}
            <div className="mt-8 flex flex-col gap-4">
              {benefits.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#b8860b]/15 ring-1 ring-[#b8860b]/20">
                    <Icon className="size-5 text-[#d4a017]" aria-hidden="true" />
                  </div>
                  <span className="text-base text-gray-200">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm sm:p-8 lg:p-10">
            <h3 className="mb-3 text-2xl font-bold text-white">
              Suscríbete gratis
            </h3>
            <p className="mb-8 text-base text-gray-300">
              Únete a cientos de inversionistas y compradores que ya reciben nuestro boletín semanal.
            </p>

            <form
              action="#"
              className="flex flex-col gap-4"
              aria-label="Suscripción al newsletter"
            >
              <input
                type="text"
                name="name"
                placeholder="Tu nombre"
                className="h-13 w-full rounded-xl border border-white/15 bg-white/10 px-5 text-base text-white placeholder:text-gray-400 outline-none transition-colors focus:border-[#b8860b]/50 focus:bg-white/15 focus:ring-2 focus:ring-[#b8860b]/20"
                aria-label="Nombre"
              />
              <input
                type="email"
                name="email"
                required
                placeholder="Tu correo electrónico"
                className="h-13 w-full rounded-xl border border-white/15 bg-white/10 px-5 text-base text-white placeholder:text-gray-400 outline-none transition-colors focus:border-[#b8860b]/50 focus:bg-white/15 focus:ring-2 focus:ring-[#b8860b]/20"
                aria-label="Correo electrónico"
              />
              <button
                type="submit"
                className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#b8860b] to-[#d4a017] text-base font-semibold text-white shadow-lg shadow-[#b8860b]/20 transition-all hover:shadow-xl hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8860b]/50"
              >
                Suscribirme
                <ArrowRight className="size-5" aria-hidden="true" />
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-gray-400">
              Sin spam. Puedes cancelar en cualquier momento.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
