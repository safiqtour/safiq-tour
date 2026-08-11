import { notFound } from "next/navigation"
import { PackageForm } from "@/components/admin/packages/package-form"
import { updatePackage } from "@/actions/packages"
import { db } from "@/lib/prisma/db"
import { getSession } from "@/services/auth.integration.service"
import { dateToWallClock } from "@/lib/packages/utils"

export default async function EditPackagePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session?.user?.id) return null

  const { id } = await params

  const pkg = await db.package.findUnique({
    where: { id },
    include: {
      hotels: true,
      schedules: true,
      facilities: true,
      itineraries: { orderBy: { day: "asc" } },
      galleries: { orderBy: { sortOrder: "asc" } },
      flights: { include: { segments: { orderBy: { segmentOrder: "asc" } } } },
    },
  })

  if (!pkg) notFound()

  const data = {
    ...pkg,
    // Flatten PackageFlight + its segments into the PackageFlightData shape the
    // form expects (one card per leg). Each PackageFlightSegment becomes one
    // segment of the leg (a direct leg has one; a transit leg has several).
    flights: pkg.flights.map((f) => ({
      id: f.id,
      label: f.label || (f.direction === "RETURN" ? "Kepulangan" : "Keberangkatan"),
      segments: f.segments.map((s) => ({
        id: crypto.randomUUID(),
        airlineId: s.airlineId ?? null,
        flightNumber: s.flightNumber ?? "",
        aircraft: "",
        departureCity: s.departureCity ?? "",
        departureAirport: s.departureAirport ?? "",
        arrivalCity: s.arrivalCity ?? "",
        arrivalAirport: s.arrivalAirport ?? "",
        departureDateTime: dateToWallClock(s.departureDateTime),
        arrivalDateTime: dateToWallClock(s.arrivalDateTime),
      })),
    })),
    publishedAt: pkg.publishedAt?.toISOString() ?? null,
    createdAt: pkg.createdAt.toISOString(),
    updatedAt: pkg.updatedAt.toISOString(),
  }

  const boundAction = updatePackage.bind(null, id)

  return <PackageForm initialData={data as never} action={boundAction} />
}
