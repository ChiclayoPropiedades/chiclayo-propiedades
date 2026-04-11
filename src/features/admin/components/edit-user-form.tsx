"use client";

import { useState, useTransition, useRef } from "react";
import Image from "next/image";
import { Save, Loader2, KeyRound, Eye, EyeOff, Camera, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { toast } from "sonner";
import {
  updateUserProfile,
  resetUserPassword,
  updateUserAvatar,
  removeUserAvatar,
} from "@/features/admin/services/admin-actions";

interface EditUserFormProps {
  profileId: string;
  userId: string;
  initialData: {
    full_name: string;
    phone: string;
    bio: string;
    role: string;
    email: string;
    avatar_url: string;
  };
}

export function EditUserForm({
  profileId,
  userId,
  initialData,
}: EditUserFormProps) {
  const [isPending, startTransition] = useTransition();
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(initialData.avatar_url);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("Máximo 2MB"); return; }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const result = await updateUserAvatar(profileId, userId, formData);
    if (result.error) {
      toast.error(result.error);
    } else if (result.url) {
      setAvatarUrl(result.url);
      toast.success("Foto actualizada");
    }
    setUploading(false);
  }

  async function handleRemoveAvatar() {
    setUploading(true);
    const result = await removeUserAvatar(profileId);
    if (result.error) {
      toast.error(result.error);
    } else {
      setAvatarUrl("");
      toast.success("Foto eliminada");
    }
    setUploading(false);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateUserProfile(profileId, {
        full_name: formData.get("full_name") as string,
        phone: formData.get("phone") as string,
        bio: formData.get("bio") as string,
        role: formData.get("role") as string,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Datos actualizados");
      }
    });
  }

  function handleResetPassword() {
    if (!newPassword || newPassword.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (!confirm("¿Cambiar la contraseña de este usuario?")) return;

    startTransition(async () => {
      const result = await resetUserPassword(userId, newPassword);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Contraseña actualizada");
        setNewPassword("");
        setShowPasswordSection(false);
      }
    });
  }

  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-[#1f2937]">
          Editar datos del usuario
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            {avatarUrl ? (
              <Image src={avatarUrl} alt="Avatar" width={64} height={64} className="size-16 rounded-full object-cover border border-gray-200" />
            ) : (
              <div className="flex size-16 items-center justify-center rounded-full bg-[#eff6ff] text-xl font-bold text-[#2563eb]">
                {initialData.full_name.charAt(0).toUpperCase() || "?"}
              </div>
            )}
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563eb] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#1e40af] disabled:opacity-60">
                <Camera className="size-3.5" />
                {avatarUrl ? "Cambiar" : "Subir foto"}
              </button>
              {avatarUrl && (
                <button type="button" onClick={handleRemoveAvatar} disabled={uploading} className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60">
                  <Trash2 className="size-3.5" />
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="full_name">Nombre completo</Label>
              <Input
                id="full_name"
                name="full_name"
                defaultValue={initialData.full_name}
                disabled={isPending}
                className="border-gray-200"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input
                value={initialData.email}
                disabled
                className="border-gray-200 bg-gray-50 text-gray-500"
              />
              <p className="text-xs text-gray-400">El email no se puede cambiar</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={initialData.phone}
                disabled={isPending}
                className="border-gray-200"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="role">Rol</Label>
              <select
                id="role"
                name="role"
                defaultValue={initialData.role}
                disabled={isPending}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 disabled:opacity-50"
              >
                <option value="user">Usuario</option>
                <option value="agent">Agente</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio">Biografía</Label>
            <textarea
              id="bio"
              name="bio"
              rows={2}
              defaultValue={initialData.bio}
              disabled={isPending}
              className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 disabled:opacity-50"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-[#2563eb] hover:bg-[#1e40af]"
            >
              {isPending ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Save className="mr-2 size-4" />
              )}
              Guardar cambios
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPasswordSection(!showPasswordSection)}
              className="gap-2"
            >
              <KeyRound className="size-4" />
              {showPasswordSection ? "Cancelar" : "Resetear contraseña"}
            </Button>
          </div>
        </form>

        {/* Reset password section */}
        {showPasswordSection && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="mb-3 text-sm font-medium text-amber-800">
              Nueva contraseña para este usuario
            </p>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  disabled={isPending}
                  className="border-amber-200 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              <Button
                onClick={handleResetPassword}
                disabled={isPending || newPassword.length < 8}
                className="bg-amber-600 hover:bg-amber-700"
              >
                {isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Cambiar"
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
