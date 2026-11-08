import { redirect } from "next/navigation";
import { UsersTable } from "@/src/features/admin/components/users-table";
import { requireAdmin } from "@/src/server/auth/authorization";
import { toAppUser } from "@/src/server/presenters";
import { listUsers } from "@/src/server/services/user-service";

export default async function AdminUsersPage() {
  const currentUser = toAppUser(await requireAdmin("/admin/users"));
  if (currentUser.role === "CONTENT_EDITOR") redirect("/admin");
  const users = await listUsers();
  return <div className="admin-page"><div className="admin-page-header"><div><p className="eyebrow">Accounts</p><h1>Пользователи</h1><p>Роли, язык интерфейса и учебный прогресс.</p></div></div><UsersTable users={users.map(({ id, name, email, role, locale, xp }) => ({ id, name, email, role, locale, xp }))} currentUser={currentUser} /></div>;
}
