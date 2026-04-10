"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion, useInView } from "motion/react"
import { ArrowRight, Building2, Users, TrendingUp, ChevronDown } from "lucide-react"

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: "easeOut" as const },
  }),
}

const stats = [
  { icon: Building2, target: 500, suffix: "+", label: "Propiedades" },
  { icon: Users, target: 200, suffix: "+", label: "Agentes" },
  { icon: TrendingUp, target: 1200, suffix: "+", label: "Clientes felices" },
]

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [isInView, target])

  return (
    <span ref={ref}>
      {count.toLocaleString("es-PE")}{suffix}
    </span>
  )
}

export function HeroSection() {
  return (
    <section
      className="relative min-h-svh overflow-hidden flex items-center justify-center"
      aria-labelledby="hero-heading"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-[url('https://horizons-cdn.hostinger.com/170c28dc-2f08-41f8-b898-3a166aeca6d3/recurso-1-ifv8K.png')] bg-cover bg-center"
        aria-hidden="true"
      />

      {/* Overlay elegante */}
      <div className="absolute inset-0 bg-black/65" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-5xl px-5 py-20 text-center sm:px-6 sm:py-16 lg:px-8">
        {/* Badge */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={0.1}
          className="mb-8 flex justify-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium text-white/90 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#b8860b] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#d4a017]" />
            </span>
            Líderes en el mercado inmobiliario de Chiclayo
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          id="hero-heading"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={0.3}
          className="mx-auto max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Encuentra el lugar perfecto
          <span className="hidden sm:inline"><br /></span>
          <span className="sm:hidden"> </span>
          para tu{" "}
          <span className="text-[#d4a017]">próxima historia</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={0.5}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg"
        >
          Conectamos tus sueños con la realidad. Descubre propiedades exclusivas
          y recibe asesoría de los mejores expertos de la región.
        </motion.p>

        {/* CTA principal */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={0.7}
          className="mt-10 flex flex-col items-center gap-6"
        >
          <Link
            href="/propiedades"
            className="group inline-flex h-14 items-center justify-center gap-3 rounded-full bg-[#b8860b] px-10 text-base font-semibold text-white shadow-lg shadow-[#b8860b]/25 transition-all duration-300 hover:bg-[#d4a017] hover:shadow-xl hover:shadow-[#b8860b]/30 hover:scale-[1.03]"
          >
            Explorar Propiedades
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>

          {/* Links secundarios */}
          <div className="flex items-center gap-8">
            <Link
              href="/contacto"
              className="text-sm font-medium text-white/60 underline underline-offset-4 decoration-white/20 transition-colors hover:text-white hover:decoration-white/50"
            >
              Vender un Inmueble
            </Link>
            <span className="text-white/20">|</span>
            <Link
              href="/signup"
              className="text-sm font-medium text-white/60 underline underline-offset-4 decoration-white/20 transition-colors hover:text-white hover:decoration-white/50"
            >
              Registro de Agente
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={0.9}
          className="mx-auto mt-16 flex max-w-md items-center justify-center gap-0 divide-x divide-white/15 sm:max-w-xl"
        >
          {stats.map(({ icon: Icon, target, suffix, label }) => (
            <div
              key={label}
              className="flex flex-1 flex-col items-center gap-1 px-4 py-2 sm:px-8"
            >
              <Icon className="size-4 text-[#d4a017] sm:size-5" aria-hidden="true" />
              <span className="text-2xl font-bold text-white sm:text-3xl">
                <CountUp target={target} suffix={suffix} />
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-white/50 sm:text-xs">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ChevronDown className="size-6 animate-bounce text-white/30" aria-hidden="true" />
      </motion.div>
    </section>
  )
}
