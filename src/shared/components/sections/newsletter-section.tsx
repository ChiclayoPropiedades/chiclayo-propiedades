import { Mail, ArrowRight, Bell } from "lucide-react"

export function NewsletterSection() {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] py-16 sm:py-20"
      aria-labelledby="newsletter-heading"
    >
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/5 blur-2xl" aria-hidden="true" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/5 blur-2xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-blue-100 backdrop-blur-sm">
            <Bell className="size-4" aria-hidden="true" />
            Mantente informado
          </div>
          <h2
            id="newsletter-heading"
            className="text-3xl font-bold text-white sm:text-4xl"
          >
            No te pierdas ninguna oportunidad
          </h2>
          <p className="mt-4 text-base leading-relaxed text-blue-100 sm:text-lg">
            Suscríbete y recibe las mejores propiedades, noticias y consejos
            inmobiliarios directamente en tu correo.
          </p>

          <form
            action="#"
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            aria-label="Suscripción al newsletter"
          >
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-blue-300" aria-hidden="true" />
              <input
                type="email"
                name="email"
                required
                placeholder="Tu correo electrónico"
                className="h-12 w-full rounded-xl border border-white/20 bg-white/10 pl-11 pr-4 text-sm text-white placeholder:text-blue-200 outline-none backdrop-blur-sm transition-colors focus:border-white/50 focus:bg-white/20 focus:ring-2 focus:ring-white/20"
                aria-label="Correo electrónico para suscripción"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-[#1e40af] shadow-lg transition-all hover:bg-blue-50 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              Suscribirme
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </form>

          <p className="mt-4 text-xs text-blue-200/80">
            Sin spam. Puedes cancelar en cualquier momento.
          </p>
        </div>
      </div>
    </section>
  )
}
