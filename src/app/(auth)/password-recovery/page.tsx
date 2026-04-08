import type { Metadata } from "next"
import { PasswordRecoveryForm } from "@/features/auth/components/password-recovery-form"

export const metadata: Metadata = {
  title: "Recuperar Contraseña | Chiclayo Propiedades",
  description: "Restablece tu contraseña en Chiclayo Propiedades",
}

export default function PasswordRecoveryPage() {
  return <PasswordRecoveryForm />
}
