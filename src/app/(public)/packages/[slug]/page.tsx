import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPublicPackageBySlug } from "@/modules/public/packages"
import { Hero } from "@/components/packages/Hero"
import { QuickInfo } from "@/components/packages/QuickInfo"
import { Highlights } from "@/components/packages/Highlights"
import { Timeline } from "@/components/packages/Timeline"
import { Hotels } from "@/components/packages/Hotels"
import { Airlines } from "@/components/packages/Airlines"
import { IncludeExclude } from "@/components/packages/IncludeExclude"
import { Gallery } from "@/components/packages/Gallery"
import { Testimonials } from "@/components/packages/Testimonials"
import { FAQ } from "@/components/packages/FAQ"

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
    title: `${pkg.title} | Safiq Tour`,
    description: `Paket Umroh ${pkg.title} dengan hotel pilihan, maskapai terbaik, pembimbing ibadah berpengalaman, harga kompetitif dan pelayanan amanah.`,
    openGraph: {
      title: `${pkg.title} | Safiq Tour`,
      description: `Paket Umroh ${pkg.title} dengan ${pkg.duration}, ${pkg.hotelMekah} dan ${pkg.hotelMadinah}.`,
      images: pkg.image ? [pkg.image] : [],
    },
  }
}

export default async function PackageDetailPage({ params }: Props) {
  const { slug } = await params
  const pub = await getPublicPackageBySlug(slug)
  if (!pub) notFound()

  const pkg = pub.card
  const detail = pub.detail
  if (!detail) notFound()

  const cat = pkg.category

  const hotelStarMap: Record<string, number> = {
    zamzam: 3,
    thaibah: 4,
    rawdah: 5,
    firdaus: 5,
    ramadhan: 4,
  }

  const hotelLabelMap: Record<string, string> = {
    zamzam: "Bintang 3",
    thaibah: "Bintang 4",
    rawdah: "Bintang 5",
    firdaus: "Bintang 5",
    ramadhan: "Bintang 4",
  }

  return (
    <>
      <Hero
        pkg={pkg}
        heroImage={detail.heroImage}
        description={detail.description}
        hotelStars={hotelStarMap[cat] || 3}
      />
      <QuickInfo
        duration={pkg.duration}
        maskapai={pkg.maskapai}
        hotelLabel={hotelLabelMap[cat] || "Bintang 3"}
      />
      <Highlights items={detail.highlights} />
      <Timeline days={detail.itinerary} durationLabel={pkg.duration} />
      <Hotels hotels={detail.hotels} />
      <Airlines airlines={detail.airlines} />
      <IncludeExclude included={detail.included} excluded={detail.excluded} />
      <Gallery />
      <Testimonials />
      <FAQ />
    </>
  )
}
