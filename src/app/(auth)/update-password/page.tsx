import type { Metadata } from "next"
import { UpdatePasswordForm } from "@/features/auth/components/update-password-form"

export const metadata: Metadata = {
  title: "Nueva contraseña",
  description: "Define una contraseña nueva para tu cuenta de Chiclayo Propiedades",
  robots: { index: false, follow: false },
}

export default function UpdatePasswordPage() {
  return <UpdatePasswordForm />
}
