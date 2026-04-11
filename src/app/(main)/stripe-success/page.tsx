import { type Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Pago exitoso",
  description: "Tu inscripción ha sido confirmada correctamente.",
};

export default function StripeSuccessPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
      <div className="flex size-24 items-center justify-center rounded-full bg-emerald-100">
        <CheckCircle className="size-12 text-emerald-600" aria-hidden="true" />
      </div>

      <h1 className="mt-6 text-3xl font-extrabold text-[#1f2937]">
        ¡Pago exitoso!
      </h1>

      <p className="mt-3 max-w-sm text-base text-gray-500">
        Tu inscripción ha sido confirmada. Recibirás un correo con los detalles
        del curso en breve.
      </p>

      <Link
        href="/dashboard"
        className="mt-8 inline-flex h-11 items-center justify-center rounded-lg bg-[#2563eb] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#1e40af] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]/50"
      >
        Ir a mis capacitaciones
      </Link>
    </div>
  );
}
