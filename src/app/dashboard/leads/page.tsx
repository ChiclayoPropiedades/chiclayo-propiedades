"use client";

import { useEffect, useState, useTransition } from "react";
import { MessageSquare, Phone, Mail, Home, Calendar, ChevronDown } from "lucide-react";
import { createClient } from "@/shared/lib/supabase/client";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: "new" | "contacted" | "closed";
  created_at: string;
  property?: {
    title: string;
    slug: string;
  } | null;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  new: { label: "Nuevo", color: "bg-blue-100 text-blue-700" },
  contacted: { label: "Contactado", color: "bg-yellow-100 text-yellow-700" },
  closed: { label: "Cerrado", color: "bg-gray-100 text-gray-500" },
};

export default function MisLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function fetchLeads() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!profile) return;
      setProfileId(profile.id);

      // Leads donde el asesor es dueño de la propiedad consultada
      const { data: leadsByProperty } = await supabase
        .from("inquiries")
        .select("id, name, email, phone, message, status, created_at, property:properties(title, slug)")
        .in("property_id",
          (await supabase
            .from("properties")
            .select("id")
            .eq("agent_id", profile.id)
          ).data?.map(p => p.id) ?? []
        )
        .order("created_at", { ascending: false });

      // Leads asignados directamente al asesor
      const { data: leadsDirect } = await supabase
        .from("inquiries")
        .select("id, name, email, phone, message, status, created_at, property:properties(title, slug)")
        .eq("agent_id", profile.id)
        .order("created_at", { ascending: false });

      // Combinar y deduplicar
      const allLeads = [...(leadsByProperty ?? []), ...(leadsDirect ?? [])];
      const uniqueLeads = allLeads.filter(
        (lead, index, self) => index === self.findIndex(l => l.id === lead.id)
      );

      // Normalizar el campo property (Supabase retorna array en joins)
      const normalized = uniqueLeads.map(lead => ({
        ...lead,
        property: Array.isArray(lead.property) ? lead.property[0] ?? null : lead.property,
      })) as Lead[];

      setLeads(normalized);
      setLoading(false);
    }

    fetchLeads();
  }, []);

  async function updateStatus(leadId: string, newStatus: string) {
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase
        .from("inquiries")
        .update({ status: newStatus })
        .eq("id", leadId);

      if (!error) {
        setLeads(prev =>
          prev.map(l => l.id === leadId ? { ...l, status: newStatus as Lead["status"] } : l)
        );
      }
    });
  }

  const newCount = leads.filter(l => l.status === "new").length;
  const contactedCount = leads.filter(l => l.status === "contacted").length;
  const closedCount = leads.filter(l => l.status === "closed").length;

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-xl bg-gray-100" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <MessageSquare className="size-6 text-[#2563eb]" aria-hidden="true" />
        <div>
          <h1 className="text-2xl font-bold text-[#1f2937]">Mis Consultas</h1>
          <p className="text-sm text-gray-500">
            Leads de personas interesadas en tus propiedades
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-medium text-blue-600">Nuevos</p>
          <p className="text-3xl font-bold text-blue-700">{newCount}</p>
          <p className="text-xs text-blue-500">Pendientes de contactar</p>
        </div>
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-sm font-medium text-yellow-600">Contactados</p>
          <p className="text-3xl font-bold text-yellow-700">{contactedCount}</p>
          <p className="text-xs text-yellow-500">En seguimiento</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-600">Cerrados</p>
          <p className="text-3xl font-bold text-gray-700">{closedCount}</p>
          <p className="text-xs text-gray-400">Finalizados</p>
        </div>
      </div>

      {/* Leads list */}
      {leads.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-16">
          <MessageSquare className="mb-4 size-12 text-gray-300" />
          <h2 className="text-lg font-semibold text-[#1f2937]">
            No tienes consultas aún
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Cuando alguien se interese en tus propiedades, aparecerá aquí
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {leads.map((lead) => {
            const status = statusLabels[lead.status];
            const date = new Intl.DateTimeFormat("es-PE", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(lead.created_at));

            return (
              <div
                key={lead.id}
                className="rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Lead info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-[#1f2937]">{lead.name}</h3>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </div>

                    {/* Contact info */}
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <a href={`mailto:${lead.email}`} className="flex items-center gap-1 hover:text-[#2563eb]">
                        <Mail className="size-3.5" />
                        {lead.email}
                      </a>
                      {lead.phone && (
                        <a href={`tel:${lead.phone}`} className="flex items-center gap-1 hover:text-[#2563eb]">
                          <Phone className="size-3.5" />
                          {lead.phone}
                        </a>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3.5" />
                        {date}
                      </span>
                    </div>

                    {/* Property */}
                    {lead.property && (
                      <div className="mt-2 flex items-center gap-1 text-sm">
                        <Home className="size-3.5 text-[#2563eb]" />
                        <a
                          href={`/propiedades/${lead.property.slug}`}
                          className="text-[#2563eb] hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {lead.property.title}
                        </a>
                      </div>
                    )}

                    {/* Message */}
                    <p className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-600 italic">
                      &ldquo;{lead.message}&rdquo;
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="shrink-0">
                    <div className="relative">
                      <select
                        value={lead.status}
                        onChange={(e) => updateStatus(lead.id, e.target.value)}
                        disabled={isPending}
                        className="h-9 appearance-none rounded-lg border border-gray-200 bg-white pl-3 pr-8 text-sm font-medium text-[#1f2937] outline-none transition-colors focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 disabled:opacity-60"
                      >
                        <option value="new">Nuevo</option>
                        <option value="contacted">Contactado</option>
                        <option value="closed">Cerrado</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                    </div>

                    {lead.phone && (
                      <a
                        href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 flex h-9 items-center justify-center gap-1.5 rounded-lg bg-green-500 px-3 text-sm font-medium text-white transition-colors hover:bg-green-600"
                      >
                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
