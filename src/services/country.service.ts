import { countryRepository } from "@/repositories/country.repository"
import { logActivity } from "@/services/audit.service"
import slugify from "slugify"

export const countryService = {
  async findAll(params: Parameters<typeof countryRepository.findAll>[0]) {
    return countryRepository.findAll(params)
  },

  async findById(id: string) {
    return countryRepository.findById(id)
  },

  async getAllActive() {
    return countryRepository.getAllActive()
  },

  async create(data: { name: string; code: string; phoneCode?: string; flag?: string; sortOrder?: number }) {
    const slug = slugify(data.name, { lower: true, strict: true })
    const country = await countryRepository.create({
      ...data,
      slug,
      phoneCode: data.phoneCode ?? "",
      flag: data.flag ?? "",
      sortOrder: data.sortOrder ?? 0,
    })
    await logActivity({ action: "CREATE", resource: "master.country", resourceId: country.id, metadata: { name: country.name } })
    return country
  },

  async update(id: string, data: { name?: string; code?: string; phoneCode?: string; flag?: string; sortOrder?: number }) {
    const existing = await countryRepository.findById(id)
    if (!existing) throw new Error("Country not found")

    const updateData: Record<string, unknown> = { ...data }
    if (data.name && data.name !== existing.name) {
      updateData.slug = slugify(data.name, { lower: true, strict: true })
    }
    const country = await countryRepository.update(id, updateData)
    await logActivity({ action: "UPDATE", resource: "master.country", resourceId: id, metadata: { name: country.name } })
    return country
  },

  async softDelete(id: string) {
    const country = await countryRepository.findById(id)
    if (!country) throw new Error("Country not found")
    await countryRepository.softDelete(id)
    await logActivity({ action: "DELETE", resource: "master.country", resourceId: id, metadata: { name: country.name } })
  },

  async restore(id: string) {
    const country = await countryRepository.findById(id)
    if (!country) throw new Error("Country not found")
    await countryRepository.restore(id)
    await logActivity({ action: "APPROVE", resource: "master.country", resourceId: id, metadata: { name: country.name } })
  },

  async toggleStatus(id: string, isActive: boolean) {
    const country = await countryRepository.findById(id)
    if (!country) throw new Error("Country not found")
    return countryRepository.toggleStatus(id, isActive)
  },
}
