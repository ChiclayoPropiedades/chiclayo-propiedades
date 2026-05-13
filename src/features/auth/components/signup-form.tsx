"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2Icon, EyeIcon, EyeOffIcon } from "lucide-react"

import { createClient } from "@/shared/lib/supabase/client"
import { cn } from "@/shared/lib/utils"
import { sendWelcomeEmail, checkPhoneDuplicate } from "@/features/auth/services/auth-actions"
import { signupSchema, firstZodError } from "@/features/auth/schemas"

type AccountRole = "user" | "agent"

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

function FormField({
  id,
  label,
  required,
  children,
}: {
  id: string
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-[#1f2937]">
        {label}
        {required && (
          <span className="ml-0.5 text-red-500" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
    </div>
  )
}

const inputClass = cn(
  "h-11 w-full rounded-lg border border-gray-300 px-3 text-sm text-[#1f2937] outline-none placeholder:text-gray-400",
  "transition-colors focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20",
  "disabled:cursor-not-allowed disabled:opacity-50"
)

export function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedRole = searchParams.get("role")

  const [role, setRole] = useState<AccountRole>(
    preselectedRole === "agent" ? "agent" : "user"
  )
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    // H-2.5: validar con Zod antes de cualquier network call.
    // Esto bloquea inputs inválidos (email mal formateado, password corta,
    // teléfono basura, role manipulado) sin pegarle a Supabase.
    const parsed = signupSchema.safeParse({
      fullName,
      email,
      phone,
      password,
      confirmPassword,
      role,
    })

    if (!parsed.success) {
      setError(firstZodError(parsed.error))
      return
    }

    setLoading(true)

    // Validar teléfono duplicado (usamos el valor normalizado por Zod)
    const isDuplicate = await checkPhoneDuplicate(parsed.data.phone)
    if (isDuplicate) {
      setError("Este número de teléfono ya está registrado.")
      setLoading(false)
      return
    }

    // Normalizar nombre: primera letra mayúscula de cada palabra
    const normalizedName = parsed.data.fullName
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase())

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        data: {
          full_name: normalizedName,
          phone: parsed.data.phone,
          role: parsed.data.role,
        },
      },
    })

    if (authError) {
      if (authError.message.includes("already registered")) {
        setError("Este correo ya está registrado. Intenta iniciar sesión.")
      } else {
        setError("Ocurrió un error al crear la cuenta. Inténtalo de nuevo.")
      }
      setLoading(false)
      return
    }

    // Enviar email de bienvenida (no bloquea el flujo)
    sendWelcomeEmail({ email: parsed.data.email, name: normalizedName, role: parsed.data.role }).catch(() => {})

    router.push("/verify-email")
  }

  return (
    <div className="w-full max-w-lg">
      <div className="rounded-2xl bg-white px-8 py-10 shadow-md">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <AuthLogo />
        </div>

        {/* Heading */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-[#1f2937]">Crear Cuenta</h1>
          <p className="mt-1 text-sm text-gray-500">
            Únete a nuestra plataforma inmobiliaria
          </p>
        </div>

        {/* Mensaje contextual si viene de capacitaciones */}
        {preselectedRole === "agent" && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            Registrate como <strong>Agente Inmobiliario</strong> para acceder a capacitaciones y publicar propiedades.
          </div>
        )}

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
          {/* Tipo de cuenta */}
          <fieldset className="rounded-lg border border-gray-200 p-4">
            <legend className="px-1 text-sm font-medium text-[#1f2937]">
              Tipo de cuenta
            </legend>
            <div className="mt-2 flex gap-6">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-[#1f2937]">
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={role === "user"}
                  onChange={() => setRole("user")}
                  disabled={loading}
                  className="size-4 accent-[#2563eb]"
                />
                Vendedor / Comprador
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-[#1f2937]">
                <input
                  type="radio"
                  name="role"
                  value="agent"
                  checked={role === "agent"}
                  onChange={() => setRole("agent")}
                  disabled={loading}
                  className="size-4 accent-[#2563eb]"
                />
                Agente Inmobiliario
              </label>
            </div>
          </fieldset>

          {/* Nombre + Correo */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField id="full-name" label="Nombre completo" required>
              <input
                id="full-name"
                type="text"
                autoComplete="name"
                placeholder="Ej: María García"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
                className={inputClass}
              />
            </FormField>

            <FormField id="email" label="Correo electrónico" required>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="maria@ejemplo.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className={inputClass}
              />
            </FormField>
          </div>

          {/* Teléfono + Contraseña */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField id="phone" label="Teléfono" required>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                placeholder="Ej: +51 987 654 321"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
                className={inputClass}
              />
            </FormField>

            <FormField id="password" label="Contraseña" required>
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
            </FormField>
          </div>

          {/* Confirmar contraseña */}
          <FormField id="confirm-password" label="Confirmar contraseña" required>
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
          </FormField>

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
            Registrarse
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-500">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#2563eb] hover:text-[#1e40af] hover:underline"
          >
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  )
}
