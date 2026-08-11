import { db } from "@/lib/prisma/db"

/**
 * Idempotent seed for Airline aliases.
 *
 * Resolves the master Airline by the exact name "Saudia Airlines" and upserts a
 * set of commonly-misspelled / alternate names as AirlineAlias rows so packages
 * can later be backfilled by alias. Running it repeatedly does not create
 * duplicates.
 *
 * This script intentionally does NOT touch Package.airline, Package.airlineId,
 * PackageFlight, or PackageFlightSegment, and does NOT create any new Airline.
 */

const MASTER_AIRLINE_NAME = "Saudia Airlines"
const ALIASES = ["Saudi Airlines", "Saudi Arabian Airlines", "SAUDIA", "Saudi"]

async function main() {
  console.log("=== Seed Airline Aliases ===\n")

  // Resolve master Airline by EXACT name. name is not unique on the model, so use findFirst.
  const airline = await db.airline.findFirst({
    where: { name: MASTER_AIRLINE_NAME },
    select: { id: true, name: true },
  })

  if (!airline) {
    console.error(`Gagal: Airline master dengan nama "${MASTER_AIRLINE_NAME}" tidak ditemukan.`)
    console.error("Tidak membuat Airline baru secara otomatis.")
    await db.$disconnect()
    process.exit(1)
  }

  console.log(`Master airline ditemukan: ${airline.name} (${airline.id})\n`)

  let inserted = 0
  let alreadyExisting = 0

  for (const alias of ALIASES) {
    // @@unique([airlineId, alias]) -> composite key name `airlineId_alias`
    const existing = await db.airlineAlias.findUnique({
      where: { airlineId_alias: { airlineId: airline.id, alias } },
      select: { id: true },
    })
    if (existing) {
      alreadyExisting++
      console.log(`  - sudah ada: "${alias}"`)
    } else {
      await db.airlineAlias.create({ data: { airlineId: airline.id, alias } })
      inserted++
      console.log(`  - dimasukkan: "${alias}"`)
    }
  }

  const finalCount = await db.airlineAlias.count({ where: { airlineId: airline.id } })

  console.log(`\n=== Ringkasan ===`)
  console.log(`Master airline: ${airline.name} (${airline.id})`)
  console.log(`Aliases dimasukkan: ${inserted}`)
  console.log(`Aliases sudah ada: ${alreadyExisting}`)
  console.log(`Total alias untuk airline ini: ${finalCount}`)

  await db.$disconnect()
}

main().catch((err) => {
  console.error("Fatal error:", err)
  process.exit(1)
})
