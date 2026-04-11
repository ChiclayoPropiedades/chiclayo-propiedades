"use client";

import { useState, useMemo, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Eye, EyeOff, Star, StarOff, Trash2, Pencil, Search, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Input } from "@/shared/components/ui/input";
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

const PAGE_SIZE = 10;

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
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  // Filtrar
  const filtered = useMemo(() => {
    if (!search.trim()) return properties;
    const q = search.toLowerCase();
    return properties.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.district?.toLowerCase().includes(q) ||
        (p.type && typeLabels[p.type]?.toLowerCase().includes(q)) ||
        (p.operation && operationLabels[p.operation]?.toLowerCase().includes(q))
    );
  }, [properties, search]);

  // Paginar
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  // Reset page on search
  function handleSearch(value: string) {
    setSearch(value);
    setPage(0);
  }

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
    if (!confirm(`¿Eliminar "${title}"? Se eliminarán sus imágenes. No se puede deshacer.`)) return;
    startTransition(async () => {
      try {
        const result = await deleteProperty(id);
        if (result?.error) { toast.error(result.error); return; }
        setProperties((prev) => prev.filter((p) => p.id !== id));
        toast.success("Propiedad eliminada");
      } catch {
        toast.error("Error al eliminar");
      }
    });
  }

  if (properties.length === 0) {
    return <p className="py-12 text-center text-sm text-gray-400">No hay propiedades registradas.</p>;
  }

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Buscar por título, distrito, tipo..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="border-gray-200 pl-9"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200 bg-gray-50">
              <TableHead className="text-xs font-medium text-gray-500">Propiedad</TableHead>
              <TableHead className="text-xs font-medium text-gray-500">Agente</TableHead>
              <TableHead className="text-xs font-medium text-gray-500">Precio</TableHead>
              <TableHead className="text-xs font-medium text-gray-500">Ubicación</TableHead>
              <TableHead className="text-xs font-medium text-gray-500">Estado</TableHead>
              <TableHead className="text-xs font-medium text-gray-500">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((prop) => {
              const agent = Array.isArray(prop.agent) ? prop.agent[0] : prop.agent;
              return (
                <TableRow key={prop.id} className="border-gray-100">
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium text-[#1f2937]">{prop.title}</p>
                      <p className="text-xs text-gray-400">
                        {typeLabels[prop.type] ?? prop.type} En {operationLabels[prop.operation] ?? prop.operation}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm text-[#1f2937]">{agent?.full_name ?? "—"}</p>
                      <p className="text-xs text-gray-400">{agent?.phone ?? ""}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-semibold text-[#1f2937]">
                    {formatPrice(prop.price, prop.currency)}
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
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/propiedades/${prop.slug}`}
                        target="_blank"
                        title="Ver"
                        className="rounded-md border border-gray-200 bg-white p-1.5 text-gray-500 hover:bg-gray-50"
                      >
                        <Eye className="size-3.5" />
                      </Link>
                      <Link
                        href={`/admin/propiedades/${prop.id}/editar`}
                        title="Editar"
                        className="rounded-md border border-blue-200 bg-white p-1.5 text-blue-500 hover:bg-blue-50"
                      >
                        <Pencil className="size-3.5" />
                      </Link>
                      <button
                        disabled={isPending}
                        onClick={() => handleToggleActive(prop.id, prop.is_active)}
                        title={prop.is_active ? "Desactivar" : "Activar"}
                        className="rounded-md border border-gray-200 bg-white p-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        {prop.is_active ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                      </button>
                      <button
                        disabled={isPending}
                        onClick={() => handleToggleFeatured(prop.id, prop.featured)}
                        title={prop.featured ? "Quitar destacado" : "Destacar"}
                        className="rounded-md border border-gray-200 bg-white p-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        {prop.featured ? <StarOff className="size-3.5" /> : <Star className="size-3.5" />}
                      </button>
                      <button
                        disabled={isPending}
                        onClick={() => handleDelete(prop.id, prop.title)}
                        title="Eliminar"
                        className="rounded-md border border-red-200 bg-white p-1.5 text-red-500 hover:bg-red-50 disabled:opacity-50"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <p className="text-xs text-gray-500">
            {filtered.length} resultado{filtered.length !== 1 ? "s" : ""} — Página {page + 1} de {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="rounded-md border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-30"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="rounded-md border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-30"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
