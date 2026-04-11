"use client";

import { useState, useRef, useCallback, useTransition } from "react";
import Image from "next/image";
import {
  Camera,
  X,
  Star,
  Link2,
  Upload,
  Loader2,
  ImagePlus,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  uploadPropertyImage,
  addPropertyImageUrl,
  removePropertyImage,
  setPropertyCoverImage,
} from "@/features/properties/services/property-actions";
import { toast } from "sonner";

interface ImageItem {
  id: string;
  url: string;
  display_order: number;
  is_cover: boolean;
}

interface PropertyImageUploadProps {
  propertyId: string;
  initialImages?: ImageItem[];
  maxImages?: number;
}

export function PropertyImageUpload({
  propertyId,
  initialImages = [],
  maxImages = 10,
}: PropertyImageUploadProps) {
  const [images, setImages] = useState<ImageItem[]>(initialImages);
  const [urlInput, setUrlInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, startUpload] = useTransition();
  const [isAddingUrl, startAddUrl] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_IMAGES = maxImages;
  const canAddMore = images.length < MAX_IMAGES;

  const handleFileUpload = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);

      if (images.length + fileArray.length > MAX_IMAGES) {
        toast.error(`Máximo ${MAX_IMAGES} imágenes por propiedad`);
        return;
      }

      for (const file of fileArray) {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} no es una imagen válida`);
          continue;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} supera 5MB`);
          continue;
        }

        startUpload(async () => {
          const formData = new FormData();
          formData.append("file", file);
          const result = await uploadPropertyImage(propertyId, formData);
          if (result.error) {
            toast.error(result.error);
          } else if (result.image) {
            setImages((prev) => [...prev, result.image as ImageItem]);
            toast.success("Imagen subida");
          }
        });
      }
    },
    [propertyId, images.length]
  );

  const handleAddUrl = () => {
    if (!urlInput.trim() || !urlInput.startsWith("http")) {
      toast.error("Ingresa una URL válida (debe empezar con http)");
      return;
    }

    if (!canAddMore) {
      toast.error(`Máximo ${MAX_IMAGES} imágenes`);
      return;
    }

    startAddUrl(async () => {
      const result = await addPropertyImageUrl(propertyId, urlInput.trim());
      if (result.error) {
        toast.error(result.error);
      } else if (result.image) {
        setImages((prev) => [...prev, result.image as ImageItem]);
        setUrlInput("");
        toast.success("Imagen agregada desde URL");
      }
    });
  };

  const handleRemove = (imageId: string) => {
    startUpload(async () => {
      const result = await removePropertyImage(imageId);
      if (result.error) {
        toast.error(result.error);
      } else {
        setImages((prev) => {
          const filtered = prev.filter((img) => img.id !== imageId);
          // Si no hay portada, asignar la primera
          if (filtered.length > 0 && !filtered.some((img) => img.is_cover)) {
            filtered[0].is_cover = true;
          }
          return filtered;
        });
        toast.success("Imagen eliminada");
      }
    });
  };

  const handleSetCover = (imageId: string) => {
    startUpload(async () => {
      const result = await setPropertyCoverImage(imageId, propertyId);
      if (result.error) {
        toast.error(result.error);
      } else {
        setImages((prev) =>
          prev.map((img) => ({ ...img, is_cover: img.id === imageId }))
        );
        toast.success("Portada actualizada");
      }
    });
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium text-gray-700">
        Fotos de la propiedad ({images.length}/{MAX_IMAGES})
      </label>

      {/* Drop zone */}
      {canAddMore && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all ${
            isDragging
              ? "border-[#2563eb] bg-blue-50"
              : "border-gray-300 bg-gray-50 hover:border-[#2563eb] hover:bg-blue-50/50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files) handleFileUpload(e.target.files);
              e.target.value = "";
            }}
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="size-8 animate-spin text-[#2563eb]" />
              <p className="text-sm text-gray-600">Subiendo imagen...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="flex size-14 items-center justify-center rounded-full bg-blue-100">
                <Camera className="size-7 text-[#2563eb]" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  <span className="text-[#2563eb]">Haz click</span> para
                  seleccionar o <span className="text-[#2563eb]">arrastra</span>{" "}
                  tus fotos aquí
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  JPG, PNG o WebP · Máx. 5MB por imagen
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* URL input */}
      {canAddMore && (
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Link2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Pegar URL de imagen (Google Drive, CDN, etc.)"
              className="pl-9"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddUrl();
                }
              }}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleAddUrl}
            disabled={isAddingUrl || !urlInput.trim()}
            className="shrink-0"
          >
            {isAddingUrl ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ImagePlus className="mr-1 size-4" />
            )}
            Agregar
          </Button>
        </div>
      )}

      {/* Image previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
            >
              <Image
                src={image.url}
                alt="Foto de propiedad"
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover"
              />

              {/* Cover badge */}
              {image.is_cover && (
                <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-[#b8860b] px-2 py-0.5 text-xs font-medium text-white shadow">
                  <Star className="size-3" />
                  Portada
                </span>
              )}

              {/* Action buttons overlay */}
              <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/60 via-transparent to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                {!image.is_cover && (
                  <button
                    type="button"
                    onClick={() => handleSetCover(image.id)}
                    className="rounded-md bg-white/90 px-2 py-1 text-xs font-medium text-gray-700 transition hover:bg-white"
                  >
                    <Star className="mr-1 inline size-3" />
                    Portada
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(image.id)}
                  className="ml-auto rounded-md bg-red-500/90 p-1.5 text-white transition hover:bg-red-600"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {images.length === 0 && !canAddMore && (
        <p className="text-center text-sm text-gray-400">
          Máximo de imágenes alcanzado
        </p>
      )}
    </div>
  );
}
