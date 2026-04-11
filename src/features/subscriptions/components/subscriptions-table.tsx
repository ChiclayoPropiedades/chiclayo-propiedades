"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { UserCheck, Plus, Loader2, Clock } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { extendSubscription } from "@/features/subscriptions/services/subscription-actions";

interface SubscriptionRow {
  id: string;
  profile_id: string;
  status: string;
  amount: number;
  currency: string;
  started_at: string | null;
  expires_at: string | null;
  agent_name: string;
  agent_phone: string | null;
}

interface Props {
  subscriptions: SubscriptionRow[];
}

function formatPrice(price: number, currency: string) {
  return currency === "USD" ? `$ ${price.toLocaleString("es-PE")}` : `S/ ${price.toLocaleString("es-PE")}`;
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function ExtendInline({ profileId }: { profileId: string }) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("1");
  const [unit, setUnit] = useState<"days" | "months" | "years">("months");

  function handleExtend() {
    const num = parseInt(amount);
    if (!num || num <= 0) {
      toast.error("Cantidad inválida");
      return;
    }
    startTransition(async () => {
      const result = await extendSubscription(profileId, num, unit);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Suscripción actualizada");
        setOpen(false);
      }
    });
  }

  if (!open) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-1 text-xs"
      >
        <Clock className="size-3" />
        Extender
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <Input
        type="number"
        min="1"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        disabled={isPending}
        className="h-7 w-14 border-gray-200 px-1.5 text-xs"
      />
      <select
        value={unit}
        onChange={(e) => setUnit(e.target.value as "days" | "months" | "years")}
        disabled={isPending}
        className="h-7 rounded-md border border-gray-200 bg-white px-1 text-xs"
      >
        <option value="days">días</option>
        <option value="months">meses</option>
        <option value="years">años</option>
      </select>
      <Button
        size="sm"
        onClick={handleExtend}
        disabled={isPending}
        className="h-7 bg-[#2563eb] px-2 text-xs hover:bg-[#1e40af]"
      >
        {isPending ? <Loader2 className="size-3 animate-spin" /> : <Plus className="size-3" />}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(false)}
        disabled={isPending}
        className="h-7 px-1.5 text-xs text-gray-400"
      >
        ✕
      </Button>
    </div>
  );
}

export function SubscriptionsTable({ subscriptions }: Props) {
  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <UserCheck className="size-5 text-[#2563eb]" />
          <CardTitle className="text-base font-semibold text-[#1f2937]">
            Suscripciones de Agentes
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {subscriptions.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-gray-400">
            No hay suscripciones registradas aún.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 bg-gray-50">
                  <TableHead className="text-xs font-medium text-gray-500">Agente</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">Monto</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">Estado</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">Inicio</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">Expira</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((sub) => (
                  <TableRow key={sub.id} className="border-gray-100">
                    <TableCell className="font-medium text-[#1f2937]">
                      {sub.agent_name}
                    </TableCell>
                    <TableCell className="font-semibold text-[#1f2937]">
                      {formatPrice(sub.amount, sub.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          sub.status === "active"
                            ? "border-green-200 bg-green-100 text-green-800"
                            : sub.status === "expired"
                              ? "border-red-200 bg-red-100 text-red-800"
                              : "border-yellow-200 bg-yellow-100 text-yellow-800"
                        }
                      >
                        {sub.status === "active" ? "Activa" : sub.status === "expired" ? "Expirada" : sub.status === "cancelled" ? "Cancelada" : "Pendiente"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-400">
                      {formatDate(sub.started_at)}
                    </TableCell>
                    <TableCell className="text-gray-400">
                      {formatDate(sub.expires_at)}
                    </TableCell>
                    <TableCell>
                      <ExtendInline profileId={sub.profile_id} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
