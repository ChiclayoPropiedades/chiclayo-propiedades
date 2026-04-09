"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Eye, EyeOff, Star, StarOff, Trash2, Pencil } from "lucide-react";
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
  togglePropertyActive,
  togglePropertyFeatured,
  deleteProperty,
  type AdminProperty,
} from "@/features/admin/services/admin-actions";

interface Props {
  properties: AdminProperty[];
}

const operationLabels: Record<string, string> = {
  venta: "Venta",
  alquiler: "Alquiler",
};

const typeLabels: Record<string, string> = {
  casa: "Casa",
  departamento: "Depto.",
  terreno: "Terreno",
  oficina: "Oficina",
  local: "Local",
  otro: "Otro",
};

export function PropiedadesTable({ properties: initialProperties }: Props) {
  const [isPending, startTransition] = useTransition();
  const [properties, setProperties] = useState<AdminProperty[]>(initialProperties);

  function handleToggleActive(id: string, current: boolean) {
    startTransition(async () => {
      try {
        await togglePropertyActive(id, !current);
        setProperties((prev) =>
          prev.map((p) => (p.id === id ? { ...p, is_active: !current } : p))
        );
        toast.success(!current ? "Propiedad activada" : "Propiedad desactivada");
      } catch {
        toast.error("Error al cambiar el estado de la propiedad");
      }
    });
  }

  function handleToggleFeatured(id: string, current: boolean) {
    startTransition(async () => {
      try {
        await togglePropertyFeatured(id, !current);
        setProperties((prev) =>
          prev.map((p) => (p.id === id ? { ...p, featured: !current } : p))
        );
        toast.success(!current ? "Propiedad destacada" : "Propiedad quitada de destacados");
      } catch {
        toast.error("Error al cambiar el estado destacado");
      }
    });
  }

  function handleDelete(id: string, title: string) {
    if (!confirm(`¿Estás seguro de eliminar la propiedad "${title}"? Se eliminarán también todas sus imágenes. Esta acción no se puede deshacer.`)) {
      return;
    }
    startTransition(async () => {
      try {
        const result = await deleteProperty(id);
        if (result?.error) {
          toast.error(result.error);
          return;
        }
        setProperties((prev) => prev.filter((p) => p.id !== id));
        toast.success("Propiedad eliminada correctamente");
      } catch {
        toast.error("Error al eliminar la propiedad");
      }
    });
  }

  if (properties.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-gray-400">
        No hay propiedades registradas.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-gray-200 bg-gray-50">
          <TableHead className="text-xs font-medium text-gray-500">Título</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Precio</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Tipo</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Operación</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Distrito</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Estado</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Destacada</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {properties.map((prop) => (
          <TableRow key={prop.id} className="border-gray-100">
            <TableCell>
              <Link
                href={`/propiedades/${prop.slug}`}
                target="_blank"
                className="max-w-[200px] truncate block text-sm font-medium text-[#2563eb] hover:underline"
              >
                {prop.title}
              </Link>
            </TableCell>
            <TableCell className="text-sm text-gray-700">
              {formatPrice(prop.price, prop.currency)}
            </TableCell>
            <TableCell className="text-sm text-gray-500">
              {typeLabels[prop.type] ?? prop.type}
            </TableCell>
            <TableCell className="text-sm text-gray-500">
              {operationLabels[prop.operation] ?? prop.operation}
            </TableCell>
            <TableCell className="text-sm text-gray-500">{prop.district}</TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${
                  prop.is_active
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "bg-red-100 text-red-600 border-red-200"
                }`}
              >
                {prop.is_active ? "Activa" : "Inactiva"}
              </span>
            </TableCell>
            <TableCell>
              {prop.featured ? (
                <span className="inline-flex items-center rounded-full border border-yellow-200 bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
                  Destacada
                </span>
              ) : (
                <span className="text-xs text-gray-300">—</span>
              )}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1.5">
                <Link
                  href={`/admin/propiedades/${prop.id}/editar`}
                  title="Editar propiedad"
                  className="rounded-md border border-blue-200 bg-white p-1.5 text-blue-500 transition-colors hover:border-blue-300 hover:bg-blue-50"
                  aria-label={`Editar propiedad: ${prop.title}`}
                >
                  <Pencil className="size-3.5" aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleToggleActive(prop.id, prop.is_active)}
                  title={prop.is_active ? "Desactivar" : "Activar"}
                  className="rounded-md border border-gray-200 bg-white p-1.5 text-gray-500 transition-colors hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                  aria-label={prop.is_active ? "Desactivar propiedad" : "Activar propiedad"}
                >
                  {prop.is_active ? (
                    <EyeOff className="size-3.5" aria-hidden="true" />
                  ) : (
                    <Eye className="size-3.5" aria-hidden="true" />
                  )}
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleToggleFeatured(prop.id, prop.featured)}
                  title={prop.featured ? "Quitar destacado" : "Destacar"}
                  className="rounded-md border border-gray-200 bg-white p-1.5 text-gray-500 transition-colors hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                  aria-label={prop.featured ? "Quitar de destacadas" : "Marcar como destacada"}
                >
                  {prop.featured ? (
                    <StarOff className="size-3.5" aria-hidden="true" />
                  ) : (
                    <Star className="size-3.5" aria-hidden="true" />
                  )}
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleDelete(prop.id, prop.title)}
                  title="Eliminar propiedad"
                  className="rounded-md border border-red-200 bg-white p-1.5 text-red-500 transition-colors hover:border-red-300 hover:bg-red-50 disabled:opacity-50"
                  aria-label={`Eliminar propiedad: ${prop.title}`}
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
