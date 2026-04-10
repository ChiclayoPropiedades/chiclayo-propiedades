import { Mail, Clock } from "lucide-react"

export function NewsletterSection() {
  return (
    <section
      className="bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] py-16 sm:py-20"
      aria-labelledby="newsletter-heading"
    >
      <div className="mx-auto max-w-7xl px-5 text-center sm:px-6 lg:px-8">
        <div className="mb-4 flex justify-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-white/10">
            <Mail className="size-6 text-white" aria-hidden="true" />
          </div>
        </div>
        <h2
          id="newsletter-heading"
          className="text-3xl font-bold text-white"
        >
          No te pierdas ninguna oportunidad
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-base text-blue-100">
          Suscríbete y recibe las mejores propiedades, noticias y consejos
          inmobiliarios directamente en tu correo.
        </p>

        <form
          action="#"
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          aria-label="Suscripción al newsletter"
        >
          <input
            type="email"
            name="email"
            required
            placeholder="Tu correo electrónico"
            className="h-12 flex-1 rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-blue-200 outline-none backdrop-blur-sm transition-colors focus:border-white/50 focus:bg-white/20 focus:ring-2 focus:ring-white/20"
            aria-label="Correo electrónico para suscripción"
          />
          <button
            type="submit"
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-[#1e40af] shadow-lg transition-all hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            <Clock className="size-4" aria-hidden="true" />
            Suscribirme
          </button>
        </form>

        <p className="mt-4 text-xs text-blue-200">
          Sin spam. Puedes cancelar en cualquier momento.
        </p>
      </div>
    </section>
  )
}
