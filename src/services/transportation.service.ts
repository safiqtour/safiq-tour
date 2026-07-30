import { transportationRepository } from "@/repositories/transportation.repository"
import { logActivity } from "@/services/audit.service"
import slugify from "slugify"

export const transportationService = {
  async findAll(params: Parameters<typeof transportationRepository.findAll>[0]) {
    return transportationRepository.findAll(params)
  },

  async findById(id: string) {
    return transportationRepository.findById(id)
  },

  async create(data: { name: string; type: string; capacity: number; status?: string; description?: string; mediaId?: string | null }) {
    const slug = slugify(data.name, { lower: true, strict: true })
    const transportation = await transportationRepository.create({
      ...data,
      slug,
      media: data.mediaId ? { connect: { id: data.mediaId } } : undefined,
    } as never)
    await logActivity({ action: "CREATE", resource: "master.transportation", resourceId: transportation.id, metadata: { name: transportation.name } })
    return transportation
  },

  async update(id: string, data: Record<string, unknown>) {
    const existing = await transportationRepository.findById(id)
    if (!existing) throw new Error("Transportation not found")

    const updateData: Record<string, unknown> = { ...data }
    if (data.name && data.name !== existing.name) {
      updateData.slug = slugify(data.name as string, { lower: true, strict: true })
    }

    const transportation = await transportationRepository.update(id, updateData as never)
    await logActivity({ action: "UPDATE", resource: "master.transportation", resourceId: id, metadata: { name: transportation.name } })
    return transportation
  },

  async softDelete(id: string) {
    const transportation = await transportationRepository.findById(id)
    if (!transportation) throw new Error("Transportation not found")
    await transportationRepository.softDelete(id)
    await logActivity({ action: "DELETE", resource: "master.transportation", resourceId: id, metadata: { name: transportation.name } })
  },

  async restore(id: string) {
    const transportation = await transportationRepository.findById(id)
    if (!transportation) throw new Error("Transportation not found")
    await transportationRepository.restore(id)
    await logActivity({ action: "APPROVE", resource: "master.transportation", resourceId: id, metadata: { name: transportation.name } })
  },
}
