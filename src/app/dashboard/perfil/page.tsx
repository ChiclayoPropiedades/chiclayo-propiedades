"use client";

import { useEffect, useState, useTransition } from "react";
import { UserRound, Save, CheckCircle, AlertCircle } from "lucide-react";
import { createClient } from "@/shared/lib/supabase/client";
import { updateProfile } from "@/features/dashboard/services/update-profile";

interface ProfileFormState {
  full_name: string;
  phone: string;
  bio: string;
}

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-[#1f2937]"
    >
      {children}
    </label>
  );
}

export default function PerfilPage() {
  const [form, setForm] = useState<ProfileFormState>({
    full_name: "",
    phone: "",
    bio: "",
  });
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("full_name, phone, bio")
        .eq("id", user.id)
        .single();

      if (data) {
        setForm({
          full_name: data.full_name ?? "",
          phone: data.phone ?? "",
          bio: data.bio ?? "",
        });
      }
      setLoading(false);
    }

    fetchProfile();
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setResult(null);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setResult(null);

    startTransition(async () => {
      const res = await updateProfile(form);
      if (res.success) {
        setResult({ type: "success", message: "Perfil actualizado correctamente." });
      } else {
        setResult({
          type: "error",
          message: res.error ?? "Error al guardar los cambios.",
        });
      }
    });
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200" />
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex flex-col gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                <div className="h-10 w-full animate-pulse rounded-lg bg-gray-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <UserRound className="size-6 text-[#2563eb]" aria-hidden="true" />
        <div>
          <h1 className="text-2xl font-bold text-[#1f2937]">Mi Perfil</h1>
          <p className="text-sm text-gray-500">
            Actualiza tu información personal y de contacto
          </p>
        </div>
      </div>

      {/* Form card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
          {/* Full name */}
          <div className="flex flex-col gap-1.5">
            <FieldLabel htmlFor="full_name">Nombre completo</FieldLabel>
            <input
              id="full_name"
              name="full_name"
              type="text"
              value={form.full_name}
              onChange={handleChange}
              required
              autoComplete="name"
              placeholder="Tu nombre completo"
              className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-[#1f2937] placeholder:text-gray-400 outline-none transition-colors focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <FieldLabel htmlFor="phone">Teléfono</FieldLabel>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              autoComplete="tel"
              placeholder="+51 9XX XXX XXX"
              className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-[#1f2937] placeholder:text-gray-400 outline-none transition-colors focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
            />
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-1.5">
            <FieldLabel htmlFor="bio">Biografía</FieldLabel>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              value={form.bio}
              onChange={handleChange}
              placeholder="Cuéntanos un poco sobre ti y tu experiencia inmobiliaria..."
              className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-[#1f2937] placeholder:text-gray-400 outline-none transition-colors focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
            />
          </div>

          {/* Feedback */}
          {result && (
            <div
              role="alert"
              className={[
                "flex items-center gap-2.5 rounded-lg px-4 py-3 text-sm font-medium",
                result.type === "success"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700",
              ].join(" ")}
            >
              {result.type === "success" ? (
                <CheckCircle className="size-4 shrink-0" aria-hidden="true" />
              ) : (
                <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
              )}
              {result.message}
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#2563eb] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#1e40af] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]/50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="size-4" aria-hidden="true" />
              {isPending ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
