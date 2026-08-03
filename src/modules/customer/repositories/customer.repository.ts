import { db } from "@/lib/prisma/db"
import type { Prisma, Customer } from "@prisma/client"
import { BaseRepository } from "@/modules/business/repositories/base.repository"
import type { CreateCustomerInput, UpdateCustomerInput } from "../validations/customer.schema"

export const customerInclude = {
  photoMedia: true,
  documents: {
    orderBy: { createdAt: "desc" as const },
  },
} satisfies Prisma.CustomerInclude

export type CustomerWithRelations = Prisma.CustomerGetPayload<{ include: typeof customerInclude }>

/**
 * Strongly-typed repository for the Customer (Jamaah / Customer) entity.
 *
 * The delegate is bound with full type-safety: `db.customer` is a native
 * `Prisma.CustomerDelegate` and `BaseRepository` accepts it directly (no
 * `as never` / `as unknown`).
 */
export class CustomerRepository extends BaseRepository<
  Customer,
  CreateCustomerInput,
  UpdateCustomerInput,
  Prisma.CustomerDelegate
> {
  constructor() {
    super(db.customer, {
      searchFields: ["name", "nickName", "email", "phone", "passportNumber", "code"],
    })
  }

  findByIdWithRelations(id: string): Promise<CustomerWithRelations | null> {
    return this.delegate.findUnique({
      where: { id },
      include: customerInclude,
    }) as Promise<CustomerWithRelations | null>
  }

  findByIdTrashed(id: string): Promise<Customer | null> {
    return this.delegate.findUnique({
      where: { id },
    })
  }
}

export const customerRepository = new CustomerRepository()
