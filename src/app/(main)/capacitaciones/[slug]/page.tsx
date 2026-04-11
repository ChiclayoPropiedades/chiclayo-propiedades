import { type Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  Calendar,
  MapPin,
  User,
  GraduationCap,
  Monitor,
  Users,
} from "lucide-react";

import { formatPrice } from "@/shared/lib/format";
import {
  getTrainingBySlug,
  getTrainings,
} from "@/features/trainings/services/get-trainings";
import { courseJsonLd } from "@/shared/lib/structured-data";
import { isStripeConfigured } from "@/shared/lib/stripe";
import { EnrollButton } from "@/features/trainings/components/enroll-button";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const trainings = await getTrainings();
    return trainings.map((t) => ({ slug: t.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const training = await getTrainingBySlug(slug);

  if (!training) {
    return { title: "Capacitación no encontrada" };
  }

  return {
    title: `${training.title} | Capacitaciones`,
    description: training.description,
    openGraph: {
      title: training.title,
      description: training.description,
      type: "website",
      ...(training.cover_image && { images: [{ url: training.cover_image }] }),
    },
  };
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  try {
    return new Intl.DateTimeFormat("es-PE", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

export default async function TrainingDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const training = await getTrainingBySlug(slug);

  if (!training) {
    notFound();
  }

  const isPresencial = training.modality === "presencial";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            courseJsonLd({
              title: training.title,
              description: training.description,
              price: training.price,
              currency: training.currency,
              slug: training.slug,
              instructor: training.instructor ?? null,
            })
          ),
        }}
      />
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6 lg:px-8">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
            <li>
              <Link
                href="/"
                className="transition-colors hover:text-[#2563eb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]/50 rounded"
              >
                Inicio
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3.5" />
            </li>
            <li>
              <Link
                href="/capacitaciones"
                className="transition-colors hover:text-[#2563eb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]/50 rounded"
              >
                Capacitaciones
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3.5" />
            </li>
            <li
              className="max-w-[200px] truncate font-medium text-[#1f2937] sm:max-w-xs"
              aria-current="page"
            >
              {training.title}
            </li>
          </ol>
        </div>
      </nav>

      <div className="bg-white py-10 sm:py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {/* Main content */}
            <div className="lg:col-span-2">
              {/* Cover image */}
              {training.cover_image ? (
                <div className="relative mb-8 h-64 w-full overflow-hidden rounded-2xl sm:h-80">
                  <Image
                    src={training.cover_image}
                    alt={training.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div
                  className="mb-8 flex h-48 w-full items-center justify-center rounded-2xl bg-[#eff6ff] sm:h-64"
                  aria-hidden="true"
                >
                  <GraduationCap className="size-20 text-[#2563eb]/30" />
                </div>
              )}

              {/* Modality badge */}
              <span
                className={[
                  "mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold",
                  isPresencial
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-100 text-gray-700",
                ].join(" ")}
              >
                {isPresencial ? (
                  <Users className="size-4" aria-hidden="true" />
                ) : (
                  <Monitor className="size-4" aria-hidden="true" />
                )}
                {isPresencial ? "Presencial" : "Virtual"}
              </span>

              {/* Title */}
              <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-[#1f2937] sm:text-4xl">
                {training.title}
              </h1>

              {/* Meta */}
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                {training.event_date && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="size-4 shrink-0 text-[#2563eb]" aria-hidden="true" />
                    <time dateTime={training.event_date}>
                      {formatDate(training.event_date)}
                    </time>
                  </span>
                )}
                {training.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-4 shrink-0 text-[#2563eb]" aria-hidden="true" />
                    <span>{training.location}</span>
                  </span>
                )}
                {training.instructor && (
                  <span className="flex items-center gap-1.5">
                    <User className="size-4 shrink-0 text-[#2563eb]" aria-hidden="true" />
                    <span>{training.instructor}</span>
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="mt-6">
                <h2 className="mb-2 text-lg font-semibold text-[#1f2937]">
                  Descripción
                </h2>
                <p className="leading-relaxed text-gray-600">
                  {training.description}
                </p>
              </div>

              {/* Content */}
              {training.content && (
                <div
                  className="prose prose-lg mt-8 max-w-none prose-headings:text-[#1f2937] prose-a:text-[#2563eb] prose-strong:text-[#1f2937]"
                  dangerouslySetInnerHTML={{ __html: training.content }}
                />
              )}

              {/* Back link */}
              <div className="mt-12 border-t border-gray-100 pt-8">
                <Link
                  href="/capacitaciones"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#2563eb] px-4 py-2.5 text-sm font-semibold text-[#2563eb] transition-colors hover:bg-[#eff6ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]/50"
                >
                  Volver a Capacitaciones
                </Link>
              </div>
            </div>

            {/* Sidebar — purchase card */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
                {/* Price */}
                <div className="mb-6 text-center">
                  <p className="text-sm font-medium text-gray-500">Precio</p>
                  <p className="mt-1 text-4xl font-extrabold text-[#1f2937]">
                    {formatPrice(training.price, training.currency)}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    {training.currency === "PEN" ? "Soles peruanos" : "Dólares americanos"}
                  </p>
                </div>

                {/* Details summary */}
                <ul className="mb-6 flex flex-col gap-3 border-t border-gray-100 pt-5 text-sm">
                  <li className="flex items-center justify-between text-gray-600">
                    <span className="font-medium text-[#1f2937]">Modalidad</span>
                    <span>{isPresencial ? "Presencial" : "Virtual"}</span>
                  </li>
                  {training.event_date && (
                    <li className="flex items-center justify-between text-gray-600">
                      <span className="font-medium text-[#1f2937]">Fecha</span>
                      <span className="text-right text-xs">
                        {formatDate(training.event_date)}
                      </span>
                    </li>
                  )}
                  {training.location && (
                    <li className="flex items-center justify-between text-gray-600">
                      <span className="font-medium text-[#1f2937]">Lugar</span>
                      <span className="text-right">{training.location}</span>
                    </li>
                  )}
                  {training.instructor && (
                    <li className="flex items-center justify-between text-gray-600">
                      <span className="font-medium text-[#1f2937]">Instructor</span>
                      <span>{training.instructor}</span>
                    </li>
                  )}
                </ul>

                {/* CTA */}
                <EnrollButton
                  trainingId={training.id}
                  isStripeConfigured={isStripeConfigured()}
                />

                <p className="mt-3 text-center text-xs text-gray-400">
                  Pago seguro con Stripe. Recibirás confirmación por email.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
