import { destinationRepository } from "@/repositories/destination.repository"
import { countryRepository } from "@/repositories/country.repository"
import { regionRepository } from "@/repositories/region.repository"
import { cityRepository } from "@/repositories/city.repository"
import { logActivity } from "@/services/audit.service"
import slugify from "slugify"

export const destinationService = {
  async findAll(params: Parameters<typeof destinationRepository.findAll>[0]) {
    return destinationRepository.findAll(params)
  },

  async findById(id: string) {
    return destinationRepository.findById(id)
  },

  async create(data: {
    name: string
    description?: string
    seoTitle?: string
    seoDescription?: string
    featuredImage?: string
    sortOrder?: number
    destinationTypeId?: string
    countryId: string
    regionId?: string
    cityId: string
  }) {
    const country = await countryRepository.findById(data.countryId)
    if (!country) throw new Error("Country not found")

    if (data.regionId) {
      const region = await regionRepository.findById(data.regionId)
      if (!region) throw new Error("Region not found")
    }

    const city = await cityRepository.findById(data.cityId)
    if (!city) throw new Error("City not found")

    const slug = slugify(data.name, { lower: true, strict: true })
    const destination = await destinationRepository.create({
      name: data.name,
      slug,
      description: data.description ?? "",
      seoTitle: data.seoTitle ?? "",
      seoDescription: data.seoDescription ?? "",
      featuredImage: data.featuredImage ?? "",
      sortOrder: data.sortOrder ?? 0,
      country: { connect: { id: data.countryId } },
      region: data.regionId ? { connect: { id: data.regionId } } : undefined,
      city: { connect: { id: data.cityId } },
      destinationType: data.destinationTypeId ? { connect: { id: data.destinationTypeId } } : undefined,
    })
    await logActivity({ action: "CREATE", resource: "master.destination", resourceId: destination.id, metadata: { name: destination.name, country: country.name } })
    return destination
  },

  async update(id: string, data: {
    name?: string
    description?: string
    seoTitle?: string
    seoDescription?: string
    featuredImage?: string
    sortOrder?: number
    destinationTypeId?: string | null
    countryId?: string
    regionId?: string | null
    cityId?: string
  }) {
    const existing = await destinationRepository.findById(id)
    if (!existing) throw new Error("Destination not found")

    const updateData: Record<string, unknown> = {}
    if (data.name) {
      updateData.name = data.name
      updateData.slug = slugify(data.name, { lower: true, strict: true })
    }
    if (data.description !== undefined) updateData.description = data.description
    if (data.seoTitle !== undefined) updateData.seoTitle = data.seoTitle
    if (data.seoDescription !== undefined) updateData.seoDescription = data.seoDescription
    if (data.featuredImage !== undefined) updateData.featuredImage = data.featuredImage
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder
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
    if (data.cityId) {
      const city = await cityRepository.findById(data.cityId)
      if (!city) throw new Error("City not found")
      updateData.city = { connect: { id: data.cityId } }
    }
    if (data.destinationTypeId !== undefined) {
      if (data.destinationTypeId) {
        updateData.destinationType = { connect: { id: data.destinationTypeId } }
      } else {
        updateData.destinationType = { disconnect: true }
      }
    }

    const destination = await destinationRepository.update(id, updateData)
    await logActivity({ action: "UPDATE", resource: "master.destination", resourceId: id, metadata: { name: destination.name } })
    return destination
  },

  async softDelete(id: string) {
    const destination = await destinationRepository.findById(id)
    if (!destination) throw new Error("Destination not found")
    await destinationRepository.softDelete(id)
    await logActivity({ action: "DELETE", resource: "master.destination", resourceId: id, metadata: { name: destination.name } })
  },

  async restore(id: string) {
    const destination = await destinationRepository.findById(id)
    if (!destination) throw new Error("Destination not found")
    await destinationRepository.restore(id)
    await logActivity({ action: "APPROVE", resource: "master.destination", resourceId: id, metadata: { name: destination.name } })
  },

  async toggleStatus(id: string, isActive: boolean) {
    const destination = await destinationRepository.findById(id)
    if (!destination) throw new Error("Destination not found")
    return destinationRepository.toggleStatus(id, isActive)
  },
}
