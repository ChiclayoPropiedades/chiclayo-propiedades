"use client";

import { useCallback, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";

const PRICE_RANGES = [
  { label: "Todos los precios", value: "" },
  { label: "Hasta S/ 100,000", value: "0-100000" },
  { label: "S/ 100,000 - S/ 200,000", value: "100000-200000" },
  { label: "S/ 200,000 - S/ 400,000", value: "200000-400000" },
  { label: "S/ 400,000 - S/ 600,000", value: "400000-600000" },
  { label: "Más de S/ 600,000", value: "600000-" },
];

const PROPERTY_TYPES = [
  { label: "Todos los tipos", value: "" },
  { label: "Casa", value: "casa" },
  { label: "Departamento", value: "departamento" },
  { label: "Terreno", value: "terreno" },
  { label: "Oficina", value: "oficina" },
  { label: "Local comercial", value: "local" },
  { label: "Otro", value: "otro" },
];

const OPERATIONS = [
  { label: "Venta y alquiler", value: "" },
  { label: "Venta", value: "venta" },
  { label: "Alquiler", value: "alquiler" },
];

export function PropertyFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      // Reset to page 1 on filter change
      params.delete("page");

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [router, pathname, searchParams]
  );

  const handleSearch = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget;
      const input = form.elements.namedItem("search") as HTMLInputElement;
      updateParam("search", input.value.trim());
    },
    [updateParam]
  );

  const handlePriceChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      const params = new URLSearchParams(searchParams.toString());
      params.delete("minPrice");
      params.delete("maxPrice");
      params.delete("page");

      if (value) {
        const [min, max] = value.split("-");
        if (min) params.set("minPrice", min);
        if (max) params.set("maxPrice", max);
      }

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [router, pathname, searchParams]
  );

  // Reconstruct current price range value for select
  const currentMin = searchParams.get("minPrice") ?? "";
  const currentMax = searchParams.get("maxPrice") ?? "";
  const currentPriceRange =
    currentMin || currentMax ? `${currentMin}-${currentMax}` : "";

  return (
    <div
      className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
      aria-label="Filtros de búsqueda"
    >
      <div className="flex flex-wrap items-center gap-3">
        <SlidersHorizontal
          className="size-4 shrink-0 text-[#2563eb]"
          aria-hidden="true"
        />

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="flex flex-1 min-w-48 items-center gap-2"
          role="search"
          aria-label="Buscar propiedades"
        >
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
            <input
              type="search"
              name="search"
              defaultValue={searchParams.get("search") ?? ""}
              placeholder="Buscar por título o ubicación..."
              className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-[#1f2937] placeholder:text-gray-400 outline-none transition-colors focus:border-[#2563eb] focus:bg-white focus:ring-2 focus:ring-[#2563eb]/20"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg bg-[#2563eb] px-4 text-sm font-medium text-white transition-colors hover:bg-[#1e40af] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]/50 disabled:opacity-50"
          >
            Buscar
          </button>
        </form>

        {/* Operation filter */}
        <select
          value={searchParams.get("operation") ?? ""}
          onChange={(e) => updateParam("operation", e.target.value)}
          className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm text-[#1f2937] outline-none transition-colors focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 cursor-pointer"
          aria-label="Filtrar por operación"
        >
          {OPERATIONS.map((op) => (
            <option key={op.value} value={op.value}>
              {op.label}
            </option>
          ))}
        </select>

        {/* Price range filter */}
        <select
          value={currentPriceRange}
          onChange={handlePriceChange}
          className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm text-[#1f2937] outline-none transition-colors focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 cursor-pointer"
          aria-label="Filtrar por precio"
        >
          {PRICE_RANGES.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>

        {/* Type filter */}
        <select
          value={searchParams.get("type") ?? ""}
          onChange={(e) => updateParam("type", e.target.value)}
          className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm text-[#1f2937] outline-none transition-colors focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 cursor-pointer"
          aria-label="Filtrar por tipo de propiedad"
        >
          {PROPERTY_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>

        {/* Clear filters */}
        {(searchParams.get("search") ||
          searchParams.get("operation") ||
          searchParams.get("type") ||
          currentMin ||
          currentMax) && (
          <button
            type="button"
            onClick={() => {
              startTransition(() => {
                router.push(pathname, { scroll: false });
              });
            }}
            className="text-sm font-medium text-gray-500 underline-offset-2 hover:text-[#2563eb] hover:underline transition-colors"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {isPending && (
        <p className="mt-2 text-xs text-[#2563eb]" aria-live="polite">
          Actualizando resultados...
        </p>
      )}
    </div>
  );
}
