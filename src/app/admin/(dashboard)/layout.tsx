import { redirect } from "next/navigation"
import { AdminShell } from "@/components/admin/admin-shell"
import { getSession } from "@/services/auth.integration.service"

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session?.user?.id) redirect("/admin/login")

  return <AdminShell user={session.user}>{children}</AdminShell>
}
