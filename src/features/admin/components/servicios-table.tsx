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
import {
  toggleServiceActive,
  type AdminService,
} from "@/features/admin/services/admin-actions";

interface Props {
  services: AdminService[];
}

export function ServiciosTable({ services }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleToggleActive(id: string, current: boolean) {
    startTransition(async () => {
      try {
        await toggleServiceActive(id, !current);
        toast.success(!current ? "Servicio activado" : "Servicio desactivado");
      } catch {
        toast.error("Error al cambiar el estado del servicio");
      }
    });
  }

  if (services.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-gray-400">
        No hay servicios registrados.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-gray-200 bg-gray-50">
          <TableHead className="text-xs font-medium text-gray-500">Orden</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Título</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Descripción</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Icono</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Estado</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.map((service) => (
          <TableRow key={service.id} className="border-gray-100">
            <TableCell className="text-center text-sm font-medium text-gray-500">
              {service.display_order}
            </TableCell>
            <TableCell className="font-medium text-[#1f2937]">
              {service.title}
            </TableCell>
            <TableCell className="text-sm text-gray-500">
              <span className="max-w-[280px] truncate block">{service.description}</span>
            </TableCell>
            <TableCell className="font-mono text-xs text-gray-400">
              {service.icon ?? <span className="text-gray-300">—</span>}
            </TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${
                  service.is_active
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "bg-red-100 text-red-600 border-red-200"
                }`}
              >
                {service.is_active ? "Activo" : "Inactivo"}
              </span>
            </TableCell>
            <TableCell>
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleToggleActive(service.id, service.is_active)}
                title={service.is_active ? "Desactivar" : "Activar"}
                className="rounded-md border border-gray-200 bg-white p-1.5 text-gray-500 transition-colors hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                aria-label={
                  service.is_active
                    ? `Desactivar servicio: ${service.title}`
                    : `Activar servicio: ${service.title}`
                }
              >
                {service.is_active ? (
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
