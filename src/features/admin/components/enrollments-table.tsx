"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2, Phone, Clock, CircleCheck, CircleX, GraduationCap, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/shared/lib/format";
import {
  confirmEnrollmentPayment,
  rejectEnrollment,
} from "@/features/trainings/services/enrollment-admin-actions";

interface Enrollment {
  id: string;
  profile_id: string;
  training_id: string;
  training_title: string;
  training_slug: string | null;
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
  { value: "all", label: "Todos", icon: GraduationCap, color: "indigo" },
  { value: "pending", label: "Pendientes", icon: Clock, color: "amber" },
  { value: "completed", label: "Pagados", icon: CircleCheck, color: "emerald" },
  { value: "failed", label: "Rechazados", icon: CircleX, color: "red" },
] as const;

function statusBadge(status: string) {
  switch (status) {
    case "completed":
    case "paid":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
          <CircleCheck className="size-3.5" />
          Pagado
        </span>
      );
    case "pending":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
          <Clock className="size-3.5" />
          Pendiente
        </span>
      );
    case "failed":
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
          <CircleX className="size-3.5" />
          Rechazado
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-600">
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

  function getCount(value: string) {
    if (value === "all") return enrollments.length;
    if (value === "completed") return paidCount;
    if (value === "pending") return pendingCount;
    return enrollments.filter((e) => e.payment_status === value).length;
  }

  const filterColors: Record<string, { active: string; inactive: string }> = {
    indigo: { active: "bg-indigo-600 text-white shadow-sm", inactive: "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50" },
    amber: { active: "bg-amber-500 text-white shadow-sm", inactive: "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50" },
    emerald: { active: "bg-emerald-600 text-white shadow-sm", inactive: "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50" },
    red: { active: "bg-red-500 text-white shadow-sm", inactive: "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50" },
  };

  return (
    <div>
      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-2 px-5 py-4">
        {STATUS_FILTERS.map((f) => {
          const count = getCount(f.value);
          const isActive = filter === f.value;
          const colors = filterColors[f.color];
          const Icon = f.icon;

          return (
            <button
              key={f.value}
              onClick={() => {
                setFilter(f.value);
                setPage(0);
              }}
              className={[
                "inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all",
                isActive ? colors.active : colors.inactive,
              ].join(" ")}
            >
              <Icon className="size-3.5" />
              {f.label}
              <span className={[
                "ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                isActive ? "bg-white/20" : "bg-gray-100",
              ].join(" ")}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tabla */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-16">
          <GraduationCap className="mb-3 size-10 text-gray-200" />
          <p className="text-sm font-medium text-gray-400">
            No hay inscripciones{filter !== "all" ? ` ${STATUS_FILTERS.find((f) => f.value === filter)?.label.toLowerCase()}` : ""}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-gray-100 bg-gray-50/80 text-left">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Capacitacion
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Agente
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Telefono
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Monto
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Estado
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Fecha inscripcion
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginated.map((enrollment) => (
                <EnrollmentRow key={enrollment.id} enrollment={enrollment} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginacion */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3.5">
          <p className="text-xs font-medium text-gray-500">
            Mostrando {page * ITEMS_PER_PAGE + 1}–{Math.min((page + 1) * ITEMS_PER_PAGE, filtered.length)} de {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40"
            >
              Anterior
            </button>
            <span className="px-3 text-xs font-medium text-gray-500">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40"
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
    <tr className="text-[#1f2937] transition-colors hover:bg-blue-50/30">
      <td className="max-w-[220px] px-5 py-3.5">
        {enrollment.training_slug ? (
          <Link
            href={`/capacitaciones/${enrollment.training_slug}`}
            className="group flex items-center gap-1 truncate font-semibold text-[#2563eb] hover:underline"
          >
            {enrollment.training_title}
            <ExternalLink className="size-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        ) : (
          <p className="truncate font-semibold">{enrollment.training_title}</p>
        )}
      </td>
      <td className="px-5 py-3.5">
        <Link
          href={`/admin/usuarios/${enrollment.profile_id}`}
          className="group flex items-center gap-1 font-medium text-[#2563eb] hover:underline"
        >
          {enrollment.user_name}
          <ExternalLink className="size-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
        </Link>
      </td>
      <td className="px-5 py-3.5 text-gray-500">
        {enrollment.user_phone ? (
          <span className="flex items-center gap-1.5 text-gray-600">
            <Phone className="size-3.5 text-gray-400" />
            {enrollment.user_phone}
          </span>
        ) : (
          <span className="text-gray-300">Sin telefono</span>
        )}
      </td>
      <td className="px-5 py-3.5">
        <span className="font-bold text-[#1f2937]">
          {formatPrice(enrollment.training_price, enrollment.training_currency as "PEN" | "USD")}
        </span>
      </td>
      <td className="px-5 py-3.5">{statusBadge(enrollment.payment_status)}</td>
      <td className="px-5 py-3.5 text-gray-500">
        {new Intl.DateTimeFormat("es-PE", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }).format(new Date(enrollment.enrolled_at))}
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center justify-end gap-1.5">
          {isPending ? (
            <Loader2 className="size-4 animate-spin text-gray-400" />
          ) : isPendingPayment ? (
            <>
              <button
                onClick={handleConfirm}
                className="inline-flex items-center gap-1 rounded-lg bg-green-50 px-2.5 py-1.5 text-xs font-semibold text-green-700 transition-colors hover:bg-green-100"
                title="Confirmar pago"
              >
                <CheckCircle className="size-3.5" />
                Confirmar
              </button>
              <button
                onClick={handleReject}
                className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100"
                title="Rechazar"
              >
                <XCircle className="size-3.5" />
                Rechazar
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
