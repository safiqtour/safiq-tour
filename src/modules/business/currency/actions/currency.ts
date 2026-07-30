"use server"

import { auth } from "@/lib/auth/auth"
import { hasPermission } from "@/services/auth.service"
import { requirePermission } from "../../lib/permission"
import { currencyService } from "../services/currency.service"
import {
  createCurrencySchema,
  updateCurrencySchema,
  currencyQuerySchema,
} from "../validations/currency.schema"

export async function getCurrencies(params: unknown) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")
  if (!hasPermission(session.user.role, "master.currency:read")) throw new Error("Forbidden")

  const query = currencyQuerySchema.parse(params)
  return currencyService.findAll(query as never)
}

export async function getCurrency(id: string) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")
  if (!hasPermission(session.user.role, "master.currency:read")) throw new Error("Forbidden")

  return currencyService.findById(id)
}

export async function createCurrency(data: unknown) {
  await requirePermission("master.currency:create")

  const parsed = createCurrencySchema.parse(data)
  return currencyService.create(parsed as never)
}

export async function updateCurrency(id: string, data: unknown) {
  await requirePermission("master.currency:update")

  const parsed = updateCurrencySchema.parse(data)
  return currencyService.update(id, parsed as never)
}

export async function deleteCurrency(id: string) {
  await requirePermission("master.currency:delete")

  await currencyService.softDelete(id)
}

export async function restoreCurrency(id: string) {
  await requirePermission("master.currency:update")

  await currencyService.restore(id)
}

export async function setBaseCurrency(id: string) {
  await requirePermission("master.currency:update")

  return currencyService.setBaseCurrency(id)
}
