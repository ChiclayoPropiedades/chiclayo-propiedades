"use client";

import { useState, useTransition } from "react";
import { CheckCircle, XCircle, Loader2, Phone } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/shared/lib/format";
import {
  confirmEnrollmentPayment,
  rejectEnrollment,
} from "@/features/trainings/services/enrollment-admin-actions";

interface Enrollment {
  id: string;
  training_id: string;
  training_title: string;
  training_price: number;
  training_currency: string;
  user_name: string;
  user_phone: string | null;
  payment_status: string;
  enrolled_at: string;
  amount_paid: number | null;
}

interface EnrollmentsTableProps {
  enrollments: Enrollment[];
}

const STATUS_FILTERS = [
  { value: "all", label: "Todos" },
  { value: "pending", label: "Pendientes" },
  { value: "completed", label: "Pagados" },
  { value: "failed", label: "Rechazados" },
] as const;

function statusBadge(status: string) {
  switch (status) {
    case "completed":
    case "paid":
      return (
        <span className="inline-flex items-center rounded-full border border-green-200 bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
          Pagado
        </span>
      );
    case "pending":
      return (
        <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
          Pendiente
        </span>
      );
    case "failed":
      return (
        <span className="inline-flex items-center rounded-full border border-red-200 bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
          Rechazado
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
          {status}
        </span>
      );
  }
}

const ITEMS_PER_PAGE = 10;

export function EnrollmentsTable({ enrollments }: EnrollmentsTableProps) {
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(0);

  const filtered =
    filter === "all"
      ? enrollments
      : enrollments.filter((e) => {
          if (filter === "completed") return e.payment_status === "completed" || e.payment_status === "paid";
          return e.payment_status === filter;
        });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

  const pendingCount = enrollments.filter((e) => e.payment_status === "pending").length;
  const paidCount = enrollments.filter((e) => e.payment_status === "completed" || e.payment_status === "paid").length;

  return (
    <div>
      {/* Filtros */}
      <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
        {STATUS_FILTERS.map((f) => {
          const count =
            f.value === "all"
              ? enrollments.length
              : f.value === "completed"
              ? paidCount
              : f.value === "pending"
              ? pendingCount
              : enrollments.filter((e) => e.payment_status === f.value).length;

          return (
            <button
              key={f.value}
              onClick={() => {
                setFilter(f.value);
                setPage(0);
              }}
              className={[
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                filter === f.value
                  ? "bg-[#2563eb] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200",
              ].join(" ")}
            >
              {f.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Tabla */}
      {filtered.length === 0 ? (
        <p className="px-6 py-12 text-center text-sm text-gray-400">
          No hay inscripciones{filter !== "all" ? ` con estado "${STATUS_FILTERS.find((f) => f.value === filter)?.label}"` : ""}.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3">Capacitacion</th>
                <th className="px-4 py-3">Usuario</th>
                <th className="px-4 py-3">Telefono</th>
                <th className="px-4 py-3">Monto</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.map((enrollment) => (
                <EnrollmentRow key={enrollment.id} enrollment={enrollment} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginacion */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
          <p className="text-xs text-gray-500">
            {filtered.length} inscripcion{filtered.length !== 1 ? "es" : ""} en total
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-40"
            >
              Anterior
            </button>
            <span className="px-2 text-xs text-gray-600">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 disabled:opacity-40"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function EnrollmentRow({ enrollment }: { enrollment: Enrollment }) {
  const [isPending, startTransition] = useTransition();
  const isPendingPayment = enrollment.payment_status === "pending";

  function handleConfirm() {
    startTransition(async () => {
      const result = await confirmEnrollmentPayment(enrollment.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Pago confirmado para ${enrollment.user_name}`);
      }
    });
  }

  function handleReject() {
    startTransition(async () => {
      const result = await rejectEnrollment(enrollment.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Inscripcion rechazada");
      }
    });
  }

  return (
    <tr className="text-[#1f2937] hover:bg-gray-50/50">
      <td className="max-w-[200px] truncate px-4 py-3 font-medium">
        {enrollment.training_title}
      </td>
      <td className="px-4 py-3">{enrollment.user_name}</td>
      <td className="px-4 py-3 text-gray-500">
        {enrollment.user_phone ? (
          <span className="flex items-center gap-1">
            <Phone className="size-3" />
            {enrollment.user_phone}
          </span>
        ) : (
          "—"
        )}
      </td>
      <td className="px-4 py-3 font-semibold">
        {formatPrice(enrollment.training_price, enrollment.training_currency as "PEN" | "USD")}
      </td>
      <td className="px-4 py-3">{statusBadge(enrollment.payment_status)}</td>
      <td className="px-4 py-3 text-gray-500">
        {new Intl.DateTimeFormat("es-PE", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }).format(new Date(enrollment.enrolled_at))}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          {isPending ? (
            <Loader2 className="size-4 animate-spin text-gray-400" />
          ) : isPendingPayment ? (
            <>
              <button
                onClick={handleConfirm}
                className="rounded-md p-1.5 text-green-600 transition-colors hover:bg-green-50"
                title="Confirmar pago"
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
          ) : (
            <span className="text-xs text-gray-300">—</span>
          )}
        </div>
      </td>
    </tr>
  );
}
