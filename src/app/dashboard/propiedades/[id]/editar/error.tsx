"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export default function EditarPropiedadError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error al editar propiedad:", error);
  }, [error]);

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
      <AlertTriangle className="size-12 text-amber-500" />
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Error al editar propiedad
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          No se pudo cargar el formulario de edición. Intenta de nuevo.
        </p>
      </div>
      <div className="flex gap-3">
        <Button onClick={reset} className="bg-[#2563eb] hover:bg-[#1e40af]">
          Reintentar
        </Button>
        <Button
          variant="outline"
          onClick={() => (window.location.href = "/dashboard/propiedades")}
        >
          Volver a Mis Propiedades
        </Button>
      </div>
    </div>
  );
}
