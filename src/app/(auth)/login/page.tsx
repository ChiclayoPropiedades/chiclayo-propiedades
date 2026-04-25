import type { Metadata } from "next"
import { Suspense } from "react"
import { LoginForm } from "@/features/auth/components/login-form"

export const metadata: Metadata = {
  title: "Iniciar Sesión",
  description: "Ingresa a tu cuenta en Chiclayo Propiedades",
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
