import { type Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Briefcase, Globe, UserCheck, GraduationCap } from "lucide-react";

export const metadata: Metadata = {
  title: "Nuestros Servicios",
  description:
    "Servicios inmobiliarios para empresas, personas y asesores en Chiclayo y Lambayeque. Asesoria, gestion de propiedades, capacitaciones y mas.",
};

interface ServiceItem {
  label: string;
}

interface ServiceSectionProps {
  title: string;
  icon: React.ReactNode;
  items: ServiceItem[];
  imagePosition: "left" | "right";
  imageSrc: string;
  imageAlt: string;
}

function ServiceSection({
  title,
  icon,
  items,
  imagePosition,
  imageSrc,
  imageAlt,
}: ServiceSectionProps) {
  const imageBlock = (
    <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl shadow-lg">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover"
      />
      {/* Overlay sutil para profundidad */}
      <div
        className="absolute inset-0 bg-gradient-to-tr from-[#1e3a8a]/30 via-transparent to-transparent"
        aria-hidden="true"
      />
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
  { label: "Asesoria en compra, venta y alquiler de inmuebles comerciales" },
  { label: "Estudios de mercado inmobiliario" },
  { label: "Saneamiento y regularizacion de propiedades" },
  { label: "Evaluacion tecnica y legal de activos inmobiliarios" },
  { label: "Gestion integral de carteras de inmuebles" },
];

const generalesItems: ServiceItem[] = [
  { label: "Saneamiento fisico-legal de propiedades" },
  { label: "Asesoria legal en contratos de compraventa y arrendamiento" },
  { label: "Publicidad y difusion de propiedades" },
  { label: "Capacitaciones para compradores e inversores" },
  { label: "Property Management y administracion de inmuebles" },
];

const asesoresItems: ServiceItem[] = [
  { label: "Cursos y talleres de formacion inmobiliaria" },
  { label: "Publicidad destacada en el portal" },
  { label: "Reconocimiento mensual y premios por desempeno" },
  { label: "Oportunidades de networking y alianzas" },
  { label: "Participacion en el ranking de asesores" },
  { label: "Linea de carrera dentro de la plataforma" },
];

export default function ServiciosPage() {
  return (
    <>
      {/* Page header */}
      <div className="bg-gradient-to-r from-[#0a1628] to-[#1e3a5f] py-10">
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
            imageSrc="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=80&auto=format&fit=crop"
            imageAlt="Profesionales cerrando un acuerdo inmobiliario corporativo"
          />

          <hr className="border-gray-100" />

          {/* Servicios Generales */}
          <ServiceSection
            title="Servicios Generales"
            icon={<Globe className="size-5 text-[#2563eb]" aria-hidden="true" />}
            items={generalesItems}
            imagePosition="right"
            imageSrc="https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&q=80&auto=format&fit=crop"
            imageAlt="Entrega de llaves de una nueva propiedad"
          />

          <hr className="border-gray-100" />

          {/* Servicios para Asesores */}
          <ServiceSection
            title="Servicios para Asesores Inmobiliarios"
            icon={<UserCheck className="size-5 text-[#2563eb]" aria-hidden="true" />}
            items={asesoresItems}
            imagePosition="left"
            imageSrc="/images/servicios/agente-inmobiliaria.jpg"
            imageAlt="Retrato de agente inmobiliaria mirando a la camara con pareja feliz al fondo"
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
