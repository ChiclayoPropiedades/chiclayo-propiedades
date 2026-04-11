"use client";

import { useState, useTransition } from "react";
import { UserPlus, Loader2, Clock } from "lucide-react";
import { toast } from "sonner";
import { requestRoleUpgrade } from "@/features/admin/services/role-upgrade-actions";

interface RequestAgentRoleProps {
  hasPendingRequest: boolean;
}

export function RequestAgentRole({ hasPendingRequest }: RequestAgentRoleProps) {
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(hasPendingRequest);

  function handleRequest() {
    startTransition(async () => {
      const result = await requestRoleUpgrade();
      if (result.error) {
        toast.error(result.error);
        if (result.error === "Ya tienes una solicitud pendiente") {
          setSubmitted(true);
        }
      } else {
        toast.success("Solicitud enviada. El administrador revisara tu peticion.");
        setSubmitted(true);
      }
    });
  }

  if (submitted) {
    return (
      <div className="space-y-3">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-2 text-amber-700">
            <Clock className="size-5 shrink-0" />
            <div>
              <p className="text-sm font-semibold">Solicitud en revision</p>
              <p className="mt-0.5 text-xs text-amber-600">
                Tu solicitud para ser Agente Inmobiliario esta siendo revisada por el administrador.
              </p>
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400">
          Te notificaremos cuando tu solicitud sea aprobada.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm font-medium text-blue-800">
          Solo los Agentes Inmobiliarios pueden inscribirse en capacitaciones.
        </p>
        <p className="mt-1 text-xs text-blue-600">
          Solicita tu cambio de rol y el administrador lo revisara.
        </p>
      </div>
      <button
        onClick={handleRequest}
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#2563eb] px-4 py-3 text-base font-semibold text-white transition-colors hover:bg-[#1e40af] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <UserPlus className="size-4" />
        )}
        Solicitar ser Agente Inmobiliario
      </button>
    </div>
  );
}
