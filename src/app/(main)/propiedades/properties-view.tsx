"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { PropertyFilters } from "@/features/properties/components/property-filters";
import { PropertyGrid } from "@/features/properties/components/property-grid";
import type { Property } from "@/features/properties/types";

interface PropertiesViewProps {
  allProperties: Property[];
}

export function PropertiesView({ allProperties }: PropertiesViewProps) {
  const searchParams = useSearchParams();

  const filtered = useMemo(() => {
    let result = allProperties;

    const search = searchParams.get("search");
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => {
        const title = p.title?.toLowerCase() ?? "";
        const district = p.district?.toLowerCase() ?? "";
        const address = p.address?.toLowerCase() ?? "";
        return (
          title.includes(q) || district.includes(q) || address.includes(q)
        );
      });
    }

    const operation = searchParams.get("operation");
    if (operation === "venta" || operation === "alquiler") {
      result = result.filter((p) => p.operation === operation);
    }

    const type = searchParams.get("type");
    if (type) {
      result = result.filter((p) => p.type === type);
    }

    const minPrice = searchParams.get("minPrice");
    if (minPrice) {
      const n = Number(minPrice);
      if (!Number.isNaN(n)) result = result.filter((p) => p.price >= n);
    }

    const maxPrice = searchParams.get("maxPrice");
    if (maxPrice) {
      const n = Number(maxPrice);
      if (!Number.isNaN(n)) result = result.filter((p) => p.price <= n);
    }

    const district = searchParams.get("district");
    if (district) {
      result = result.filter((p) => p.district === district);
    }

    return result;
  }, [allProperties, searchParams]);

  return (
    <div className="flex flex-col gap-6">
      <PropertyFilters />
      <div className="flex flex-col gap-4">
        <p className="text-sm text-gray-500" aria-live="polite">
          {filtered.length === 0
            ? "No se encontraron propiedades con los filtros seleccionados."
            : `${filtered.length} propiedad${filtered.length !== 1 ? "es" : ""} encontrada${filtered.length !== 1 ? "s" : ""}`}
        </p>
        <PropertyGrid properties={filtered} />
      </div>
    </div>
  );
}
