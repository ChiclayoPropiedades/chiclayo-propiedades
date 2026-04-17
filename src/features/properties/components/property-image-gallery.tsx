"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { Home, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import type { PropertyImage } from "@/features/properties/types";

interface PropertyImageGalleryProps {
  images: PropertyImage[];
  propertyTitle: string;
}

const navButtonClass =
  "absolute top-1/2 -translate-y-1/2 flex size-10 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-md transition-all hover:bg-white hover:scale-110 sm:size-12";

export function PropertyImageGallery({
  images,
  propertyTitle,
}: PropertyImageGalleryProps) {
  const orderedImages = useMemo(() => {
    const sorted = [...images].sort(
      (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
    );
    const cover = sorted.find((img) => img.is_cover);
    return cover
      ? [cover, ...sorted.filter((img) => img.id !== cover.id)]
      : sorted;
  }, [images]);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openAt = useCallback((index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  }, []);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i === 0 ? orderedImages.length - 1 : i - 1));
  }, [orderedImages.length]);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % orderedImages.length);
  }, [orderedImages.length]);

  // Soporte teclado: ← / → mientras el lightbox está abierto
  useEffect(() => {
    if (!lightboxOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, goPrev, goNext]);

  if (orderedImages.length === 0) {
    return (
      <div className="flex h-80 w-full items-center justify-center rounded-xl bg-gray-100">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <Home className="size-16" aria-hidden="true" />
          <span className="text-sm">Sin imágenes disponibles</span>
        </div>
      </div>
    );
  }

  const mainImage = orderedImages[0];
  const otherImages = orderedImages.slice(1);
  // Defensa: si images cambia y currentIndex queda fuera de rango, cae al último
  const safeIndex = Math.min(currentIndex, orderedImages.length - 1);
  const currentImage = orderedImages[safeIndex];
  const hasMany = orderedImages.length > 1;

  return (
    <>
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => openAt(0)}
          aria-label="Ver imagen principal en grande"
          className="group relative block h-56 w-full overflow-hidden rounded-xl sm:h-72 lg:h-96 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]"
        >
          <Image
            src={mainImage.url}
            alt={mainImage.alt_text ?? propertyTitle}
            fill
            sizes="(min-width: 1024px) 66vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            priority
          />
          <div className="pointer-events-none absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
            <ZoomIn className="size-3.5" aria-hidden="true" />
            Ver en grande
          </div>
        </button>

        {otherImages.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 sm:grid sm:grid-cols-4 sm:overflow-x-visible sm:pb-0 lg:grid-cols-5">
            {otherImages.map((img, index) => {
              const imageIndex = index + 1;
              return (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => openAt(imageIndex)}
                  aria-label={`Ver imagen ${imageIndex + 1} de ${orderedImages.length} en grande`}
                  className="group relative h-28 w-40 shrink-0 overflow-hidden rounded-xl sm:h-auto sm:w-auto sm:aspect-[4/3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]"
                >
                  <Image
                    src={img.url}
                    alt={
                      img.alt_text ??
                      `Imagen ${imageIndex + 1} de ${propertyTitle}`
                    }
                    fill
                    sizes="(max-width: 640px) 160px, 20vw"
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          showCloseButton
          className="max-w-[calc(100vw-2rem)] sm:max-w-5xl bg-black/95 p-0 ring-0 sm:p-0"
        >
          <DialogTitle className="sr-only">
            {propertyTitle} — Imagen {safeIndex + 1} de {orderedImages.length}
          </DialogTitle>

          {/* Conditional mount: evita preload de la imagen del lightbox cuando está cerrado */}
          {lightboxOpen && (
            <div className="relative flex h-[80vh] w-full items-center justify-center">
              <Image
                src={currentImage.url}
                alt={
                  currentImage.alt_text ??
                  `Imagen ${safeIndex + 1} de ${propertyTitle}`
                }
                fill
                sizes="(max-width: 640px) 100vw, 80vw"
                className="object-contain"
              />

              {hasMany && (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label="Imagen anterior"
                    className={`${navButtonClass} left-2 sm:left-4`}
                  >
                    <ChevronLeft className="size-5 sm:size-6" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="Imagen siguiente"
                    className={`${navButtonClass} right-2 sm:right-4`}
                  >
                    <ChevronRight className="size-5 sm:size-6" aria-hidden="true" />
                  </button>

                  <div
                    role="status"
                    aria-live="polite"
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm"
                  >
                    {safeIndex + 1} de {orderedImages.length}
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
