"use client";

import { useState, useTransition } from "react";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { createUser } from "@/features/admin/services/admin-actions";

export function CreateUserDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const email = (formData.get("email") as string).trim();
    const full_name = (formData.get("full_name") as string).trim();
    const role = formData.get("role") as string;
    const phone = (formData.get("phone") as string).trim();

    if (!email || !full_name) {
      toast.error("Email y nombre son obligatorios");
      return;
    }

    startTransition(async () => {
      const result = await createUser({ email, full_name, role, phone });
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Usuario ${full_name} creado exitosamente`);
        setOpen(false);
      }
    });
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="gap-2 bg-[#2563eb] text-white hover:bg-[#1e40af]"
      >
        <UserPlus className="size-4" />
        Crear Usuario
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Crear nuevo usuario</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="correo@ejemplo.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name">Nombre completo *</Label>
              <Input
                id="full_name"
                name="full_name"
                placeholder="Juan Pérez"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <select
                id="role"
                name="role"
                defaultValue="user"
                className="flex h-9 w-full rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2563eb]"
              >
                <option value="user">Usuario</option>
                <option value="agent">Agente</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+51 999 999 999"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-[#2563eb] text-white hover:bg-[#1e40af]"
              >
                {isPending ? "Creando..." : "Crear usuario"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
