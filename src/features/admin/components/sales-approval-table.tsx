"use client";

import { useTransition } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { approveSale, rejectSale } from "@/features/admin/services/admin-actions";
import { formatPrice } from "@/shared/lib/format";
import { toast } from "sonner";

interface PendingSale {
  id: string;
  title: string;
  price: number;
  currency: "PEN" | "USD";
  sale_price: number | null;
  sale_date: string | null;
  agent:
    | { full_name: string; phone: string | null }
    | { full_name: string; phone: string | null }[];
}

function getAgentName(
  agent:
    | { full_name: string; phone: string | null }
    | { full_name: string; phone: string | null }[]
): string {
  if (Array.isArray(agent)) return agent[0]?.full_name ?? "Sin agente";
  return agent?.full_name ?? "Sin agente";
}

function SaleRow({ sale }: { sale: PendingSale }) {
  const [isPending, startTransition] = useTransition();

  const handleApprove = () => {
    startTransition(async () => {
      const result = await approveSale(sale.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Venta aprobada: ${sale.title}`);
      }
    });
  };

  const handleReject = () => {
    startTransition(async () => {
      const result = await rejectSale(sale.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Venta rechazada: ${sale.title}`);
      }
    });
  };

  return (
    <tr className="border-b last:border-b-0">
      <td className="px-4 py-3">
        <div>
          <p className="text-sm font-medium text-gray-900">{sale.title}</p>
          <p className="text-xs text-gray-500">{getAgentName(sale.agent)}</p>
        </div>
      </td>
      <td className="hidden px-4 py-3 text-sm text-gray-600 sm:table-cell">
        {formatPrice(sale.price, sale.currency)}
      </td>
      <td className="px-4 py-3 text-sm font-semibold text-green-700">
        {sale.sale_price
          ? formatPrice(sale.sale_price, sale.currency)
          : "—"}
      </td>
      <td className="hidden px-4 py-3 text-xs text-gray-500 md:table-cell">
        {sale.sale_date
          ? new Date(sale.sale_date).toLocaleDateString("es-PE")
          : "—"}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            onClick={handleApprove}
            disabled={isPending}
            className="h-7 bg-green-600 px-2 text-xs hover:bg-green-700"
          >
            <CheckCircle className="mr-1 h-3 w-3" />
            Aprobar
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleReject}
            disabled={isPending}
            className="h-7 border-red-200 px-2 text-xs text-red-600 hover:bg-red-50"
          >
            <XCircle className="mr-1 h-3 w-3" />
            Rechazar
          </Button>
        </div>
      </td>
    </tr>
  );
}

interface SalesApprovalTableProps {
  sales: PendingSale[];
}

export function SalesApprovalTable({ sales }: SalesApprovalTableProps) {
  if (sales.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
        <CheckCircle className="mx-auto h-8 w-8 text-green-400" />
        <p className="mt-2 text-sm text-gray-600">
          No hay ventas pendientes de aprobación
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
              Propiedad / Agente
            </th>
            <th className="hidden px-4 py-2 text-left text-xs font-medium text-gray-500 sm:table-cell">
              Precio publicado
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
              Precio venta
            </th>
            <th className="hidden px-4 py-2 text-left text-xs font-medium text-gray-500 md:table-cell">
              Fecha
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <SaleRow key={sale.id} sale={sale} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
