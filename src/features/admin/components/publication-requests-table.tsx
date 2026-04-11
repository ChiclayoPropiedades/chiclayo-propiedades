"use client";

import { useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Check, X, Loader2, ExternalLink } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  approvePublicationRequest,
  rejectPublicationRequest,
  changeRequestPlan,
  deletePublicationRequest,
  deactivatePublicationRequest,
} from "@/features/subscriptions/services/publication-actions";

interface PublicationRequest {
  id: string;
  profile_id: string;
  plan_type: string;
  plan_name: string;
  plan_price: number;
  currency: string;
  status: string;
  used?: boolean;
  expires_at?: string | null;
  is_expired?: boolean;
  property_id?: string | null;
  property_title?: string | null;
  created_at: string;
  user_name: string;
  user_phone: string | null;
}

interface Props {
  requests: PublicationRequest[];
}

function formatPrice(price: number, currency: string) {
  return currency === "USD"
    ? `$ ${price.toLocaleString("es-PE")}`
    : `S/ ${price.toLocaleString("es-PE")}`;
}

export function PublicationRequestsTable({ requests }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleApprove(id: string) {
    startTransition(async () => {
      const result = await approvePublicationRequest(id);
      if (result.error) toast.error(result.error);
      else toast.success("Solicitud aprobada. El usuario ya puede publicar.");
    });
  }

  function handleReject(id: string) {
    if (!confirm("¿Rechazar esta solicitud?")) return;
    startTransition(async () => {
      const result = await rejectPublicationRequest(id);
      if (result.error) toast.error(result.error);
      else toast.success("Solicitud rechazada");
    });
  }

  function handleDeactivate(id: string) {
    if (!confirm("¿Desactivar esta publicación? La propiedad se ocultará pero no se eliminará.")) return;
    startTransition(async () => {
      const result = await deactivatePublicationRequest(id);
      if (result.error) toast.error(result.error);
      else toast.success("Publicación desactivada");
    });
  }

  function handleDelete(id: string) {
    if (!confirm("¿Eliminar PERMANENTEMENTE esta solicitud y su propiedad? No se puede deshacer.")) return;
    startTransition(async () => {
      const result = await deletePublicationRequest(id);
      if (result.error) toast.error(result.error);
      else toast.success("Solicitud y propiedad eliminadas");
    });
  }

  if (requests.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-400">
        No hay solicitudes de publicación pendientes.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-gray-200 bg-gray-50">
          <TableHead className="text-xs font-medium text-gray-500">Usuario</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Plan</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Propiedad</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Monto</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Estado</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Expira</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Fecha</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((req) => (
          <TableRow key={req.id} className="border-gray-100">
            <TableCell>
              <p className="font-medium text-[#1f2937]">{req.user_name}</p>
              {req.user_phone && (
                <p className="text-xs text-gray-400">{req.user_phone}</p>
              )}
            </TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={
                  req.plan_type === "advanced"
                    ? "border-purple-200 bg-purple-100 text-purple-700"
                    : "border-blue-200 bg-blue-100 text-blue-700"
                }
              >
                {req.plan_name}
              </Badge>
            </TableCell>
            <TableCell className="text-sm text-gray-700">
              {req.property_title && req.property_id ? (
                <Link
                  href={`/admin/propiedades/${req.property_id}/editar`}
                  className="inline-flex items-center gap-1 font-medium text-[#2563eb] hover:underline"
                >
                  {req.property_title}
                  <ExternalLink className="size-3" />
                </Link>
              ) : (
                <span className="text-gray-300">Sin publicar</span>
              )}
            </TableCell>
            <TableCell className="font-semibold text-[#1f2937]">
              {formatPrice(req.plan_price, req.currency)}
            </TableCell>
            <TableCell>
              <div className="flex flex-col gap-1">
                <Badge
                  variant="outline"
                  className={
                    req.is_expired
                      ? "border-gray-200 bg-gray-100 text-gray-500"
                      : req.status === "approved"
                        ? "border-green-200 bg-green-100 text-green-700"
                        : req.status === "rejected"
                          ? "border-red-200 bg-red-100 text-red-700"
                          : "border-yellow-200 bg-yellow-100 text-yellow-700"
                  }
                >
                  {req.is_expired
                    ? "Expirada"
                    : req.status === "approved"
                      ? req.used ? "Usada" : "Aprobada"
                      : req.status === "rejected"
                        ? "Rechazada"
                        : "Pendiente"}
                </Badge>
              </div>
            </TableCell>
            <TableCell className="text-xs text-gray-400">
              {req.expires_at
                ? new Date(req.expires_at).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" })
                : "—"}
            </TableCell>
            <TableCell className="text-xs text-gray-400">
              {new Date(req.created_at).toLocaleDateString("es-PE", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap items-center gap-1.5">
                {req.status === "pending" && (
                  <>
                    <select
                      defaultValue={req.plan_type}
                      disabled={isPending}
                      onChange={(e) => {
                        const newPlan = e.target.value as "basic" | "advanced";
                        startTransition(async () => {
                          const result = await changeRequestPlan(req.id, newPlan);
                          if (result.error) toast.error(result.error);
                          else toast.success("Plan cambiado");
                        });
                      }}
                      className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/30 disabled:opacity-50"
                    >
                      <option value="basic">Básica</option>
                      <option value="advanced">Avanzada</option>
                    </select>
                    <button
                      onClick={() => handleApprove(req.id)}
                      disabled={isPending}
                      className="inline-flex items-center gap-1 rounded-md border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 hover:bg-green-100 disabled:opacity-50"
                    >
                      {isPending ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3" />}
                      Aprobar
                    </button>
                    <button
                      onClick={() => handleReject(req.id)}
                      disabled={isPending}
                      className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
                    >
                      <X className="size-3" />
                      Rechazar
                    </button>
                  </>
                )}
                {req.status !== "pending" && (
                  <>
                    {req.status === "approved" && !req.is_expired && (
                      <button
                        onClick={() => handleDeactivate(req.id)}
                        disabled={isPending}
                        className="inline-flex items-center gap-1 rounded-md border border-yellow-200 bg-yellow-50 px-2.5 py-1 text-xs font-medium text-yellow-700 hover:bg-yellow-100 disabled:opacity-50"
                      >
                        <X className="size-3" />
                        Desactivar
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(req.id)}
                      disabled={isPending}
                      className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
                    >
                      <X className="size-3" />
                      Eliminar
                    </button>
                  </>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
