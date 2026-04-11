import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { getUsers } from "@/features/admin/services/admin-actions";
import { UsuariosTable } from "@/features/admin/components/usuarios-table";
import { CreateUserDialog } from "@/features/admin/components/create-user-dialog";
import { getPendingRoleUpgrades } from "@/features/admin/services/role-upgrade-actions";
import { RoleUpgradeTable } from "@/features/admin/components/role-upgrade-table";
import { UserPlus } from "lucide-react";

export default async function AdminUsuariosPage() {
  const [users, pendingUpgrades] = await Promise.all([
    getUsers(),
    getPendingRoleUpgrades(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1f2937]">Usuarios</h2>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona los usuarios y sus roles en la plataforma
          </p>
        </div>
        <CreateUserDialog />
      </div>

      {/* Solicitudes de cambio de rol pendientes */}
      {pendingUpgrades.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-amber-800">
              <UserPlus className="size-5" />
              {pendingUpgrades.length} solicitud{pendingUpgrades.length !== 1 ? "es" : ""} de cambio de rol
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <RoleUpgradeTable requests={pendingUpgrades} />
          </CardContent>
        </Card>
      )}

      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-[#1f2937]">
            {users.length} usuario{users.length !== 1 ? "s" : ""} registrado
            {users.length !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <UsuariosTable users={users} />
        </CardContent>
      </Card>
    </div>
  );
}
