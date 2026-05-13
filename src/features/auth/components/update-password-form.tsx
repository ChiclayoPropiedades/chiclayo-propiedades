"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2Icon, EyeIcon, EyeOffIcon, CheckCircleIcon } from "lucide-react"

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

const inputClass = cn(
  "h-11 w-full rounded-lg border border-gray-300 px-3 text-sm text-[#1f2937] outline-none placeholder:text-gray-400",
  "transition-colors focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20",
  "disabled:cursor-not-allowed disabled:opacity-50"
)

/**
 * Form para completar el flujo de password recovery (H-2.2).
 * El usuario llega aqui desde el email de recovery -> /api/auth/callback?next=/update-password.
 * En ese momento ya tiene una sesion temporal de Supabase suficiente para llamar updateUser.
 */
export function UpdatePasswordForm() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.")
      return
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.")
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(
        updateError.message.includes("session")
          ? "Tu enlace expiró. Solicita uno nuevo desde 'Recuperar contraseña'."
          : "No pudimos actualizar la contraseña. Inténtalo de nuevo."
      )
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
    // Pequeno delay para que el usuario vea el confirmation antes de redirigir
    setTimeout(() => router.push("/dashboard"), 1500)
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl bg-white px-8 py-10 shadow-md">
        <div className="mb-6 flex justify-center">
          <AuthLogo />
        </div>

        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-[#1f2937]">Nueva contraseña</h1>
          <p className="mt-1 text-sm text-gray-500">
            Define una contraseña nueva para tu cuenta
          </p>
        </div>

        {success ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-green-100">
              <CheckCircleIcon className="size-7 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-[#1f2937]">
                ¡Contraseña actualizada!
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Te llevamos a tu panel en un momento...
              </p>
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div
                role="alert"
                className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-medium text-[#1f2937]">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Mínimo 8 caracteres"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className={cn(inputClass, "pr-10")}
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
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="confirm-password" className="text-sm font-medium text-[#1f2937]">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Repite tu contraseña"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    className={cn(inputClass, "pr-10")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
                    aria-label={showConfirm ? "Ocultar confirmación" : "Mostrar confirmación"}
                  >
                    {showConfirm ? (
                      <EyeOffIcon className="size-4" />
                    ) : (
                      <EyeIcon className="size-4" />
                    )}
                  </button>
                </div>
              </div>

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
                {loading && (
                  <Loader2Icon className="size-4 animate-spin" aria-hidden="true" />
                )}
                Guardar contraseña
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              ¿Recordaste tu contraseña?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#2563eb] hover:text-[#1e40af] hover:underline"
              >
                Inicia sesión
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
