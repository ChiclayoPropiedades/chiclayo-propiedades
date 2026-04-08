"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Trophy } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { recalculateRankings } from "@/features/admin/services/admin-actions";

export function RecalcularRankingButton() {
  const [isPending, startTransition] = useTransition();

  function handleRecalculate() {
    startTransition(async () => {
      try {
        await recalculateRankings();
        toast.success("Rankings recalculados correctamente");
      } catch {
        toast.error("Error al recalcular los rankings");
      }
    });
  }

  return (
    <Button
      type="button"
      onClick={handleRecalculate}
      disabled={isPending}
      className="bg-[#2563eb] hover:bg-[#1e40af]"
    >
      <Trophy className="size-4" aria-hidden="true" />
      {isPending ? "Recalculando..." : "Recalcular Rankings"}
    </Button>
  );
}
