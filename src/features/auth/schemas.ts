/**
 * Schemas de validación Zod para los formularios de auth (H-2.5).
 *
 * Estos schemas se aplican client-side ANTES de llamar a Supabase Auth.
 * No reemplazan la validación server-side (el trigger SQL handle_new_user
 * fuerza role='user' en signup, H-2.1) — son una capa de UX que da
 * mensajes claros antes de la network y bloquea inputs basura.
 *
 * Zod 4.x: usamos `.refine()` para passwordsMatch y APIs nuevas como
 * `z.email()` cuando aplican.
 */
import { z } from "zod"

/**
 * Roles que el cliente PUEDE auto-asignarse en signup.
 * Importante: NO incluye 'admin'. El trigger SQL server-side debe forzar
 * cualquier intento de role='admin' desde metadata a 'user' (ver H-2.1).
 */
export const ALLOWED_SIGNUP_ROLES = ["user", "agent"] as const

/**
 * Regex de teléfono permisivo (formato peruano + internacional ligero).
 * Acepta dígitos, espacios y un '+' inicial opcional. Entre 8 y 15 chars.
 */
const PHONE_REGEX = /^\+?[0-9 ]{8,15}$/

/**
 * Schema para signup.
 * fullName se trim'ea y normaliza fuera del schema (en el componente).
 */
export const signupSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "El nombre debe tener al menos 2 caracteres.")
      .max(80, "El nombre no puede superar 80 caracteres."),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, "El correo es obligatorio.")
      .email("Correo inválido."),
    phone: z
      .string()
      .trim()
      .regex(PHONE_REGEX, "Teléfono inválido. Usa solo dígitos, espacios y un '+' opcional (8-15 caracteres)."),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres.")
      .max(128, "La contraseña no puede superar 128 caracteres."),
    confirmPassword: z.string(),
    role: z.enum(ALLOWED_SIGNUP_ROLES),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  })

export type SignupInput = z.infer<typeof signupSchema>

/**
 * Schema para login. Solo valida formato — no enforce min length en password
 * porque cuentas antiguas pueden tener passwords de menos de 8 chars.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "El correo es obligatorio.")
    .email("Correo inválido."),
  password: z.string().min(1, "La contraseña es obligatoria."),
})

export type LoginInput = z.infer<typeof loginSchema>

/**
 * Schema para password recovery (request del enlace).
 */
export const passwordRecoverySchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "El correo es obligatorio.")
    .email("Correo inválido."),
})

export type PasswordRecoveryInput = z.infer<typeof passwordRecoverySchema>

/**
 * Schema para definir nueva contraseña tras recovery.
 */
export const updatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres.")
      .max(128, "La contraseña no puede superar 128 caracteres."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  })

export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>

/**
 * Helper para extraer el primer mensaje de error de un ZodError.
 * Mantiene la UX simple: un error a la vez en el banner rojo.
 *
 * Acepta directamente el error (no el resultado completo) para no depender
 * del nombre del tipo SafeParseResult que cambió entre Zod 3 y 4.
 */
export function firstZodError(error: z.ZodError): string {
  const flat = z.flattenError(error)
  // Errores de schema-level (refine sin path) van en formErrors
  if (flat.formErrors.length > 0) return flat.formErrors[0]
  // Errores de field-level
  for (const msgs of Object.values(flat.fieldErrors)) {
    if (Array.isArray(msgs) && msgs.length > 0) {
      return msgs[0] as string
    }
  }
  return "Datos inválidos. Revisa el formulario."
}
