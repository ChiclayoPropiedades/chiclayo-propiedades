import { MapPin, Phone, Mail, Clock } from "lucide-react";

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

function InfoCard({ icon, title, children }: InfoCardProps) {
  return (
    <div className="flex gap-4 rounded-xl bg-[#eff6ff] p-4">
      <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#2563eb]/10">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-[#1f2937]">{title}</p>
        <div className="mt-1 text-sm leading-relaxed text-gray-600">
          {children}
        </div>
      </div>
    </div>
  );
}

const socialLinks = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/chiclayopropiedades",
    icon: (
      <svg
        className="size-5"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12z" />
      </svg>
    ),
    label: "Facebook de Chiclayo Propiedades",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/chiclayopropiedades",
    icon: (
      <svg
        className="size-5"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    label: "Instagram de Chiclayo Propiedades",
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@CHICLAYOPROPIEDADES",
    icon: (
      <svg
        className="size-5"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
      </svg>
    ),
    label: "YouTube de Chiclayo Propiedades",
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@chiclayopropiedades",
    icon: (
      <svg
        className="size-5"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
      </svg>
    ),
    label: "TikTok de Chiclayo Propiedades",
  },
];

export function ContactInfo() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-[#1f2937]">
          Información de contacto
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Estamos disponibles para atenderte en los siguientes canales.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <InfoCard
          icon={<MapPin className="size-5 text-[#2563eb]" aria-hidden="true" />}
          title="Dirección"
        >
          <address className="not-italic">
            Plaza Bolognesi, Av. Francisco Bolognesi 536
            <br />
            Stand 302A, Chiclayo, Lambayeque, Perú
          </address>
        </InfoCard>

        <InfoCard
          icon={<Phone className="size-5 text-[#2563eb]" aria-hidden="true" />}
          title="Teléfono"
        >
          <a
            href="tel:+51928216206"
            className="hover:text-[#2563eb] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]/50 rounded"
          >
            +51 928 216 206
          </a>
        </InfoCard>

        <InfoCard
          icon={<Mail className="size-5 text-[#2563eb]" aria-hidden="true" />}
          title="Correo electrónico"
        >
          <a
            href="mailto:info@chiclayopropiedades.com"
            className="hover:text-[#2563eb] transition-colors break-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]/50 rounded"
          >
            info@chiclayopropiedades.com
          </a>
        </InfoCard>

        <InfoCard
          icon={<Clock className="size-5 text-[#2563eb]" aria-hidden="true" />}
          title="Horario de atención"
        >
          <ul className="space-y-0.5" aria-label="Horarios de atención">
            <li>
              <span className="font-medium text-[#1f2937]">Lunes a Viernes:</span>{" "}
              9:00 AM - 6:00 PM
            </li>
            <li>
              <span className="font-medium text-[#1f2937]">Sábados:</span>{" "}
              9:00 AM - 1:00 PM
            </li>
            <li>
              <span className="font-medium text-[#1f2937]">Domingos:</span>{" "}
              Cerrado
            </li>
          </ul>
        </InfoCard>
      </div>

      {/* Redes Sociales */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-[#1f2937]">
          Síguenos en Redes Sociales
        </h3>
        <div className="flex flex-wrap gap-2" role="list">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              role="listitem"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-[#2563eb] hover:bg-[#eff6ff] hover:text-[#2563eb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]/50"
            >
              {social.icon}
              {social.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
