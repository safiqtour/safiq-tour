import { notFound } from "next/navigation"
import { PackageForm } from "@/components/admin/packages/package-form"
import { updatePackage } from "@/actions/packages"
import { db } from "@/lib/prisma/db"
import { auth } from "@/lib/auth/auth"

export default async function EditPackagePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return null

  const { id } = await params

  const pkg = await db.package.findUnique({
    where: { id },
    include: {
      hotels: true,
      schedules: true,
      facilities: true,
      itineraries: { orderBy: { day: "asc" } },
      galleries: { orderBy: { sortOrder: "asc" } },
    },
  })

  if (!pkg) notFound()

  const data = {
    ...pkg,
    publishedAt: pkg.publishedAt?.toISOString() ?? null,
    createdAt: pkg.createdAt.toISOString(),
    updatedAt: pkg.updatedAt.toISOString(),
  }

  const boundAction = updatePackage.bind(null, id)

  return <PackageForm initialData={data as never} action={boundAction} />
}
