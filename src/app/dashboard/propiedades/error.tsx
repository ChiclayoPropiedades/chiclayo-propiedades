"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export default function PropiedadesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error en propiedades:", error);
  }, [error]);

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
      <AlertTriangle className="size-12 text-amber-500" />
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Algo salió mal
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Hubo un error al cargar tus propiedades. Intenta de nuevo.
        </p>
      </div>
      <Button onClick={reset} className="bg-[#2563eb] hover:bg-[#1e40af]">
        Reintentar
      </Button>
    </div>
  );
}
