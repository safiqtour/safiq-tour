import { regionRepository } from "@/repositories/region.repository"
import { countryRepository } from "@/repositories/country.repository"
import { logActivity } from "@/services/audit.service"
import slugify from "slugify"

export const regionService = {
  async findAll(params: Parameters<typeof regionRepository.findAll>[0]) {
    return regionRepository.findAll(params)
  },

  async findById(id: string) {
    return regionRepository.findById(id)
  },

  async getByCountry(countryId: string) {
    return regionRepository.getByCountry(countryId)
  },

  async create(data: { name: string; countryId: string; sortOrder?: number }) {
    const country = await countryRepository.findById(data.countryId)
    if (!country) throw new Error("Country not found")

    const slug = slugify(data.name, { lower: true, strict: true })
    const region = await regionRepository.create({
      name: data.name,
      slug,
      country: { connect: { id: data.countryId } },
      sortOrder: data.sortOrder ?? 0,
    })
    await logActivity({ action: "CREATE", resource: "master.region", resourceId: region.id, metadata: { name: region.name, country: country.name } })
    return region
  },

  async update(id: string, data: { name?: string; countryId?: string; sortOrder?: number }) {
    const existing = await regionRepository.findById(id)
    if (!existing) throw new Error("Region not found")

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
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder

    const region = await regionRepository.update(id, updateData)
    await logActivity({ action: "UPDATE", resource: "master.region", resourceId: id, metadata: { name: region.name } })
    return region
  },

  async softDelete(id: string) {
    const region = await regionRepository.findById(id)
    if (!region) throw new Error("Region not found")
    await regionRepository.softDelete(id)
    await logActivity({ action: "DELETE", resource: "master.region", resourceId: id, metadata: { name: region.name } })
  },

  async restore(id: string) {
    const region = await regionRepository.findById(id)
    if (!region) throw new Error("Region not found")
    await regionRepository.restore(id)
    await logActivity({ action: "APPROVE", resource: "master.region", resourceId: id, metadata: { name: region.name } })
  },

  async toggleStatus(id: string, isActive: boolean) {
    const region = await regionRepository.findById(id)
    if (!region) throw new Error("Region not found")
    return regionRepository.toggleStatus(id, isActive)
  },
}
