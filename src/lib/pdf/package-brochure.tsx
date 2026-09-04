import React from "react"
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  renderToBuffer,
  Svg,
  Circle,
  Path,
} from "@react-pdf/renderer"
import sharp from "sharp"
import { formatPrice } from "@/data/packages"
import { SITE_URL } from "@/lib/jsonld"
import type { PublicPackage, PublicFlightLeg } from "@/modules/public/packages"

/**
 * On-demand package brochure PDF (A4 portrait, navy/gold Safiq Tour brand).
 *
 * Everything runs server-side: images are fetched and re-encoded here (never
 * by the browser) so the PDF renders identically in dev and production. All
 * content comes from the existing public package payload — nothing is invented
 * and nothing is persisted. @react-pdf/renderer only embeds PNG/JPEG images,
 * so non-PNG sources (e.g. .webp hotel photos) are re-encoded with sharp.
 */

const NAVY = "#0B2D5C"
const NAVY_DEEP = "#071F3E"
const GOLD = "#D4AF37"
const GOLD_DARK = "#B8962E"
const GRAY = "#4A5568"
const BORDER = "#E2E8F0"
const LIGHT = "#F8FAFC"
const INK = "#1A202C"
// Facility checklist colors (premium brochure reference design).
const GREEN = "#16A34A"
const RED = "#DC2626"
const CREAM = "#FDF6E0"
// Solid approximations of translucent whites on navy (react-pdf color safety).
const WHITE_80 = "#D7DEEA"
const WHITE_55 = "#93A5C4"
const WHITE_15 = "#24466F"
const GOLD_40 = "#8C7A45"
const GOLD_10 = "#1A3E70"

const WEBSITE = "safiqtour.id"
const COMPANY = "PT. Safiq Oto Mandiri"
// Same source as the public ContactCards component (src/components/contact/ContactCards.tsx).
const OFFICE_ADDRESS =
  "Perumahan Cimareme Indah Blok A5 No.01, Desa Cimareme, Kecamatan Ngamprah, Kabupaten Bandung Barat, Jawa Barat 40552"

// Local paths are resolved against the live site first (spec), with the dev
// server as a fallback so `npm run dev` can also embed locally served images.
const DEV_ORIGIN = "http://localhost:3000"
const FETCH_TIMEOUT_MS = 10_000
const MAX_IMAGE_BYTES = 8 * 1024 * 1024

/* ------------------------------ view data ------------------------------ */

interface FlightSegmentView {
  airline: string
  flightNumber: string
  depCity: string
  depAirport: string
  depDate: string
  depTime: string
  arrCity: string
  arrAirport: string
  arrDate: string
  arrTime: string
  transitToNext: string
  logo: string | null
}

interface FlightLegView {
  label: string
  segments: FlightSegmentView[]
}

interface HotelView {
  city: string
  name: string
  stars: string
  distance: string
  desc: string
  image: string | null
}

interface ItineraryDayView {
  label: string
  title: string
  desc: string
}

interface HighlightView {
  title: string
  desc: string
}

interface RoomPriceView {
  label: string
  desc: string
  value: string
}

export interface BrochureViewData {
  title: string
  badge: string
  duration: string
  priceLabel: string
  roomPrices: RoomPriceView[]
  airline: string
  hotelMekah: string
  hotelMadinah: string
  description: string
  highlights: HighlightView[]
  itinerary: ItineraryDayView[]
  /** Ordered unique cities extracted from itinerary titles (empty = hide route). */
  journeyCities: string[]
  hotels: HotelView[]
  flightLegs: FlightLegView[]
  airlinesFallback: { name: string; detail: string }[]
  included: string[]
  excluded: string[]
  /** Only set when the package actually mentions Haramain Express / kereta cepat. */
  haramainExpress: { logo: string | null } | null
  heroImage: string | null
  logoImage: string | null
  whatsappDisplay: string
}

/* ----------------------------- text helpers ---------------------------- */

/** "6281234567890" -> "+62 812 3456 7890" for a readable PDF contact line. */
function displayNumber(whatsapp: string): string {
  const digits = (whatsapp ?? "").replace(/\D/g, "")
  if (!digits) return ""
  if (!digits.startsWith("62")) return `+${digits}`
  const rest = digits.slice(2)
  const parts = rest.match(/.{1,4}/g) ?? [rest]
  return `+62 ${parts.join(" ")}`
}

/** Common named HTML entities produced by rich-text editors (single-pass decode). */
const HTML_ENTITIES: Record<string, string> = {
  nbsp: " ",
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  hellip: "…",
  mdash: "—",
  ndash: "–",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
  bull: "•",
}

function decodeCodePoint(value: number): string {
  if (!Number.isInteger(value) || value < 1 || value > 0x10ffff) return ""
  try {
    return String.fromCodePoint(value)
  } catch {
    return ""
  }
}

/**
 * Strip TipTap rich-text HTML so descriptions render as plain PDF text.
 * - <p>...</p> / <div> / headings become separate lines (paragraph breaks)
 * - <br> becomes a newline
 * - <li> becomes a "• " bullet line
 * - inline tags (<strong>, <em>, ...) are dropped while their text is kept
 * - HTML entities are decoded in a single pass (no double decoding)
 * - plain-text input passes through unchanged (only trimmed/whitespace-collapsed)
 */
function htmlToPlainText(html: string): string {
  return (html ?? "")
    .replace(/\r\n?/g, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<li[^>]*>/gi, "\n• ")
    .replace(/<\/(p|div|li|h[1-6]|ul|ol|table|tr|blockquote|section|article)>/gi, "\n")
    .replace(/<(p|div|h[1-6]|ul|ol|table|tr|blockquote|section|article)[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => decodeCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => decodeCodePoint(Number(dec)))
    .replace(/&([a-z][a-z0-9]*);/gi, (m, name: string) => HTML_ENTITIES[name.toLowerCase()] ?? m)
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

function pad2(n: number): string {
  return String(n).padStart(2, "0")
}

/* ---------------------------- image handling --------------------------- */

/**
 * SSRF protection: check whether a URL is safe to fetch server-side.
 * Blocks private IPs, loopback, link-local, and internal hostnames.
 */
function isSafeUrl(url: string): boolean {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return false
  }

  const protocol = parsed.protocol
  if (protocol !== "http:" && protocol !== "https:") return false

  const host = parsed.hostname

  // Loopback
  if (host === "localhost" || host === "[::1]") return false
  if (/^127\./.test(host)) return false

  // Private / reserved IPv4 ranges
  if (/^10\./.test(host)) return false
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(host)) return false
  if (/^192\.168\./.test(host)) return false

  // Link-local
  if (/^169\.254\./.test(host)) return false

  // Other internal ranges
  if (/^0\./.test(host)) return false
  if (/^100\.(6[4-9]|[7-9]\d|1[0-2][0-7])\./.test(host)) return false
  if (/^192\.0\.[02]\./.test(host)) return false
  if (/^198\.(1[89])\./.test(host)) return false

  // IPv6 private/link-local
  if (/^f[cd]/i.test(host)) return false
  if (/^fe[89ab]/i.test(host)) return false

  return true
}

/** Resolve any stored image reference into fetchable absolute URL candidates. */
function candidateUrls(src: string): string[] {
  const s = (src ?? "").trim()
  if (!s) return []
  if (/^data:image\//i.test(s)) return [s]
  if (/^https?:\/\//i.test(s)) return isSafeUrl(s) ? [s] : []
  if (s.startsWith("/")) return [`${SITE_URL}${s}`, `${DEV_ORIGIN}${s}`]
  return []
}

/** Encode a fetched image buffer as a data URL react-pdf can embed. */
async function toDataUrl(buf: Buffer, mime: string, maxWidth: number): Promise<string> {
  let image = sharp(buf)
  const meta = await image.metadata()
  if (maxWidth > 0 && (meta.width ?? 0) > maxWidth) {
    image = sharp(buf).resize({ width: maxWidth, withoutEnlargement: true })
  }
  if (mime === "image/png") {
    const out = await image.png().toBuffer()
    return `data:image/png;base64,${out.toString("base64")}`
  }
  // react-pdf only embeds PNG/JPEG — re-encode everything else (webp, ...) to JPEG.
  const out = await image.jpeg({ quality: 80 }).toBuffer()
  return `data:image/jpeg;base64,${out.toString("base64")}`
}

/**
 * Fetch one image server-side and return a data URL, or null when it cannot
 * be loaded/encoded. A single broken image must never fail the whole brochure.
 */
async function loadImage(src: string | null | undefined, maxWidth: number): Promise<string | null> {
  for (const url of candidateUrls(src ?? "")) {
    try {
      if (url.startsWith("data:")) {
        const match = /^data:(image\/[\w.+-]+);base64,(.+)$/i.exec(url)
        if (!match) continue
        return await toDataUrl(Buffer.from(match[2], "base64"), match[1].toLowerCase(), maxWidth)
      }
      const res = await fetch(url, {
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        redirect: "manual",
      })
      if (res.status >= 300 && res.status < 400) {
        const location = res.headers.get("location")
        if (!location || !isSafeUrl(location)) continue
        const redirected = await fetch(location, {
          signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
          redirect: "manual",
        })
        if (!redirected.ok) continue
        const mime = (redirected.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase()
        if (!mime.startsWith("image/")) continue
        const buf = Buffer.from(await redirected.arrayBuffer())
        if (buf.byteLength === 0 || buf.byteLength > MAX_IMAGE_BYTES) continue
        return await toDataUrl(buf, mime, maxWidth)
      }
      if (!res.ok) continue
      const mime = (res.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase()
      if (!mime.startsWith("image/")) continue
      const buf = Buffer.from(await res.arrayBuffer())
      if (buf.byteLength === 0 || buf.byteLength > MAX_IMAGE_BYTES) continue
      return await toDataUrl(buf, mime, maxWidth)
    } catch {
      // Skip the image and keep generating the rest of the brochure.
    }
  }
  return null
}

/**
 * Per-request image loader with a small cache: the same source (e.g. an airline
 * logo used by both flight legs) is fetched and re-encoded only once, keeping
 * the PDF light and generation fast. Cache lives only for this build.
 */
type ImageLoader = (src: string | null | undefined, maxWidth: number) => Promise<string | null>

function createImageLoader(): ImageLoader {
  const cache = new Map<string, Promise<string | null>>()
  return (src, maxWidth) => {
    const key = `${maxWidth}::${src ?? ""}`
    let entry = cache.get(key)
    if (!entry) {
      entry = loadImage(src, maxWidth)
      cache.set(key, entry)
    }
    return entry
  }
}

/* -------------------------- smart content resolvers -------------------------- */

/**
 * Airline logo files shipped with the project (public/images). Matched against
 * the airline NAME as a fallback when the database has no logo for a segment.
 * Never downloads anything at runtime; unknown airlines render text-only.
 */
const AIRLINE_LOGO_FILES: { test: RegExp; src: string }[] = [
  { test: /saudi/i, src: "/images/Saudi-Airlines.png" },
  { test: /garuda/i, src: "/images/Garuda-Indonesia.png" },
  { test: /emirates/i, src: "/images/Emirates.png" },
  { test: /etihad/i, src: "/images/Etihad.png" },
  { test: /qatar/i, src: "/images/Qatar-Airways.png" },
  { test: /turkish/i, src: "/images/Turkish-Airlines.png" },
  { test: /lion/i, src: "/images/Lion-Air.png" },
  { test: /air\s*asia|airasia/i, src: "/images/Airasia.png" },
  { test: /oman/i, src: "/images/Oman-Air.png" },
  { test: /indigo/i, src: "/images/Indigo.png" },
  { test: /scoot/i, src: "/images/Scoot.png" },
  { test: /fly\s*dubai|fly\s*dba|flydba/i, src: "/images/Fly-DBA.png" },
]

/**
 * Resolve the logo source path for an airline segment.
 * Priority: segment airlineLogo (DB) → package detail airlines[].logo →
 * local file matched by airline name → null (text-only card).
 */
function resolveAirlineLogoSource(
  segmentLogo: string | null | undefined,
  airlineName: string | null | undefined,
  detailAirlines: { name: string; logo: string }[],
): string | null {
  const seg = (segmentLogo ?? "").trim()
  if (seg) return seg
  const name = (airlineName ?? "").trim().toLowerCase()
  if (!name) return null
  for (const a of detailAirlines) {
    const aName = (a?.name ?? "").trim().toLowerCase()
    const aLogo = (a?.logo ?? "").trim()
    if (aLogo && aName && name.includes(aName)) return aLogo
  }
  for (const entry of AIRLINE_LOGO_FILES) {
    if (entry.test.test(name)) return entry.src
  }
  return null
}

/** City aliases normalised to one display name (upper-case). */
const KNOWN_CITY_ALIASES: Record<string, string> = {
  JAKARTA: "JAKARTA",
  JEDDAH: "JEDDAH",
  MADINAH: "MADINAH",
  MEDINA: "MADINAH",
  MEKKAH: "MEKKAH",
  MAKKAH: "MEKKAH",
  THAIF: "THAIF",
  TAIF: "THAIF",
  TURKI: "TURKI",
  ISTANBUL: "ISTANBUL",
  MESIR: "MESIR",
  KAIRO: "KAIRO",
  DUBAI: "DUBAI",
}

/**
 * Extract the journey route from itinerary day titles: each known city is
 * matched on word boundaries, in order of first appearance. When the first
 * city re-appears on the last day (round trip) it is appended to close the
 * route. Returns [] when fewer than 2 cities are found (section hidden).
 */
function extractJourneyCities(titles: string[]): string[] {
  const seq: string[] = []
  let lastDayHasFirstCity = false
  titles.forEach((raw, i) => {
    const t = (raw ?? "").toUpperCase()
    if (!t) return
    const found: { at: number; city: string }[] = []
    for (const alias of Object.keys(KNOWN_CITY_ALIASES)) {
      const re = new RegExp(`\\b${alias}\\b`)
      const m = re.exec(t)
      if (m) found.push({ at: m.index, city: KNOWN_CITY_ALIASES[alias] })
    }
    found.sort((a, b) => a.at - b.at)
    for (const f of found) {
      if (!seq.includes(f.city)) seq.push(f.city)
    }
    if (i === titles.length - 1 && seq.length > 0 && t.includes(seq[0])) {
      lastDayHasFirstCity = true
    }
  })
  if (seq.length >= 2 && lastDayHasFirstCity && seq[seq.length - 1] !== seq[0]) {
    seq.push(seq[0])
  }
  return seq.length >= 2 ? seq : []
}

/** True only when the package content actually mentions Haramain / kereta cepat. */
function detectHaramainExpress(texts: (string | null | undefined)[]): boolean {
  const blob = texts
    .filter(Boolean)
    .join(" \n ")
    .toLowerCase()
  return /haramain|haromain|kereta\s*cepat/.test(blob)
}

/* -------------------------------- styles ------------------------------- */

const styles = StyleSheet.create({
  /* ---- PAGE 1: overview (cover + detail + hotel + flight + haramain + route) ---- */
  ovPage: { fontFamily: "Helvetica", fontSize: 10, color: INK, paddingTop: 0, paddingHorizontal: 0, paddingBottom: 44 },
  ovCover: { backgroundColor: NAVY, color: "#FFFFFF", paddingTop: 26, paddingHorizontal: 34, paddingBottom: 18 },
  ovTopBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  ovLogo: { width: 82, height: 36, objectFit: "contain" },
  ovBrand: { fontSize: 14, fontFamily: "Helvetica-Bold", color: "#FFFFFF", letterSpacing: 3 },
  ovCompany: { fontSize: 7.5, color: WHITE_55, letterSpacing: 1, textAlign: "right" },
  ovHero: { width: "100%", height: 168, objectFit: "cover" },
  ovHeroFallback: { width: "100%", height: 168, backgroundColor: NAVY_DEEP, borderWidth: 1, borderColor: GOLD, justifyContent: "center", alignItems: "center" },
  ovHeroFallbackText: { fontSize: 10, color: GOLD, letterSpacing: 4, fontFamily: "Helvetica-Bold", textAlign: "center" },
  ovGoldRule: { height: 3, backgroundColor: GOLD, width: 70, marginTop: 12, marginBottom: 10 },
  ovBadges: { flexDirection: "row", marginBottom: 8 },
  badgePill: { backgroundColor: GOLD, paddingHorizontal: 9, paddingVertical: 3, marginRight: 6 },
  badgePillText: { fontSize: 7.5, fontFamily: "Helvetica-Bold", color: NAVY, letterSpacing: 2.5, lineHeight: 1.2 },
  badgePillOutline: { borderWidth: 1, borderColor: GOLD, paddingHorizontal: 9, paddingVertical: 2.5 },
  badgePillOutlineText: { fontSize: 7.5, fontFamily: "Helvetica-Bold", color: GOLD, letterSpacing: 2, lineHeight: 1.2 },
  ovTitle: { fontSize: 23, fontFamily: "Helvetica-Bold", color: "#FFFFFF", lineHeight: 1.12 },
  ovDuration: { fontSize: 11, color: GOLD, marginTop: 4, lineHeight: 1.2 },
  ovBody: { paddingHorizontal: 34, paddingTop: 10 },
  ovIntro: { fontSize: 8.5, color: GRAY, lineHeight: 1.4, marginBottom: 8, fontFamily: "Helvetica-Oblique" },
  ovInfoRow: { flexDirection: "row" },
  ovInfoCard: { flex: 1, borderWidth: 1, borderColor: BORDER, backgroundColor: LIGHT, borderTopWidth: 2, borderTopColor: GOLD, padding: 7, marginRight: 6 },
  ovInfoLabel: { fontSize: 6.5, color: GRAY, letterSpacing: 1.5, marginBottom: 3, lineHeight: 1.2 },
  ovInfoValue: { fontSize: 10, fontFamily: "Helvetica-Bold", color: NAVY, lineHeight: 1.2 },
  ovSectionLabel: { fontSize: 7, fontFamily: "Helvetica-Bold", color: GOLD_DARK, letterSpacing: 2.5, marginBottom: 5, lineHeight: 1.2 },
  ovSection: { marginTop: 10 },
  ovHotelRow: { flexDirection: "row" },
  ovHotelCard: { flex: 1, flexDirection: "row", borderWidth: 1, borderColor: BORDER, backgroundColor: LIGHT, padding: 6, marginRight: 6 },
  ovHotelImage: { width: 56, height: 46, objectFit: "cover", marginRight: 7 },
  ovHotelCity: { fontSize: 6.5, fontFamily: "Helvetica-Bold", color: GOLD_DARK, letterSpacing: 1.5, marginBottom: 1.5, lineHeight: 1.2 },
  ovHotelName: { fontSize: 8.5, fontFamily: "Helvetica-Bold", color: NAVY, lineHeight: 1.2, marginBottom: 1.5 },
  ovHotelMeta: { fontSize: 7, color: GRAY, lineHeight: 1.2 },
  ovFlightRow: { flexDirection: "row" },
  ovFlightCol: { flexDirection: "column" },
  ovFlightCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: LIGHT,
    borderTopWidth: 2,
    borderTopColor: NAVY,
    padding: 8,
    marginRight: 6,
    marginBottom: 6,
  },
  ovFlightLabel: { alignSelf: "flex-start", backgroundColor: NAVY, paddingHorizontal: 7, paddingVertical: 2, marginBottom: 6 },
  ovFlightLabelText: { fontSize: 7, fontFamily: "Helvetica-Bold", color: GOLD, letterSpacing: 2, lineHeight: 1.2 },
  ovFlightSegLogoCol: { width: 28, flexShrink: 0, alignItems: "center", paddingTop: 2, marginRight: 8 },
  ovFlightLogo: { width: 22, height: 22, objectFit: "contain" },
  ovFlightSegInfo: { flex: 1, flexGrow: 1 },
  /* ---- simple vertical normal-flow block for multi-segment legs ---- */
  ovFlightMultiBlock: { marginBottom: 6 },
  ovFlightMultiLabel: { fontSize: 7.5, fontFamily: "Helvetica-Bold", color: GOLD_DARK, letterSpacing: 2, lineHeight: 1.2, marginBottom: 3 },
  ovFlightMultiSeg: { marginBottom: 5 },
  ovFlightMultiRow: { flexDirection: "row", alignItems: "center" },
  ovFlightMultiLogoCol: { width: 20, flexShrink: 0, marginRight: 6 },
  ovFlightMultiLogo: { width: 18, height: 18, objectFit: "contain" },
  ovFlightMultiName: { fontSize: 8, fontFamily: "Helvetica-Bold", color: NAVY, lineHeight: 1.25 },
  ovFlightMultiRoute: { fontSize: 8, fontFamily: "Helvetica-Bold", color: INK, lineHeight: 1.3, marginTop: 1.5 },
  ovFlightMultiDate: { fontSize: 7.5, color: GRAY, lineHeight: 1.2, marginTop: 0.5 },
  /* ---- compact variants (only applied when some leg is multi-segment) ---- */
  ovSectionTight: { marginTop: 6 },
  ovSectionLabelTight: { marginBottom: 3 },
  ovHotelCardTight: { padding: 5 },
  ovHotelImageTight: { width: 52, height: 40 },
  ovRoomRowTight: { marginTop: 5 },
  ovFlightMultiBlockTight: { marginBottom: 4 },
  ovFlightMultiLabelTight: { marginBottom: 2 },
  ovFlightMultiSegTight: { marginBottom: 3 },
  ovFlightMultiRouteTight: { marginTop: 1 },
  routeStripTight: { marginTop: 6, padding: 6 },
  ovRoomRow: { flexDirection: "row", marginTop: 8 },
  ovRoomCard: { flex: 1, borderWidth: 1, borderColor: BORDER, backgroundColor: LIGHT, borderTopWidth: 2, borderTopColor: GOLD, padding: 6, marginRight: 6 },
  ovRoomLabel: { fontSize: 6.5, fontFamily: "Helvetica-Bold", color: GOLD_DARK, letterSpacing: 1.5, marginBottom: 2, lineHeight: 1.2 },
  ovRoomValue: { fontSize: 9.5, fontFamily: "Helvetica-Bold", color: NAVY, lineHeight: 1.2 },

  /* ---- content pages ---- */
  page: { fontFamily: "Helvetica", fontSize: 10, color: INK, paddingTop: 40, paddingHorizontal: 44, paddingBottom: 56 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 8, marginBottom: 16, borderBottomWidth: 2, borderBottomColor: NAVY },
  headerBrand: { fontSize: 10, fontFamily: "Helvetica-Bold", color: NAVY, letterSpacing: 3 },
  headerTitle: { fontSize: 8, color: GRAY, letterSpacing: 1 },
  sectionWrap: { marginBottom: 14, marginTop: 4 },
  sectionWrapCompact: { marginBottom: 8, marginTop: 0 },
  sectionBar: { width: 26, height: 3, backgroundColor: GOLD, marginBottom: 6 },
  sectionTitle: { fontSize: 16, fontFamily: "Helvetica-Bold", color: NAVY, letterSpacing: 0.3, lineHeight: 1.15 },
  /* ---- itinerary (compact, text-only) ---- */
  pageTight: { paddingTop: 34, paddingBottom: 52 },
  dayBlock: { borderBottomWidth: 0.5, borderBottomColor: GOLD, paddingBottom: 3, marginBottom: 3 },
  dayBlockLast: { paddingBottom: 0, marginBottom: 0 },
  dayHeadCompact: { flexDirection: "row", alignItems: "center", marginBottom: 1 },
  dayBadgeCompact: { minWidth: 44, height: 11, backgroundColor: NAVY, justifyContent: "center", alignItems: "center", marginRight: 8, paddingHorizontal: 4 },
  dayBadgeCompactText: { fontSize: 6, fontFamily: "Helvetica-Bold", color: GOLD, letterSpacing: 0.5 },
  dayTitleCompact: { fontFamily: "Helvetica-Bold", color: NAVY, lineHeight: 1.15 },
  routeStrip: { backgroundColor: LIGHT, borderWidth: 1, borderColor: BORDER, borderLeftWidth: 3, borderLeftColor: GOLD, padding: 8, marginTop: 10 },
  routeLabel: { fontSize: 7.5, fontFamily: "Helvetica-Bold", color: GOLD_DARK, letterSpacing: 2, marginBottom: 5, lineHeight: 1.2 },
  routeRow: { flexDirection: "row", flexWrap: "wrap", alignItems: "center" },
  routeCity: { fontSize: 10, fontFamily: "Helvetica-Bold", color: NAVY, letterSpacing: 0.5, lineHeight: 1.2 },
  routeArrow: { fontSize: 10, fontFamily: "Helvetica-Bold", color: GOLD, marginHorizontal: 6 },
  haramainBadge: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: GOLD, backgroundColor: CREAM, padding: 6, marginTop: 10 },
  haramainLogo: { width: 34, height: 21, objectFit: "contain", marginRight: 9 },
  haramainText: { fontSize: 9, fontFamily: "Helvetica-Bold", color: NAVY, letterSpacing: 1, lineHeight: 1.2 },
  haramainSub: { fontSize: 7, color: GRAY, marginTop: 1.5, lineHeight: 1.2 },
  airlineCard: { borderWidth: 1, borderColor: BORDER, backgroundColor: LIGHT, padding: 8, marginBottom: 6 },
  airlineName: { fontSize: 9.5, fontFamily: "Helvetica-Bold", color: NAVY, marginBottom: 2, lineHeight: 1.2 },
  airlineDetail: { fontSize: 8.5, color: GRAY, lineHeight: 1.3 },

  /* ---- PAGE 3: facilities (green check / red cross) ---- */
  facColumns: { flexDirection: "row" },
  facColLeft: { width: "60%" },
  facColRight: { width: "40%", paddingLeft: 12 },
  facHeadBar: { width: 20, height: 2, marginBottom: 5 },
  facHead: { fontSize: 10.5, fontFamily: "Helvetica-Bold", color: NAVY, letterSpacing: 1.5, marginBottom: 7, lineHeight: 1.2 },
  facGrid: { flexDirection: "row", flexWrap: "wrap" },
  facItemCard: { width: "49%", flexDirection: "row", alignItems: "center", borderWidth: 0.8, borderColor: BORDER, backgroundColor: LIGHT, borderRadius: 6, paddingVertical: 3, paddingHorizontal: 5, marginRight: "2%", marginBottom: 4 },
  facItemText: { flex: 1, fontSize: 8, color: INK, lineHeight: 1.2 },
  facExclCard: { flexDirection: "row", alignItems: "center", borderWidth: 0.8, borderColor: BORDER, backgroundColor: LIGHT, borderRadius: 6, paddingVertical: 3, paddingHorizontal: 5, marginBottom: 4 },
  facNote: { backgroundColor: CREAM, borderLeftWidth: 2, borderLeftColor: GOLD, padding: 8, marginTop: 16 },
  facNoteText: { fontSize: 7.5, color: GRAY, lineHeight: 1.4 },
  footer: { position: "absolute", bottom: 24, left: 44, right: 44, flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: BORDER, paddingTop: 6 },
  footerText: { fontSize: 7.5, color: GRAY },

  /* ---- CTA page ---- */
  ctaPage: { backgroundColor: NAVY, fontFamily: "Helvetica", color: "#FFFFFF", paddingTop: 80, paddingHorizontal: 44, paddingBottom: 44, alignItems: "center" },
  ctaLogo: { width: 130, height: 56, objectFit: "contain", marginBottom: 24 },
  ctaTitle: { fontSize: 26, fontFamily: "Helvetica-Bold", color: "#FFFFFF", textAlign: "center", marginBottom: 10, letterSpacing: 0.5 },
  ctaGoldRule: { width: 60, height: 3, backgroundColor: GOLD, marginBottom: 14 },
  ctaTagline: { fontSize: 11, color: WHITE_80, textAlign: "center", marginBottom: 30, fontFamily: "Helvetica-Oblique" },
  ctaCard: { width: "100%", borderWidth: 1, borderColor: GOLD_40, backgroundColor: GOLD_10, padding: 20 },
  ctaCardRow: { flexDirection: "row", marginBottom: 8 },
  ctaCardLabel: { width: 100, fontSize: 8, color: GOLD, letterSpacing: 2, paddingTop: 2 },
  ctaCardLabelGreen: { width: 100, fontSize: 8, color: "#4ADE80", letterSpacing: 2, paddingTop: 2, fontFamily: "Helvetica-Bold" },
  ctaCardValue: { flex: 1, fontSize: 10.5, color: "#FFFFFF", fontFamily: "Helvetica-Bold" },
  ctaSite: { marginTop: 14, fontSize: 10, color: GOLD, letterSpacing: 3, fontFamily: "Helvetica-Bold" },
  ctaFooter: { marginTop: 60, fontSize: 8, color: WHITE_55, textAlign: "center" },
})

/* ---------------------------- page components --------------------------- */

function PageHeader({ title }: { title: string }) {
  return (
    <View style={styles.header} fixed>
      <Text style={styles.headerBrand}>SAFIQ TOUR</Text>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  )
}

function PageFooter({ label }: { label: string }) {
  return (
    <View style={styles.footer} fixed>
      <Text style={styles.footerText}>{label}</Text>
      <Text style={styles.footerText} render={({ pageNumber }) => `Halaman ${pageNumber}`} />
    </View>
  )
}

function SectionTitle({ children, compact }: { children: string; compact?: boolean }) {
  return (
    <View style={compact ? styles.sectionWrapCompact : styles.sectionWrap}>
      <View style={styles.sectionBar} />
      <Text style={styles.sectionTitle}>{children}</Text>
    </View>
  )
}

/* ------------------------------- PAGE 1 ------------------------------- */

/** Compact hotel card for the overview row (photo + name + stars + distance). */
function OverviewHotelCard({ hotel, tight }: { hotel: HotelView; tight?: boolean }) {
  return (
    <View
      style={tight ? [styles.ovHotelCard, styles.ovHotelCardTight] : styles.ovHotelCard}
      wrap={false}
    >
      {hotel.image ? (
        <Image
          style={tight ? [styles.ovHotelImage, styles.ovHotelImageTight] : styles.ovHotelImage}
          src={hotel.image}
        />
      ) : null}
      <View style={{ flex: 1, justifyContent: "center" }}>
        {hotel.city ? <Text style={styles.ovHotelCity}>{hotel.city.toUpperCase()}</Text> : null}
        <Text style={styles.ovHotelName}>{hotel.name}</Text>
        {[hotel.stars, hotel.distance].filter(Boolean).length > 0 ? (
          <Text style={styles.ovHotelMeta}>{[hotel.stars, hotel.distance].filter(Boolean).join("  •  ")}</Text>
        ) : null}
      </View>
    </View>
  )
}

/**
 * Simple vertical normal-flow block for legs with multiple segments.
 * No ticket-card nesting, no flexGrow, no fixed heights — every segment is a
 * standalone block whose height follows its own content, so nothing can
 * overlap regardless of how many segments a leg carries.
 */
function MultiSegmentFlightBlock({ leg, tight }: { leg: FlightLegView; tight?: boolean }) {
  const block = tight ? [styles.ovFlightMultiBlock, styles.ovFlightMultiBlockTight] : styles.ovFlightMultiBlock
  const label = tight ? [styles.ovFlightMultiLabel, styles.ovFlightMultiLabelTight] : styles.ovFlightMultiLabel
  const seg = tight ? [styles.ovFlightMultiSeg, styles.ovFlightMultiSegTight] : styles.ovFlightMultiSeg
  const route = tight ? [styles.ovFlightMultiRoute, styles.ovFlightMultiRouteTight] : styles.ovFlightMultiRoute
  return (
    <View style={block}>
      {leg.label ? <Text style={label}>{leg.label.toUpperCase()}</Text> : null}
      {leg.segments.map((seg0, j) => {
        const dep = [seg0.depAirport, seg0.depTime].filter(Boolean).join(" ")
        const arr = [seg0.arrAirport, seg0.arrTime].filter(Boolean).join(" ")
        return (
          <View key={j} wrap={false} style={seg}>
            <View style={styles.ovFlightMultiRow}>
              <View style={styles.ovFlightMultiLogoCol}>
                {seg0.logo ? <Image style={styles.ovFlightMultiLogo} src={seg0.logo} /> : null}
              </View>
              <Text style={styles.ovFlightMultiName}>
                {[seg0.airline.toUpperCase(), seg0.flightNumber].filter(Boolean).join(" · ")}
              </Text>
            </View>
            <Text style={route}>{[dep, arr].filter(Boolean).join("  →  ")}</Text>
            {seg0.depDate || seg0.arrDate ? (
              <Text style={styles.ovFlightMultiDate}>{seg0.depDate || seg0.arrDate}</Text>
            ) : null}
          </View>
        )
      })}
    </View>
  )
}

/**
 * Flight ticket card for single-segment legs (side-by-side simple pairs).
 * Height follows content, wrap={false} so it never splits across pages.
 */
function FlightLegCard({ leg, grow }: { leg: FlightLegView; grow?: boolean }) {
  const n = leg.segments.length
  const tight = n >= 5
  const compact = n >= 3
  const nameSize = tight ? 7.5 : compact ? 8 : 8.5
  const routeSize = tight ? 7.5 : compact ? 8 : 8.5
  const timesSize = 7.5
  const segGap = tight ? 3 : compact ? 4 : 6

  return (
    <View style={grow ? styles.ovFlightCard : [styles.ovFlightCard, { flexGrow: 0 }]} wrap={false}>
      {leg.label ? (
        <View style={styles.ovFlightLabel}>
          <Text style={styles.ovFlightLabelText}>{leg.label.toUpperCase()}</Text>
        </View>
      ) : null}
      {leg.segments.map((seg, j) => {
        const dep = seg.depAirport
          ? seg.depTime
            ? `${seg.depAirport} ${seg.depTime}`
            : seg.depAirport
          : seg.depTime || ""
        const arr = seg.arrAirport
          ? seg.arrTime
            ? `${seg.arrAirport} ${seg.arrTime}`
            : seg.arrAirport
          : seg.arrTime || ""
        return (
          <View
            key={j}
            wrap={false}
            style={{ flexDirection: "row", alignItems: "flex-start", marginTop: j > 0 ? segGap : 0 }}
          >
            <View style={styles.ovFlightSegLogoCol}>
              {seg.logo ? <Image style={styles.ovFlightLogo} src={seg.logo} /> : null}
            </View>
            <View style={styles.ovFlightSegInfo}>
              {seg.airline || seg.flightNumber ? (
                <Text
                  style={{
                    fontSize: nameSize,
                    fontFamily: "Helvetica-Bold",
                    color: NAVY,
                    lineHeight: 1.25,
                  }}
                >
                  {[seg.airline.toUpperCase(), seg.flightNumber].filter(Boolean).join("  ·  ")}
                </Text>
              ) : null}
              {seg.depCity || seg.arrCity ? (
                <Text
                  style={{
                    fontSize: routeSize,
                    fontFamily: "Helvetica-Bold",
                    color: INK,
                    lineHeight: 1.25,
                    marginTop: 1,
                  }}
                >
                  {[seg.depCity.toUpperCase(), seg.arrCity.toUpperCase()].filter(Boolean).join("  »  ")}
                </Text>
              ) : null}
              {[dep, arr].filter(Boolean).length > 0 ? (
                <Text
                  style={{
                    fontSize: timesSize,
                    color: GRAY,
                    lineHeight: 1.3,
                    marginTop: 1,
                  }}
                >
                  {[dep, arr].filter(Boolean).join("  –  ")}
                </Text>
              ) : null}
              {seg.depDate || seg.arrDate ? (
                <Text
                  style={{
                    fontSize: 7.5,
                    color: GOLD_DARK,
                    fontFamily: "Helvetica-Bold",
                    lineHeight: 1.2,
                    marginTop: 1.5,
                  }}
                >
                  {seg.depDate || seg.arrDate}
                </Text>
              ) : null}
            </View>
          </View>
        )
      })}
    </View>
  )
}

/* ------------------------------- PAGE 1 ------------------------------- */

/**
 * PAGE 1 — the most informative page: navy cover block (logo, hero, title,
 * badge, duration) followed on white by the package intro, info cards, room
 * prices, hotels, flights, Haramain badge and the journey route.
 */
function PackageOverviewPage({ data }: { data: BrochureViewData }) {
  // Real package fields only — empty/placeholder values hide their card.
  const infoCards = [
    { label: "DURASI", value: data.duration },
    { label: "HARGA MULAI", value: data.priceLabel },
    { label: "MASKAPAI", value: data.airline },
  ].filter((c) => {
    const v = (c.value ?? "").trim()
    return v.length > 0 && v !== "-" && v !== "Maskapai Mitra"
  })

  // Side-by-side layout is safe only for a simple pair (2 legs, 1 segment each).
  // Any leg with multiple segments stacks its card full-width so rows never
  // collide or overflow the half-width column.
  const simplePair =
    data.flightLegs.length === 2 && data.flightLegs.every((leg) => leg.segments.length === 1)
  // Compact overview: when any leg is multi-segment the flight area grows, so
  // tighten spacing everywhere on page 1 to keep the journey route on page 1.
  const tight = data.flightLegs.some((leg) => leg.segments.length > 1)
  const sectionStyle = tight ? [styles.ovSection, styles.ovSectionTight] : styles.ovSection
  const sectionLabelStyle = tight
    ? [styles.ovSectionLabel, styles.ovSectionLabelTight]
    : styles.ovSectionLabel

  return (
    <Page size="A4" style={styles.ovPage}>
      {/* navy cover block */}
      <View style={styles.ovCover}>
        <View style={styles.ovTopBar}>
          {data.logoImage ? (
            <Image style={styles.ovLogo} src={data.logoImage} />
          ) : (
            <Text style={styles.ovBrand}>SAFIQ TOUR</Text>
          )}
          <Text style={styles.ovCompany}>{COMPANY}</Text>
        </View>

        {data.heroImage ? (
          <Image style={styles.ovHero} src={data.heroImage} />
        ) : (
          <View style={styles.ovHeroFallback}>
            <Text style={styles.ovHeroFallbackText}>PERJALANAN IBADAH MENUJU BAITULLAH</Text>
          </View>
        )}

        <View style={styles.ovGoldRule} />
        <View style={styles.ovBadges}>
          <View style={styles.badgePill}>
            <Text style={styles.badgePillText}>PAKET UMROH</Text>
          </View>
          {data.badge ? (
            <View style={styles.badgePillOutline}>
              <Text style={styles.badgePillOutlineText}>{data.badge.toUpperCase()}</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.ovTitle}>{data.title}</Text>
        <Text style={styles.ovDuration}>{data.duration}</Text>
      </View>

      {/* white content area */}
      <View style={styles.ovBody}>
        {data.description ? <Text style={styles.ovIntro}>{data.description}</Text> : null}

        {infoCards.length > 0 ? (
          <View style={styles.ovInfoRow}>
            {infoCards.map((card) => (
              <View key={card.label} style={styles.ovInfoCard} wrap={false}>
                <Text style={styles.ovInfoLabel}>{card.label}</Text>
                <Text style={styles.ovInfoValue}>{card.value}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {data.roomPrices.length > 0 ? (
          <View style={tight ? [styles.ovRoomRow, styles.ovRoomRowTight] : styles.ovRoomRow} wrap={false}>
            {data.roomPrices.map((room) => (
              <View key={room.label} style={styles.ovRoomCard}>
                <Text style={styles.ovRoomLabel}>{`${room.label.toUpperCase()} — ${room.desc}`}</Text>
                <Text style={styles.ovRoomValue}>{room.value}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {data.hotels.length > 0 ? (
          <View style={sectionStyle}>
            <Text style={sectionLabelStyle}>HOTEL</Text>
            <View style={styles.ovHotelRow}>
              {data.hotels.map((hotel, i) => (
                <OverviewHotelCard key={i} hotel={hotel} tight={tight} />
              ))}
            </View>
          </View>
        ) : null}

        {data.flightLegs.length > 0 ? (
          <View style={sectionStyle}>
            <Text style={sectionLabelStyle}>PENERBANGAN</Text>
            <View style={simplePair ? styles.ovFlightRow : styles.ovFlightCol}>
              {data.flightLegs.map((leg, i) =>
                simplePair ? (
                  <FlightLegCard key={i} leg={leg} grow />
                ) : (
                  <MultiSegmentFlightBlock key={i} leg={leg} tight={tight} />
                ),
              )}
            </View>
          </View>
        ) : null}

        {data.flightLegs.length === 0 && data.airlinesFallback.length > 0 ? (
          <View style={sectionStyle}>
            <Text style={sectionLabelStyle}>PENERBANGAN</Text>
            {data.airlinesFallback.map((airline, i) => (
              <View key={i} style={styles.airlineCard} wrap={false}>
                <Text style={styles.airlineName}>{airline.name}</Text>
                {airline.detail ? <Text style={styles.airlineDetail}>{airline.detail}</Text> : null}
              </View>
            ))}
          </View>
        ) : null}

        {data.haramainExpress ? (
          <View style={styles.haramainBadge} wrap={false}>
            {data.haramainExpress.logo ? (
              <Image style={styles.haramainLogo} src={data.haramainExpress.logo} />
            ) : null}
            <View style={{ flex: 1 }}>
              <Text style={styles.haramainText}>HARAMAIN EXPRESS</Text>
              <Text style={styles.haramainSub}>Perjalanan antar kota menggunakan kereta cepat sesuai itinerary</Text>
            </View>
          </View>
        ) : null}

        {data.journeyCities.length >= 2 ? <JourneyRoute cities={data.journeyCities} tight={tight} /> : null}
      </View>

      <PageFooter label={`${WEBSITE}  •  ${data.title}`} />
    </Page>
  )
}

/* ------------------------------- PAGE 3+ ------------------------------- */

/**
 * Compact text-only itinerary. Typography adapts to the amount of real content
 * (never below 7.5pt body) so 9-day packages fit one page; overflow flows
 * naturally to the next page instead of being clipped or overlapped.
 */
function ItineraryPage({ data }: { data: BrochureViewData }) {
  const dayCount = data.itinerary.length
  const totalChars = data.itinerary.reduce((n, d) => n + d.title.length + d.desc.length, 0)
  const tight = dayCount > 9 || totalChars > 2600
  const compact = tight || dayCount > 6 || totalChars > 1800

  const titleSize = tight ? 9 : compact ? 9.5 : 10.5
  const descSize = tight ? 7.5 : compact ? 8 : 9
  const descLineHeight = tight ? 1.18 : compact ? 1.25 : 1.45
  const last = data.itinerary.length - 1

  return (
    <Page size="A4" style={tight ? [styles.page, styles.pageTight] : styles.page}>
      <PageHeader title={`Brosur Paket — ${data.title}`} />
      <PageFooter label={`${WEBSITE}  •  ${data.title}`} />

      <SectionTitle compact>Itinerary Perjalanan</SectionTitle>
      {data.itinerary.map((day, i) => (
        <View key={day.label} style={i < last ? styles.dayBlock : styles.dayBlockLast}>
          <View style={styles.dayHeadCompact} wrap={false}>
            <View style={styles.dayBadgeCompact}>
              <Text style={styles.dayBadgeCompactText}>{day.label}</Text>
            </View>
            {day.title ? (
              <Text style={[styles.dayTitleCompact, { fontSize: titleSize }]}>{day.title}</Text>
            ) : null}
          </View>
          {day.desc
            ? day.desc
                .split("\n")
                .map((para) => para.trim())
                .filter(Boolean)
                .map((para, j) => (
                  <Text key={`${day.label}-${j}`} style={{ fontSize: descSize, color: GRAY, lineHeight: descLineHeight }}>
                    {para}
                  </Text>
                ))
            : null}
        </View>
      ))}
    </Page>
  )
}

/* ------------------------------- PAGE 4 ------------------------------- */

/** Compact journey map built only from cities actually named in the itinerary. */
function JourneyRoute({ cities, tight }: { cities: string[]; tight?: boolean }) {
  return (
    <View style={tight ? [styles.routeStrip, styles.routeStripTight] : styles.routeStrip} wrap={false}>
      <Text style={styles.routeLabel}>RUTE PERJALANAN</Text>
      <View style={styles.routeRow}>
        {cities.map((city, i) => (
          <View key={`${city}-${i}`} style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.routeCity}>{city}</Text>
            {i < cities.length - 1 ? <Text style={styles.routeArrow}>»</Text> : null}
          </View>
        ))}
      </View>
    </View>
  )
}

/* ------------------------------- PAGE 3 ------------------------------- */

/** Green circular check icon drawn with SVG (font-independent, WinAnsi-safe). */
function CheckIcon() {
  return (
    <Svg width={12} height={12} style={{ marginRight: 6 }}>
      <Circle cx={6} cy={6} r={6} fill={GREEN} />
      <Path d="M3 6 L5 8 L9 4" stroke="#FFFFFF" strokeWidth={1.6} fill="none" />
    </Svg>
  )
}

/** Red circular cross icon drawn with SVG. */
function CrossIcon() {
  return (
    <Svg width={12} height={12} style={{ marginRight: 6 }}>
      <Circle cx={6} cy={6} r={6} fill={RED} />
      <Path d="M3.5 3.5 L8.5 8.5 M8.5 3.5 L3.5 8.5" stroke="#FFFFFF" strokeWidth={1.6} fill="none" />
    </Svg>
  )
}

/* ------------------------------- PAGE 3 ------------------------------- */

/**
 * PAGE 3 — facilities in two columns: green-check cards on the left, red-cross
 * cards on the right. Packages without `included` fall back to their real
 * highlights list so the page still shows actual data (never invented).
 */
function FacilitiesPage({ data }: { data: BrochureViewData }) {
  const included = data.included.filter((s) => (s ?? "").trim())
  const excluded = data.excluded.filter((s) => (s ?? "").trim())
  // Packages that store facilities only as highlights (no included list).
  const highlightItems = included.length === 0 ? data.highlights.map((h) => h.title).filter(Boolean) : []
  const includedItems = included.length > 0 ? included : highlightItems
  const includedTitle = included.length > 0 ? "SUDAH TERMASUK" : "KEUNGGULAN PAKET"

  return (
    <Page size="A4" style={styles.page}>
      <PageHeader title={`Brosur Paket — ${data.title}`} />
      <PageFooter label={`${WEBSITE}  •  ${data.title}`} />

      <SectionTitle>Fasilitas Paket</SectionTitle>

      {includedItems.length > 0 || excluded.length > 0 ? (
        <View style={styles.facColumns}>
          {includedItems.length > 0 ? (
            <View style={styles.facColLeft} minPresenceAhead={60}>
              <View style={[styles.facHeadBar, { backgroundColor: GREEN }]} />
              <Text style={styles.facHead}>{includedTitle}</Text>
              <View style={styles.facGrid}>
                {includedItems.map((item, i) => (
                  <View key={i} style={styles.facItemCard} wrap={false}>
                    <CheckIcon />
                    <Text style={styles.facItemText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {excluded.length > 0 ? (
            <View style={styles.facColRight} minPresenceAhead={60}>
              <View style={[styles.facHeadBar, { backgroundColor: RED }]} />
              <Text style={styles.facHead}>TIDAK TERMASUK</Text>
              {excluded.map((item, i) => (
                <View key={i} style={styles.facExclCard} wrap={false}>
                  <CrossIcon />
                  <Text style={styles.facItemText}>{item}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      ) : null}

      <View style={styles.facNote} wrap={false}>
        <Text style={styles.facNoteText}>
          Jadwal, fasilitas, dan harga dapat berubah sewaktu-waktu menyesuaikan ketentuan dari pihak terkait.
        </Text>
      </View>
    </Page>
  )
}

/* ------------------------------- PAGE 4 ------------------------------- */

function CtaRow({ label, value, green }: { label: string; value: string; green?: boolean }) {
  return (
    <View style={styles.ctaCardRow}>
      <Text style={green ? styles.ctaCardLabelGreen : styles.ctaCardLabel}>{label}</Text>
      <Text style={styles.ctaCardValue}>{value}</Text>
    </View>
  )
}

/**
 * PAGE 4 — premium navy contact page. Static document: contact details only,
 * no interactive buttons or "Daftar Sekarang" call-to-action.
 */
function CtaPage({ data }: { data: BrochureViewData }) {
  return (
    <Page size="A4" style={styles.ctaPage}>
      {data.logoImage ? (
        <Image style={styles.ctaLogo} src={data.logoImage} />
      ) : (
        <Text style={[styles.ovBrand, { marginBottom: 24 }]}>SAFIQ TOUR</Text>
      )}

      <Text style={styles.ctaTitle}>Siap Berangkat Umroh?</Text>
      <View style={styles.ctaGoldRule} />
      <Text style={styles.ctaTagline}>Percayakan perjalanan ibadah Anda bersama Safiq Tour.</Text>

      <View style={styles.ctaCard}>
        {data.whatsappDisplay ? <CtaRow label="WHATSAPP" value={data.whatsappDisplay} green /> : null}
        <CtaRow label="WEBSITE" value={`https://${WEBSITE}`} />
        <CtaRow label="ALAMAT KANTOR" value={OFFICE_ADDRESS} />
        <CtaRow label="PENYELENGGARA" value={COMPANY} />
      </View>

      <Text style={styles.ctaSite}>{WEBSITE}</Text>

      <Text style={styles.ctaFooter}>{`${COMPANY}  •  https://${WEBSITE}`}</Text>
    </Page>
  )
}

/* ------------------------------- document ------------------------------- */

export function BrochureDocument({ data }: { data: BrochureViewData }) {
  // 4-page premium brochure: (1) overview cover, (2) itinerary, (3) facilities,
  // (4) CTA. Sections without real data hide themselves; overflowing content
  // flows to extra pages only when it genuinely cannot fit.
  const hasFacilities =
    data.included.some((s) => (s ?? "").trim()) ||
    data.excluded.some((s) => (s ?? "").trim()) ||
    data.highlights.some((h) => Boolean(h.title))

  return (
    <Document
      title={`${data.title} — Brosur Safiq Tour`}
      author="Safiq Tour"
      subject="Brosur Paket Umroh"
      creator="Safiq Tour"
    >
      <PackageOverviewPage data={data} />
      {data.itinerary.length > 0 ? <ItineraryPage data={data} /> : null}
      {hasFacilities ? <FacilitiesPage data={data} /> : null}
      <CtaPage data={data} />
    </Document>
  )
}

/* ------------------------------ data mapping ---------------------------- */

async function toFlightLegs(
  legs: PublicFlightLeg[],
  loader: ImageLoader,
  detailAirlines: { name: string; logo: string }[],
): Promise<FlightLegView[]> {
  const toSegment = async (
    s: {
      airlineName: string | null
      airlineLogo: string | null
      flightNumber: string
      departureCity: string
      departureAirport: string
      arrivalCity: string
      arrivalAirport: string
      departureDateLabel: string | null
      departureTimeLabel: string | null
      arrivalDateLabel: string | null
      arrivalTimeLabel: string | null
      transitDurationToNext?: string | null
    },
  ): Promise<FlightSegmentView> => {
    const logoSource = resolveAirlineLogoSource(s.airlineLogo, s.airlineName, detailAirlines)
    const logo = logoSource ? await loader(logoSource, 200) : null
    return {
      airline: (s.airlineName ?? "").trim(),
      flightNumber: (s.flightNumber ?? "").trim(),
      depCity: (s.departureCity ?? "").trim(),
      depAirport: (s.departureAirport ?? "").trim(),
      depDate: (s.departureDateLabel ?? "").trim(),
      depTime: (s.departureTimeLabel ?? "").trim(),
      arrCity: (s.arrivalCity ?? "").trim(),
      arrAirport: (s.arrivalAirport ?? "").trim(),
      arrDate: (s.arrivalDateLabel ?? "").trim(),
      arrTime: (s.arrivalTimeLabel ?? "").trim(),
      transitToNext: (s.transitDurationToNext ?? "").trim(),
      logo,
    }
  }

  const out: FlightLegView[] = []
  for (const leg of legs) {
    // Leg-level fields mirror the first segment — use them as fallback when
    // a legacy leg has no segment rows.
    const segments =
      leg.segments.length > 0 ? await Promise.all(leg.segments.map((s) => toSegment(s))) : [await toSegment(leg)]
    out.push({ label: (leg.label ?? "").trim(), segments })
  }
  return out.filter((leg) => leg.segments.length > 0)
}

function toAirlinesFallback(airlines: { name: string; baggage: string; transit: string; estimasi: string; pesawat: string }[]) {
  return airlines.map((a) => ({
    name: a.name,
    detail: [
      a.baggage ? `Bagasi ${a.baggage}` : "",
      a.transit,
      a.estimasi ? `Estimasi ${a.estimasi}` : "",
      a.pesawat,
    ]
      .filter(Boolean)
      .join("  •  "),
  }))
}

/**
 * Build the brochure view model from the public package payload, fetching and
 * re-encoding every embeddable image server-side (fail-safe per image).
 */
export async function buildBrochureViewData(pub: PublicPackage, whatsapp: string): Promise<BrochureViewData> {
  const { card, detail } = pub
  // One cached loader per request: shared sources (logos, repeated photos) are
  // fetched and re-encoded once, keeping the PDF light.
  const loader = createImageLoader()
  const detailAirlines = detail?.airlines ?? []

  const [heroImage, logoImage] = await Promise.all([
    loader(detail?.heroImage || card.image || "", 1400),
    loader("/images/logo-safiq.png", 400),
  ])

  const hotelSources = detail?.hotels ?? []
  const hotels: HotelView[] = hotelSources.map((h) => ({
    city: h.city ?? "",
    name: h.name ?? "",
    stars: h.stars > 0 ? `Bintang ${h.stars}` : "",
    distance: h.distance ?? "",
    desc: h.desc ?? "",
    image: null,
  }))
  // Max 1 image per hotel keeps the PDF light.
  await Promise.all(
    hotels.map(async (hotel, i) => {
      hotel.image = await loader(hotelSources[i]?.images?.[0], 900)
    }),
  )

  const itinerarySources = detail?.itinerary ?? []
  const itinerary: ItineraryDayView[] = itinerarySources.map((d) => ({
    label: `HARI ${pad2(d.day)}`,
    title: htmlToPlainText(d.title ?? ""),
    desc: htmlToPlainText(d.desc ?? ""),
  }))

  // Journey route — only from cities genuinely named in the itinerary titles.
  const journeyCities = extractJourneyCities(itinerarySources.map((d) => d.title ?? ""))

  // Haramain Express badge — strictly conditional on real package content.
  const haramainMentioned = detectHaramainExpress([
    ...itinerarySources.flatMap((d) => [d.title ?? "", d.desc ?? ""]),
    detail?.description ?? "",
    ...(detail?.included ?? []),
    ...(detail?.excluded ?? []),
    ...detailAirlines.map((a) => `${a?.name ?? ""} ${a?.transit ?? ""} ${a?.pesawat ?? ""}`),
  ])
  const haramainExpress = haramainMentioned ? { logo: await loader("/images/Haramain-High-Speed.png", 300) } : null

  const roomPrices: RoomPriceView[] = [
    { label: "Quad", desc: "4 orang / kamar", value: card.quadPrice },
    { label: "Triple", desc: "3 orang / kamar", value: card.triplePrice },
    { label: "Double", desc: "2 orang / kamar", value: card.doublePrice },
  ]
    .filter((r) => typeof r.value === "number" && r.value > 0)
    .map((r) => ({ label: r.label, desc: r.desc, value: formatPrice(Number(r.value)) }))

  return {
    title: card.title,
    badge: (card.badge ?? "").trim(),
    duration: card.duration ?? "",
    priceLabel: card.price > 0 ? formatPrice(card.price) : "Hubungi Kami",
    roomPrices,
    airline: (card.maskapai ?? "").trim() || "Maskapai Mitra",
    hotelMekah: (card.hotelMekah ?? "").trim() || "-",
    hotelMadinah: (card.hotelMadinah ?? "").trim() || "-",
    description: htmlToPlainText(detail?.description ?? ""),
    // Highlights that merely repeat `included` items are dropped so no
    // information is displayed twice; genuinely different ones survive.
    highlights: (detail?.highlights ?? [])
      .map((h) => ({ title: h.title, desc: h.desc }))
      .filter((h) => Boolean(h.title))
      .filter((h) => !(detail?.included ?? []).includes(h.title)),
    itinerary,
    journeyCities,
    hotels,
    flightLegs: await toFlightLegs(pub.flights ?? [], loader, detailAirlines),
    airlinesFallback: toAirlinesFallback(detail?.airlines ?? []),
    included: detail?.included ?? [],
    excluded: detail?.excluded ?? [],
    haramainExpress,
    heroImage,
    logoImage,
    whatsappDisplay: displayNumber(whatsapp),
  }
}

/* ------------------------------- generator ------------------------------ */

/**
 * Generate the brochure PDF as a Buffer (on demand; nothing is persisted).
 * Mirrors the invoice generator pattern in @/modules/booking/pdf.
 */
export async function generatePackageBrochurePdf(pub: PublicPackage, whatsapp: string): Promise<Buffer> {
  const data = await buildBrochureViewData(pub, whatsapp)
  const element = React.createElement(BrochureDocument, { data }) as unknown as Parameters<
    typeof renderToBuffer
  >[0]
  return renderToBuffer(element)
}






