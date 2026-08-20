import { z } from "zod"

const passwordRule = z
  .string()
  .min(6, "Password minimal 6 karakter")
  .max(72, "Password terlalu panjang")

export const createUserSchema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi").max(200).nullable().optional(),
  email: z.string().trim().email("Email tidak valid").max(200),
  roleId: z.string().min(1).nullable().optional(),
  image: z.string().trim().max(500).nullable().optional(),
  isActive: z.boolean().default(true),
  password: passwordRule,
})

export const updateUserSchema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi").max(200).nullable().optional(),
  email: z.string().trim().email("Email tidak valid").max(200).optional(),
  roleId: z.string().min(1).nullable().optional(),
  image: z.string().trim().max(500).nullable().optional(),
  isActive: z.boolean().optional(),
  password: passwordRule.optional().or(z.literal("")),
})

export const userQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type UserQueryInput = z.infer<typeof userQuerySchema>