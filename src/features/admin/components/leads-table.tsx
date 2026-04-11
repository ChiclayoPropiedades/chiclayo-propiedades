"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
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
  deleteInquiry,
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

export function LeadsTable({ inquiries: initialInquiries }: Props) {
  const [isPending, startTransition] = useTransition();
  const [inquiries, setInquiries] = useState<AdminInquiry[]>(initialInquiries);

  function handleStatusChange(id: string, status: string) {
    startTransition(async () => {
      try {
        await updateInquiryStatus(id, status);
        setInquiries((prev) =>
          prev.map((inq) =>
            inq.id === id
              ? { ...inq, status: status as AdminInquiry["status"] }
              : inq
          )
        );
        toast.success("Estado actualizado");
      } catch {
        toast.error("Error al actualizar el estado");
      }
    });
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`¿Estás seguro de eliminar la consulta de "${name}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    startTransition(async () => {
      try {
        const result = await deleteInquiry(id);
        if (result?.error) {
          toast.error(result.error);
          return;
        }
        setInquiries((prev) => prev.filter((inq) => inq.id !== id));
        toast.success("Consulta eliminada correctamente");
      } catch {
        toast.error("Error al eliminar la consulta");
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
                <span className="text-sm">
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
              <div className="flex items-center gap-1.5">
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
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleDelete(inquiry.id, inquiry.name)}
                  title="Eliminar consulta"
                  className="rounded-md border border-red-200 bg-white p-1.5 text-red-500 transition-colors hover:border-red-300 hover:bg-red-50 disabled:opacity-50"
                  aria-label={`Eliminar consulta de ${inquiry.name}`}
                >
                  <Trash2 className="size-3.5" aria-hidden="true" />
                </button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
