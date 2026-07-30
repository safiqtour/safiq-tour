import { cityRepository } from "@/repositories/city.repository"
import { countryRepository } from "@/repositories/country.repository"
import { regionRepository } from "@/repositories/region.repository"
import { logActivity } from "@/services/audit.service"
import slugify from "slugify"

export const cityService = {
  async findAll(params: Parameters<typeof cityRepository.findAll>[0]) {
    return cityRepository.findAll(params)
  },

  async findById(id: string) {
    return cityRepository.findById(id)
  },

  async getByCountry(countryId: string) {
    return cityRepository.getByCountry(countryId)
  },

  async getByRegion(regionId: string) {
    return cityRepository.getByRegion(regionId)
  },

  async create(data: { name: string; countryId: string; regionId?: string; timezone?: string; latitude?: number; longitude?: number; sortOrder?: number }) {
    const country = await countryRepository.findById(data.countryId)
    if (!country) throw new Error("Country not found")

    if (data.regionId) {
      const region = await regionRepository.findById(data.regionId)
      if (!region) throw new Error("Region not found")
    }

    const slug = slugify(data.name, { lower: true, strict: true })
    const city = await cityRepository.create({
      name: data.name,
      slug,
      country: { connect: { id: data.countryId } },
      region: data.regionId ? { connect: { id: data.regionId } } : undefined,
      timezone: data.timezone ?? "",
      latitude: data.latitude,
      longitude: data.longitude,
      sortOrder: data.sortOrder ?? 0,
    })
    await logActivity({ action: "CREATE", resource: "master.city", resourceId: city.id, metadata: { name: city.name, country: country.name } })
    return city
  },

  async update(id: string, data: { name?: string; countryId?: string; regionId?: string | null; timezone?: string; latitude?: number; longitude?: number; sortOrder?: number }) {
    const existing = await cityRepository.findById(id)
    if (!existing) throw new Error("City not found")

    const updateData: Record<string, unknown> = {}
    if (data.name) {
      updateData.name = data.name
      updateData.slug = slugify(data.name, { lower: true, strict: true })
    }
    if (data.countryId) {
      const country = await countryRepository.findById(data.countryId)
      if (!country) throw new Error("Country not found")
      updateData.country = { connect: { id: data.countryId } }
    }
    if (data.regionId !== undefined) {
      if (data.regionId) {
        const region = await regionRepository.findById(data.regionId)
        if (!region) throw new Error("Region not found")
        updateData.region = { connect: { id: data.regionId } }
      } else {
        updateData.region = { disconnect: true }
      }
    }
    if (data.timezone !== undefined) updateData.timezone = data.timezone
    if (data.latitude !== undefined) updateData.latitude = data.latitude
    if (data.longitude !== undefined) updateData.longitude = data.longitude
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder

    const city = await cityRepository.update(id, updateData)
    await logActivity({ action: "UPDATE", resource: "master.city", resourceId: id, metadata: { name: city.name } })
    return city
  },

  async softDelete(id: string) {
    const city = await cityRepository.findById(id)
    if (!city) throw new Error("City not found")
    await cityRepository.softDelete(id)
    await logActivity({ action: "DELETE", resource: "master.city", resourceId: id, metadata: { name: city.name } })
  },

  async restore(id: string) {
    const city = await cityRepository.findById(id)
    if (!city) throw new Error("City not found")
    await cityRepository.restore(id)
    await logActivity({ action: "APPROVE", resource: "master.city", resourceId: id, metadata: { name: city.name } })
  },

  async toggleStatus(id: string, isActive: boolean) {
    const city = await cityRepository.findById(id)
    if (!city) throw new Error("City not found")
    return cityRepository.toggleStatus(id, isActive)
  },
}
