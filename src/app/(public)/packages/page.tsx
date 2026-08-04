import { getPublicPackages } from "@/modules/public/packages"
import { PackagesPageClient } from "@/components/packages/packages-page-client"

export default async function PackagesPage() {
  const allPackages = await getPublicPackages()

  return <PackagesPageClient packages={allPackages} />
}