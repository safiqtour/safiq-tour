# Prisma Build Compatibility Report

- **Date:** 2026-07-31
- **Status:** RESOLVED
- **Affected:** Vercel production build
- **Impact:** `Module "@prisma/client" has no exported member "PrismaClient"`

## Symptom
The Vercel build failed with:

```
Module "@prisma/client" has no exported member "PrismaClient"
```

reported from `prisma/seed.ts` and `src/lib/prisma/db.ts` (TS2305).

## Root Cause
This project uses **Prisma 7**, which no longer generates the client into
`node_modules/@prisma/client` but into `node_modules/.prisma/client`. The
generated output is ephemeral and excluded by git (under `node_modules`).

`@prisma/client`'s own `default.d.ts` simply re-exports from
`.prisma/client/default`:

```ts
export * from '.prisma/client/default'
```

So when `prisma generate` has not been run in the install environment,
`PrismaClient` is not exported at all.

`package.json` had **no `postinstall` script**, so Vercel's `npm install`
never invoked `prisma generate`. The generated client only existed in the
local development environment, so local builds/typechecks worked while the
clean Vercel build failed.

## Reproduction
1. Temporarily removed `node_modules/.prisma/client`.
2. Ran `npx tsc --noEmit --incremental false`.
3. Observed the identical error at `prisma/seed.ts(1,10)` and
   `src/lib/prisma/db.ts(1,10)` plus cascading `TS7006` implicit-any errors.

## Fix
Added a `postinstall` script to `package.json` so the client is generated on
every install (local and CI/Vercel):

```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

No business logic was changed.

## Verification
1. Deleted the generated client (`node_modules/.prisma/client`).
2. Ran `npm run postinstall` — regenerated successfully.
3. Ran `npx tsc --noEmit --incremental false` — **exit 0, no errors**.
4. Ran `npm run build` — compiled successfully (build4.log; only pre-existing
   lint warnings such as `no-img-element`, no errors).
5. Confirmed `prisma generate` succeeds without a `DATABASE_URL` (config loads
   but generation does not require a live database), so it is safe for CI.

## Compatibility Notes
- Prisma `7.x` moves the generated client to `node_modules/.prisma/client`;
  tooling that imports `@prisma/client` must run `prisma generate` before
  typecheck/build in each environment.
- The runtime driver adapter (`PrismaPg` from `@prisma/adapter-pg`) is
  required at `PrismaClient` instantiation and was already wired in
  `src/lib/prisma/db.ts` and `prisma/seed.ts`; it is unrelated to this build
  failure.

## Artifacts
- `D:\test-safiq-iid\package.json` (fix)
- `D:\test-safiq-iid\prisma\schema.prisma`
- `D:\test-safiq-iid\prisma.config.ts`
- `D:\test-safiq-iid\prisma\seed.ts`
- `D:\test-safiq-iid\src\lib\prisma\db.ts`
- `C:\Users\PC\AppData\Local\Temp\opencode\dbcheck\build.log` (pre-fix failure)
- `C:\Users\PC\AppData\Local\Temp\opencode\dbcheck\build4.log` (post-fix success)
