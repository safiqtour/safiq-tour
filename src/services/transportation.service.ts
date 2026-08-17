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
    // Strip the scalar FK field out of `data` so it is never written as a raw
    // scalar (an empty string "" has no matching media row and would violate
    // transportations_mediaId_fkey). Map it through Prisma relation connect.
    const { mediaId, ...rest } = data
    const transportation = await transportationRepository.create({
      ...rest,
      slug,
      media: mediaId ? { connect: { id: mediaId } } : undefined,
    } as never)
    await logActivity({ action: "CREATE", resource: "master.transportation", resourceId: transportation.id, metadata: { name: transportation.name } })
    return transportation
  },

  async update(id: string, data: Record<string, unknown>) {
    const existing = await transportationRepository.findById(id)
    if (!existing) throw new Error("Transportation not found")

    // Strip the scalar FK field out of the payload and map it through Prisma
    // relation connect/disconnect. This prevents an empty string "" (the form's
    // "no media" value) from being written directly to the FK column, which would
    // otherwise violate transportations_mediaId_fkey.
    const { mediaId, ...rest } = data as Record<string, unknown>
    const updateData: Record<string, unknown> = { ...rest }
    if (data.name && data.name !== existing.name) {
      updateData.slug = slugify(data.name as string, { lower: true, strict: true })
    }
    if ("mediaId" in data) {
      updateData.media = (mediaId as string)?.trim()
        ? { connect: { id: (mediaId as string).trim() } }
        : { disconnect: true }
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
