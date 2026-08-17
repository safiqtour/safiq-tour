# ADR-001 — Enterprise Storage Provider Foundation

**Status:** Accepted  
**Date:** 2026-07-31  
**Deciders:** Chief Software Architect  
**Sprint:** 2D.2.1

---

## Context

STMS (Safiq Tour Management System) requires a centralized media and file
storage layer that:

- Supports multiple storage backends without code changes.
- Treats **Supabase Storage** as only one possible implementation.
- Keeps the business layer (Media Library, documents, gallery) decoupled from
  any specific vendor.
- Must be verifiable at runtime via a health check.

The existing `src/lib/storage/` layer was a minimal prototype exposing only
`upload`, `delete`, and `getUrl`, and it leaked vendor-specific behavior
(Cloudinary stub, local-only). Sprint 2D.2.1 replaces this with an
**enterprise-grade, provider-agnostic foundation** in a new infrastructure
layer. The Media Library is **not** integrated in this sprint.

---

## Decision

Create `src/providers/storage/` as the Infrastructure storage layer with:

### 1. `StorageProvider` interface (`types.ts`)

A single contract every provider must implement:

```ts
upload(file, path): Promise<StorageUploadResult>
delete(path): Promise<void>
exists(path): Promise<boolean>
copy(from, to): Promise<void>
move(from, to): Promise<void>
getPublicUrl(path): string
createSignedUrl(path, expiresIn): Promise<string>
list(prefix): Promise<StorageListEntry[]>
createFolder(path): Promise<void>
deleteFolder(path): Promise<void>
```

### 2. Implementations

| Provider | File | Root / Target |
|----------|------|---------------|
| `local` | `local.provider.ts` | `public/uploads/` (filesystem) |
| `supabase` | `supabase.provider.ts` | Bucket from `SUPABASE_STORAGE_BUCKET` (no hardcoded names) |

### 3. Factory (`factory.ts`)

Provider selection is driven by environment:

```
STORAGE_PROVIDER=local     # default
STORAGE_PROVIDER=supabase
```

### 4. Health Service (`health.ts`)

`runStorageHealthCheck(provider?, providerName?)` verifies:

1. Provider loaded
2. Bucket / storage root exists
3. Upload test
4. Public URL + signed URL generation
5. Delete test

---

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                  Business / Application Layer                │
│   (Media Library, Documents, Gallery — NOT in this sprint)   │
└──────────────────────────┬───────────────────────────────────┘
                           │  StorageProvider interface
                           ▼
┌──────────────────────────────────────────────────────────────┐
│               StorageFactory  (src/providers/storage/)        │
│         selects provider from STORAGE_PROVIDER env           │
└──────────────┬──────────────────────────┬────────────────────┘
               │                          │
      ┌────────▼────────┐        ┌────────▼─────────────────┐
      │ LocalStorage    │        │ SupabaseStorageProvider  │
      │ Provider        │        │  (supabase-js, service   │
      │ public/uploads/ │        │   role key, bucket from  │
      │ (filesystem)    │        │   SUPABASE_STORAGE_BUCKET)│
      └─────────────────┘        └────────┬─────────────────┘
                                          ▼
                                  Supabase Storage API
                                          │
                                      PostgreSQL
                              (file metadata, no binary blobs)

                        ┌────────────────────────────┐
                        │  Storage Health Service    │
                        │  (runStorageHealthCheck)   │
                        └────────────────────────────┘
```

**Layer rules (AGENTS.md):** UI → Service → Repository → Database.
Storage is accessed through this provider layer only — never directly by
React components, and binary data is never stored in PostgreSQL
(`media.storagePath` / `storageProvider` columns reference objects here).

---

## Consequences

**Positive**
- Vendor-agnostic: Supabase, local, and future providers (R2/S3/MinIO) are
  drop-in implementations behind one interface.
- No hardcoded bucket names; bucket is configurable via `SUPABASE_STORAGE_BUCKET`.
- Runtime verifiability via health check.
- Path safety: local provider rejects path traversal outside its root.
- No Media Library, UI, or business-layer changes.

**Negative / Trade-offs**
- Supabase bucket must be provisioned (dashboard or Storage API) before use;
  the health check reports it when missing.
- Local provider returns the public URL for `createSignedUrl` (no real
  signing) — acceptable for development only.
- `@supabase/supabase-js` adds a dependency to the infrastructure layer.

---

## Alternatives Considered

| Alternative | Decision |
|-------------|----------|
| Extend `src/lib/storage/` (Cloudinary, UploadThing) | Rejected — prototype API too narrow; UploadThing is not a generic object store |
| S3 / MinIO first | Rejected — project already runs on Supabase; keep Supabase as the primary remote |
| Direct Prisma/DB blob storage | Rejected — violates "no binary data in PostgreSQL" rule |
| Single provider without interface | Rejected — violates "storage provider must be replaceable" rule |

---

## Verification

- `npx tsc --noEmit` — clean
- `npx eslint src/providers/storage` — 0 errors
- Health check — `local`: 5/5 pass; `supabase`: 5/5 pass
- Smoke test of all 10 interface methods on both providers — pass
