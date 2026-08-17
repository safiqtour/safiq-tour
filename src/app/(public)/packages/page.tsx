import { getPublicPackages } from "@/modules/public/packages"
import { PackagesPageClient } from "@/components/packages/packages-page-client"

export const dynamic = "force-dynamic"

export default async function PackagesPage() {
  const allPackages = await getPublicPackages()

  return <PackagesPageClient packages={allPackages} />
}