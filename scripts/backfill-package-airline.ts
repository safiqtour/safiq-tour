import { db } from "@/lib/prisma/db"

/**
 * Smart backfill for the Package -> Airline master relation.
 *
 * Finds every package whose `airlineId` is still NULL and links it to the Airline
 * master data. The legacy `airline` string is NEVER modified.
 *
 * Matching priority:
 *   1. Normalize the airline text.
 *   2. Match Airline.name (exact, then case-insensitive).
 *   3. Match AirlineAlias.alias (exact, then case-insensitive).
 *   4. Detect multi-airline values separated by "/", "," or "&".
 *
 * For multi-airline values: airlineId is NOT updated (left NULL); the package is
 * reported only, so a human can decide how to split the values.
 */

const SEPARATORS = /[\/,&]/

/** Normalize a name for case-insensitive / whitespace-tolerant comparison. */
function normalizeName(s: string): string {
  return s
    .normalize("NFKC")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
}

async function main() {
  console.log("=== Smart Airline Backfill ===\n")

  // Master airline lookup maps.
  const airlines = await db.airline.findMany({
    select: { id: true, name: true },
  })
  const nameExact = new Map(airlines.map((a) => [a.name, a.id]))
  const nameCi = new Map(airlines.map((a) => [normalizeName(a.name), a.id]))

  // Alias lookup maps.
  const aliases = await db.airlineAlias.findMany({
    select: { airlineId: true, alias: true },
  })
  const aliasExact = new Map(aliases.map((x) => [x.alias, x.airlineId]))
  const aliasCi = new Map(aliases.map((x) => [normalizeName(x.alias), x.airlineId]))

  // All packages that still need a master airline reference.
  const packages = await db.package.findMany({
    where: { airlineId: null },
    select: { id: true, slug: true, title: true, airline: true },
  })

  const totalChecked = packages.length
  let updated = 0
  let masterMatch = 0
  let aliasMatch = 0
  let multiCount = 0
  let notFound = 0

  const multi: { slug: string; title: string; airline: string }[] = []
  const notFoundList: { slug: string; title: string; airline: string }[] = []

  for (const pkg of packages) {
    const airlineRaw = (pkg.airline ?? "").trim()
    if (!airlineRaw) {
      notFound++
      notFoundList.push({ slug: pkg.slug, title: pkg.title, airline: "" })
      continue
    }

    // Split on the known multi-airline separators.
    const parts = airlineRaw
      .split(SEPARATORS)
      .map((p) => p.trim())
      .filter((p) => p.length > 0)

    if (parts.length > 1) {
      // Multi-airline value: do NOT update airlineId, report only.
      multiCount++
      multi.push({ slug: pkg.slug, title: pkg.title, airline: airlineRaw })
      continue
    }

    const single = parts[0]
    const norm = normalizeName(single)

    // 2. Match Airline.name (exact, then case-insensitive)
    let airlineId = nameExact.get(single)
    if (!airlineId) {
      airlineId = nameCi.get(norm)
    }

    let matchType: "master" | "alias" = "master"

    // 3. Match AirlineAlias.alias (exact, then case-insensitive)
    if (!airlineId) {
      airlineId = aliasExact.get(single)
      if (!airlineId) {
        airlineId = aliasCi.get(norm)
      }
      if (airlineId) matchType = "alias"
    }

    if (!airlineId) {
      notFound++
      notFoundList.push({ slug: pkg.slug, title: pkg.title, airline: airlineRaw })
      continue
    }

    try {
      // Update ONLY airlineId; legacy `airline` string is preserved.
      await db.package.update({
        where: { id: pkg.id },
        data: { airlineId },
      })
      updated++
      if (matchType === "master") masterMatch++
      else aliasMatch++
      console.log(
        `✓ Updated: [${pkg.slug}] ${pkg.title} -> ${matchType} "${airlineRaw}" (${airlineId})`
      )
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      notFound++
      notFoundList.push({
        slug: pkg.slug,
        title: pkg.title,
        airline: `${airlineRaw} (update gagal: ${message})`,
      })
    }
  }

  console.log(`\n=== Ringkasan ===`)
  console.log(`Total checked: ${totalChecked}`)
  console.log(`Updated: ${updated}`)
  console.log(`Master match: ${masterMatch}`)
  console.log(`Alias match: ${aliasMatch}`)
  console.log(`Multi airline: ${multiCount}`)
  console.log(`Not found: ${notFound}`)

  if (multi.length > 0) {
    console.log(`\n=== Multi Airline (tidak diupdate) ===`)
    multi.forEach((p) => {
      console.log(`  - [${p.slug}] ${p.title} | airline: "${p.airline}"`)
    })
  }

  if (notFoundList.length > 0) {
    console.log(`\n=== Not Found ===`)
    notFoundList.forEach((p) => {
      console.log(`  - [${p.slug}] ${p.title} | airline: "${p.airline}"`)
    })
  }

  await db.$disconnect()
}

main().catch((err) => {
  console.error("Fatal error:", err)
  process.exit(1)
})
