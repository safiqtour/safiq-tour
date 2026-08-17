import { PackageForm } from "@/components/admin/packages/package-form"
import { createPackage } from "@/actions/packages"

export default function NewPackagePage() {
  return <PackageForm action={createPackage} />
}
