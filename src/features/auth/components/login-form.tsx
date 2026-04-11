"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2Icon, EyeIcon, EyeOffIcon } from "lucide-react"

import { createClient } from "@/shared/lib/supabase/client"
import { cn } from "@/shared/lib/utils"

function AuthLogo() {
  return (
    <div className="flex flex-col items-center leading-none select-none">
      <span className="text-2xl font-black tracking-widest text-[#1f2937] uppercase">
        Chiclayo
      </span>
      <span className="text-xs font-semibold tracking-[0.35em] text-[#b8860b] uppercase">
        Propiedades
      </span>
    </div>
  )
}

export function LoginForm() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(
        authError.message === "Invalid login credentials"
          ? "Correo o contraseña incorrectos. Por favor, verifica tus datos."
          : "Ocurrió un error al iniciar sesión. Inténtalo de nuevo."
      )
      setLoading(false)
      return
    }

    // Verificar rol para redirigir al panel correcto
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle()

      if (profile?.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    } else {
      router.push("/dashboard")
    }
    router.refresh()
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl bg-white px-8 py-10 shadow-md">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <AuthLogo />
        </div>

        {/* Heading */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-[#1f2937]">Iniciar Sesión</h1>
          <p className="mt-1 text-sm text-gray-500">
            Ingresa a tu cuenta para continuar
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium text-[#1f2937]"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="tu@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className={cn(
                "h-11 w-full rounded-lg border border-gray-300 px-3 text-sm text-[#1f2937] outline-none placeholder:text-gray-400",
                "transition-colors focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20",
                "disabled:cursor-not-allowed disabled:opacity-50"
              )}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-[#1f2937]"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className={cn(
                  "h-11 w-full rounded-lg border border-gray-300 px-3 pr-10 text-sm text-[#1f2937] outline-none placeholder:text-gray-400",
                  "transition-colors focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20",
                  "disabled:cursor-not-allowed disabled:opacity-50"
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? (
                  <EyeOffIcon className="size-4" />
                ) : (
                  <EyeIcon className="size-4" />
                )}
              </button>
            </div>
            <div className="flex justify-end">
              <Link
                href="/password-recovery"
                className="text-xs text-[#2563eb] hover:text-[#1e40af] hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={cn(
              "mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#2563eb] text-sm font-semibold text-white",
              "transition-colors hover:bg-[#1e40af]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]/50",
              "disabled:cursor-not-allowed disabled:opacity-60"
            )}
          >
            {loading && <Loader2Icon className="size-4 animate-spin" aria-hidden="true" />}
            Iniciar Sesión
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-500">
          ¿No tienes cuenta?{" "}
          <Link
            href="/signup"
            className="font-semibold text-[#2563eb] hover:text-[#1e40af] hover:underline"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  )
}
