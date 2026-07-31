import { notFound } from "next/navigation"
import { getSession } from "@/services/auth.integration.service"
import { ProfileForm } from "./profile-form"

export default async function ProfilePage() {
  const session = await getSession()
  if (!session?.user) notFound()

  return <ProfileForm user={session.user} />
}
