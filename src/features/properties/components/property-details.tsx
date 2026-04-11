import Image from "next/image";
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Home,
  Phone,
  User,
  MessageCircle,
  Building2,
} from "lucide-react";

import { formatPrice } from "@/shared/lib/format";
import { Property } from "../types";
import { ContactForm } from "./contact-form";

interface PropertyDetailsProps {
  property: Property;
}

const typeLabels: Record<Property["type"], string> = {
  casa: "Casa",
  departamento: "Departamento",
  terreno: "Terreno",
  oficina: "Oficina",
  local: "Local comercial",
  otro: "Otro",
};

const operationLabels: Record<Property["operation"], string> = {
  venta: "En Venta",
  alquiler: "En Alquiler",
};

function ImageGallery({ property }: { property: Property }) {
  const images = property.property_images ?? [];
  const coverImage = images.find((img) => img.is_cover) ?? images[0] ?? null;
  const otherImages = images.filter((img) => img !== coverImage).slice(0, 4);

  if (!coverImage) {
    return (
      <div className="flex h-80 w-full items-center justify-center rounded-xl bg-gray-100">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <Home className="size-16" aria-hidden="true" />
          <span className="text-sm">Sin imágenes disponibles</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-4 sm:grid-rows-2">
      {/* Main image */}
      <div className="relative overflow-hidden rounded-xl sm:col-span-3 sm:row-span-2 h-48 sm:h-72 lg:h-96">
        <Image
          src={coverImage.url}
          alt={coverImage.alt_text ?? property.title}
          fill
          sizes="(max-width: 640px) 100vw, 75vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Secondary images */}
      {otherImages.slice(0, 2).map((img, index) => (
        <div
          key={img.id}
          className={`relative hidden overflow-hidden rounded-xl sm:block h-[calc((24rem-0.5rem)/2)] ${
            index === 1 && otherImages.length > 2
              ? "sm:relative"
              : ""
          }`}
        >
          <Image
            src={img.url}
            alt={img.alt_text ?? `Imagen ${index + 2} de ${property.title}`}
            fill
            sizes="25vw"
            className="object-cover"
          />
          {index === 1 && otherImages.length > 2 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="text-lg font-semibold text-white">
                +{otherImages.length - 1}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function PropertyDetails({ property }: PropertyDetailsProps) {
  const whatsappMessage = encodeURIComponent(
    `Hola, estoy interesado en la propiedad: ${property.title}. ¿Podría brindarme más información?`
  );
  const whatsappPhone = property.agent?.phone?.replace(/\D/g, "") ?? "";
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${whatsappMessage}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav aria-label="Ruta de navegación" className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li>
            <a href="/" className="hover:text-[#2563eb] transition-colors">
              Inicio
            </a>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <a
              href="/propiedades"
              className="hover:text-[#2563eb] transition-colors"
            >
              Propiedades
            </a>
          </li>
          <li aria-hidden="true">/</li>
          <li
            className="truncate max-w-48 text-[#1f2937] font-medium"
            aria-current="page"
          >
            {property.title}
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main column */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Gallery */}
          <ImageGallery property={property} />

          {/* Title + Price */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${
                      property.operation === "venta"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {operationLabels[property.operation]}
                  </span>
                  <span className="inline-flex items-center rounded-md bg-[#eff6ff] px-2.5 py-1 text-xs font-semibold text-[#2563eb]">
                    {typeLabels[property.type]}
                  </span>
                  {property.featured && (
                    <span className="inline-flex items-center rounded-md bg-[#2563eb] px-2.5 py-1 text-xs font-semibold text-white">
                      Premium
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-[#1f2937] sm:text-3xl">
                  {property.title}
                </h1>
              </div>
              <p className="text-2xl font-bold text-[#2563eb] whitespace-nowrap">
                {formatPrice(property.price, property.currency)}
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <MapPin
                className="size-4 shrink-0 text-[#2563eb]"
                aria-hidden="true"
              />
              <span>
                {property.address}, {property.district}, {property.city}
              </span>
            </div>
          </div>

          {/* Specs */}
          <section aria-labelledby="specs-heading">
            <h2
              id="specs-heading"
              className="mb-4 text-lg font-semibold text-[#1f2937]"
            >
              Especificaciones
            </h2>
            <dl className="grid grid-cols-2 gap-2 sm:gap-4 sm:grid-cols-3">
              {property.bedrooms !== null && (
                <div className="flex flex-col gap-1 rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <dt className="flex items-center gap-2 text-xs font-medium text-gray-500">
                    <Bed className="size-4 text-[#2563eb]" aria-hidden="true" />
                    Habitaciones
                  </dt>
                  <dd className="text-xl font-bold text-[#1f2937]">
                    {property.bedrooms}
                  </dd>
                </div>
              )}
              {property.bathrooms !== null && (
                <div className="flex flex-col gap-1 rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <dt className="flex items-center gap-2 text-xs font-medium text-gray-500">
                    <Bath
                      className="size-4 text-[#2563eb]"
                      aria-hidden="true"
                    />
                    Baños
                  </dt>
                  <dd className="text-xl font-bold text-[#1f2937]">
                    {property.bathrooms}
                  </dd>
                </div>
              )}
              {property.area_m2 !== null && (
                <div className="flex flex-col gap-1 rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <dt className="flex items-center gap-2 text-xs font-medium text-gray-500">
                    <Maximize2
                      className="size-4 text-[#2563eb]"
                      aria-hidden="true"
                    />
                    Área total
                  </dt>
                  <dd className="text-xl font-bold text-[#1f2937]">
                    {property.area_m2} m²
                  </dd>
                </div>
              )}
              <div className="flex flex-col gap-1 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <dt className="flex items-center gap-2 text-xs font-medium text-gray-500">
                  <Building2
                    className="size-4 text-[#2563eb]"
                    aria-hidden="true"
                  />
                  Distrito
                </dt>
                <dd className="text-base font-semibold text-[#1f2937]">
                  {property.district}
                </dd>
              </div>
              <div className="col-span-2 flex flex-col gap-1 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:col-span-2">
                <dt className="flex items-center gap-2 text-xs font-medium text-gray-500">
                  <MapPin
                    className="size-4 text-[#2563eb]"
                    aria-hidden="true"
                  />
                  Dirección
                </dt>
                <dd className="text-sm font-semibold text-[#1f2937]">
                  {property.address}
                </dd>
              </div>
            </dl>
          </section>

          {/* Description */}
          {property.description && (
            <section aria-labelledby="description-heading">
              <h2
                id="description-heading"
                className="mb-4 text-lg font-semibold text-[#1f2937]"
              >
                Descripción
              </h2>
              <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-line leading-relaxed">
                {property.description}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-6">
          {/* Agent card */}
          {property.agent && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">
                Agente responsable
              </h2>
              <div className="flex items-center gap-3">
                {property.agent.avatar_url ? (
                  <Image
                    src={property.agent.avatar_url}
                    alt={property.agent.full_name}
                    width={48}
                    height={48}
                    className="size-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#eff6ff]">
                    <User
                      className="size-6 text-[#2563eb]"
                      aria-hidden="true"
                    />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-[#1f2937]">
                    {property.agent.full_name}
                  </p>
                  {property.agent.phone && (
                    <a
                      href={`tel:${property.agent.phone}`}
                      className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#2563eb] transition-colors"
                    >
                      <Phone className="size-3.5" aria-hidden="true" />
                      {property.agent.phone}
                    </a>
                  )}
                </div>
              </div>

              {property.agent.phone && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
                >
                  <MessageCircle className="size-4" aria-hidden="true" />
                  Contactar por WhatsApp
                </a>
              )}
            </div>
          )}

          {/* Contact form */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-[#1f2937]">
              ¿Te interesa esta propiedad?
            </h2>
            <p className="mb-4 text-sm text-gray-500">
              Déjanos tus datos y un asesor se pondrá en contacto contigo.
            </p>
            <ContactForm propertyTitle={property.title} />
          </div>
        </aside>
      </div>
    </div>
  );
}
