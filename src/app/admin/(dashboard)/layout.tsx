import { AdminShell } from "@/components/admin/admin-shell"
import { getSession } from "@/services/auth.integration.service"

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  return <AdminShell user={session?.user ?? null}>{children}</AdminShell>
}
