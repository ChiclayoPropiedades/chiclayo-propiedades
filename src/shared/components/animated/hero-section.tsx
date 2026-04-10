"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "motion/react"
import { ArrowRight, Building2, Users, TrendingUp } from "lucide-react"

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: "easeOut" as const },
  }),
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 80, damping: 20, delay: 0.1 },
  },
}

const stats = [
  { icon: Building2, value: "500+", label: "Propiedades" },
  { icon: Users, value: "200+", label: "Agentes" },
  { icon: TrendingUp, value: "1,200+", label: "Clientes felices" },
]

export function HeroSection() {
  return (
    <section
      className="relative min-h-[100vh] overflow-hidden flex items-center justify-center"
      aria-labelledby="hero-heading"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-[url('https://horizons-cdn.hostinger.com/170c28dc-2f08-41f8-b898-3a166aeca6d3/recurso-1-ifv8K.png')] bg-cover bg-center scale-105"
        aria-hidden="true"
      />

      {/* Multi-layer overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-900/50 to-slate-950/80"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-blue-950/30 via-transparent to-blue-950/30"
        aria-hidden="true"
      />

      {/* Decorative orbs */}
      <div
        className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl animate-float-slow"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl animate-float-slow-reverse"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-blue-600/5 blur-3xl"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-16 text-center sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
        {/* Logo */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          className="mb-8 inline-block"
        >
          <div className="relative mx-auto inline-flex items-center justify-center rounded-2xl bg-white/95 px-8 py-5 shadow-2xl shadow-black/20 backdrop-blur-sm ring-1 ring-white/20">
            <Image
              src="/images/logo-color.png"
              alt="Chiclayo Propiedades"
              width={280}
              height={100}
              className="h-20 w-auto sm:h-24"
              priority
            />
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
          </div>
        </motion.div>

        {/* Badge */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={0.3}
          className="mb-6 flex justify-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/15 px-5 py-2 text-sm font-medium text-blue-100 backdrop-blur-md ring-1 ring-blue-400/20">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-300" />
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
          custom={0.5}
          className="mx-auto max-w-4xl text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Encuentra el lugar perfecto para tu{" "}
          <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
            próxima historia
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={0.7}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-blue-100/90 sm:text-xl"
        >
          Conectamos tus sueños con la realidad. Descubre propiedades exclusivas
          y recibe asesoría de los mejores expertos de la región.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={0.9}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/propiedades"
            className="group inline-flex h-13 items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-8 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-600/40 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50"
          >
            Explorar Propiedades
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
          <Link
            href="/contacto"
            className="inline-flex h-13 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-8 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:border-white/30 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            Vender un Inmueble
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-13 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-8 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:border-white/30 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            Registro de Agente Inmobiliario
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={1.1}
          className="mx-auto mt-16 grid max-w-lg grid-cols-3 gap-4 sm:max-w-2xl sm:gap-6"
        >
          {stats.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 rounded-xl bg-white/5 py-4 px-3 backdrop-blur-sm ring-1 ring-white/10 transition-colors hover:bg-white/10"
            >
              <Icon className="size-5 text-blue-300" aria-hidden="true" />
              <span className="text-2xl font-bold text-white sm:text-3xl">{value}</span>
              <span className="text-xs font-medium text-blue-200/80">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"
        aria-hidden="true"
      />
    </section>
  )
}
