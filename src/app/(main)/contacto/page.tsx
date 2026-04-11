import { type Metadata } from "next";
import { Mail } from "lucide-react";
import { ContactForm } from "@/features/contact/components/contact-form";
import { ContactInfo } from "@/features/contact/components/contact-info";

export const metadata: Metadata = {
  title: "Contáctanos",
  description:
    "Ponte en contacto con nuestro equipo. Estamos listos para ayudarte a encontrar la propiedad ideal en Chiclayo y Lambayeque.",
  openGraph: {
    title: "Contáctanos",
    description:
      "Ponte en contacto con nuestro equipo. Estamos listos para ayudarte a encontrar la propiedad ideal en Chiclayo y Lambayeque.",
    type: "website",
  },
};

export default function ContactoPage() {
  return (
    <>
      {/* Page header */}
      <section
        className="bg-gradient-to-br from-[#0a1628] via-[#1e3a5f] to-[#1e3a5f] py-14 sm:py-20"
        aria-labelledby="contact-heading"
      >
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-4 inline-flex size-14 items-center justify-center rounded-full bg-white/10">
            <Mail className="size-7 text-white" aria-hidden="true" />
          </div>
          <h1
            id="contact-heading"
            className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
          >
            Contáctanos
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-blue-100">
            Nuestro equipo está listo para atenderte. Cuéntanos en qué podemos
            ayudarte y nos comunicaremos contigo a la brevedad.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="bg-white py-12 sm:py-16" aria-label="Formulario y datos de contacto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Contact form */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
              <ContactForm />
            </div>

            {/* Contact info */}
            <div>
              <ContactInfo />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
