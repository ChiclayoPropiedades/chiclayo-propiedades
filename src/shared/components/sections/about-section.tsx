"use client"

import { useRef } from "react"
import { motion, useInView } from "motion/react"
import { ShieldCheck, Handshake, GraduationCap, BarChart3 } from "lucide-react"

const features = [
  {
    icon: ShieldCheck,
    title: "Compra Segura",
    description: "Verificamos cada propiedad y asesor para tu tranquilidad.",
  },
  {
    icon: Handshake,
    title: "Transparencia",
    description: "Procesos claros y comunicación directa en cada paso.",
  },
  {
    icon: GraduationCap,
    title: "Capacitación",
    description: "Formamos a los mejores agentes inmobiliarios de la región.",
  },
  {
    icon: BarChart3,
    title: "Tecnología",
    description: "Plataforma moderna con las mejores herramientas digitales.",
  },
]

export function AboutSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section
      ref={ref}
      className="flex min-h-svh items-center bg-[#f8fafc] py-12 sm:py-16"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Text + Features (primero en mobile) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" as const }}
            className="order-first"
          >
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#2563eb]">
              Sobre nosotros
            </p>
            <h2
              id="about-heading"
              className="mb-4 text-3xl font-bold text-[#1f2937] sm:text-4xl"
            >
              Conoce Chiclayo Propiedades
            </h2>
            <p className="mb-8 text-base leading-relaxed text-gray-600 sm:text-lg">
              Somos la plataforma inmobiliaria más completa de Chiclayo y
              Lambayeque. Ofrecemos propiedades en venta y alquiler, capacitamos
              agentes inmobiliarios y conectamos compradores con vendedores de
              manera segura, ágil y transparente.
            </p>

            {/* Feature cards grid */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              {features.map(({ icon: Icon, title, description }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease: "easeOut" as const }}
                  className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-[#eff6ff]">
                    <Icon className="size-5 text-[#2563eb]" aria-hidden="true" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#1f2937]">{title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">{description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Video (segundo en mobile, izquierda en desktop) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" as const }}
            className="order-last lg:order-first"
          >
            <div className="overflow-hidden rounded-2xl shadow-xl ring-1 ring-gray-200">
              <div className="aspect-video">
                <iframe
                  src="https://www.youtube.com/embed/9UG8qJQE-2U"
                  title="Chiclayo Propiedades - Video de presentación"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
