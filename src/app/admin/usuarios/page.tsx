import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { getUsers } from "@/features/admin/services/admin-actions";
import { UsuariosTable } from "@/features/admin/components/usuarios-table";
import { CreateUserDialog } from "@/features/admin/components/create-user-dialog";

export default async function AdminUsuariosPage() {
  const users = await getUsers();

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
