"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2Icon, EyeIcon, EyeOffIcon } from "lucide-react"

import { createClient } from "@/shared/lib/supabase/client"
import { cn } from "@/shared/lib/utils"
import { loginSchema, firstZodError } from "@/features/auth/schemas"

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

/**
 * Mapea el mensaje crudo de Supabase Auth a un mensaje en español claro
 * para el usuario final. Cubre los errores más comunes que vimos en producción.
 */
function mapAuthError(rawMessage: string): string {
  const msg = rawMessage.toLowerCase()
  if (msg.includes("invalid login credentials") || msg.includes("invalid_credentials")) {
    return "Correo o contraseña incorrectos. Por favor, verifica tus datos."
  }
  if (msg.includes("email not confirmed") || msg.includes("email_not_confirmed")) {
    return "Tu correo aún no está verificado. Revisa tu bandeja de entrada (y spam) y haz click en el enlace de confirmación."
  }
  if (msg.includes("user not found") || msg.includes("user_not_found")) {
    return "No encontramos una cuenta con ese correo. ¿Quieres registrarte?"
  }
  if (msg.includes("too many") || msg.includes("rate limit")) {
    return "Demasiados intentos. Espera unos minutos antes de volver a intentar."
  }
  if (msg.includes("network") || msg.includes("fetch")) {
    return "No pudimos conectarnos al servidor. Verifica tu conexión a internet."
  }
  if (msg.includes("database") || msg.includes("server error")) {
    return "Hay un problema temporal con el servidor. Por favor intenta nuevamente en unos momentos."
  }
  return "Ocurrió un error al iniciar sesión. Inténtalo de nuevo."
}

/**
 * Mapea errores que llegan por query string desde el callback de auth
 * (`/login?error=...`).
 */
function mapCallbackError(code: string | null): string | null {
  if (!code) return null
  switch (code) {
    case "auth":
      return "El enlace de verificación no es válido o ya expiró. Inicia sesión con tu correo y contraseña, o solicita un nuevo enlace."
    case "inactive":
      return "Tu cuenta está desactivada. Contacta al administrador para reactivarla."
    case "profile":
      return "Hubo un problema al crear tu perfil. Por favor contacta al administrador."
    default:
      return null
  }
}

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [needsResend, setNeedsResend] = useState(false)
  const [resendStatus, setResendStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")

  // Mostrar errores que llegan desde el callback (ej. /login?error=inactive).
  useEffect(() => {
    const callbackError = mapCallbackError(searchParams.get("error"))
    if (callbackError) setError(callbackError)
  }, [searchParams])

  async function handleResendConfirmation() {
    if (!email || resendStatus === "sending") return
    setResendStatus("sending")
    const supabase = createClient()
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email,
    })
    if (resendError) {
      setResendStatus("error")
    } else {
      setResendStatus("sent")
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setNeedsResend(false)
    setResendStatus("idle")

    // H-2.5: validación Zod antes del network call.
    const parsed = loginSchema.safeParse({ email, password })
    if (!parsed.success) {
      setError(firstZodError(parsed.error))
      return
    }

    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    })

    if (authError) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[auth] signInWithPassword error:", authError.message)
      }
      const isUnconfirmed = authError.message.toLowerCase().includes("email not confirmed")
        || authError.message.toLowerCase().includes("email_not_confirmed")
      setNeedsResend(isUnconfirmed)
      setError(mapAuthError(authError.message))
      setLoading(false)
      return
    }

    // Verificar perfil para redirigir al panel correcto.
    // Si el perfil no existe o no se puede leer (RLS), evitamos redirigir
    // a una pantalla rota y mostramos un error claro.
    // H-2.4: en cualquier rama de error post-signIn debemos hacer signOut()
    // para no dejar una sesion zombie en la cookie del browser.
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      await supabase.auth.signOut()
      setError("No pudimos iniciar tu sesión. Inténtalo de nuevo.")
      setLoading(false)
      return
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, is_active")
      .eq("user_id", user.id)
      .maybeSingle()

    if (profileError) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[auth] profile select error:", profileError.message)
      }
      await supabase.auth.signOut()
      setError("Hubo un problema al cargar tu perfil. Contacta al administrador.")
      setLoading(false)
      return
    }

    if (!profile) {
      await supabase.auth.signOut()
      setError("Tu cuenta no tiene un perfil asociado. Por favor contacta al administrador para que lo cree.")
      setLoading(false)
      return
    }

    if (profile.is_active === false) {
      setError("Tu cuenta está desactivada. Contacta al administrador para reactivarla.")
      setLoading(false)
      // Cerrar sesión para evitar estado inconsistente
      await supabase.auth.signOut()
      return
    }

    if (profile.role === "admin") {
      router.push("/admin")
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
            <p>{error}</p>
            {needsResend && (
              <div className="mt-2">
                {resendStatus === "sent" ? (
                  <p className="text-xs font-semibold text-green-700">
                    ✓ Te enviamos un nuevo correo de confirmación. Revisa tu bandeja.
                  </p>
                ) : resendStatus === "error" ? (
                  <p className="text-xs text-red-600">
                    No pudimos reenviar el correo. Intenta más tarde o contacta al administrador.
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendConfirmation}
                    disabled={resendStatus === "sending" || !email}
                    className="text-xs font-semibold text-[#2563eb] underline hover:text-[#1e40af] disabled:opacity-50"
                  >
                    {resendStatus === "sending"
                      ? "Reenviando..."
                      : "Reenviar correo de confirmación"}
                  </button>
                )}
              </div>
            )}
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
