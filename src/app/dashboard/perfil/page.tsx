"use client";

import { useEffect, useState, useTransition, useRef } from "react";
import { UserRound, Save, CheckCircle, AlertCircle, Camera, Trash2 } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/shared/lib/supabase/client";
import { updateProfile } from "@/features/dashboard/services/update-profile";
import { emitProfileUpdated } from "@/shared/lib/events";

interface ProfileFormState {
  full_name: string;
  phone: string;
  bio: string;
  avatar_url: string;
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
    avatar_url: "",
  });
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchProfile() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;
      setUserId(user.id);

      const { data } = await supabase
        .from("profiles")
        .select("full_name, phone, bio, avatar_url")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setForm({
          full_name: data.full_name ?? "",
          phone: data.phone ?? "",
          bio: data.bio ?? "",
          avatar_url: data.avatar_url ?? "",
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

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    if (!file.type.startsWith("image/")) {
      setResult({ type: "error", message: "Solo se permiten imágenes (JPG, PNG, WebP)" });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setResult({ type: "error", message: "La imagen no debe superar 2MB" });
      return;
    }

    setUploading(true);
    setResult(null);

    const supabase = createClient();
    const fileExt = file.name.split(".").pop();
    const filePath = `${userId}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setResult({ type: "error", message: "Error al subir la imagen: " + uploadError.message });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    const avatarUrl = urlData.publicUrl + "?t=" + Date.now();

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: avatarUrl })
      .eq("user_id", userId);

    if (updateError) {
      setResult({ type: "error", message: "Error al guardar: " + updateError.message });
    } else {
      setForm((prev) => ({ ...prev, avatar_url: avatarUrl }));
      setResult({ type: "success", message: "Foto de perfil actualizada" });
      emitProfileUpdated();
    }

    setUploading(false);
  }

  async function handleRemoveAvatar() {
    if (!userId) return;
    setUploading(true);

    const supabase = createClient();
    await supabase
      .from("profiles")
      .update({ avatar_url: null })
      .eq("user_id", userId);

    setForm((prev) => ({ ...prev, avatar_url: "" }));
    setResult({ type: "success", message: "Foto de perfil eliminada" });
    emitProfileUpdated();
    setUploading(false);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setResult(null);

    startTransition(async () => {
      const res = await updateProfile({
        full_name: form.full_name,
        phone: form.phone,
        bio: form.bio,
      });
      if (res.success) {
        setResult({ type: "success", message: "Perfil actualizado correctamente." });
        emitProfileUpdated();
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
            {[1, 2, 3, 4].map((i) => (
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
            Actualiza tu información personal y foto de perfil
          </p>
        </div>
      </div>

      {/* Avatar section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-[#1f2937]">Foto de perfil / Logo</h2>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div className="relative shrink-0">
            {form.avatar_url ? (
              <Image
                src={form.avatar_url}
                alt="Avatar"
                width={96}
                height={96}
                className="size-20 rounded-full object-cover border-2 border-gray-200 sm:size-24"
              />
            ) : (
              <div className="flex size-20 items-center justify-center rounded-full bg-[#2563eb] text-2xl font-bold text-white border-2 border-gray-200 sm:size-24 sm:text-3xl">
                {form.full_name.charAt(0).toUpperCase() || "?"}
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                <div className="size-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
              </div>
            )}
          </div>
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <p className="text-sm text-gray-500">JPG, PNG o WebP. Máximo 2MB.</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563eb] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1e40af] disabled:opacity-60"
              >
                <Camera className="size-4" />
                {form.avatar_url ? "Cambiar foto" : "Subir foto"}
              </button>
              {form.avatar_url && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  disabled={uploading}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
                >
                  <Trash2 className="size-4" />
                  Eliminar
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Form card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-[#1f2937]">Información personal</h2>
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
