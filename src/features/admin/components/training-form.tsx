"use client";

import { useTransition, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";

interface TrainingInitialData {
  title: string;
  description: string;
  content: string | null;
  price: number;
  currency: string;
  modality: string;
  location: string | null;
  instructor: string | null;
  event_date: string | null;
  cover_image: string | null;
}

interface TrainingFormProps {
  initialData?: TrainingInitialData;
  action: (formData: FormData) => Promise<{ error: string } | void>;
}

const FIELD_CLASS =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 disabled:opacity-50";

export function TrainingForm({ initialData, action }: TrainingFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const isEditing = Boolean(initialData);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        const result = await action(formData);
        if (result?.error) {
          setError(result.error);
          toast.error(result.error);
        } else {
          toast.success(
            isEditing
              ? "Capacitación actualizada correctamente"
              : "Capacitación creada correctamente"
          );
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Error al guardar la capacitación";
        setError(message);
        toast.error(message);
      }
    });
  }

  // Normalizar event_date a formato datetime-local (YYYY-MM-DDTHH:mm)
  const defaultEventDate = initialData?.event_date
    ? initialData.event_date.slice(0, 16)
    : "";

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-6"
      aria-label={
        isEditing
          ? "Formulario de edición de capacitación"
          : "Formulario de nueva capacitación"
      }
    >
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* Título */}
      <div className="space-y-1.5">
        <Label htmlFor="title">
          Título{" "}
          <span className="text-red-500" aria-hidden="true">
            *
          </span>
        </Label>
        <Input
          id="title"
          name="title"
          type="text"
          defaultValue={initialData?.title ?? ""}
          placeholder="Ej: Curso de Tasación Inmobiliaria"
          required
          disabled={isPending}
          className="border-gray-200 focus:border-[#2563eb] focus:ring-[#2563eb]/20"
        />
      </div>

      {/* Descripción */}
      <div className="space-y-1.5">
        <Label htmlFor="description">
          Descripción{" "}
          <span className="text-red-500" aria-hidden="true">
            *
          </span>
        </Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={initialData?.description ?? ""}
          placeholder="Breve descripción de la capacitación para listados y SEO..."
          rows={3}
          required
          disabled={isPending}
          className="resize-none border-gray-200 focus:border-[#2563eb] focus:ring-[#2563eb]/20"
        />
      </div>

      {/* Precio + Moneda */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="price">
            Precio{" "}
            <span className="text-red-500" aria-hidden="true">
              *
            </span>
          </Label>
          <Input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            defaultValue={initialData?.price ?? ""}
            placeholder="199"
            required
            disabled={isPending}
            className="border-gray-200 focus:border-[#2563eb] focus:ring-[#2563eb]/20"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="currency">Moneda</Label>
          <select
            id="currency"
            name="currency"
            defaultValue={initialData?.currency ?? "PEN"}
            disabled={isPending}
            className={FIELD_CLASS}
          >
            <option value="PEN">PEN (Soles)</option>
            <option value="USD">USD (Dólares)</option>
          </select>
        </div>
      </div>

      {/* Modalidad + Instructor */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="modality">Modalidad</Label>
          <select
            id="modality"
            name="modality"
            defaultValue={initialData?.modality ?? "presencial"}
            disabled={isPending}
            className={FIELD_CLASS}
          >
            <option value="presencial">Presencial</option>
            <option value="virtual">Virtual</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="instructor">Instructor</Label>
          <Input
            id="instructor"
            name="instructor"
            type="text"
            defaultValue={initialData?.instructor ?? ""}
            placeholder="Nombre del instructor"
            disabled={isPending}
            className="border-gray-200 focus:border-[#2563eb] focus:ring-[#2563eb]/20"
          />
        </div>
      </div>

      {/* Ubicación + Fecha */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="location">Ubicación</Label>
          <Input
            id="location"
            name="location"
            type="text"
            defaultValue={initialData?.location ?? ""}
            placeholder="Ej: Centro de Convenciones Chiclayo"
            disabled={isPending}
            className="border-gray-200 focus:border-[#2563eb] focus:ring-[#2563eb]/20"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="event_date">Fecha y hora</Label>
          <Input
            id="event_date"
            name="event_date"
            type="datetime-local"
            defaultValue={defaultEventDate}
            disabled={isPending}
            className="border-gray-200 focus:border-[#2563eb] focus:ring-[#2563eb]/20"
          />
        </div>
      </div>

      {/* Imagen de portada */}
      <div className="space-y-1.5">
        <Label htmlFor="cover_image">Imagen de portada (URL)</Label>
        <Input
          id="cover_image"
          name="cover_image"
          type="url"
          defaultValue={initialData?.cover_image ?? ""}
          placeholder="https://ejemplo.com/imagen.jpg"
          disabled={isPending}
          className="border-gray-200 focus:border-[#2563eb] focus:ring-[#2563eb]/20"
        />
        <p className="text-xs text-gray-400">
          Pega la URL de una imagen. Formatos: JPG, PNG, WebP.
        </p>
      </div>

      {/* Contenido (full width) */}
      <div className="space-y-1.5">
        <Label htmlFor="content">Contenido detallado</Label>
        <Textarea
          id="content"
          name="content"
          defaultValue={initialData?.content ?? ""}
          placeholder="Describe el programa, temario, requisitos y beneficios de la capacitación..."
          rows={10}
          disabled={isPending}
          className="resize-y border-gray-200 font-mono text-sm focus:border-[#2563eb] focus:ring-[#2563eb]/20"
        />
      </div>

      {/* Acciones */}
      <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 pt-6">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-[#2563eb] hover:bg-[#1e40af]"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="mr-2 size-4" aria-hidden="true" />
              {isEditing ? "Guardar Cambios" : "Crear Capacitación"}
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin/capacitaciones")}
          disabled={isPending}
          className="text-gray-500"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
