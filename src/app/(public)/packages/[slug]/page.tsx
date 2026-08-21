import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPublicPackageBySlug } from "@/modules/public/packages"
import { getWhatsAppNumber } from "@/lib/whatsapp.server"
import { SITE_URL } from "@/lib/jsonld"
import { Hero } from "@/components/packages/Hero"
import { QuickInfo } from "@/components/packages/QuickInfo"
import { Highlights } from "@/components/packages/Highlights"
import { Timeline } from "@/components/packages/Timeline"
import { Hotels } from "@/components/packages/Hotels"
import { Flights } from "@/components/packages/Flights"
import { Airlines } from "@/components/packages/Airlines"
import { TermsConditions } from "@/components/packages/TermsConditions"
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

  // Enrich SEO with the primary flight leg (airline, flight number, airport
  // route) when the package has a saved flight itinerary.
  const leg = pub?.flights?.[0]
  const flightInfo = leg
    ? ` Penerbangan ${[leg.airlineName, leg.flightNumber].filter(Boolean).join(" ")} rute ${leg.departureCity} (${leg.departureAirport}) menuju ${leg.arrivalCity} (${leg.arrivalAirport}).`
    : ""

  const title = `${pkg.title} | Safiq Tour`
  const description = `Paket Umroh ${pkg.title} dengan ${pkg.duration}, ${pkg.hotelMekah} dan ${pkg.hotelMadinah}, maskapai ${pkg.maskapai}.${flightInfo}`
  const url = `${SITE_URL}/packages/${pkg.slug}`

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Safiq Tour",
      locale: "id_ID",
      type: "website",
      images: pkg.image ? [pkg.image] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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
  const whatsappNumber = await getWhatsAppNumber()

  const packageUrl = `${SITE_URL}/packages/${pkg.slug}`

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Beranda", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Paket Umroh", item: `${SITE_URL}/packages` },
      { "@type": "ListItem", position: 3, name: pkg.title, item: packageUrl },
    ],
  }

  const productJsonLd =
    pkg.price > 0
      ? {
          "@context": "https://schema.org",
          "@type": "Product",
          name: pkg.title,
          description: detail.description,
          ...(pkg.image ? { image: [pkg.image] } : {}),
          category: "Paket Umroh",
          brand: { "@type": "Brand", name: "Safiq Tour" },
          offers: {
            "@type": "Offer",
            url: packageUrl,
            price: pkg.price,
            priceCurrency: "IDR",
          },
        }
      : null

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}
      <Hero
        pkg={pkg}
        heroImage={detail.heroImage}
        description={detail.description}
        hotelStars={hotelStarMap[cat] || 3}
        whatsappNumber={whatsappNumber}
      />
      <QuickInfo
        duration={pkg.duration}
        maskapai={pkg.maskapai}
        hotelLabel={hotelLabelMap[cat] || "Bintang 3"}
      />
      <Highlights items={detail.highlights} />
      <Timeline days={detail.itinerary} durationLabel={pkg.duration} />
      <Hotels hotels={detail.hotels} />
      {/* Flight itinerary legs when saved; legacy airline display as fallback */}
      {pub.flights.length > 0 ? (
        <Flights legs={pub.flights} />
      ) : (
        <Airlines airlines={detail.airlines} />
      )}
      {/* Static terms & conditions below the flight itinerary */}
      <TermsConditions />
      <IncludeExclude included={detail.included} excluded={detail.excluded} />
      <Gallery />
      <Testimonials />
      <FAQ />
    </>
  )
}
