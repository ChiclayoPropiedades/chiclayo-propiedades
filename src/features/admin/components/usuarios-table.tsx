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
  updateUserRole,
  toggleUserActive,
  type AdminProfile,
} from "@/features/admin/services/admin-actions";

interface Props {
  users: AdminProfile[];
}

const roleColors: Record<string, string> = {
  admin: "bg-red-100 text-red-700 border-red-200",
  agent: "bg-blue-100 text-blue-700 border-blue-200",
  user: "bg-gray-100 text-gray-600 border-gray-200",
};

const roleLabels: Record<string, string> = {
  admin: "Admin",
  agent: "Agente",
  user: "Usuario",
};

export function UsuariosTable({ users }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleRoleChange(profileId: string, role: string) {
    startTransition(async () => {
      try {
        await updateUserRole(profileId, role);
        toast.success("Rol actualizado correctamente");
      } catch {
        toast.error("Error al actualizar el rol");
      }
    });
  }

  function handleToggleActive(profileId: string, current: boolean) {
    startTransition(async () => {
      try {
        await toggleUserActive(profileId, !current);
        toast.success(
          !current ? "Usuario activado" : "Usuario desactivado"
        );
      } catch {
        toast.error("Error al cambiar el estado del usuario");
      }
    });
  }

  if (users.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-gray-400">
        No hay usuarios registrados.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-gray-200 bg-gray-50">
          <TableHead className="text-xs font-medium text-gray-500">Nombre</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Teléfono</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Rol</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Estado</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id} className="border-gray-100">
            <TableCell className="font-medium text-[#1f2937]">
              {user.full_name ?? "Sin nombre"}
            </TableCell>
            <TableCell className="text-gray-500">
              {user.phone ?? <span className="text-gray-300">—</span>}
            </TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${roleColors[user.role ?? "user"] ?? roleColors["user"]}`}
              >
                {roleLabels[user.role ?? "user"] ?? user.role}
              </span>
            </TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${
                  user.is_active
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "bg-red-100 text-red-600 border-red-200"
                }`}
              >
                {user.is_active ? "Activo" : "Inactivo"}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {/* Cambiar rol */}
                <select
                  defaultValue={user.role ?? "user"}
                  disabled={isPending}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 disabled:opacity-50"
                  aria-label={`Cambiar rol de ${user.full_name ?? "usuario"}`}
                >
                  <option value="user">Usuario</option>
                  <option value="agent">Agente</option>
                  <option value="admin">Admin</option>
                </select>

                {/* Activar / Desactivar */}
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleToggleActive(user.id, user.is_active ?? false)}
                  className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-50 ${
                    user.is_active
                      ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                      : "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                  }`}
                >
                  {user.is_active ? "Desactivar" : "Activar"}
                </button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
