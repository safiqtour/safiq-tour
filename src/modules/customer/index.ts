export { customerRepository } from "./repositories/customer.repository"
export { customerService } from "./services/customer.service"
export {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  restoreCustomer,
  verifyCustomerDocument,
  rejectCustomerDocument,
} from "./actions/customer"
export {
  createCustomerSchema,
  updateCustomerSchema,
  customerQuerySchema,
  customerDocumentSchema,
  customerFieldsSchema,
} from "./validations/customer.schema"
export type {
  CreateCustomerInput,
  UpdateCustomerInput,
  CustomerQueryInput,
  CustomerDocumentInput,
} from "./validations/customer.schema"
export {
  CUSTOMER_GENDERS,
  CUSTOMER_STATUSES,
  CUSTOMER_DOCUMENT_TYPES,
  CUSTOMER_DOCUMENT_STATUSES,
} from "./types"
export type {
  CustomerGender,
  CustomerStatus,
  CustomerDocumentType,
  CustomerDocumentStatus,
  CustomerListItem,
} from "./types"
