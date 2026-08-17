import { db } from "@/lib/prisma/db"
import type { Package } from "@/data/packages"
import type { PackageDetail } from "@/data/packages-detail"

/**
 * Public (front-end) read access to CMS-managed Package content.
 *
 * The public marketing payload (card + detail) is stored on the Package row in
 * the `publicContent` JSON column, seeded from the former hardcoded data. Only
 * PUBLISHED packages with a public payload are exposed. This keeps the public
 * UI contract identical while the content becomes database-managed.
 */

export interface PublicPackage {
  card: Package
  detail: PackageDetail | null
  flights: PublicFlightLeg[]
}

/**
 * One segment (hop) of a public flight leg, with display-ready date/time
 * labels. `transitDurationToNext` is the human-readable wait between this
 * segment's arrival and the next segment's departure (null on the last
 * segment or when either datetime is missing/invalid).
 */
export interface PublicFlightSegment {
  id: string
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
  transitDurationToNext: string | null
}

/**
 * One flight leg for the public "Penerbangan" section, flattened from
 * PackageFlight with display-ready date/time labels. Queried live (not stored
 * in `publicContent`) so packages saved before this feature expose their
 * flights without a re-save.
 *
 * The leg-level route/airline/schedule fields mirror the FIRST segment and
 * are kept for backward compatibility (direct-flight display + SEO metadata);
 * `segments` carries every hop ordered by segmentOrder for multi-segment
 * (transit) display.
 */
export interface PublicFlightLeg {
  id: string
  label: string
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
  segments: PublicFlightSegment[]
}

const PUBLISHED = "PUBLISHED"

/**
 * Semantic journey order for flight legs. PackageFlight rows are created inside
 * a single DB transaction, so createdAt cannot order them reliably — order by
 * the leg label instead (departure … side trips … return).
 */
const LEG_ORDER: Record<string, number> = {
  Keberangkatan: 0,
  Transit: 1,
  "Menuju Kota Tambahan": 2,
  "Kembali ke Saudi": 3,
  Kepulangan: 4,
}

function legOrder(label: string, direction: string): number {
  if (direction === "RETURN") return 4
  return LEG_ORDER[label] ?? 1
}

// Flight datetimes are stored as wall-clock UTC (see wallClockToDate in
// @/lib/packages/utils), so format with an explicit UTC timezone to display
// exactly what the admin entered, regardless of server/browser timezone.
function formatLegDate(d: Date | null): string | null {
  if (!d) return null
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })
}

function formatLegTime(d: Date | null): string | null {
  if (!d) return null
  const hh = String(d.getUTCHours()).padStart(2, "0")
  const mm = String(d.getUTCMinutes()).padStart(2, "0")
  return `${hh}:${mm}`
}

/**
 * Human-readable transit wait between two wall-clock UTC datetimes (previous
 * segment arrival → next segment departure). Mirrors the admin form's
 * calculateDuration; returns null when either value is missing or end is not
 * after start.
 */
function formatTransitDuration(start: Date | null, end: Date | null): string | null {
  if (!start || !end) return null
  const totalMinutes = Math.round((end.getTime() - start.getTime()) / 60000)
  if (totalMinutes <= 0) return null
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  if (h === 0) return `${m} menit`
  if (m === 0) return `${h} jam`
  return `${h} jam ${m} menit`
}

function parseContent(raw: unknown): { card: Package; detail: PackageDetail | null } | null {
  if (!raw) return null
  const content = raw as { card?: Package; detail?: PackageDetail }
  if (!content.card) return null
  return { card: content.card, detail: content.detail ?? null }
}

export async function getPublicPackages(params?: {
  category?: string
  featuredOnly?: boolean
}): Promise<Package[]> {
  const rows = await db.package.findMany({
    where: { status: PUBLISHED },
    orderBy: [{ featured: "desc" }, { createdAt: "asc" }],
  })

  const packages = rows
    .map((row) => parseContent(row.publicContent)?.card)
    .filter((p): p is Package => Boolean(p))

  if (params?.category && params.category !== "all") {
    return packages.filter((p) => p.category === params.category)
  }
  if (params?.featuredOnly) {
    return packages.filter((p) => p.featured)
  }
  return packages
}

export async function getPublicPackageBySlug(slug: string): Promise<PublicPackage | null> {
  const row = await db.package.findUnique({
    where: { slug },
    include: {
      flights: {
        include: {
          segments: {
            orderBy: { segmentOrder: "asc" },
            include: { airline: { include: { logoMedia: true } } },
          },
        },
      },
    },
  })
  if (!row || row.status !== PUBLISHED) return null

  const parsed = parseContent(row.publicContent)
  if (!parsed) return null

  const flights: PublicFlightLeg[] = row.flights
    .slice()
    .sort((a, b) => legOrder(a.label, a.direction) - legOrder(b.label, b.direction))
    .map((f) => {
      // Every hop of the leg (ordered by segmentOrder via the Prisma include).
      const segments: PublicFlightSegment[] = f.segments.map((seg, i) => {
        const next = f.segments[i + 1]
        return {
          id: seg.id,
          airlineName: seg.airline?.name ?? null,
          airlineLogo: seg.airline?.logoMedia?.url ?? null,
          flightNumber: seg.flightNumber ?? "",
          departureCity: seg.departureCity ?? "",
          departureAirport: seg.departureAirport ?? "",
          arrivalCity: seg.arrivalCity ?? "",
          arrivalAirport: seg.arrivalAirport ?? "",
          departureDateLabel: formatLegDate(seg.departureDateTime),
          departureTimeLabel: formatLegTime(seg.departureDateTime),
          arrivalDateLabel: formatLegDate(seg.arrivalDateTime),
          arrivalTimeLabel: formatLegTime(seg.arrivalDateTime),
          transitDurationToNext: next
            ? formatTransitDuration(seg.arrivalDateTime, next.departureDateTime)
            : null,
        }
      })
      const s = f.segments[0]
      return {
        id: f.id,
        label: f.label || (f.direction === "RETURN" ? "Kepulangan" : "Keberangkatan"),
        airlineName: s?.airline?.name ?? null,
        airlineLogo: s?.airline?.logoMedia?.url ?? null,
        flightNumber: s?.flightNumber ?? "",
        departureCity: s?.departureCity ?? "",
        departureAirport: s?.departureAirport ?? "",
        arrivalCity: s?.arrivalCity ?? "",
        arrivalAirport: s?.arrivalAirport ?? "",
        departureDateLabel: formatLegDate(s?.departureDateTime ?? null),
        departureTimeLabel: formatLegTime(s?.departureDateTime ?? null),
        arrivalDateLabel: formatLegDate(s?.arrivalDateTime ?? null),
        arrivalTimeLabel: formatLegTime(s?.arrivalDateTime ?? null),
        segments,
      }
    })

  return { ...parsed, flights }
}

export async function getAllPackageSlugs(): Promise<string[]> {
  const rows = await db.package.findMany({
    where: { status: PUBLISHED },
    select: { slug: true },
  })
  return rows.map((r) => r.slug)
}
