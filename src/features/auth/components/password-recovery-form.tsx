"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2Icon, CheckCircleIcon, ArrowLeftIcon } from "lucide-react"

import { createClient } from "@/shared/lib/supabase/client"
import { cn } from "@/shared/lib/utils"
import { passwordRecoverySchema, firstZodError } from "@/features/auth/schemas"

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

export function PasswordRecoveryForm() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    // H-2.5: validar email antes del network call.
    const parsed = passwordRecoverySchema.safeParse({ email })
    if (!parsed.success) {
      setError(firstZodError(parsed.error))
      return
    }

    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.resetPasswordForEmail(
      parsed.data.email,
      {
        redirectTo: `${window.location.origin}/api/auth/callback?next=/update-password`,
      }
    )

    if (authError) {
      setError("Ocurrió un error al enviar el enlace. Inténtalo de nuevo.")
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
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
          <h1 className="text-2xl font-bold text-[#1f2937]">
            Recuperar Contraseña
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Te enviaremos un enlace para restablecer tu contraseña
          </p>
        </div>

        {/* Success state */}
        {success ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-green-100">
              <CheckCircleIcon className="size-7 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-[#1f2937]">
                ¡Enlace enviado!
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Revisa tu bandeja de entrada en{" "}
                <span className="font-medium text-[#1f2937]">{email}</span> y
                sigue las instrucciones para restablecer tu contraseña.
              </p>
            </div>
            <Link
              href="/login"
              className="mt-2 text-sm font-semibold text-[#2563eb] hover:text-[#1e40af] hover:underline"
            >
              Volver a iniciar sesión
            </Link>
          </div>
        ) : (
          <>
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
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-[#1f2937]"
                >
                  Correo electrónico
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
                Enviar enlace de recuperación
              </button>
            </form>

            <div className="mt-6 flex justify-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1f2937] hover:underline"
              >
                <ArrowLeftIcon className="size-3.5" aria-hidden="true" />
                Volver a iniciar sesión
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
