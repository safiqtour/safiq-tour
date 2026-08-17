import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPublicPackageBySlug } from "@/modules/public/packages"
import { getWhatsAppNumber } from "@/lib/whatsapp.server"
import { PublicRegistrationForm } from "@/components/packages/public-registration-form"

export const dynamic = "force-dynamic"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const pub = await getPublicPackageBySlug(slug)
  const pkg = pub?.card
  if (!pkg) return {}
  return {
    title: `Daftar ${pkg.title} | Safiq Tour`,
    description: `Daftar paket umroh ${pkg.title} — isi formulir pendaftaran dan tim Safiq Tour akan menghubungi Anda.`,
  }
}

export default async function PublicRegistrationPage({ params }: Props) {
  const { slug } = await params
  const pub = await getPublicPackageBySlug(slug)
  if (!pub) notFound()

  const whatsappNumber = await getWhatsAppNumber()

  return <PublicRegistrationForm pkg={pub.card} whatsappNumber={whatsappNumber} />
}
