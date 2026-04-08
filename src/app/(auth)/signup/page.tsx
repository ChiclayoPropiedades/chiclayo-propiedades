import type { Metadata } from "next"
import { SignupForm } from "@/features/auth/components/signup-form"

export const metadata: Metadata = {
  title: "Crear Cuenta | Chiclayo Propiedades",
  description: "Únete a la plataforma inmobiliaria de Chiclayo",
}

export default function SignupPage() {
  return <SignupForm />
}
