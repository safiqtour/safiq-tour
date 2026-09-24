-- ============================================================================
-- 20260923000000_add_auth_user_id_link
-- Safiq Tour - canonical identity link between STMS User and Supabase Auth user
--
-- Reconciliation + feature migration (AUTH-01B):
-- 1. Drop two stale package FK indexes that exist in migration history but are
--    missing from the actual database (drift). They are no longer declared in
--    schema.prisma. DROP INDEX IF EXISTS is safe for both the existing
--    database (already missing) and fresh databases (created by the original
--    migration 20260808172023_add_package_category_type_relation).
-- 2. Add nullable unique authUserId to users. Nullable + unique allows
--    multiple NULLs (legacy unlinked accounts) while keeping the canonical
--    link at most 1:1 STMS->Auth.
--
-- IMPORTANT:
-- - No BEGIN/COMMIT. Prisma Migration Engine manages the transaction.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Reconciliation: drop stale package FK indexes (drift fix)
-- ----------------------------------------------------------------------------
DROP INDEX IF EXISTS "packages_packageCategoryId_idx";
DROP INDEX IF EXISTS "packages_packageTypeId_idx";

-- ----------------------------------------------------------------------------
-- 2. Identity mapping: nullable unique authUserId on users
-- ----------------------------------------------------------------------------
ALTER TABLE "users" ADD COLUMN "authUserId" TEXT;

CREATE UNIQUE INDEX "users_authUserId_key" ON "users"("authUserId");