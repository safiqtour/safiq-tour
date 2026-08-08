import { airlineRepository } from "@/repositories/airline.repository"
import { logActivity } from "@/services/audit.service"
import slugify from "slugify"

export const airlineService = {
  async findAll(params: Parameters<typeof airlineRepository.findAll>[0]) {
    return airlineRepository.findAll(params)
  },

  async findById(id: string) {
    return airlineRepository.findById(id)
  },

  async getActiveAirlines() {
    return airlineRepository.getActiveAirlines()
  },

  async create(data: { name: string; iataCode?: string | null; icaoCode?: string | null; countryId?: string | null; logoMediaId?: string | null; website?: string; callCenter?: string; status?: string }) {
    const slug = slugify(data.name, { lower: true, strict: true })
    if (data.iataCode) {
      const existing = await airlineRepository.findByIata(data.iataCode)
      if (existing) throw new Error(`Airline with IATA code ${data.iataCode} already exists`)
    }
    // Destructure the scalar FK fields out of `data` so they are never written
    // as raw scalars (e.g. an empty string "" would violate airlines_logoMediaId_fkey
    // / airlines_countryId_fkey because no media/country row has id "").
    const { countryId, logoMediaId, ...rest } = data
    const airline = await airlineRepository.create({
      ...rest,
      slug,
      iataCode: data.iataCode ?? null,
      country: countryId ? { connect: { id: countryId } } : undefined,
      logoMedia: logoMediaId ? { connect: { id: logoMediaId } } : undefined,
    } as never)
    await logActivity({ action: "CREATE", resource: "master.airline", resourceId: airline.id, metadata: { name: airline.name } })
    return airline
  },

  async update(id: string, data: Record<string, unknown>) {
    const existing = await airlineRepository.findById(id)
    if (!existing) throw new Error("Airline not found")

    // Strip scalar FK fields out of `data` and map them through Prisma relation
    // connect/disconnect. This prevents an empty string "" (the form's "no logo"
    // / "no country" value) from being written directly to the FK column, which
    // otherwise violates airlines_logoMediaId_fkey / airlines_countryId_fkey.
    const { countryId, logoMediaId, ...rest } = data as Record<string, unknown>
    const updateData: Record<string, unknown> = { ...rest }
    if (data.name && data.name !== existing.name) {
      updateData.slug = slugify(data.name as string, { lower: true, strict: true })
    }
    if ("countryId" in data) {
      updateData.country = (countryId as string)?.trim()
        ? { connect: { id: (countryId as string).trim() } }
        : { disconnect: true }
    }
    if ("logoMediaId" in data) {
      updateData.logoMedia = (logoMediaId as string)?.trim()
        ? { connect: { id: (logoMediaId as string).trim() } }
        : { disconnect: true }
    }

    const airline = await airlineRepository.update(id, updateData as never)
    await logActivity({ action: "UPDATE", resource: "master.airline", resourceId: id, metadata: { name: airline.name } })
    return airline
  },

  async softDelete(id: string) {
    const airline = await airlineRepository.findById(id)
    if (!airline) throw new Error("Airline not found")
    await airlineRepository.softDelete(id)
    await logActivity({ action: "DELETE", resource: "master.airline", resourceId: id, metadata: { name: airline.name } })
  },

  async restore(id: string) {
    const airline = await airlineRepository.findById(id)
    if (!airline) throw new Error("Airline not found")
    await airlineRepository.restore(id)
    await logActivity({ action: "APPROVE", resource: "master.airline", resourceId: id, metadata: { name: airline.name } })
  },
}
