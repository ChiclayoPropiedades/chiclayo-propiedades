"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  updateInquiryStatus,
  type AdminInquiry,
} from "@/features/admin/services/admin-actions";

interface Props {
  inquiries: AdminInquiry[];
}

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700 border-blue-200",
  contacted: "bg-yellow-100 text-yellow-700 border-yellow-200",
  closed: "bg-gray-100 text-gray-500 border-gray-200",
};

const statusLabels: Record<string, string> = {
  new: "Nuevo",
  contacted: "Contactado",
  closed: "Cerrado",
};

export function LeadsTable({ inquiries }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleStatusChange(id: string, status: string) {
    startTransition(async () => {
      try {
        await updateInquiryStatus(id, status);
        toast.success("Estado actualizado");
      } catch {
        toast.error("Error al actualizar el estado");
      }
    });
  }

  if (inquiries.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-gray-400">
        No hay consultas registradas.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-gray-200 bg-gray-50">
          <TableHead className="text-xs font-medium text-gray-500">Fecha</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Nombre</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Email</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Teléfono</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Propiedad</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Estado</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {inquiries.map((inquiry) => (
          <TableRow key={inquiry.id} className="border-gray-100">
            <TableCell className="text-xs text-gray-400">
              {new Date(inquiry.created_at).toLocaleDateString("es-PE", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </TableCell>
            <TableCell className="font-medium text-[#1f2937]">
              {inquiry.name}
            </TableCell>
            <TableCell className="text-sm text-gray-500">{inquiry.email}</TableCell>
            <TableCell className="text-sm text-gray-500">
              {inquiry.phone ?? <span className="text-gray-300">—</span>}
            </TableCell>
            <TableCell className="text-sm text-gray-500">
              {inquiry.property ? (
                <span className="max-w-[160px] truncate block">
                  {inquiry.property.title}
                </span>
              ) : (
                <span className="text-gray-300">—</span>
              )}
            </TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${statusColors[inquiry.status] ?? ""}`}
              >
                {statusLabels[inquiry.status] ?? inquiry.status}
              </span>
            </TableCell>
            <TableCell>
              <select
                defaultValue={inquiry.status}
                disabled={isPending}
                onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 disabled:opacity-50"
                aria-label={`Cambiar estado del lead de ${inquiry.name}`}
              >
                <option value="new">Nuevo</option>
                <option value="contacted">Contactado</option>
                <option value="closed">Cerrado</option>
              </select>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
