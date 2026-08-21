export const SITE_URL = "https://safiqtour.id"

export const ORGANIZATION_ID = `${SITE_URL}/#organization`
export const WEBSITE_ID = `${SITE_URL}/#website`
export const LOGO_ID = `${SITE_URL}/#logo`

const organization = {
  "@type": "TravelAgent",
  "@id": ORGANIZATION_ID,
  name: "PT. Safiq Oto Mandiri",
  alternateName: "Safiq Tour",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    "@id": LOGO_ID,
    url: `${SITE_URL}/images/logo-safiq.png`,
  },
  image: { "@id": LOGO_ID },
  email: "info@safiqtour.com",
  telephone: "+62-822-1162-4747",
  sameAs: [
    "https://www.facebook.com/safiqtour/",
    "https://www.instagram.com/pt.safiqotomandiri",
    "https://www.tiktok.com/@safiqtour",
    "https://www.youtube.com/@safiqtour",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+62-822-1162-4747",
    contactType: "customer service",
    availableLanguage: ["Indonesian", "English"],
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Perumahan Cimareme Indah Blok A5 No.01",
    addressLocality: "Bandung Barat",
    addressRegion: "Jawa Barat",
    postalCode: "40552",
    addressCountry: "ID",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -6.86139,
    longitude: 107.5020676,
  },
  hasMap:
    "https://maps.google.com/?q=Perumahan+Cimareme+Indah+Blok+A5+No.01+Bandung+Barat",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "08:00",
      closes: "17:00",
    },
  ],
  areaServed: [
    { "@type": "City", name: "Bandung" },
    { "@type": "AdministrativeArea", name: "Kabupaten Bandung Barat" },
  ],
}

const website = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: "Safiq Tour",
  url: SITE_URL,
  publisher: { "@id": ORGANIZATION_ID },
  inLanguage: "id-ID",
}

export function getGlobalJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [organization, website],
  }
}

export function organizationRef() {
  return { "@id": ORGANIZATION_ID }
}
