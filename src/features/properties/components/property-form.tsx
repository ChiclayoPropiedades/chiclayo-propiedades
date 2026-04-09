"use client";

import { useTransition, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";

interface PropertyInitialData {
  title: string;
  description: string | null;
  price: number;
  currency: string;
  operation: string;
  type: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area_m2: number | null;
  address: string;
  district: string;
  city: string;
}

interface PropertyFormProps {
  initialData?: PropertyInitialData;
  action: (formData: FormData) => Promise<{ error: string } | void>;
}

const FIELD_CLASS =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 disabled:opacity-50";

export function PropertyForm({ initialData, action }: PropertyFormProps) {
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
              ? "Propiedad actualizada correctamente"
              : "Propiedad publicada correctamente"
          );
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error al guardar la propiedad";
        setError(message);
        toast.error(message);
      }
    });
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-6"
      aria-label={isEditing ? "Formulario de edición de propiedad" : "Formulario de nueva propiedad"}
    >
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* Fila 1: Título */}
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
          placeholder="Ej: Casa moderna en urbanización El Golf"
          required
          disabled={isPending}
          className="border-gray-200 focus:border-[#2563eb] focus:ring-[#2563eb]/20"
        />
      </div>

      {/* Fila 2: Precio + Moneda */}
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
            placeholder="250000"
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

      {/* Fila 3: Operación + Tipo */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="operation">
            Operación{" "}
            <span className="text-red-500" aria-hidden="true">
              *
            </span>
          </Label>
          <select
            id="operation"
            name="operation"
            defaultValue={initialData?.operation ?? "venta"}
            required
            disabled={isPending}
            className={FIELD_CLASS}
          >
            <option value="venta">Venta</option>
            <option value="alquiler">Alquiler</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="type">
            Tipo{" "}
            <span className="text-red-500" aria-hidden="true">
              *
            </span>
          </Label>
          <select
            id="type"
            name="type"
            defaultValue={initialData?.type ?? "casa"}
            required
            disabled={isPending}
            className={FIELD_CLASS}
          >
            <option value="casa">Casa</option>
            <option value="departamento">Departamento</option>
            <option value="terreno">Terreno</option>
            <option value="oficina">Oficina</option>
            <option value="local">Local</option>
            <option value="otro">Otro</option>
          </select>
        </div>
      </div>

      {/* Fila 4: Dormitorios + Baños + Área */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="bedrooms">Dormitorios</Label>
          <Input
            id="bedrooms"
            name="bedrooms"
            type="number"
            min="0"
            defaultValue={initialData?.bedrooms ?? ""}
            placeholder="3"
            disabled={isPending}
            className="border-gray-200 focus:border-[#2563eb] focus:ring-[#2563eb]/20"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bathrooms">Baños</Label>
          <Input
            id="bathrooms"
            name="bathrooms"
            type="number"
            min="0"
            defaultValue={initialData?.bathrooms ?? ""}
            placeholder="2"
            disabled={isPending}
            className="border-gray-200 focus:border-[#2563eb] focus:ring-[#2563eb]/20"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="area_m2">
            Área (m<sup>2</sup>)
          </Label>
          <Input
            id="area_m2"
            name="area_m2"
            type="number"
            min="0"
            step="0.01"
            defaultValue={initialData?.area_m2 ?? ""}
            placeholder="120"
            disabled={isPending}
            className="border-gray-200 focus:border-[#2563eb] focus:ring-[#2563eb]/20"
          />
        </div>
      </div>

      {/* Fila 5: Dirección + Distrito */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="address">
            Dirección{" "}
            <span className="text-red-500" aria-hidden="true">
              *
            </span>
          </Label>
          <Input
            id="address"
            name="address"
            type="text"
            defaultValue={initialData?.address ?? ""}
            placeholder="Av. Las Flores 123"
            required
            disabled={isPending}
            className="border-gray-200 focus:border-[#2563eb] focus:ring-[#2563eb]/20"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="district">
            Distrito{" "}
            <span className="text-red-500" aria-hidden="true">
              *
            </span>
          </Label>
          <Input
            id="district"
            name="district"
            type="text"
            defaultValue={initialData?.district ?? ""}
            placeholder="Chiclayo"
            required
            disabled={isPending}
            className="border-gray-200 focus:border-[#2563eb] focus:ring-[#2563eb]/20"
          />
        </div>
      </div>

      {/* Fila 6: Ciudad */}
      <div className="space-y-1.5">
        <Label htmlFor="city">Ciudad</Label>
        <Input
          id="city"
          name="city"
          type="text"
          defaultValue={initialData?.city ?? "Chiclayo"}
          placeholder="Chiclayo"
          disabled={isPending}
          className="border-gray-200 focus:border-[#2563eb] focus:ring-[#2563eb]/20"
        />
      </div>

      {/* Fila 7: Descripción (full width) */}
      <div className="space-y-1.5">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={initialData?.description ?? ""}
          placeholder="Describe los detalles, características y puntos destacados de la propiedad..."
          rows={5}
          disabled={isPending}
          className="resize-y border-gray-200 focus:border-[#2563eb] focus:ring-[#2563eb]/20"
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
              {isEditing ? "Guardar Cambios" : "Publicar Propiedad"}
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/dashboard/propiedades")}
          disabled={isPending}
          className="text-gray-500"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
