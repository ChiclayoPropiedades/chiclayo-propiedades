import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, BookOpen, User, GraduationCap } from "lucide-react";

import { formatPrice } from "@/shared/lib/format";
import { Training } from "../types";

interface TrainingCardProps {
  training: Training;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  try {
    return new Intl.DateTimeFormat("es-PE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

function CoverPlaceholder() {
  return (
    <div
      className="flex h-full w-full items-center justify-center bg-[#eff6ff]"
      aria-hidden="true"
    >
      <GraduationCap className="size-14 text-[#2563eb]/30" />
    </div>
  );
}

export function TrainingCard({ training }: TrainingCardProps) {
  const isPresencial = training.modality === "presencial";

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Cover image */}
      <div className="relative h-48 w-full shrink-0 overflow-hidden bg-[#eff6ff]">
        {training.cover_image ? (
          <Image
            src={training.cover_image}
            alt={training.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <CoverPlaceholder />
        )}

        {/* Modality badge */}
        <span
          className={[
            "absolute left-3 top-3 inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold shadow",
            isPresencial
              ? "bg-emerald-600 text-white"
              : "bg-gray-500 text-white",
          ].join(" ")}
        >
          {isPresencial ? "Presencial" : "Virtual"}
        </span>

        {/* Price badge */}
        <span className="absolute right-3 top-3 inline-flex items-center rounded-md bg-[#2563eb] px-2.5 py-1 text-sm font-bold text-white shadow">
          {formatPrice(training.price, training.currency)}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Title */}
        <h2 className="text-base font-bold leading-snug text-[#1f2937]">
          {training.title}
        </h2>

        {/* Meta info */}
        <div className="flex flex-col gap-2">
          {training.event_date && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="size-4 shrink-0 text-[#2563eb]" aria-hidden="true" />
              <span>{formatDate(training.event_date)}</span>
            </div>
          )}

          {training.location && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="size-4 shrink-0 text-[#2563eb]" aria-hidden="true" />
              <span className="truncate">{training.location}</span>
            </div>
          )}

          {training.description && (
            <div className="flex items-start gap-2 text-sm text-gray-500">
              <BookOpen className="mt-0.5 size-4 shrink-0 text-[#2563eb]" aria-hidden="true" />
              <span className="line-clamp-2">{training.description}</span>
            </div>
          )}

          {training.instructor && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <User className="size-4 shrink-0 text-[#2563eb]" aria-hidden="true" />
              <span>{training.instructor}</span>
            </div>
          )}
        </div>

        {/* CTA button */}
        <div className="mt-auto pt-2">
          <Link
            href={`/capacitaciones/${training.slug}`}
            className="flex h-10 w-full items-center justify-center rounded-lg bg-[#2563eb] text-sm font-semibold text-white transition-colors hover:bg-[#1e40af] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]/50"
          >
            {training.stripe_price_id ? "Inscribirse" : "Más información"}
          </Link>
        </div>
      </div>
    </article>
  );
}
