# Testing Rules

## Strategy
| Level | Tools | Target |
|-------|-------|--------|
| Unit | Vitest | Services, validations, utils |
| Integration | Vitest | Server actions, API routes |
| E2E | Playwright (future) | Critical user flows |
| Visual | Storybook (future) | UI components |

## Unit Test Example
```
// package.service.test.ts
import { describe, it, expect } from "vitest"

describe("PackageService", () => {
  it("should calculate final price after discount", () => {
    const result = calculateFinalPrice(1000000, 10)
    expect(result).toBe(900000)
  })
})
```

## Validation Test Example
```
describe("createPackageSchema", () => {
  it("should reject negative price", () => {
    const result = createPackageSchema.safeParse({ price: -1 })
    expect(result.success).toBe(false)
  })
})
```

## What to Test
- Wajib: Business logic, validations, edge cases
- Disarankan: Error handling, permission checks
- Opsional: UI rendering (kompleks components)

## What NOT to Test
- Library code (Prisma, Auth.js, Zod)
- Simple passthrough functions
- Boilerplate UI

## File Naming
```
src/services/package.service.ts
src/services/package.service.test.ts    # Unit test
src/actions/create-package.ts
src/actions/create-package.test.ts      # Integration test
```
