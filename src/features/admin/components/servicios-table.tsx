"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, Pencil, Plus, Save, Trash2, X } from "lucide-react";
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
  createService,
  updateService,
  deleteService,
  type AdminService,
} from "@/features/admin/services/admin-actions";

interface Props {
  services: AdminService[];
}

interface ServiceFormState {
  title: string;
  description: string;
  icon: string;
  display_order: string;
}

const emptyForm: ServiceFormState = {
  title: "",
  description: "",
  icon: "",
  display_order: "0",
};

export function ServiciosTable({ services: initialServices }: Props) {
  const [isPending, startTransition] = useTransition();
  const [services, setServices] = useState<AdminService[]>(initialServices);

  // Estado para el formulario de nuevo servicio
  const [showNewForm, setShowNewForm] = useState(false);
  const [newForm, setNewForm] = useState<ServiceFormState>(emptyForm);

  // Estado para edicion inline
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<ServiceFormState>(emptyForm);

  function handleToggleActive(id: string, current: boolean) {
    startTransition(async () => {
      try {
        await toggleServiceActive(id, !current);
        setServices((prev) =>
          prev.map((s) => (s.id === id ? { ...s, is_active: !current } : s))
        );
        toast.success(!current ? "Servicio activado" : "Servicio desactivado");
      } catch {
        toast.error("Error al cambiar el estado del servicio");
      }
    });
  }

  function handleStartEdit(service: AdminService) {
    setEditingId(service.id);
    setEditForm({
      title: service.title,
      description: service.description,
      icon: service.icon ?? "",
      display_order: String(service.display_order),
    });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setEditForm(emptyForm);
  }

  function handleSaveEdit(id: string) {
    if (!editForm.title.trim()) {
      toast.error("El título es obligatorio");
      return;
    }
    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.set("title", editForm.title);
        fd.set("description", editForm.description);
        fd.set("icon", editForm.icon);
        fd.set("display_order", editForm.display_order);
        const result = await updateService(id, fd);
        if (result?.error) {
          toast.error(result.error);
          return;
        }
        setServices((prev) =>
          prev.map((s) =>
            s.id === id
              ? {
                  ...s,
                  title: editForm.title,
                  description: editForm.description,
                  icon: editForm.icon || null,
                  display_order: parseInt(editForm.display_order) || 0,
                }
              : s
          )
        );
        setEditingId(null);
        toast.success("Servicio actualizado correctamente");
      } catch {
        toast.error("Error al actualizar el servicio");
      }
    });
  }

  function handleDelete(id: string, title: string) {
    if (!confirm(`¿Estás seguro de eliminar el servicio "${title}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    startTransition(async () => {
      try {
        const result = await deleteService(id);
        if (result?.error) {
          toast.error(result.error);
          return;
        }
        setServices((prev) => prev.filter((s) => s.id !== id));
        toast.success("Servicio eliminado correctamente");
      } catch {
        toast.error("Error al eliminar el servicio");
      }
    });
  }

  function handleCreateService() {
    if (!newForm.title.trim()) {
      toast.error("El título es obligatorio");
      return;
    }
    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.set("title", newForm.title);
        fd.set("description", newForm.description);
        fd.set("icon", newForm.icon);
        fd.set("display_order", newForm.display_order);
        const result = await createService(fd);
        if (result?.error) {
          toast.error(result.error);
          return;
        }
        // Recargar la lista desde el estado optimista con un ID temporal
        const tempService: AdminService = {
          id: `temp-${Date.now()}`,
          title: newForm.title,
          description: newForm.description,
          icon: newForm.icon || null,
          display_order: parseInt(newForm.display_order) || 0,
          is_active: true,
        };
        setServices((prev) =>
          [...prev, tempService].sort(
            (a, b) => a.display_order - b.display_order
          )
        );
        setNewForm(emptyForm);
        setShowNewForm(false);
        toast.success("Servicio creado correctamente");
      } catch {
        toast.error("Error al crear el servicio");
      }
    });
  }

  return (
    <div className="space-y-4">
      {/* Botón nuevo servicio */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            setShowNewForm((v) => !v);
            setNewForm(emptyForm);
          }}
          className="inline-flex items-center gap-1.5 rounded-md bg-[#2563eb] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1e40af] disabled:opacity-50"
          disabled={isPending}
        >
          {showNewForm ? (
            <>
              <X className="size-4" aria-hidden="true" />
              Cancelar
            </>
          ) : (
            <>
              <Plus className="size-4" aria-hidden="true" />
              Nuevo Servicio
            </>
          )}
        </button>
      </div>

      {/* Formulario nuevo servicio */}
      {showNewForm && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h3 className="mb-3 text-sm font-semibold text-[#1e40af]">Nuevo Servicio</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newForm.title}
                onChange={(e) => setNewForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Ej: Compra y Venta"
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Descripción
              </label>
              <textarea
                value={newForm.description}
                onChange={(e) => setNewForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Describe brevemente el servicio..."
                rows={3}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Icono (nombre Lucide)
              </label>
              <input
                type="text"
                value={newForm.icon}
                onChange={(e) => setNewForm((f) => ({ ...f, icon: e.target.value }))}
                placeholder="Ej: Home, Building2, Key"
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Orden de visualización
              </label>
              <input
                type="number"
                value={newForm.display_order}
                onChange={(e) => setNewForm((f) => ({ ...f, display_order: e.target.value }))}
                min={0}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30"
              />
            </div>
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowNewForm(false)}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              <X className="size-3.5" aria-hidden="true" />
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleCreateService}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-md bg-[#2563eb] px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#1e40af] disabled:opacity-50"
            >
              <Save className="size-3.5" aria-hidden="true" />
              Guardar Servicio
            </button>
          </div>
        </div>
      )}

      {/* Tabla */}
      {services.length === 0 && !showNewForm ? (
        <p className="py-12 text-center text-sm text-gray-400">
          No hay servicios registrados.
        </p>
      ) : (
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
            {services.map((service) =>
              editingId === service.id ? (
                /* Fila de edición inline */
                <TableRow key={service.id} className="border-blue-100 bg-blue-50/40">
                  <TableCell>
                    <input
                      type="number"
                      value={editForm.display_order}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, display_order: e.target.value }))
                      }
                      min={0}
                      className="w-16 rounded border border-gray-200 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30"
                    />
                  </TableCell>
                  <TableCell>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, title: e.target.value }))
                      }
                      className="w-full min-w-[140px] rounded border border-gray-200 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30"
                    />
                  </TableCell>
                  <TableCell>
                    <textarea
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, description: e.target.value }))
                      }
                      rows={2}
                      className="w-full min-w-[200px] rounded border border-gray-200 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30"
                    />
                  </TableCell>
                  <TableCell>
                    <input
                      type="text"
                      value={editForm.icon}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, icon: e.target.value }))
                      }
                      placeholder="Ej: Home"
                      className="w-24 rounded border border-gray-200 bg-white px-2 py-1 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30"
                    />
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-gray-400">—</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleSaveEdit(service.id)}
                        title="Guardar cambios"
                        className="inline-flex items-center gap-1 rounded-md bg-[#2563eb] px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-[#1e40af] disabled:opacity-50"
                        aria-label="Guardar cambios"
                      >
                        <Save className="size-3.5" aria-hidden="true" />
                        Guardar
                      </button>
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={handleCancelEdit}
                        title="Cancelar edición"
                        className="rounded-md border border-gray-200 bg-white p-1.5 text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-50"
                        aria-label="Cancelar edición"
                      >
                        <X className="size-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                /* Fila normal */
                <TableRow key={service.id} className="border-gray-100">
                  <TableCell className="text-center text-sm font-medium text-gray-500">
                    {service.display_order}
                  </TableCell>
                  <TableCell className="font-medium text-[#1f2937]">
                    {service.title}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    <span className="max-w-[280px] truncate block">
                      {service.description}
                    </span>
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
                    <div className="flex items-center gap-1.5">
                      {/* Activar / Desactivar */}
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() =>
                          handleToggleActive(service.id, service.is_active)
                        }
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

                      {/* Editar */}
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleStartEdit(service)}
                        title="Editar servicio"
                        className="rounded-md border border-gray-200 bg-white p-1.5 text-gray-500 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50"
                        aria-label={`Editar servicio: ${service.title}`}
                      >
                        <Pencil className="size-3.5" aria-hidden="true" />
                      </button>

                      {/* Eliminar */}
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleDelete(service.id, service.title)}
                        title="Eliminar servicio"
                        className="rounded-md border border-red-200 bg-white p-1.5 text-red-500 transition-colors hover:border-red-300 hover:bg-red-50 disabled:opacity-50"
                        aria-label={`Eliminar servicio: ${service.title}`}
                      >
                        <Trash2 className="size-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
