import slugify from "slugify"
import { db } from "@/lib/prisma/db"
import { BaseService } from "../../services/base.service"
import { tagRepository } from "../repositories/tag.repository"
import { generateSequentialCode } from "../../utils/code"
import type { TagListItem } from "../types"
import type { BusinessModuleConfig } from "../../types/base.types"

const config: BusinessModuleConfig = {
  module: "tag",
  codePrefix: "TAG",
  permission: "master.tag",
  auditEntity: "Tag",
}

export class TagService extends BaseService<
  TagListItem,
  Record<string, unknown>,
  Record<string, unknown>
> {
  constructor() {
    super(tagRepository, config.permission)
  }

  async create(data: Record<string, unknown>) {
    const name = data.name as string
    const shortName = data.shortName as string

    const existingName = await tagRepository.findFirst({ name } as Record<string, unknown>)
    if (existingName) throw new Error("Tag name already exists")

    const existingShort = await tagRepository.findFirst({ shortName } as Record<string, unknown>)
    if (existingShort) throw new Error("Short name already exists")

    const count = await db.tag.count({ where: { deletedAt: null } })
    const code = generateSequentialCode(config.codePrefix, count)
    const slug = slugify(name, { lower: true, strict: true })

    return super.create({ ...data, code, slug } as Record<string, unknown>)
  }

  async update(id: string, data: Record<string, unknown>) {
    const existing = await tagRepository.findById(id)
    if (!existing) throw new Error("Tag not found")

    const name = data.name as string | undefined
    const shortName = data.shortName as string | undefined

    if (name && name !== (existing as unknown as Record<string, unknown>).name) {
      const dup = await tagRepository.findFirst({ name } as Record<string, unknown>)
      if (dup && (dup as unknown as Record<string, unknown>).id !== id) throw new Error("Tag name already exists")
    }

    if (shortName && shortName !== (existing as unknown as Record<string, unknown>).shortName) {
      const dup = await tagRepository.findFirst({ shortName } as Record<string, unknown>)
      if (dup && (dup as unknown as Record<string, unknown>).id !== id) throw new Error("Short name already exists")
    }

    return super.update(id, data)
  }
}

export const tagService = new TagService()
