"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Check, X, Loader2 } from "lucide-react";
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
} from "@/features/subscriptions/services/publication-actions";

interface PublicationRequest {
  id: string;
  profile_id: string;
  plan_type: string;
  plan_name: string;
  plan_price: number;
  currency: string;
  status: string;
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
          <TableHead className="text-xs font-medium text-gray-500">Monto</TableHead>
          <TableHead className="text-xs font-medium text-gray-500">Estado</TableHead>
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
            <TableCell className="font-semibold text-[#1f2937]">
              {formatPrice(req.plan_price, req.currency)}
            </TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={
                  req.status === "approved"
                    ? "border-green-200 bg-green-100 text-green-700"
                    : req.status === "rejected"
                      ? "border-red-200 bg-red-100 text-red-700"
                      : "border-yellow-200 bg-yellow-100 text-yellow-700"
                }
              >
                {req.status === "approved"
                  ? "Aprobada"
                  : req.status === "rejected"
                    ? "Rechazada"
                    : "Pendiente"}
              </Badge>
            </TableCell>
            <TableCell className="text-xs text-gray-400">
              {new Date(req.created_at).toLocaleDateString("es-PE", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </TableCell>
            <TableCell>
              {req.status === "pending" && (
                <div className="flex items-center gap-1.5">
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
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
