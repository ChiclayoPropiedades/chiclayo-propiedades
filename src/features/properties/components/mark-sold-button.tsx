"use client";

import { useState, useTransition } from "react";
import { DollarSign } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { markPropertyAsSold } from "@/features/properties/services/property-actions";
import { toast } from "sonner";

interface MarkSoldButtonProps {
  propertyId: string;
  currentPrice: number;
  currency: "PEN" | "USD";
}

export function MarkSoldButton({
  propertyId,
  currentPrice,
  currency,
}: MarkSoldButtonProps) {
  const [showForm, setShowForm] = useState(false);
  const [salePrice, setSalePrice] = useState(currentPrice.toString());
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    const price = parseFloat(salePrice);
    if (isNaN(price) || price <= 0) {
      toast.error("Ingresa un precio de venta válido");
      return;
    }

    startTransition(async () => {
      const result = await markPropertyAsSold(propertyId, price);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(
          "Propiedad marcada como vendida. Pendiente de aprobación del administrador."
        );
        setShowForm(false);
      }
    });
  };

  if (!showForm) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowForm(true)}
        className="border-green-300 text-green-700 hover:bg-green-50"
      >
        <DollarSign className="mr-1 h-3.5 w-3.5" />
        Marcar vendida
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">
          {currency === "PEN" ? "S/" : "$"}
        </span>
        <Input
          type="number"
          value={salePrice}
          onChange={(e) => setSalePrice(e.target.value)}
          className="h-8 w-32 pl-7 text-sm"
          placeholder="Precio venta"
          min="0"
          step="0.01"
        />
      </div>
      <Button
        size="sm"
        onClick={handleSubmit}
        disabled={isPending}
        className="h-8 bg-green-600 text-xs hover:bg-green-700"
      >
        {isPending ? "..." : "Confirmar"}
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setShowForm(false)}
        className="h-8 text-xs"
      >
        Cancelar
      </Button>
    </div>
  );
}
