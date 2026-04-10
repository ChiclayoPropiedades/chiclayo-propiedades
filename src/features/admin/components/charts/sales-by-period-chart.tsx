"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { SalesData } from "@/features/admin/services/chart-data-actions";

interface Props {
  data: SalesData[];
}

export function SalesByPeriodChart({ data }: Props) {
  const hasData = data.some((d) => d.count > 0);

  if (!hasData) {
    return (
      <div className="flex h-[250px] items-center justify-center text-sm text-gray-400">
        No hay ventas registradas aún
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart
        data={data}
        margin={{ top: 5, right: 5, left: -10, bottom: 5 }}
      >
        <defs>
          <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#b8860b" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#b8860b" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: "#6b7280" }}
          axisLine={{ stroke: "#e5e7eb" }}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 11, fill: "#6b7280" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            fontSize: 13,
          }}
          formatter={(value, name) => {
            if (name === "amount")
              return [`S/ ${Number(value).toLocaleString("es-PE")}`, "Monto"];
            return [String(value), "Ventas"];
          }}
        />
        <Area
          type="monotone"
          dataKey="amount"
          stroke="#b8860b"
          strokeWidth={2}
          fill="url(#salesGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
