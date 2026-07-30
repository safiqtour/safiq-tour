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
    const airline = await airlineRepository.create({
      ...data,
      slug,
      iataCode: data.iataCode ?? null,
      country: data.countryId ? { connect: { id: data.countryId } } : undefined,
      logoMedia: data.logoMediaId ? { connect: { id: data.logoMediaId } } : undefined,
    } as never)
    await logActivity({ action: "CREATE", resource: "master.airline", resourceId: airline.id, metadata: { name: airline.name } })
    return airline
  },

  async update(id: string, data: Record<string, unknown>) {
    const existing = await airlineRepository.findById(id)
    if (!existing) throw new Error("Airline not found")

    const updateData: Record<string, unknown> = { ...data }
    if (data.name && data.name !== existing.name) {
      updateData.slug = slugify(data.name as string, { lower: true, strict: true })
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
