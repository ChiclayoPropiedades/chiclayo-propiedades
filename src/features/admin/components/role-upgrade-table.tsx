"use client";

import { useTransition } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  approveRoleUpgrade,
  rejectRoleUpgrade,
} from "@/features/admin/services/role-upgrade-actions";

interface RoleUpgradeRequest {
  id: string;
  profile_id: string;
  from_role: string;
  to_role: string;
  reason: string | null;
  status: string;
  created_at: string;
  user_name: string;
  user_phone: string | null;
}

interface RoleUpgradeTableProps {
  requests: RoleUpgradeRequest[];
}

export function RoleUpgradeTable({ requests }: RoleUpgradeTableProps) {
  if (requests.length === 0) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
            <th className="px-4 py-3">Usuario</th>
            <th className="px-4 py-3">Telefono</th>
            <th className="px-4 py-3">Solicita</th>
            <th className="px-4 py-3">Razon</th>
            <th className="px-4 py-3">Fecha</th>
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {requests.map((req) => (
            <RoleUpgradeRow key={req.id} request={req} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RoleUpgradeRow({ request }: { request: RoleUpgradeRequest }) {
  const [isPending, startTransition] = useTransition();

  function handleApprove() {
    startTransition(async () => {
      const result = await approveRoleUpgrade(request.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${request.user_name} ahora es Agente Inmobiliario`);
      }
    });
  }

  function handleReject() {
    startTransition(async () => {
      const result = await rejectRoleUpgrade(request.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Solicitud rechazada");
      }
    });
  }

  const roleLabels: Record<string, string> = {
    user: "Usuario",
    agent: "Agente",
    admin: "Admin",
  };

  return (
    <tr className="text-[#1f2937] hover:bg-gray-50/50">
      <td className="px-4 py-3 font-medium">{request.user_name}</td>
      <td className="px-4 py-3 text-gray-500">{request.user_phone ?? "—"}</td>
      <td className="px-4 py-3">
        <span className="text-gray-500">{roleLabels[request.from_role] ?? request.from_role}</span>
        <span className="mx-1.5 text-gray-300">&rarr;</span>
        <span className="font-medium text-[#2563eb]">{roleLabels[request.to_role] ?? request.to_role}</span>
      </td>
      <td className="max-w-[200px] truncate px-4 py-3 text-gray-500">
        {request.reason || "—"}
      </td>
      <td className="px-4 py-3 text-gray-500">
        {new Intl.DateTimeFormat("es-PE", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }).format(new Date(request.created_at))}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          {isPending ? (
            <Loader2 className="size-4 animate-spin text-gray-400" />
          ) : (
            <>
              <button
                onClick={handleApprove}
                className="rounded-md p-1.5 text-green-600 transition-colors hover:bg-green-50"
                title="Aprobar"
              >
                <CheckCircle className="size-5" />
              </button>
              <button
                onClick={handleReject}
                className="rounded-md p-1.5 text-red-500 transition-colors hover:bg-red-50"
                title="Rechazar"
              >
                <XCircle className="size-5" />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
