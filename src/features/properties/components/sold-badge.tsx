"use client";

import { CheckCircle, Clock, XCircle } from "lucide-react";

interface SoldBadgeProps {
  status: "active" | "sold" | "inactive";
  saleApproved?: boolean;
}

export function SoldBadge({ status, saleApproved = false }: SoldBadgeProps) {
  if (status === "sold" && saleApproved) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
        <CheckCircle className="h-3 w-3" />
        Vendida
      </span>
    );
  }

  if (status === "sold" && !saleApproved) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
        <Clock className="h-3 w-3" />
        Pendiente aprobación
      </span>
    );
  }

  if (status === "inactive") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
        <XCircle className="h-3 w-3" />
        Inactiva
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
      <CheckCircle className="h-3 w-3" />
      Activa
    </span>
  );
}
