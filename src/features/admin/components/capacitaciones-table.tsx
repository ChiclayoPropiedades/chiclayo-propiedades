"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { formatPrice } from "@/shared/lib/format";
import {
  toggleTrainingActive,
  type AdminTraining,
} from "@/features/admin/services/admin-actions";

interface Props {
  trainings: AdminTraining[];
}

const modalityLabels: Record<string, string> = {
  presencial: "Presencial",
  virtual: "Virtual",
};

export function CapacitacionesTable({ trainings }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleToggleActive(id: string, current: boolean) {
    startTransition(async () => {
      try {
        await toggleTrainingActive(id, !current);
        toast.success(!current ? "Capacitación activada" : "Capacitación desactivada");
      } catch {
        toast.error("Error al cambiar el estado de la capacitación");
      }
    });
  }

  if (trainings.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-gray-400">
        No hay capacitaciones registradas.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-gray-200 bg-gray-50">
          <TableHead className="text-xs font-medium text-gray-500">Título</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Precio</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Modalidad</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Instructor</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Fecha evento</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Estado</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {trainings.map((training) => (
          <TableRow key={training.id} className="border-gray-100">
            <TableCell className="font-medium text-[#1f2937]">
              <span className="max-w-[200px] truncate block">{training.title}</span>
            </TableCell>
            <TableCell className="text-sm text-gray-700">
              {formatPrice(training.price, training.currency)}
            </TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${
                  training.modality === "presencial"
                    ? "bg-purple-100 text-purple-700 border-purple-200"
                    : "bg-teal-100 text-teal-700 border-teal-200"
                }`}
              >
                {modalityLabels[training.modality] ?? training.modality}
              </span>
            </TableCell>
            <TableCell className="text-sm text-gray-500">
              {training.instructor ?? <span className="text-gray-300">—</span>}
            </TableCell>
            <TableCell className="text-xs text-gray-400">
              {training.event_date
                ? new Date(training.event_date).toLocaleDateString("es-PE", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : <span className="text-gray-300">—</span>}
            </TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${
                  training.is_active
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "bg-red-100 text-red-600 border-red-200"
                }`}
              >
                {training.is_active ? "Activa" : "Inactiva"}
              </span>
            </TableCell>
            <TableCell>
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleToggleActive(training.id, training.is_active)}
                title={training.is_active ? "Desactivar" : "Activar"}
                className="rounded-md border border-gray-200 bg-white p-1.5 text-gray-500 transition-colors hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                aria-label={
                  training.is_active
                    ? `Desactivar capacitación: ${training.title}`
                    : `Activar capacitación: ${training.title}`
                }
              >
                {training.is_active ? (
                  <EyeOff className="size-3.5" aria-hidden="true" />
                ) : (
                  <Eye className="size-3.5" aria-hidden="true" />
                )}
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
