import { type Metadata } from "next";
import Link from "next/link";
import { CheckCircle, Briefcase, Globe, UserCheck, GraduationCap } from "lucide-react";

export const metadata: Metadata = {
  title: "Nuestros Servicios",
  description:
    "Servicios inmobiliarios para empresas, personas y asesores en Chiclayo y Lambayeque. Asesoría, gestión de propiedades, capacitaciones y más.",
};

interface ServiceItem {
  label: string;
}

interface ServiceSectionProps {
  title: string;
  icon: React.ReactNode;
  items: ServiceItem[];
  imagePosition: "left" | "right";
  imageBg: string;
  imageIcon: React.ReactNode;
}

function ServiceSection({
  title,
  icon,
  items,
  imagePosition,
  imageBg,
  imageIcon,
}: ServiceSectionProps) {
  const imageBlock = (
    <div
      className={[
        "flex h-40 w-full items-center justify-center rounded-2xl sm:h-64 lg:h-80",
        imageBg,
      ].join(" ")}
      aria-hidden="true"
    >
      {imageIcon}
    </div>
  );

  const contentBlock = (
    <div className="flex flex-col justify-center">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-[#eff6ff]">
          {icon}
        </div>
        <h2 className="text-xl font-bold text-[#1f2937] sm:text-2xl">{title}</h2>
      </div>
      <ul className="flex flex-col gap-3" role="list">
        {items.map((item) => (
          <li key={item.label} className="flex items-start gap-3">
            <CheckCircle
              className="mt-0.5 size-5 shrink-0 text-[#2563eb]"
              aria-hidden="true"
            />
            <span className="text-base text-gray-600">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center lg:gap-14">
      {imagePosition === "left" ? (
        <>
          {imageBlock}
          {contentBlock}
        </>
      ) : (
        <>
          {contentBlock}
          {imageBlock}
        </>
      )}
    </div>
  );
}

const empresasItems: ServiceItem[] = [
  { label: "Asesoría en compra, venta y alquiler de inmuebles comerciales" },
  { label: "Estudios de mercado inmobiliario" },
  { label: "Saneamiento y regularización de propiedades" },
  { label: "Evaluación técnica y legal de activos inmobiliarios" },
  { label: "Gestión integral de carteras de inmuebles" },
];

const generalesItems: ServiceItem[] = [
  { label: "Saneamiento físico-legal de propiedades" },
  { label: "Asesoría legal en contratos de compraventa y arrendamiento" },
  { label: "Publicidad y difusión de propiedades" },
  { label: "Capacitaciones para compradores e inversores" },
  { label: "Property Management y administración de inmuebles" },
];

const asesoresItems: ServiceItem[] = [
  { label: "Cursos y talleres de formación inmobiliaria" },
  { label: "Publicidad destacada en el portal" },
  { label: "Reconocimiento mensual y premios por desempeño" },
  { label: "Oportunidades de networking y alianzas" },
  { label: "Participación en el ranking de asesores" },
  { label: "Línea de carrera dentro de la plataforma" },
];

export default function ServiciosPage() {
  return (
    <>
      {/* Page header */}
      <div className="bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Briefcase className="size-8 text-white/70" aria-hidden="true" />
            <div>
              <h1 className="text-2xl font-bold text-white sm:text-3xl">
                Nuestros Servicios
              </h1>
              <p className="mt-0.5 text-sm text-blue-100">
                Soluciones inmobiliarias integrales para empresas, personas y asesores
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-20">
          {/* Servicios para Empresas */}
          <ServiceSection
            title="Servicios para Empresas"
            icon={<Briefcase className="size-5 text-[#2563eb]" aria-hidden="true" />}
            items={empresasItems}
            imagePosition="left"
            imageBg="bg-gradient-to-br from-[#1e3a8a] to-[#2563eb]"
            imageIcon={
              <Briefcase className="size-24 text-white/20" aria-hidden="true" />
            }
          />

          <hr className="border-gray-100" />

          {/* Servicios Generales */}
          <ServiceSection
            title="Servicios Generales"
            icon={<Globe className="size-5 text-[#2563eb]" aria-hidden="true" />}
            items={generalesItems}
            imagePosition="right"
            imageBg="bg-gradient-to-br from-emerald-600 to-teal-500"
            imageIcon={
              <Globe className="size-24 text-white/20" aria-hidden="true" />
            }
          />

          <hr className="border-gray-100" />

          {/* Servicios para Asesores */}
          <ServiceSection
            title="Servicios para Asesores Inmobiliarios"
            icon={<UserCheck className="size-5 text-[#2563eb]" aria-hidden="true" />}
            items={asesoresItems}
            imagePosition="left"
            imageBg="bg-gradient-to-br from-violet-600 to-indigo-500"
            imageIcon={
              <UserCheck className="size-24 text-white/20" aria-hidden="true" />
            }
          />
        </div>

        {/* Capacitaciones CTA */}
        <div className="mt-20 overflow-hidden rounded-2xl bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] px-8 py-10 text-center">
          <div className="mx-auto flex max-w-xl flex-col items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-white/10">
              <GraduationCap className="size-7 text-white" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Capacitaciones Destacadas
            </h2>
            <p className="text-base text-blue-100">
              Potencia tu carrera inmobiliaria con nuestros cursos y talleres
              presenciales y virtuales. Aprende de los mejores profesionales del
              sector.
            </p>
            <Link
              href="/capacitaciones"
              className="mt-2 inline-flex h-11 items-center justify-center rounded-lg bg-white px-6 text-sm font-semibold text-[#2563eb] transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              Ver capacitaciones
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
