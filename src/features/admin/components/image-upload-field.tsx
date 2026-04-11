"use client";

import { useState, useRef, useTransition } from "react";
import Image from "next/image";
import { Upload, X, Link as LinkIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { uploadCoverImage } from "@/features/admin/services/upload-actions";

interface ImageUploadFieldProps {
  name: string;
  label: string;
  defaultValue?: string | null;
  disabled?: boolean;
  onChange?: (url: string) => void;
}

export function ImageUploadField({
  name,
  label,
  defaultValue,
  disabled,
  onChange,
}: ImageUploadFieldProps) {
  const [imageUrl, setImageUrl] = useState(defaultValue ?? "");
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [isPending, startTransition] = useTransition();
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileSelect(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Solo se permiten imágenes");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no debe superar 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    startTransition(async () => {
      const result = await uploadCoverImage(formData);
      if (result.error) {
        toast.error(result.error);
      } else if (result.url) {
        setImageUrl(result.url);
        onChange?.(result.url);
        toast.success("Imagen subida correctamente");
      }
    });
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  }

  function handleRemove() {
    setImageUrl("");
    onChange?.("");
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {/* Hidden input con la URL para el form */}
      <input type="hidden" name={name} value={imageUrl} />

      {/* Preview */}
      {imageUrl && (
        <div className="relative w-full overflow-hidden rounded-lg border border-gray-200">
          <div className="relative h-40 w-full">
            <Image
              src={imageUrl}
              alt="Portada"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled || isPending}
            className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white transition-colors hover:bg-black/70"
            title="Quitar imagen"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* Upload area */}
      {!imageUrl && (
        <>
          {/* Mode toggle */}
          <div className="flex gap-1 rounded-lg border border-gray-200 bg-gray-50 p-0.5">
            <button
              type="button"
              onClick={() => setMode("upload")}
              className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                mode === "upload"
                  ? "bg-white text-[#1f2937] shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Upload className="mr-1 inline size-3" />
              Subir archivo
            </button>
            <button
              type="button"
              onClick={() => setMode("url")}
              className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                mode === "url"
                  ? "bg-white text-[#1f2937] shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <LinkIcon className="mr-1 inline size-3" />
              Pegar URL
            </button>
          </div>

          {mode === "upload" ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors ${
                dragOver
                  ? "border-[#2563eb] bg-[#eff6ff]"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100"
              } ${isPending ? "pointer-events-none opacity-50" : ""}`}
            >
              {isPending ? (
                <>
                  <Loader2 className="mb-2 size-8 animate-spin text-[#2563eb]" />
                  <p className="text-sm font-medium text-gray-600">
                    Subiendo imagen...
                  </p>
                </>
              ) : (
                <>
                  <Upload className="mb-2 size-8 text-gray-400" />
                  <p className="text-sm font-medium text-gray-600">
                    Arrastra una imagen o haz clic para seleccionar
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    JPG, PNG o WebP. Máximo 5MB.
                  </p>
                </>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleInputChange}
                disabled={disabled || isPending}
                className="hidden"
              />
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="https://ejemplo.com/imagen.jpg"
                disabled={disabled || isPending}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const val = (e.target as HTMLInputElement).value.trim();
                    if (val) {
                      setImageUrl(val);
                      onChange?.(val);
                    }
                  }
                }}
                className="border-gray-200 focus:border-[#2563eb] focus:ring-[#2563eb]/20"
              />
              <Button
                type="button"
                variant="outline"
                disabled={disabled || isPending}
                onClick={() => {
                  const input = document.querySelector(
                    'input[type="url"][placeholder]'
                  ) as HTMLInputElement | null;
                  const val = input?.value.trim();
                  if (val) setImageUrl(val);
                }}
              >
                Agregar
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
