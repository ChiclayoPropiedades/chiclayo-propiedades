"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import type { UserProperty, UserInquiry } from "@/features/admin/services/user-detail-actions";

const statusLabels: Record<string, string> = {
  active: "Activa",
  sold: "Vendida",
  inactive: "Inactiva",
};

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800 border-green-200",
  sold: "bg-blue-100 text-blue-800 border-blue-200",
  inactive: "bg-gray-100 text-gray-600 border-gray-200",
};

const inquiryStatusLabels: Record<string, string> = {
  new: "Nuevo",
  contacted: "Contactado",
  closed: "Cerrado",
};

const inquiryStatusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800 border-blue-200",
  contacted: "bg-yellow-100 text-yellow-800 border-yellow-200",
  closed: "bg-gray-100 text-gray-600 border-gray-200",
};

function formatPrice(price: number, currency: string) {
  const symbol = currency === "USD" ? "$" : "S/";
  return `${symbol} ${price.toLocaleString("es-PE")}`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface UserDetailTabsProps {
  properties: UserProperty[];
  inquiries: UserInquiry[];
}

export function UserDetailTabs({
  properties,
  inquiries,
}: UserDetailTabsProps) {
  const sales = properties.filter((p) => p.status === "sold");

  return (
    <Tabs defaultValue="properties" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="properties">
          Propiedades ({properties.length})
        </TabsTrigger>
        <TabsTrigger value="inquiries">
          Leads ({inquiries.length})
        </TabsTrigger>
        <TabsTrigger value="sales">Ventas ({sales.length})</TabsTrigger>
      </TabsList>

      {/* Propiedades */}
      <TabsContent value="properties" className="mt-4">
        {properties.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400">
            No tiene propiedades publicadas
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-xs font-medium text-gray-500">
                    Título
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">
                    Precio
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">
                    Tipo
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">
                    Operación
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">
                    Estado
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">
                    Fecha
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.map((prop) => (
                  <TableRow key={prop.id} className="border-gray-100">
                    <TableCell className="max-w-[200px] truncate font-medium text-[#1f2937]">
                      {prop.title}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {formatPrice(prop.price, prop.currency)}
                    </TableCell>
                    <TableCell className="capitalize text-gray-500">
                      {prop.type}
                    </TableCell>
                    <TableCell className="capitalize text-gray-500">
                      {prop.operation}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${statusColors[prop.status ?? "active"] ?? ""}`}
                      >
                        {statusLabels[prop.status ?? "active"] ?? prop.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-400">
                      {formatDate(prop.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </TabsContent>

      {/* Leads */}
      <TabsContent value="inquiries" className="mt-4">
        {inquiries.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400">
            No tiene leads registrados
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-xs font-medium text-gray-500">
                    Nombre
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">
                    Email
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">
                    Propiedad
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">
                    Estado
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">
                    Fecha
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inquiries.map((inq) => (
                  <TableRow key={inq.id} className="border-gray-100">
                    <TableCell className="font-medium text-[#1f2937]">
                      {inq.name}
                    </TableCell>
                    <TableCell className="text-gray-500">{inq.email}</TableCell>
                    <TableCell className="max-w-[160px] truncate text-gray-500">
                      {inq.property?.title ?? "—"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${inquiryStatusColors[inq.status] ?? ""}`}
                      >
                        {inquiryStatusLabels[inq.status] ?? inq.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-400">
                      {formatDate(inq.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </TabsContent>

      {/* Ventas */}
      <TabsContent value="sales" className="mt-4">
        {sales.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400">
            No tiene ventas registradas
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-xs font-medium text-gray-500">
                    Propiedad
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">
                    Precio venta
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">
                    Comisión
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">
                    Aprobada
                  </TableHead>
                  <TableHead className="text-xs font-medium text-gray-500">
                    Fecha
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale.id} className="border-gray-100">
                    <TableCell className="max-w-[200px] truncate font-medium text-[#1f2937]">
                      {sale.title}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {sale.sale_price
                        ? formatPrice(sale.sale_price, sale.currency)
                        : "—"}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {sale.commission_amount
                        ? `S/ ${sale.commission_amount.toLocaleString("es-PE")}`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          sale.sale_approved
                            ? "border-green-200 bg-green-100 text-green-800"
                            : "border-yellow-200 bg-yellow-100 text-yellow-800"
                        }
                      >
                        {sale.sale_approved ? "Aprobada" : "Pendiente"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-400">
                      {sale.sale_date ? formatDate(sale.sale_date) : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
