import type { Metadata } from "next"
import { Suspense } from "react"
import { SignupForm } from "@/features/auth/components/signup-form"

export const metadata: Metadata = {
  title: "Crear Cuenta",
  description: "Únete a la plataforma inmobiliaria de Chiclayo",
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  )
}
