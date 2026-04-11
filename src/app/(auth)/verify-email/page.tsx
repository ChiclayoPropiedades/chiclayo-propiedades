import type { Metadata } from "next"
import Link from "next/link"
import { MailCheckIcon } from "lucide-react"

export const metadata: Metadata = {
  title: "Verifica tu correo",
  description: "Verifica tu correo electrónico para completar el registro",
}

export default function VerifyEmailPage() {
  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl bg-white px-8 py-10 shadow-md text-center">
        {/* Logo */}
        <div className="mb-6 flex flex-col items-center leading-none select-none">
          <span className="text-2xl font-black tracking-widest text-[#1f2937] uppercase">
            Chiclayo
          </span>
          <span className="text-xs font-semibold tracking-[0.35em] text-[#b8860b] uppercase">
            Propiedades
          </span>
        </div>

        {/* Icon */}
        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-[#eff6ff]">
          <MailCheckIcon className="size-8 text-[#2563eb]" aria-hidden="true" />
        </div>

        {/* Content */}
        <h1 className="text-2xl font-bold text-[#1f2937]">
          Revisa tu correo electrónico
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-500">
          Te hemos enviado un enlace de confirmación. Abre tu bandeja de entrada
          y haz clic en el enlace para activar tu cuenta.
        </p>

        <div className="mt-5 rounded-lg bg-[#eff6ff] px-4 py-3 text-left">
          <p className="text-sm font-medium text-[#1e40af]">
            No olvides revisar la carpeta de spam
          </p>
          <p className="mt-0.5 text-xs text-blue-600">
            A veces los correos de confirmación pueden llegar a tu carpeta de
            correo no deseado.
          </p>
        </div>

        <Link
          href="/login"
          className="mt-6 inline-block text-sm font-semibold text-[#2563eb] hover:text-[#1e40af] hover:underline"
        >
          Volver a iniciar sesión
        </Link>
      </div>
    </div>
  )
}
