import { AdminShell } from "@/src/features/admin/components/admin-shell";
import { getDictionary } from "@/src/i18n/config";
import { requireAdmin } from "@/src/server/auth/authorization";
import { toAppUser } from "@/src/server/presenters";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = toAppUser(await requireAdmin("/admin"));
  return <AdminShell user={user} dictionary={getDictionary(user.locale)}>{children}</AdminShell>;
}
