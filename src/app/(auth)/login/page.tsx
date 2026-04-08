import type { Metadata } from "next"
import { LoginForm } from "@/features/auth/components/login-form"

export const metadata: Metadata = {
  title: "Iniciar Sesión | Chiclayo Propiedades",
  description: "Ingresa a tu cuenta en Chiclayo Propiedades",
}

export default function LoginPage() {
  return <LoginForm />
}
